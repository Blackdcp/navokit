import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://apihub.agnes-ai.com/v1';

export const maxDuration = 60;

type DraftId = "x" | "linkedin" | "instagram" | "hooks";

const draftIds: DraftId[] = ["x", "linkedin", "instagram", "hooks"];
const draftAliases: Record<DraftId, string[]> = {
  x: ["x", "twitter", "tweet"],
  linkedin: ["linkedin", "linkedIn"],
  instagram: ["instagram", "ig"],
  hooks: ["hooks", "hook", "hookIdeas", "hook_ideas", "hook options", "openers"],
};

function textFromParsed(parsed: Partial<Record<string, unknown>>, id: DraftId) {
  for (const key of draftAliases[id]) {
    const value = parsed[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value)) {
      const lines = value.filter(item => typeof item === "string" && item.trim());
      if (lines.length) return lines.join("\n");
    }
  }

  return "";
}

function fallbackHooks(topic: string, locale: "en" | "zh") {
  if (locale === "zh") {
    return [
      `把这个想法讲清楚：${topic.slice(0, 28)}...`,
      "别急着发布，先把观点变成结构。",
      "一个让内容更快成稿的小流程。",
      "从零散想法到可发布内容，其实只差一步整理。",
      "如果你也经常卡在整理笔记，这个方法可以试试。",
    ].join("\n");
  }

  return [
    "Turn rough notes into publishable content faster.",
    "Your ideas do not need more storage. They need structure.",
    "A simple workflow for turning messy notes into usable posts.",
    "Stop waiting for inspiration. Build a repeatable content workflow.",
    "From rough idea to publishable draft in one focused pass.",
  ].join("\n");
}

function extractJsonObject(value: string) {
  const trimmed = value.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as Partial<Record<string, unknown>>;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { topic, language } = await req.json();
    const outputLanguage = language === 'zh' ? 'Chinese' : 'English';
    const locale = language === 'zh' ? 'zh' : 'en';
    const cleanTopic = typeof topic === 'string' ? topic.trim() : '';

    if (!cleanTopic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    if (cleanTopic.length > 1000) {
      return NextResponse.json({ error: 'Topic is too long (max 1000 characters)' }, { status: 400 });
    }

    const AGNES_API_KEY = process.env.AGNES_API_KEY;
    if (!AGNES_API_KEY) {
      console.error("Missing AGNES_API_KEY");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const prompt = `You are a senior social media editor for a global creator and startup audience.
Turn the user's rough idea into multiple editable social drafts.

User idea:
${cleanTopic}

Output language: ${outputLanguage}.

Return ONLY valid JSON. Do not use markdown fences. Use exactly these string keys:
{
  "x": "A concise X / Twitter post. Clear hook, useful body, no hype.",
  "linkedin": "A professional LinkedIn post. Strong opening, useful context, credible tone.",
  "instagram": "An Instagram caption. Natural, visual, lightly formatted, with a few relevant hashtags.",
  "hooks": "5 short hook options, each on a new line."
}

Rules:
- All four keys are required: x, linkedin, instagram, hooks.
- The hooks value must not be empty. It must contain exactly 5 short lines.
- Keep every draft editable and specific.
- Do not invent facts, numbers, prices, dates, or results.
- Do not promise engagement, virality, revenue, or conversion.
- Avoid sounding like an ad unless the user explicitly asks for promotional copy.
- Do not mention region-specific platforms unless the user's idea explicitly asks for them.`;

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AGNES_API_KEY}`
      },
      body: JSON.stringify({
        model: 'agnes-2.0-flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
      }),
      signal: AbortSignal.timeout(55_000),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Agnes API Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate content' }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    const parsed = extractJsonObject(content);
    const drafts = parsed
      ? draftIds
          .map(id => ({ id, text: textFromParsed(parsed, id) || (id === "hooks" ? fallbackHooks(cleanTopic, locale) : "") }))
          .filter(item => item.text)
      : [];

    return NextResponse.json({
      drafts: drafts.length ? drafts : [{ id: "x", text: content.trim() }],
      content: drafts.length
        ? drafts.map(item => `${item.id.toUpperCase()}\n${item.text}`).join("\n\n")
        : content.trim(),
      locale,
    });

  } catch (error) {
    console.error('Social Booster API Error:', error);
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      { error: timedOut ? 'Generation timed out. Please try again.' : 'Internal Server Error' },
      { status: timedOut ? 504 : 500 },
    );
  }
}
