import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "images", "tool-examples");
const logoPath = path.join(root, "public", "logo-watermark.png");

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrapText(text, maxChars = 58) {
  const lines = [];

  for (const paragraph of String(text).split("\n")) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }

    let current = "";
    for (const word of paragraph.split(/\s+/)) {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxChars && current) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
  }

  return lines;
}

function markdownCardSvg({ title, body, width = 1120, height = 720 }) {
  const bodyLines = String(body).split("\n");
  const bodySvg = bodyLines.map((line, index) => {
    const y = 222 + index * 44;
    if (!line.trim()) return "";
    if (line.startsWith("- ")) {
      return `<text x="136" y="${y}" class="body"><tspan class="bullet">-</tspan> ${esc(line.slice(2))}</text>`;
    }
    return `<text x="96" y="${y}" class="body">${esc(line)}</text>`;
  }).join("");

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#0B1220" flood-opacity="0.10"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" rx="34" fill="#F8FAFC"/>
  <rect x="52" y="44" width="${width - 104}" height="${height - 88}" rx="28" fill="#FFFFFF" filter="url(#shadow)"/>
  <text x="96" y="140" class="title">${esc(title)}</text>
  ${bodySvg}
  <line x1="96" x2="${width - 96}" y1="${height - 144}" y2="${height - 144}" stroke="#E5E7EB" stroke-width="2"/>
  <text x="${width - 360}" y="${height - 79}" class="watermark">Made with</text>
  <style>
    .title { fill: #0B1220; font: 800 54px Inter, Arial, sans-serif; letter-spacing: -1.8px; }
    .body { fill: #334155; font: 500 29px Inter, Arial, sans-serif; }
    .bullet { fill: #64748B; font-weight: 700; }
    .watermark { fill: #64748B; font: 700 18px Inter, Arial, sans-serif; }
  </style>
</svg>`;
}

function socialWorkspaceSvg({ input, drafts, width = 1220, height = 840 }) {
  const inputLines = wrapText(input, 38).slice(0, 12);
  const inputSvg = inputLines.map((line, index) => (
    line ? `<text x="91" y="${168 + index * 23}" class="textareaText">${esc(line)}</text>` : ""
  )).join("");

  const draftCards = drafts.map((draft, cardIndex) => {
    const cardX = 648;
    const cardY = 98 + cardIndex * 164;
    const lines = wrapText(draft.text, 58).slice(0, 4);
    const lineSvg = lines.map((line, index) => (
      line ? `<text x="${cardX + 24}" y="${cardY + 72 + index * 22}" class="draftText">${esc(line)}</text>` : ""
    )).join("");

    return `
      <rect x="${cardX}" y="${cardY}" width="500" height="144" rx="16" fill="#FFFFFF" stroke="#DDE3EE"/>
      <text x="${cardX + 24}" y="${cardY + 36}" class="draftTitle">${esc(draft.label)}</text>
      <rect x="${cardX + 430}" y="${cardY + 18}" width="48" height="28" rx="14" fill="#F8FAFC" stroke="#DDE3EE"/>
      <text x="${cardX + 444}" y="${cardY + 36}" class="copyText">Copy</text>
      ${lineSvg}
    `;
  }).join("");

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shellShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="28" flood-color="#0B1220" flood-opacity="0.10"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" rx="36" fill="#F8FAFC"/>
  <rect x="38" y="40" width="1144" height="760" rx="24" fill="#FFFFFF" stroke="#E5E7EB" filter="url(#shellShadow)"/>
  <rect x="56" y="58" width="546" height="724" rx="18" fill="#FFFFFF" stroke="#DDE3EE"/>
  <rect x="626" y="58" width="538" height="724" rx="18" fill="#F8FAFC" stroke="#DDE3EE"/>

  <circle cx="88" cy="86" r="11" fill="#EFF6FF"/>
  <text x="88" y="90" class="step">01</text>
  <text x="110" y="91" class="panelTitle">Describe the idea</text>
  <text x="548" y="91" class="counter">${input.length}/1000</text>

  <circle cx="658" cy="86" r="11" fill="#EFF6FF"/>
  <text x="658" y="90" class="step">02</text>
  <text x="680" y="91" class="panelTitle">Platform-ready drafts</text>
  <rect x="1080" y="71" width="64" height="34" rx="17" fill="#FFFFFF" stroke="#CBD5E1"/>
  <text x="1112" y="92" class="copyAll">Copy All</text>

  <rect x="78" y="124" width="502" height="282" rx="14" fill="#FFFFFF" stroke="#CBD5E1"/>
  ${inputSvg}

  <rect x="78" y="424" width="240" height="38" rx="19" fill="#FFFFFF" stroke="#DDE3EE"/>
  <text x="198" y="448" class="pill">X post</text>
  <rect x="340" y="424" width="240" height="38" rx="19" fill="#FFFFFF" stroke="#DDE3EE"/>
  <text x="460" y="448" class="pill">LinkedIn post</text>
  <rect x="78" y="476" width="240" height="38" rx="19" fill="#FFFFFF" stroke="#DDE3EE"/>
  <text x="198" y="500" class="pill">Instagram caption</text>
  <rect x="340" y="476" width="240" height="38" rx="19" fill="#FFFFFF" stroke="#DDE3EE"/>
  <text x="460" y="500" class="pill">Hook ideas</text>
  <rect x="78" y="536" width="502" height="44" rx="10" fill="#2563EB"/>
  <text x="329" y="564" class="buttonText">Generate Drafts</text>
  <text x="329" y="612" class="note">Your idea is processed by an AI service to generate editable drafts.</text>
  <text x="329" y="632" class="note">Do not enter sensitive or confidential information.</text>

  ${draftCards}

  <style>
    .step { fill: #2563EB; font: 800 10px Inter, Arial, sans-serif; text-anchor: middle; }
    .panelTitle { fill: #0B1220; font: 800 13px Inter, Arial, sans-serif; }
    .counter, .note { fill: #64748B; font: 500 11px Inter, Arial, sans-serif; text-anchor: middle; }
    .textareaText { fill: #0B1220; font: 500 16px Inter, Arial, sans-serif; }
    .pill { fill: #0B1220; font: 700 12px Inter, Arial, sans-serif; text-anchor: middle; }
    .buttonText { fill: #FFFFFF; font: 800 14px Inter, Arial, sans-serif; text-anchor: middle; }
    .draftTitle { fill: #0B1220; font: 800 13px Inter, Arial, sans-serif; }
    .draftText { fill: #0F172A; font: 500 13px Inter, Arial, sans-serif; }
    .copyText { fill: #475569; font: 700 10px Inter, Arial, sans-serif; }
    .copyAll { fill: #0B1220; font: 800 11px Inter, Arial, sans-serif; text-anchor: middle; }
  </style>
</svg>`;
}

async function renderMarkdownCard(fileName, data) {
  const svgBuffer = Buffer.from(markdownCardSvg(data));
  const logo = await sharp(logoPath).resize({ width: 146 }).png().toBuffer();

  await sharp(svgBuffer)
    .composite([{ input: logo, left: data.width ? data.width - 218 : 902, top: data.height ? data.height - 104 : 616 }])
    .png()
    .toFile(path.join(outDir, fileName));
}

async function renderSocialWorkspace(fileName, data) {
  await sharp(Buffer.from(socialWorkspaceSvg(data)))
    .png()
    .toFile(path.join(outDir, fileName));
}

await fs.mkdir(outDir, { recursive: true });

await renderMarkdownCard("markdown-chatgpt-answer.png", {
  title: "Project recap",
  body: "Three useful takeaways from this ChatGPT answer:\n\n- Start with the user task\n- Keep the reusable output\n- Export the final result as an image card",
});

await renderMarkdownCard("markdown-api-checklist.png", {
  title: "API launch checklist",
  body: "- Validate input\n- Return helpful errors\n- Document limits\n- Test the retry path\n\nstatus: ready",
});

await renderMarkdownCard("markdown-social-card.png", {
  title: "Small tools. Faster work.",
  body: "Works well for:\n\n- X image posts\n- LinkedIn visuals\n- Newsletter recap cards\n- Short tutorials",
});

await renderSocialWorkspace("social-workspace-launch.png", {
  input: "Write a launch post for this product: NavoKit Markdown to Image. It turns Markdown, ChatGPT answers, notes, and checklists into clean PNG image cards. Include this link exactly: navokit.com/en/tools/markdown-to-image. Audience: creators and developers. Tone: direct, useful, not salesy.",
  drafts: [
    { label: "X / Twitter", text: "Turn text into shareable images without the design headache. NavoKit Markdown to Image converts your notes, checklists, and even ChatGPT answers into clean PNGs instantly." },
    { label: "LinkedIn", text: "Design overhead often slows down content creation. NavoKit's Markdown to Image tool converts structured text directly into clean, high-quality PNG image cards." },
    { label: "Instagram", text: "Text to image, but make it clean. Stop wrestling with templates for simple posts. NavoKit turns markdown, notes, and chat responses into ready-to-share PNG cards." },
    { label: "Hook ideas", text: "Turn text into shareable images instantly. Stop designing simple posts. Just write. Markdown to PNG: The shortcut creators need." },
  ],
});

await renderSocialWorkspace("social-workspace-video-prompt.png", {
  input: "Turn this guide idea into a practical X post: most AI video prompts fail because they describe a vibe, not a shot. Include a simple structure: subject, action, setting, camera movement, lighting, style. Tone: useful, concise, no hype.",
  drafts: [
    { label: "X / Twitter", text: "Most AI video prompts fail. Why? You describe a vibe, not a shot. Fix it with this structure: subject, action, setting, camera movement, lighting, style." },
    { label: "LinkedIn", text: "If your AI video output looks chaotic, your prompt is likely too abstract. Define specific visual elements instead of only describing a mood." },
    { label: "Instagram", text: "Stop prompting vibes. Start directing shots. Subject + Action + Setting + Camera Movement + Lighting + Style." },
    { label: "Hook ideas", text: "Stop asking for vibes. Start asking for shots. The 6-part formula that fixes bad AI video prompts." },
  ],
});

await renderSocialWorkspace("social-workspace-event.png", {
  input: "Write an Instagram caption for an online live session about turning rough notes into publishable content. Keep it clear, relaxed, not overhyped. Include date placeholder, time placeholder, topic, and what people will learn.",
  drafts: [
    { label: "X / Twitter", text: "Rough notes shouldn't stay rough. Join my live session on turning fragmented ideas into polished content. Date: [Date]. Time: [Time]." },
    { label: "LinkedIn", text: "We all have great ideas that get stuck in rough notes. The gap between a scribbled thought and a publishable asset is often just process." },
    { label: "Instagram", text: "Stuck with messy notes? Let's fix that. I'm hosting a live session to show you how to turn rough drafts into content you can actually publish." },
    { label: "Hook ideas", text: "Turn messy notes into clean posts. Stop letting good ideas stay in drafts. From scribble to publish in one session." },
  ],
});

console.log("Generated tool example assets in public/images/tool-examples");
