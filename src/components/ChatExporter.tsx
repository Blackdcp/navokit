"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import * as htmlToImage from "html-to-image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, ClipboardPaste, Copy, Download, Trash2 } from "lucide-react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import ToolPageContent from "./ToolPageContent";
import { trackToolError, trackToolEvent } from "../lib/clientAnalytics";
import type { ToolPageContentData } from "../types/toolPageContent";
import "./tool-studio.css";

type Dictionary = {
  tools: {
    chatExporter: {
      hero: { title: string; subtitle: string; watermarkText: string };
      editor: { placeholder: string; previewTitle: string; downloadImage: string; downloading: string };
    };
  };
};

export type ExportTheme = "light" | "dark";
export type ExportPreset = "paper" | "mist" | "cream" | "midnight" | "graphite";
export type ExportRatio = "auto" | "4:5" | "16:9" | "1:1";
export type ExportFont = "sans" | "serif" | "mono";
export type ExportSize = "sm" | "md" | "lg";
export type ExportScale = 2 | 3;

const PRESET_META: Array<{ id: ExportPreset; en: string; zh: string; swatch: string; dark: boolean; bg: string }> = [
  { id: "paper", en: "Paper", zh: "纸白", swatch: "#FFFFFF", dark: false, bg: "#E2E8F0" },
  { id: "mist", en: "Mist", zh: "雾蓝", swatch: "#DBEAFE", dark: false, bg: "#E0E7FF" },
  { id: "cream", en: "Cream", zh: "暖米", swatch: "#FAF7F2", dark: false, bg: "#E8E0D4" },
  { id: "midnight", en: "Midnight", zh: "午夜", swatch: "#0B1220", dark: true, bg: "#050914" },
  { id: "graphite", en: "Graphite", zh: "石墨", swatch: "#18181B", dark: true, bg: "#09090B" },
];

const QUICK_SAMPLES = {
  en: [
    {
      label: "Checklist",
      content: `# 5-Step Product Launch Checklist

1. **Validate one core workflow** — Confirm users finish the task without docs.
2. **Export real visual proof** — Replace generic mockups with actual outputs.
3. **Track real actions** — Measure exports and return visits, not vanity clicks.
4. **Ship to focused communities** — Answer real threads where the pain already exists.
5. **Fix top friction first** — Polish before scaling distribution.`,
    },
    {
      label: "Table",
      content: `# Local vs. Cloud Tool Architecture

| Dimension | Browser-Local | Cloud API |
| --- | --- | --- |
| **Latency** | Instant (0 ms) | Queue & network |
| **Privacy** | Stays on device | Sent to server |
| **Marginal Cost** | Zero | Per-request |

> Start local-first whenever a workflow can run cleanly in the browser.`,
    },
    {
      label: "Code",
      content: `# Ship Small, Verify Fast

Keep every release static, verifiable, and zero-surprise:

\`\`\`bash
npm run lint && npm run build
npm run geo:audit -- http://127.0.0.1:3001
\`\`\`

- **Zero runtime drift** across 400+ static pages
- **Instant CDN delivery** with zero cold starts`,
    },
  ],
  zh: [
    {
      label: "清单",
      content: `# 独立产品上线 5 步检查清单

1. **打穿唯一核心流程** — 确保新用户不看说明书也能完成主任务。
2. **展示真实产品输出** — 用真实截图和导出结果替代空洞宣传图。
3. **盯紧真实动作指标** — 看导出与回访，不只看表面浏览量。
4. **去痛点现场自然分享** — 在用户已经在讨论该问题的社区里提供帮助。
5. **先修掉最大卡点** — 体验打磨到位后再放大分发。`,
    },
    {
      label: "表格",
      content: `# 纯前端本地工具 vs 云端 API 工具

| 对比维度 | 浏览器本地运行 | 云端 API 托管 |
| --- | --- | --- |
| **响应速度** | 毫秒级，无等待 | 受队列与延迟影响 |
| **数据隐私** | 内容留在用户本机 | 需上传第三方服务器 |
| **边际成本** | 几乎为零 | 按次消耗算力费用 |

> 凡是能在浏览器端完成的任务，优先本地架构：更快、更稳、更省钱。`,
    },
    {
      label: "代码",
      content: `# 小步快跑，自动校验

让每一次上线都保持纯静态、可验证、零惊喜：

\`\`\`bash
npm run lint && npm run build
npm run geo:audit -- http://127.0.0.1:3001
\`\`\`

- **400+ 静态页面零运行时漂移**
- **CDN 直出，无冷启动与额外函数费用**`,
    },
  ],
};

