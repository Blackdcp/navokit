import { NextResponse } from "next/server";

export const maxDuration = 60;

const AGNES_ENDPOINT = "https://apihub.agnes-ai.com/v1/videos";
const MODEL = "agnes-video-v2.0";

const formats = {
  landscape: { width: 1152, height: 768 },
  portrait: { width: 768, height: 1152 },
  square: { width: 768, height: 768 },
} as const;

const durations = {
  "3": 81,
  "5": 121,
  "10": 241,
  "18": 441,
} as const;
const durationPresets = Object.keys(durations) as Array<keyof typeof durations>;

function isFormat(value: unknown): value is keyof typeof formats {
  return typeof value === "string" && value in formats;
}

function isDuration(value: unknown): value is keyof typeof durations {
  return typeof value === "string" && value in durations;
}

function nearestDurationPreset(seconds: number): keyof typeof durations {
  return durationPresets.reduce((best, preset) => (
    Math.abs(Number(preset) - seconds) < Math.abs(Number(best) - seconds) ? preset : best
  ), "5" as keyof typeof durations);
}

function explicitDurationFromPrompt(prompt: string) {
  const match = prompt.match(/(?:^|\D)(\d{1,2})\s*(?:s|sec|secs|second|seconds|秒)/i);
  if (!match) return null;

  const seconds = Number(match[1]);
  if (!Number.isFinite(seconds)) return null;
  return nearestDurationPreset(seconds);
}

function chooseDuration(prompt: string, requested: unknown): keyof typeof durations | null {
  const value = String(requested ?? "auto");
  if (isDuration(value)) return value;
  if (value !== "auto") return null;

  const explicit = explicitDurationFromPrompt(prompt);
  if (explicit) return explicit;

  const normalized = prompt.toLowerCase();
  const longIntent = /(montage|multiple scenes|story sequence|before and after|walkthrough|tutorial|timelapse|time-lapse|several shots|multi[- ]scene|多镜头|多个场景|教程|过程|延时|故事)/i.test(normalized);
  const mediumIntent = /(product demo|demo|travel|showcase|cinematic sequence|opening scene|展示|演示|旅拍|开场)/i.test(normalized);

  if (longIntent || prompt.length > 520) return "18";
  if (mediumIntent || prompt.length > 260) return "10";
  if (prompt.length < 80 && /(logo|icon|loop|gif|very short|极短|循环|标志)/i.test(normalized)) return "3";
  return "5";
}

function errorMessage(status: number) {
  if (status === 401) return "Video generation is temporarily unavailable.";
  if (status === 503) return "Video generation is busy. Please try again shortly.";
  if (status === 400) return "The video request was rejected. Try revising your prompt.";
  return "The video service could not start this request.";
}

function isTimeoutError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return error.name === "TimeoutError" || error.name === "AbortError";
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.AGNES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Video generation is temporarily unavailable." },
        { status: 503 },
      );
    }
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const format = body.format;
    const duration = chooseDuration(prompt, body.duration);

    if (prompt.length < 10 || prompt.length > 1200) {
      return NextResponse.json(
        { error: "Prompt must be between 10 and 1,200 characters." },
        { status: 400 },
      );
    }
    if (!isFormat(format) || !duration) {
      return NextResponse.json({ error: "Invalid video settings." }, { status: 400 });
    }

    const response = await fetch(AGNES_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        ...formats[format],
        num_frames: durations[duration],
        frame_rate: 24,
      }),
      signal: AbortSignal.timeout(55_000),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.video_id) {
      console.error("Agnes video submit failed", {
        status: response.status,
        providerError: data?.error?.message ?? data?.error ?? null,
      });
      return NextResponse.json(
        { error: errorMessage(response.status) },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 },
      );
    }

    return NextResponse.json({
      videoId: data.video_id,
      status: data.status ?? "queued",
      progress: Number(data.progress) || 0,
      seconds: data.seconds ?? null,
      size: data.size ?? null,
    });
  } catch (error) {
    const timedOut = isTimeoutError(error);
    console.error("Agnes video submit exception", error);
    return NextResponse.json(
      { error: timedOut ? "The video service timed out. Please try again." : "Unable to start video generation." },
      { status: timedOut ? 504 : 500 },
    );
  }
}
