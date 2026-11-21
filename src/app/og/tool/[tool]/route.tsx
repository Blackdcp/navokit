/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

type ToolSlug =
  | "free-ai-video-generator"
  | "ai-social-booster"
  | "markdown-to-image"
  | "mermaid-to-image"
  | "chatgpt-to-image"
  | "claude-to-image"
  | "obsidian-to-image"
  | "linkedin-carousel"
  | "github-readme-card"
  | "x-thread-card";

type OgToolConfig = {
  eyebrow: string;
  title: string;
  subtitle: string;
  inputLabel: string;
  input: string;
  outputLabel: string;
  outputs: string[];
  footer: string;
  accent: string;
};

const size = {
  width: 1200,
  height: 630,
};

const toolCards: Record<ToolSlug, OgToolConfig> = {
  "free-ai-video-generator": {
    eyebrow: "AI VIDEO IDEA TEST",
    title: "Test one AI video prompt",
    subtitle: "One shot. One style. One result to review before you edit.",
    inputLabel: "Prompt",
    input: "Red fox in a snowy forest, soft snowfall, low tracking shot, cinematic realism.",
    outputLabel: "Result",
    outputs: ["Landscape", "Auto duration", "Prompt stays editable for retry"],
    footer: "Free AI Video Generator",
    accent: "#2563EB",
  },
  "ai-social-booster": {
    eyebrow: "SOCIAL DRAFT WORKFLOW",
    title: "Turn one idea into draft angles",
    subtitle: "X, LinkedIn, Instagram, and hooks — still yours to edit.",
    inputLabel: "Idea",
    input:
      "I made a free tool that turns Markdown into clean image cards for creators and founders.",
    outputLabel: "Drafts",
    outputs: ["X post", "LinkedIn angle", "Instagram caption", "Hook ideas"],
    footer: "AI Social Post Generator",
    accent: "#16A34A",
  },
  "markdown-to-image": {
    eyebrow: "MARKDOWN TO IMAGE",
    title: "Turn Markdown into a clean image card",
    subtitle: "Paste notes, preview the card, and export a shareable PNG.",
    inputLabel: "Markdown",
    input: "## Launch checklist\n- One clear idea\n- Short intro\n- Useful steps\n- Export PNG",
    outputLabel: "Preview",
    outputs: ["Clean headings", "Readable bullets", "NavoKit watermark"],
    footer: "Markdown to Image",
    accent: "#0B1220",
  },
  "mermaid-to-image": {
    eyebrow: "MERMAID TO IMAGE",
    title: "Mermaid diagrams to 2x PNG & SVG",
    subtitle: "Render flowcharts, sequence, and ER diagrams locally in your browser.",
    inputLabel: "Mermaid",
    input: "flowchart LR\n  A[Syntax] --> B[Browser]\n  B --> C[2x PNG]\n  B --> D[Vector SVG]",
    outputLabel: "Export",
    outputs: ["Copy PNG in 1 click", "Lossless SVG download", "Light & Dark themes"],
    footer: "Mermaid to Image",
    accent: "#0B1220",
  },
  "chatgpt-to-image": {
    eyebrow: "CHATGPT EXPORT",
    title: "Export ChatGPT answers as clean PNGs",
    subtitle: "Copy raw Markdown from ChatGPT and render a crisp 2x card locally.",
    inputLabel: "ChatGPT Markdown",
    input: "# 5-Step Checklist\n1. Validate workflow\n2. Export clean proof\n3. Track UTM links",
    outputLabel: "PNG Card",
    outputs: ["No login required", "Tables & code intact", "100% browser-local"],
    footer: "ChatGPT to Image",
    accent: "#0B1220",
  },
  "claude-to-image": {
    eyebrow: "CLAUDE EXPORT",
    title: "Turn Claude responses & tables into PNGs",
    subtitle: "Preserve comparison tables, outlines, and Markdown Artifacts cleanly.",
    inputLabel: "Claude Markdown",
    input: "| Dimension | Local | Cloud |\n| Latency | Instant | Queue |\n| Privacy | On-device | Server |",
    outputLabel: "PNG Card",
    outputs: ["GFM tables", "Zero upload", "2x high-DPI PNG"],
    footer: "Claude to Image",
    accent: "#0B1220",
  },
  "obsidian-to-image": {
    eyebrow: "OBSIDIAN NOTES",
    title: "Convert Obsidian notes to PNG cards",
    subtitle: "Share atomic notes and highlights without installing extra plugins.",
    inputLabel: "Obsidian Note",
    input: "# Atomic Note\n- One concept per card\n- Clear 2-line summary\n- Concrete examples",
    outputLabel: "PNG Card",
    outputs: ["No plugins needed", "Local-first privacy", "Crisp typography"],
    footer: "Obsidian to Image",
    accent: "#0B1220",
  },
  "linkedin-carousel": {
    eyebrow: "LINKEDIN VISUALS",
    title: "Markdown to LinkedIn visual cards",
    subtitle: "Skip heavy design tools. Export high-contrast cards for posts & PDFs.",
    inputLabel: "Outline",
    input: "# B2B Content Rules\n- Lead with one takeaway\n- Show a checklist\n- Keep under 100 words",
    outputLabel: "Slide PNG",
    outputs: ["Mobile legible", "Uniform slide padding", "Ready for PDF merge"],
    footer: "LinkedIn Visual Cards",
    accent: "#0B1220",
  },
  "github-readme-card": {
    eyebrow: "DEVELOPER VISUALS",
    title: "GitHub README & changelog to PNG",
    subtitle: "Turn release notes, CLI steps, and GFM tables into launch graphics.",
    inputLabel: "CHANGELOG.md",
    input: "# Release v2.4\n- 3x faster indexing\n- Zero-config CLI\n- Strict TypeScript types",
    outputLabel: "Release Card",
    outputs: ["GFM tables & code", "Safe for private drafts", "2x sharp export"],
    footer: "GitHub README Card",
    accent: "#0B1220",
  },
  "x-thread-card": {
    eyebrow: "X / TWITTER VISUALS",
    title: "Markdown notes & code to X cards",
    subtitle: "Replace blurry phone screenshots with crisp 2x timeline graphics.",
    inputLabel: "Thread Note",
    input: "# Ship Faster\n- Cut scope, not polish\n- Measure real actions\n- Show real outputs",
    outputLabel: "Timeline PNG",
    outputs: ["Code blocks intact", "Attach up to 4 cards", "Browser-local export"],
    footer: "X Thread Card",
    accent: "#0B1220",
  },
};