const WATERMARK_LOGOS: Record<ExportTheme, string> = {
  light: "/logo-watermark.png",
  dark: "/logo-inverse.png",
};

const markdownComponents = {
  h1: ({ children }: ComponentPropsWithoutRef<"h1">) => <h2 className="markdown-rendered-h1">{children}</h2>,
};

const watermarkImagePromises: Partial<Record<ExportTheme, Promise<HTMLImageElement>>> = {};

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = async () => {
      if (typeof image.decode === "function") {
        await image.decode().catch(() => undefined);
      }
      resolve(image);
    };
    image.onerror = () => reject(new Error("Unable to load NavoKit watermark logo."));
    image.src = src;
  });
}

async function loadWatermarkImage(theme: ExportTheme) {
  if (watermarkImagePromises[theme]) return watermarkImagePromises[theme]!;
  const src = WATERMARK_LOGOS[theme];

  watermarkImagePromises[theme] = fetch(src, { cache: "force-cache" })
    .then(response => {
      if (!response.ok) throw new Error(`Unable to fetch NavoKit watermark logo: ${response.status}`);
      return response.blob();
    })
    .then(blobToDataUrl)
    .then(loadImage)
    .catch(() => loadImage(src));

  return watermarkImagePromises[theme]!;
}

function drawImageContainAt(context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let dx = x;
  let dy = y;

  if (sourceRatio > targetRatio) {
    drawHeight = width / sourceRatio;
    dy = y + (height - drawHeight) / 2;
  } else {
    drawWidth = height * sourceRatio;
    dx = x + (width - drawWidth) / 2;
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, dx, dy, drawWidth, drawHeight);
}

async function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(async image => {
      if (image.complete && image.naturalWidth > 0) return;
      if (typeof image.decode === "function") {
        await image.decode().catch(() => undefined);
      }
    }),
  );
}

function isMobileSafari() {
  if (typeof navigator === "undefined") return false;
  const userAgent = navigator.userAgent;
  const isAppleMobile = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS/.test(userAgent);
  return isAppleMobile && isSafari;
}

function dataUrlToBlob(dataUrl: string) {
  const [metadata, data] = dataUrl.split(",");
  const mime = metadata.match(/data:(.*?);/)?.[1] || "image/png";
  const binary = window.atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  if (!canvas.toBlob) {
    return Promise.resolve(dataUrlToBlob(canvas.toDataURL("image/png")));
  }
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("Unable to export image."));
    }, "image/png");
  });
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  if (isMobileSafari()) {
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return;
  }
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

type BreadcrumbItem = { label: string; href?: string };
type UseCaseLink = { title: string; description: string; href: string };

export default function ChatExporter({
  dict,
  lang,
  content,
  initialMarkdown,
  exportFilename = "navokit-markdown.png",
  defaultTheme = "light",
  defaultRatio = "auto",
  heroBadge,
  heroTitle,
  heroSubtitle,
  answerFirst,
  breadcrumbItems,
  useCaseLinks,
}: {
  dict: Dictionary;
  lang: "en" | "zh";
  content: ToolPageContentData;
  initialMarkdown?: string;
  exportFilename?: string;
  defaultTheme?: ExportTheme;
  defaultRatio?: ExportRatio;
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  answerFirst?: string;
  breadcrumbItems?: BreadcrumbItem[];
  useCaseLinks?: UseCaseLink[];
}) {
  const zh = lang === "zh";
  const defaultMarkdown = QUICK_SAMPLES[lang][0].content;
  const [markdown, setMarkdown] = useState(initialMarkdown ?? defaultMarkdown);
  const [preset, setPreset] = useState<ExportPreset>(defaultTheme === "dark" ? "midnight" : "mist");
  const [ratio, setRatio] = useState<ExportRatio>(defaultRatio);
  const [font, setFont] = useState<ExportFont>("sans");
  const [size, setSize] = useState<ExportSize>("md");
  const [framed, setFramed] = useState(true);
  const [scale, setScale] = useState<ExportScale>(2);
  const [author, setAuthor] = useState("");
  const [exporting, setExporting] = useState(false);
  const [copying, setCopying] = useState(false);
  const [toast, setToast] = useState("");
  const [exportError, setExportError] = useState("");
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const watermarkLogoRef = useRef<HTMLImageElement>(null);

  const presetInfo = PRESET_META.find(item => item.id === preset) ?? PRESET_META[0];
  const isDark = presetInfo.dark;
  const watermarkTheme: ExportTheme = isDark ? "dark" : "light";

  useEffect(() => {
    loadWatermarkImage(watermarkTheme).catch(() => undefined);
  }, [watermarkTheme]);

  useEffect(() => {
    const node = previewRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const update = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({ w: Math.round(rect.width * scale), h: Math.round(rect.height * scale) });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [scale, preset, ratio, font, size, framed, markdown, author]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(current => (current === message ? "" : current)), 2400);
  }, []);

  const renderExportBlob = useCallback(async (): Promise<Blob> => {
    const exportNode = previewRef.current;
    if (!exportNode) throw new Error("Preview not ready.");
    const watermarkLogo = watermarkLogoRef.current;
    const watermarkImage = await loadWatermarkImage(watermarkTheme);
    await waitForImages(exportNode);

    const rootRect = exportNode.getBoundingClientRect();
    const watermarkRect = watermarkLogo?.getBoundingClientRect();
    const cardBg = isDark ? (preset === "graphite" ? "#141417" : "#0B1220") : preset === "cream" ? "#FAF7F2" : "#FFFFFF";

    const canvas = await htmlToImage.toCanvas(exportNode, {
      pixelRatio: scale,
      backgroundColor: framed ? presetInfo.bg : cardBg,
      cacheBust: true,
    });

    const context = canvas.getContext("2d");
    if (context && watermarkRect && watermarkRect.width > 0 && watermarkRect.height > 0) {
      const scaleX = canvas.width / rootRect.width;
      const scaleY = canvas.height / rootRect.height;
      const box = {
        x: watermarkRect.left - rootRect.left,
        y: watermarkRect.top - rootRect.top,
        width: watermarkRect.width,
        height: watermarkRect.height,
      };
      context.fillStyle = cardBg;
      context.fillRect(box.x * scaleX, box.y * scaleY, box.width * scaleX, box.height * scaleY);
      drawImageContainAt(context, watermarkImage, box.x * scaleX, box.y * scaleY, box.width * scaleX, box.height * scaleY);
    }

    return canvasToPngBlob(canvas);
  }, [framed, isDark, preset, presetInfo.bg, scale, watermarkTheme]);

  const download = useCallback(async () => {
    if (!previewRef.current || exporting || copying || !markdown.trim()) return;
    setExporting(true);
    setExportError("");
    try {
      trackToolEvent("tool_markdown_export_started", {
        tool: "markdown_to_image",
        lang,
        preset,
        ratio,
        scale,
        characters: markdown.length,
      });

      const blob = await renderExportBlob();
      saveBlob(blob, exportFilename);
      showToast(zh ? `已导出 ${scale}x 高清 PNG（${exportFilename}）` : `Downloaded ${scale}x PNG (${exportFilename})`);
      trackToolEvent("tool_markdown_export_succeeded", {
        tool: "markdown_to_image",
        lang,
        preset,
        ratio,
        scale,
        characters: markdown.length,
      });
    } catch (caught) {
      trackToolError("tool_markdown_export_failed", caught, {
        tool: "markdown_to_image",
        lang,
        characters: markdown.length,
      });
      setExportError(zh ? "暂时无法导出图片。请保留输入内容，移除无法加载的外部图片后重试。" : "Could not export PNG. Remove any remote external images blocked by CORS and retry.");
    } finally {
      setExporting(false);
    }
  }, [copying, exportFilename, exporting, lang, markdown, preset, ratio, renderExportBlob, scale, showToast, zh]);

  const copyImage = useCallback(async () => {
    if (!previewRef.current || exporting || copying || !markdown.trim()) return;
    setCopying(true);
    setExportError("");
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard || typeof ClipboardItem === "undefined") {
        throw new Error("CLIPBOARD_UNSUPPORTED");
      }
      const blob = await renderExportBlob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      showToast(zh ? "已复制高清 PNG 到剪贴板，直接粘贴即可" : "Copied high-DPI PNG to clipboard—ready to paste");
      trackToolEvent("tool_markdown_copy_succeeded", {
        tool: "markdown_to_image",
        lang,
        preset,
        ratio,
        scale,
        characters: markdown.length,
      });
    } catch (caught) {
      const unsupported = caught instanceof Error && caught.message === "CLIPBOARD_UNSUPPORTED";
      trackToolError("tool_markdown_copy_failed", caught, {
        tool: "markdown_to_image",
        lang,
        characters: markdown.length,
      });
      setExportError(
        unsupported
          ? (zh ? "当前浏览器不支持直接复制 PNG，请点击「下载图片」。" : "Your browser does not support copying PNG images directly. Use Download PNG instead.")
          : (zh ? "复制图片失败，请点击「下载图片」保存 PNG。" : "Could not copy image in this browser. Please use Download PNG instead."),
      );
    } finally {
      setCopying(false);
    }
  }, [copying, exporting, lang, markdown, preset, ratio, renderExportBlob, scale, showToast, zh]);

  async function pasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMarkdown(text);
        showToast(zh ? "已从剪贴板粘贴 Markdown" : "Pasted Markdown from clipboard");
      }
    } catch {
      setExportError(zh ? "浏览器未授权读取剪贴板，请直接在编辑框按 ⌘V / Ctrl+V 粘贴。" : "Clipboard access denied. Press ⌘V / Ctrl+V inside the editor instead.");
    }
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        void download();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [download]);

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const ratioClass = ratio === "4:5"
    ? "studio-export-frame--ratio-4-5"
    : ratio === "16:9"
      ? "studio-export-frame--ratio-16-9"
      : ratio === "1:1"
        ? "studio-export-frame--ratio-1-1"
        : "";

  return (
    <div className="site-shell">
      <SiteHeader lang={lang} />
      <main id="main-content">
        <header className="tool-hero tool-container">
          {breadcrumbItems && breadcrumbItems.length > 0 && (
            <nav className="tool-breadcrumb" aria-label={zh ? "面包屑导航" : "Breadcrumb"}>
              {breadcrumbItems.map((item, idx) => (
                <span key={`${item.label}-${idx}`}>
                  {idx > 0 && <span aria-hidden="true"> / </span>}
                  {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
                </span>
              ))}
            </nav>
          )}
          <span className="tool-badge">{heroBadge ?? (zh ? "文本与导出" : "Text & Export")}</span>
          <h1>{heroTitle ?? dict.tools.chatExporter.hero.title}</h1>
          <p>{heroSubtitle ?? dict.tools.chatExporter.hero.subtitle}</p>
        </header>

        <section className="studio-workspace tool-container">
          {/* Panel 01: Editor */}
          <div className="studio-panel">
            <div className="studio-panel__header">
              <div className="studio-panel__title">
                <span className="studio-step-badge">01</span>
                <strong id="markdown-input-label">{zh ? "编辑或粘贴 Markdown" : "Edit or paste Markdown"}</strong>
              </div>
              <div className="workspace-actions">
                <button type="button" className="studio-icon-btn" onClick={pasteClipboard}>
                  <ClipboardPaste size={13} aria-hidden="true" />
                  <span>{zh ? "粘贴" : "Paste"}</span>
                </button>
                <button type="button" className="studio-icon-btn" disabled={!markdown} onClick={() => setMarkdown("")}>
                  <Trash2 size={13} aria-hidden="true" />
                  <span>{zh ? "清空" : "Clear"}</span>
                </button>
              </div>
            </div>

            <div className="studio-toolbar" role="toolbar" aria-label={zh ? "示例模板" : "Quick templates"}>
              <div className="studio-group" role="group" aria-label={zh ? "示例" : "Samples"}>
                {QUICK_SAMPLES[lang].map(sample => (
                  <button
                    key={sample.label}
                    type="button"
                    className="studio-chip"
                    onClick={() => setMarkdown(sample.content)}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                className="studio-author-input"
                value={author}
                maxLength={40}
                onChange={event => setAuthor(event.target.value)}
                placeholder={zh ? "署名（如 @你的账号）" : "Byline (e.g. @handle)"}
                aria-label={zh ? "卡片底部作者署名" : "Optional author handle on card footer"}
              />
            </div>

            <textarea
              className="studio-textarea"
              aria-labelledby="markdown-input-label"
              value={markdown}
              onChange={event => setMarkdown(event.target.value)}
              placeholder={dict.tools.chatExporter.editor.placeholder}
            />

            <div className="studio-panel__footer">
              <span>{markdown.length} {zh ? "字符" : "chars"} · {wordCount} {zh ? "词" : "words"}</span>
              <span>{zh ? "快捷键：⌘/Ctrl + Enter 快速下载" : "Shortcut: ⌘/Ctrl + Enter to download"}</span>
            </div>
          </div>

          {/* Panel 02: Studio Preview & Export */}
          <div className="studio-panel">
            <div className="studio-panel__header">
              <div className="studio-panel__title">
                <span className="studio-step-badge">02</span>
                <strong>{dict.tools.chatExporter.editor.previewTitle}</strong>
                {dimensions && (
                  <span className="studio-meta-pill" aria-label={zh ? "导出像素尺寸" : "Export dimensions"}>
                    {dimensions.w} × {dimensions.h} px
                  </span>
                )}
              </div>
              <div className="workspace-actions">
                <button
                  type="button"
                  className="button button--secondary button--small"
                  disabled={!markdown.trim() || exporting || copying}
                  onClick={copyImage}
                >
                  <Copy size={14} aria-hidden="true" style={{ marginRight: 5 }} />
                  {copying ? (zh ? "复制中..." : "Copying...") : (zh ? "复制 PNG" : "Copy PNG")}
                </button>
                <button
                  type="button"
                  className="button button--blue button--small"
                  disabled={!markdown.trim() || exporting || copying}
                  onClick={download}
                >
                  <Download size={14} aria-hidden="true" style={{ marginRight: 5 }} />
                  {exporting ? dict.tools.chatExporter.editor.downloading : dict.tools.chatExporter.editor.downloadImage}
                </button>
              </div>
            </div>

            {/* Row 1: Studio Presets */}
            <div className="studio-toolbar" role="toolbar" aria-label={zh ? "视觉预设" : "Visual presets"}>
              <div className="studio-group" role="group" aria-label={zh ? "主题预设" : "Theme presets"}>
                {PRESET_META.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className={`studio-chip${preset === item.id ? " is-active" : ""}`}
                    aria-pressed={preset === item.id}
                    onClick={() => setPreset(item.id)}
                  >
                    <span className="studio-swatch" style={{ background: item.swatch }} aria-hidden="true" />
                    <span>{zh ? item.zh : item.en}</span>
                  </button>
                ))}
              </div>

              <div className="studio-group" role="group" aria-label={zh ? "画幅比例" : "Aspect ratio"}>
                {(["auto", "4:5", "16:9", "1:1"] as ExportRatio[]).map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`studio-chip${ratio === option ? " is-active" : ""}`}
                    aria-pressed={ratio === option}
                    onClick={() => setRatio(option)}
                  >
                    {option === "auto" ? (zh ? "自适应" : "Auto") : option}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Typography, Frame & Resolution */}
            <div className="studio-toolbar studio-toolbar--sub" role="toolbar" aria-label={zh ? "排版与分辨率设置" : "Typography and resolution"}>
              <div className="studio-group" role="group" aria-label={zh ? "字体风格" : "Font style"}>
                {([
                  ["sans", zh ? "无衬线" : "Sans"],
                  ["serif", zh ? "衬线" : "Serif"],
                  ["mono", zh ? "等宽" : "Mono"],
                ] as Array<[ExportFont, string]>).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={`studio-chip${font === id ? " is-active" : ""}`}
                    aria-pressed={font === id}
                    onClick={() => setFont(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="studio-group" role="group" aria-label={zh ? "字号" : "Font size"}>
                {(["sm", "md", "lg"] as ExportSize[]).map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`studio-chip${size === option ? " is-active" : ""}`}
                    aria-pressed={size === option}
                    onClick={() => setSize(option)}
                  >
                    {option.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="studio-group" role="group" aria-label={zh ? "边框与清晰度" : "Frame and export scale"}>
                <button
                  type="button"
                  className={`studio-chip${framed ? " is-active" : ""}`}
                  aria-pressed={framed}
                  onClick={() => setFramed(prev => !prev)}
                >
                  {zh ? "画框" : "Frame"}
                </button>
                <button
                  type="button"
                  className={`studio-chip${scale === 2 ? " is-active" : ""}`}
                  aria-pressed={scale === 2}
                  onClick={() => setScale(2)}
                >
                  2x
                </button>
                <button
                  type="button"
                  className={`studio-chip${scale === 3 ? " is-active" : ""}`}
                  aria-pressed={scale === 3}
                  onClick={() => setScale(3)}
                >
                  3x HD
                </button>
              </div>
            </div>

            {toast && (
              <div className="studio-toast" role="status">
                <Check size={14} aria-hidden="true" />
                <span>{toast}</span>
              </div>
            )}
            {exportError && <div className="studio-error-banner" role="alert">{exportError}</div>}

            <div className="studio-preview-stage">
              <div
                ref={previewRef}
                className={`studio-export-frame studio-preset-${preset} ${framed ? "studio-export-frame--padded" : "studio-export-frame--flat"} ${ratioClass} studio-font-${font} studio-size-${size}`}
              >
                <div className={`studio-card${isDark ? " studio-card--dark" : ""}`}>
                  <div className={`studio-markdown prose${isDark ? " prose-invert" : ""}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {markdown}
                    </ReactMarkdown>
                  </div>
                  <div className="studio-card__footer">
                    {author.trim() ? <span className="studio-card__author">{author.trim()}</span> : <span />}
                    <div className="studio-card__watermark">
                      <span>Made with</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        ref={watermarkLogoRef}
                        className="watermark-logo"
                        src={WATERMARK_LOGOS[watermarkTheme]}
                        alt="NavoKit"
                        width={328}
                        height={84}
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {answerFirst && (
          <section className="tool-container tool-answer-first" aria-label={zh ? "快速结论" : "Quick answer"}>
            <div className="tool-answer-first__card">
              <span className="tool-answer-first__label">{zh ? "快速结论" : "Quick answer"}</span>
              <p>{answerFirst}</p>
            </div>
          </section>
        )}

        <ToolPageContent lang={lang} {...content} />

        {useCaseLinks && useCaseLinks.length > 0 && (
          <section className="tool-container tool-usecase-links" aria-labelledby="markdown-usecase-heading">
            <h2 id="markdown-usecase-heading">{zh ? "按使用场景直接导出" : "Export templates by workflow"}</h2>
            <div className="tool-usecase-grid">
              {useCaseLinks.map(item => (
                <Link key={item.href} href={item.href} className="tool-usecase-card">
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