async function loadImageDataUrl(path: string, type = "image/png") {
  const file = await readFile(path);
  return `data:${type};base64,${Buffer.from(file).toString("base64")}`;
}

async function loadFonts() {
  const geistRegular = await readFile(
    join(process.cwd(), "node_modules", "next", "dist", "compiled", "@vercel", "og", "Geist-Regular.ttf"),
  );
  const fontData = geistRegular.buffer.slice(
    geistRegular.byteOffset,
    geistRegular.byteOffset + geistRegular.byteLength,
  );

  return [
    {
      name: "Geist",
      data: fontData,
      style: "normal" as const,
      weight: 400 as const,
    },
    {
      name: "Geist",
      data: fontData,
      style: "normal" as const,
      weight: 700 as const,
    },
  ];
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(toolCards).map(tool => ({ tool }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tool: string }> },
) {
  const { tool } = await params;
  const config = toolCards[tool as ToolSlug];

  if (!config) {
    return new Response("Not found", { status: 404 });
  }

  const [logoSrc, fonts] = await Promise.all([
    loadImageDataUrl(join(process.cwd(), "public", "logo-watermark.png")),
    loadFonts(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#F8FAFC",
          color: "#0B1220",
          fontFamily: "Geist",
          padding: "54px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 12%, rgba(37, 99, 235, 0.13), transparent 28%), radial-gradient(circle at 86% 72%, rgba(15, 23, 42, 0.08), transparent 34%)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <img src={logoSrc} alt="NavoKit" width={194} height={50} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #D7E2F0",
              borderRadius: 999,
              background: "#FFFFFF",
              padding: "10px 16px",
              color: "#475569",
              fontSize: 22,
            }}
          >
            navokit.com
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 34,
            alignItems: "stretch",
            marginTop: 48,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 548,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  borderRadius: 999,
                  background: "#EFF6FF",
                  color: "#2563EB",
                  padding: "8px 13px",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                {config.eyebrow}
              </div>
              <div
                style={{
                  marginTop: 22,
                  fontSize: 62,
                  lineHeight: 0.96,
                  letterSpacing: "-0.055em",
                  fontWeight: 700,
                }}
              >
                {config.title}
              </div>
              <div
                style={{
                  marginTop: 22,
                  color: "#475569",
                  fontSize: 29,
                  lineHeight: 1.32,
                }}
              >
                {config.subtitle}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#64748B",
                fontSize: 22,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: config.accent,
                }}
              />
              {config.footer}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              border: "1px solid #D7E2F0",
              borderRadius: 32,
              background: "rgba(255,255,255,0.92)",
              padding: 24,
              boxShadow: "0 22px 70px rgba(15,23,42,0.10)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "stretch",
                height: "100%",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #E2E8F0",
                  borderRadius: 22,
                  background: "#FFFFFF",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 18px",
                    borderBottom: "1px solid #E2E8F0",
                    color: "#2563EB",
                    fontSize: 17,
                    fontWeight: 700,
                  }}
                >
                  01
                  <span style={{ color: "#0B1220" }}>{config.inputLabel}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    padding: 22,
                    color: "#172033",
                    whiteSpace: "pre-wrap",
                    fontSize: tool === "markdown-to-image" ? 25 : 24,
                    lineHeight: 1.5,
                  }}
                >
                  {config.input}
                </div>
              </div>

              <div
                style={{
                  width: 250,
                  display: "flex",
                  flexDirection: "column",
                  gap: 13,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#2563EB",
                    fontSize: 17,
                    fontWeight: 700,
                  }}
                >
                  02
                  <span style={{ color: "#0B1220" }}>{config.outputLabel}</span>
                </div>
                {config.outputs.map((output, index) => (
                  <div
                    key={output}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: index === 0 ? 78 : 66,
                      border: "1px solid #E2E8F0",
                      borderRadius: 18,
                      background: index === 0 ? "#F8FAFC" : "#FFFFFF",
                      padding: "14px 16px",
                      color: "#172033",
                      fontSize: 21,
                      lineHeight: 1.2,
                      fontWeight: index === 0 ? 700 : 400,
                    }}
                  >
                    {output}
                  </div>
                ))}
                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 18,
                    background: "#0B1220",
                    color: "#FFFFFF",
                    padding: "16px 18px",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  Free online tool
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable",
      },
    },
  );
}
