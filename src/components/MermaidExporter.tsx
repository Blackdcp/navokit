"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Check, ClipboardPaste, Code2, Copy, Download, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import ToolPageContent from "./ToolPageContent";
import { trackToolError, trackToolEvent } from "../lib/clientAnalytics";
import type { ToolPageContentData } from "../types/toolPageContent";
import "./tool-studio.css";

type DiagramPresetId = "light" | "cream" | "dark" | "forest";
type ExportScale = 2 | 3 | 4;

interface DiagramPreset {
  id: DiagramPresetId;
  en: string;
  zh: string;
  swatch: string;
  mermaidTheme: "neutral" | "base" | "dark" | "forest";
  bg: string;
  dark: boolean;
  themeVariables?: Record<string, string>;
}

const DIAGRAM_PRESETS: DiagramPreset[] = [
  {
    id: "light",
    en: "Light",
    zh: "纸白",
    swatch: "#FFFFFF",
    mermaidTheme: "base",
    bg: "#FFFFFF",
    dark: false,
    themeVariables: {
      background: "#FFFFFF",
      primaryColor: "#F1F5F9",
      primaryTextColor: "#0B1220",
      primaryBorderColor: "#334155",
      lineColor: "#334155",
      secondaryColor: "#F8FAFC",
      tertiaryColor: "#FFFFFF",
      textColor: "#0B1220",
      actorBkg: "#F1F5F9",
      actorBorder: "#334155",
      actorTextColor: "#0B1220",
      signalColor: "#0B1220",
      signalTextColor: "#0B1220",
    },
  },
  {
    id: "cream",
    en: "Editorial",
    zh: "暖米",
    swatch: "#FAF7F2",
    mermaidTheme: "base",
    bg: "#FAF7F2",
    dark: false,
    themeVariables: {
      background: "#FAF7F2",
      primaryColor: "#F3EDE2",
      primaryTextColor: "#1C1917",
      primaryBorderColor: "#57534E",
      lineColor: "#44403C",
      secondaryColor: "#E7DFD3",
      tertiaryColor: "#FAF7F2",
      textColor: "#1C1917",
      actorBkg: "#F3EDE2",
      actorBorder: "#57534E",
      actorTextColor: "#1C1917",
      signalColor: "#1C1917",
      signalTextColor: "#1C1917",
    },
  },
  {
    id: "dark",
    en: "Midnight",
    zh: "午夜",
    swatch: "#0B1220",
    mermaidTheme: "base",
    bg: "#0B1220",
    dark: true,
    themeVariables: {
      darkMode: "true",
      background: "#0B1220",
      primaryColor: "#1E293B",
      primaryTextColor: "#F8FAFC",
      primaryBorderColor: "#64748B",
      lineColor: "#94A3B8",
      secondaryColor: "#131D33",
      tertiaryColor: "#0F172A",
      textColor: "#F8FAFC",
      mainBkg: "#1E293B",
      nodeBorder: "#64748B",
      clusterBkg: "#131D33",
      clusterBorder: "#475569",
      titleColor: "#F8FAFC",
      edgeLabelBackground: "#0B1220",
      actorBkg: "#1E293B",
      actorBorder: "#64748B",
      actorTextColor: "#F8FAFC",
      actorLineColor: "#64748B",
      signalColor: "#E2E8F0",
      signalTextColor: "#F8FAFC",
      labelTextColor: "#F8FAFC",
      noteBkgColor: "#1E293B",
      noteTextColor: "#F8FAFC",
      noteBorderColor: "#475569",
    },
  },
  {
    id: "forest",
    en: "Forest",
    zh: "森绿",
    swatch: "#DCFCE7",
    mermaidTheme: "base",
    bg: "#FFFFFF",
    dark: false,
    themeVariables: {
      background: "#FFFFFF",
      primaryColor: "#ECFDF5",
      primaryTextColor: "#064E3B",
      primaryBorderColor: "#059669",
      lineColor: "#047857",
      secondaryColor: "#D1FAE5",
      tertiaryColor: "#F0FDF4",
      textColor: "#064E3B",
      actorBkg: "#ECFDF5",
      actorBorder: "#059669",
      actorTextColor: "#064E3B",
      signalColor: "#065F46",
      signalTextColor: "#064E3B",
    },
  },
];

let mermaidRenderQueue: Promise<unknown> = Promise.resolve();

function enqueueMermaidRender<T>(task: () => Promise<T>): Promise<T> {
  const next = mermaidRenderQueue.then(task, task);
  mermaidRenderQueue = next.catch(() => undefined);
  return next;
}

interface DiagramTemplate {
  id: string;
  label: { en: string; zh: string };
  code: { en: string; zh: string };
}

const TEMPLATES: DiagramTemplate[] = [
  {
    id: "architecture",
    label: { en: "Architecture", zh: "架构图" },
    code: {
      en: `flowchart LR
  subgraph Client["Browser Client"]
    UI["Editor UI"] --> Engine["Local Renderer"]
  end
  subgraph Edge["Static CDN"]
    HTML["Prebuilt HTML"]
    OG["Static OG PNGs"]
  end
  HTML --> UI
  Engine -->|2x-4x| PNG["PNG / Clipboard"]
  Engine -->|Vector| SVG["Figma-Ready SVG"]`,
      zh: `flowchart LR
  subgraph Client["浏览器本地"]
    UI["在线编辑器"] --> Engine["纯前端渲染引擎"]
  end
  subgraph Edge["静态 CDN 节点"]
    HTML["预渲染 HTML"]
    OG["静态 OG 卡片"]
  end
  HTML --> UI
  Engine -->|2x-4x| PNG["高清 PNG / 剪贴板"]
  Engine -->|无损矢量| SVG["Figma 兼容 SVG"]`,
    },
  },
  {
    id: "flowchart",
    label: { en: "Flowchart", zh: "流程图" },
    code: {
      en: `flowchart TD
  A["Open Pull Request"] --> B{"Lint & Type Check"}
  B -->|Pass| C["Build Static Pages"]
  B -->|Fail| D["Fix Issues Locally"]
  D --> A
  C --> E{"GEO & Crawl Audits"}
  E -->|Pass| F["Deploy to Production"]
  E -->|Fail| D`,
      zh: `flowchart TD
  A["提交代码变更"] --> B{"Lint 与类型检查"}
  B -->|通过| C["静态预渲染构建"]
  B -->|失败| D["本地修复问题"]
  D --> A
  C --> E{"GEO 与抓取审计"}
  E -->|通过| F["发布至生产 CDN"]
  E -->|失败| D`,
    },
  },
  {
    id: "sequence",
    label: { en: "Sequence", zh: "时序图" },
    code: {
      en: `sequenceDiagram
  autonumber
  participant User
  participant App
  participant Auth
  participant API
  User->>App: Click Sign In
  App->>Auth: Request OAuth Token
  Auth-->>App: Signed JWT
  App->>API: GET /v1/projects (Bearer JWT)
  API-->>App: 200 OK JSON
  App-->>User: Render Dashboard`,
      zh: `sequenceDiagram
  autonumber
  participant 用户
  participant 前端应用
  participant 认证服务
  participant 业务接口
  用户->>前端应用: 点击登录
  前端应用->>认证服务: 请求 OAuth 令牌
  认证服务-->>前端应用: 返回签名 JWT
  前端应用->>业务接口: GET /v1/projects (Bearer JWT)
  业务接口-->>前端应用: 200 OK 数据
  前端应用-->>用户: 渲染控制台`,
    },
  },
  {
    id: "state",
    label: { en: "State", zh: "状态机" },
    code: {
      en: `stateDiagram-v2
  [*] --> Queued
  Queued --> Running : Worker picked up
  Running --> Completed : Valid output
  Running --> Retrying : Transient error
  Retrying --> Running : Backoff elapsed
  Retrying --> Failed : Max retries
  Completed --> [*]
  Failed --> [*]`,
      zh: `stateDiagram-v2
  [*] --> 排队中
  排队中 --> 执行中 : Worker 领取任务
  执行中 --> 已完成 : 输出校验通过
  执行中 --> 重试等待 : 临时网络异常
  重试等待 --> 执行中 : 退避时间结束
  重试等待 --> 已失败 : 达到最大重试
  已完成 --> [*]
  已失败 --> [*]`,
    },
  },
  {
    id: "er",
    label: { en: "ER Model", zh: "ER 图" },
    code: {
      en: `erDiagram
  CATEGORY ||--o{ PRODUCT : groups
  PRODUCT ||--o{ COMPARISON : appears_in
  ARTICLE }o--o{ PRODUCT : links_to
  PRODUCT {
    string slug PK
    string pricing
    date verified_at
  }`,
      zh: `erDiagram
  CATEGORY ||--o{ PRODUCT : groups
  PRODUCT ||--o{ COMPARISON : appears_in
  ARTICLE }o--o{ PRODUCT : links_to
  PRODUCT {
    string slug PK
    string pricing
    date verified_at
  }`,
    },
  },
  {
    id: "gantt",
    label: { en: "Roadmap", zh: "甘特图" },
    code: {
      en: `gantt
  title Product Launch Sprint
  dateFormat  YYYY-MM-DD
  section Build
  Core Tool UX       :done, a1, 2026-11-01, 4d
  Static OG & Schema :done, a2, after a1, 2d
  section Growth
  GEO Audit & Launch :active, b1, after a2, 2d
  GSC CTR Tuning     :b2, after b1, 5d`,
      zh: `gantt
  title 产品上线冲刺计划
  dateFormat  YYYY-MM-DD
  section 研发阶段
  核心工具打磨       :done, a1, 2026-11-01, 4d
  静态 OG 与结构化   :done, a2, after a1, 2d
  section 增长阶段
  GEO 审计与上线     :active, b1, after a2, 2d
  GSC 曝光点击调优   :b2, after b1, 5d`,
    },
  },
];

function parseSvgMetrics(svgMarkup: string): { width: number; height: number; exportSvg: string; previewSvg: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgMarkup, "image/svg+xml");
  const svgEl = doc.querySelector("svg");
  if (!svgEl) throw new Error("Invalid SVG output.");

  let width = 800;
  let height = 450;
  const viewBox = svgEl.getAttribute("viewBox");
  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && Number.isFinite(parts[2]) && Number.isFinite(parts[3]) && parts[2] > 0 && parts[3] > 0) {
      width = parts[2];
      height = parts[3];
    }
  } else {
    const attrW = Number.parseFloat(svgEl.getAttribute("width") || "");
    const attrH = Number.parseFloat(svgEl.getAttribute("height") || "");
    if (Number.isFinite(attrW) && attrW > 0) width = attrW;
    if (Number.isFinite(attrH) && attrH > 0) height = attrH;
    svgEl.setAttribute("viewBox", `0 0 ${Math.ceil(width)} ${Math.ceil(height)}`);
  }

  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const serializer = new XMLSerializer();

  // Export SVG: exact pixel dimensions for crisp 2x/3x/4x Canvas rasterization & Figma
  const exportClone = svgEl.cloneNode(true) as SVGSVGElement;
  exportClone.setAttribute("width", String(Math.ceil(width)));
  exportClone.setAttribute("height", String(Math.ceil(height)));
  exportClone.style.maxWidth = "none";
  const exportSvg = serializer.serializeToString(exportClone);

  // Preview SVG: fluid responsive fit inside the card with zero horizontal clipping
  const previewClone = svgEl.cloneNode(true) as SVGSVGElement;
  previewClone.setAttribute("width", "100%");
  previewClone.removeAttribute("height");
  previewClone.style.maxWidth = "100%";
  previewClone.style.height = "auto";
  const previewSvg = serializer.serializeToString(previewClone);

  return {
    width: Math.ceil(width),
    height: Math.ceil(height),
    exportSvg,
    previewSvg,
  };
}

function loadSvgAsImage(svgString: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not rasterize SVG in this browser."));
    img.src = encoded;
  });
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("Unable to encode PNG."));
    }, "image/png");
  });
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export default function MermaidExporter({
  lang,
  content,
  answerFirst,
}: {
  lang: "en" | "zh";
  content: ToolPageContentData;
  answerFirst: string;
}) {
  const zh = lang === "zh";
  const renderIdBase = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [code, setCode] = useState(TEMPLATES[0].code[lang]);
  const [presetId, setPresetId] = useState<DiagramPresetId>("light");
  const [renderedPresetId, setRenderedPresetId] = useState<DiagramPresetId>("light");
  const [transparent, setTransparent] = useState(false);
  const [scale, setScale] = useState<ExportScale>(3);
  const [zoom, setZoom] = useState(1);
  const [exportSvgMarkup, setExportSvgMarkup] = useState("");
  const [previewSvgMarkup, setPreviewSvgMarkup] = useState("");
  const [svgSize, setSvgSize] = useState<{ w: number; h: number } | null>(null);
  const [renderError, setRenderError] = useState("");
  const [exportError, setExportError] = useState("");
  const [toast, setToast] = useState("");
  const [exporting, setExporting] = useState(false);
  const [copying, setCopying] = useState(false);
  const renderSeqRef = useRef(0);

  const preset = DIAGRAM_PRESETS.find(item => item.id === presetId) ?? DIAGRAM_PRESETS[0];
  const activeVisualPreset = DIAGRAM_PRESETS.find(item => item.id === renderedPresetId) ?? preset;
  const PADDING = 40;
  const FOOTER_H = transparent ? 0 : 28;

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(current => (current === message ? "" : current)), 2400);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const seq = ++renderSeqRef.current;

    const timer = window.setTimeout(() => {
      const trimmed = code.trim();
      if (!trimmed) {
        if (!cancelled) {
          setExportSvgMarkup("");
          setPreviewSvgMarkup("");
          setSvgSize(null);
          setRenderError("");
        }
        return;
      }

      void enqueueMermaidRender(async () => {
        if (cancelled || seq !== renderSeqRef.current) return;
        try {
          const mermaidModule = await import("mermaid");
          const mermaid = mermaidModule.default;
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: preset.mermaidTheme,
            themeVariables: preset.themeVariables ?? {},
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            flowchart: { htmlLabels: false, curve: "basis" },
            sequence: { useMaxWidth: true },
          });

          const id = `nv-mmd-${renderIdBase}-${seq}`;
          const { svg } = await mermaid.render(id, trimmed);
          if (!cancelled && seq === renderSeqRef.current) {
            const metrics = parseSvgMetrics(svg);
            setExportSvgMarkup(metrics.exportSvg);
            setPreviewSvgMarkup(metrics.previewSvg);
            setSvgSize({ w: metrics.width, h: metrics.height });
            setRenderedPresetId(preset.id);
            setRenderError("");
          }
        } catch (caught) {
          if (!cancelled && seq === renderSeqRef.current) {
            const message = caught instanceof Error ? caught.message : String(caught);
            setRenderError(
              zh
                ? `语法未闭合或存在错误（已保留上次有效预览）：${message.split("\n")[0]}`
                : `Syntax error (showing last valid diagram): ${message.split("\n")[0]}`,
            );
          }
        }
      });
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [code, preset, renderIdBase, zh]);

  const renderPngBlob = useCallback(async (): Promise<Blob> => {
    if (!exportSvgMarkup) throw new Error("No diagram rendered yet.");
    const { width, height, exportSvg } = parseSvgMetrics(exportSvgMarkup);
    const img = await loadSvgAsImage(exportSvg);

    const outW = width + PADDING * 2;
    const outH = height + PADDING * 2 + FOOTER_H;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(outW * scale);
    canvas.height = Math.round(outH * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable.");
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (!transparent) {
      ctx.fillStyle = activeVisualPreset.bg;
      ctx.fillRect(0, 0, outW, outH);
    }

    ctx.drawImage(img, PADDING, PADDING, width, height);

    if (!transparent) {
      ctx.font = '600 11px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillStyle = activeVisualPreset.dark ? "rgba(148, 163, 184, 0.8)" : "rgba(100, 116, 139, 0.78)";
      ctx.textAlign = "right";
      ctx.fillText("Made with NavoKit", outW - PADDING, outH - 14);
    }

    return canvasToPngBlob(canvas);
  }, [FOOTER_H, PADDING, activeVisualPreset.bg, activeVisualPreset.dark, exportSvgMarkup, scale, transparent]);

  const downloadPng = useCallback(async () => {
    if (!exportSvgMarkup || exporting || copying) return;
    setExporting(true);
    setExportError("");
    try {
      const blob = await renderPngBlob();
      const filename = `navokit-mermaid-${templateId}-${scale}x.png`;
      saveBlob(blob, filename);
      showToast(zh ? `已导出 ${scale}x 高清 PNG（${filename}）` : `Downloaded ${scale}x PNG (${filename})`);
      trackToolEvent("tool_mermaid_export_png", { tool: "mermaid_to_image", lang, preset: presetId, scale, transparent, characters: code.length });
    } catch (caught) {
      trackToolError("tool_mermaid_export_failed", caught, { tool: "mermaid_to_image", lang });
      setExportError(zh ? "导出 PNG 失败，请尝试下载无损矢量 SVG。" : "Could not export PNG in this browser. Try downloading lossless SVG instead.");
    } finally {
      setExporting(false);
    }
  }, [code.length, copying, exportSvgMarkup, exporting, lang, presetId, renderPngBlob, scale, showToast, templateId, transparent, zh]);

  const copyPng = useCallback(async () => {
    if (!exportSvgMarkup || exporting || copying) return;
    setCopying(true);
    setExportError("");
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard || typeof ClipboardItem === "undefined") {
        throw new Error("CLIPBOARD_UNSUPPORTED");
      }
      const blob = await renderPngBlob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      showToast(zh ? `已复制 ${scale}x 高清 PNG 到剪贴板` : `Copied ${scale}x PNG to clipboard—ready to paste`);
      trackToolEvent("tool_mermaid_copy_succeeded", { tool: "mermaid_to_image", lang, preset: presetId, scale, transparent, characters: code.length });
    } catch (caught) {
      trackToolError("tool_mermaid_copy_failed", caught, { tool: "mermaid_to_image", lang });
      setExportError(zh ? "当前浏览器不支持直接复制 PNG，请点击「下载 PNG」或「下载 SVG」。" : "Clipboard image copy is not supported in this browser. Use Download PNG or SVG instead.");
    } finally {
      setCopying(false);
    }
  }, [code.length, copying, exportSvgMarkup, exporting, lang, presetId, renderPngBlob, scale, showToast, transparent, zh]);

  function downloadSvg() {
    if (!exportSvgMarkup) return;
    const filename = `navokit-mermaid-${templateId}.svg`;
    const blob = new Blob([exportSvgMarkup], { type: "image/svg+xml;charset=utf-8" });
    saveBlob(blob, filename);
    showToast(zh ? `已下载矢量 SVG（兼容 Figma / Keynote）` : `Downloaded vector SVG (Figma & Keynote ready)`);
    trackToolEvent("tool_mermaid_export_svg", { tool: "mermaid_to_image", lang, preset: presetId, characters: code.length });
  }

  async function copySvg() {
    if (!exportSvgMarkup) return;
    try {
      await navigator.clipboard.writeText(exportSvgMarkup);
      showToast(zh ? "已复制矢量 SVG 源码（可直接粘贴进 Figma）" : "Copied vector SVG code (paste directly into Figma)");
      trackToolEvent("tool_mermaid_copy_svg", { tool: "mermaid_to_image", lang, preset: presetId });
    } catch {
      setExportError(zh ? "复制 SVG 失败，请点击「下载 SVG」。" : "Could not copy SVG code. Use Download SVG instead.");
    }
  }

  async function pasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text);
        showToast(zh ? "已从剪贴板粘贴 Mermaid 语法" : "Pasted Mermaid syntax from clipboard");
      }
    } catch {
      setExportError(zh ? "浏览器未授权读取剪贴板，请在编辑框按 ⌘V / Ctrl+V 粘贴。" : "Clipboard access denied. Press ⌘V / Ctrl+V inside the editor instead.");
    }
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        void downloadPng();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [downloadPng]);

  const exportW = svgSize ? Math.round((svgSize.w + PADDING * 2) * scale) : null;
  const exportH = svgSize ? Math.round((svgSize.h + PADDING * 2 + FOOTER_H) * scale) : null;

  return (
    <div className="site-shell">
      <SiteHeader lang={lang} />
      <main id="main-content">
        <header className="tool-hero tool-container">
          <nav className="tool-breadcrumb" aria-label={zh ? "面包屑导航" : "Breadcrumb"}>
            <Link href={`/${lang}`}>NavoKit</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${lang}/tools`}>{zh ? "产品库" : "Tools"}</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{zh ? "Mermaid 转图片" : "Mermaid to Image"}</span>
          </nav>
          <span className="tool-badge">{zh ? "图表与导出" : "Diagrams & Export"}</span>
          <h1>{zh ? "Mermaid 流程图转高清 PNG / SVG" : "Mermaid to PNG & SVG Studio"}</h1>
          <p>
            {zh
              ? "把 ChatGPT、Claude 或代码仓库里的 Mermaid 架构图、流程图、时序图与 ER 图直接在浏览器本地渲染为纯矢量 SVG，支持透明底与最高 4x 超清 PNG 导出，兼容 Figma 与 Keynote。"
              : "Render Mermaid architecture, flowcharts, sequence diagrams, ER models, and Gantt charts locally as pure Figma-ready SVG or up to 4x ultra-HD PNG with transparent background support."}
          </p>
        </header>

        <section className="studio-workspace tool-container">
          {/* Panel 01: Mermaid Code Editor */}
          <div className="studio-panel">
            <div className="studio-panel__header">
              <div className="studio-panel__title">
                <span className="studio-step-badge">01</span>
                <strong id="mermaid-input-label">{zh ? "编辑或粘贴 Mermaid 语法" : "Edit or paste Mermaid syntax"}</strong>
              </div>
              <div className="workspace-actions">
                <button type="button" className="studio-icon-btn" onClick={pasteClipboard}>
                  <ClipboardPaste size={13} aria-hidden="true" />
                  <span>{zh ? "粘贴" : "Paste"}</span>
                </button>
                <button type="button" className="studio-icon-btn" disabled={!code} onClick={() => setCode("")}>
                  <Trash2 size={13} aria-hidden="true" />
                  <span>{zh ? "清空" : "Clear"}</span>
                </button>
              </div>
            </div>

            <div className="studio-toolbar" role="toolbar" aria-label={zh ? "内置图表模板" : "Diagram starter templates"}>
              <div className="studio-group" role="group" aria-label={zh ? "图表模板" : "Templates"}>
                {TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    type="button"
                    className={`studio-chip${templateId === tpl.id ? " is-active" : ""}`}
                    aria-pressed={templateId === tpl.id}
                    onClick={() => {
                      setTemplateId(tpl.id);
                      setCode(tpl.code[lang]);
                    }}
                  >
                    {tpl.label[lang]}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="studio-textarea"
              aria-labelledby="mermaid-input-label"
              value={code}
              onChange={event => setCode(event.target.value)}
              spellCheck={false}
              placeholder={zh ? "粘贴 flowchart / sequenceDiagram / stateDiagram-v2 / erDiagram / gantt..." : "Paste flowchart, sequenceDiagram, stateDiagram-v2, erDiagram, or gantt syntax..."}
            />

            <div className="studio-panel__footer">
              <span>{code.split("\n").length} {zh ? "行" : "lines"} · {code.length} {zh ? "字符" : "chars"}</span>
              <span>{zh ? "纯原生 SVG 文本 · 兼容 Figma / PPT" : "Pure native SVG text · Figma & Keynote ready"}</span>
            </div>
          </div>

          {/* Panel 02: Diagram Studio Preview & Export */}
          <div className="studio-panel">
            <div className="studio-panel__header">
              <div className="studio-panel__title">
                <span className="studio-step-badge">02</span>
                <strong>{zh ? "实时矢量预览" : "Live vector preview"}</strong>
                {exportW && exportH && (
                  <span className="studio-meta-pill" aria-label={zh ? "导出像素尺寸" : "Output PNG resolution"}>
                    {exportW} × {exportH} px
                  </span>
                )}
              </div>
              <div className="workspace-actions">
                <button
                  type="button"
                  className="button button--secondary button--small"
                  disabled={!exportSvgMarkup || exporting || copying}
                  onClick={copyPng}
                >
                  <Copy size={13} aria-hidden="true" style={{ marginRight: 5 }} />
                  {copying ? (zh ? "复制中..." : "Copying...") : (zh ? "复制 PNG" : "Copy PNG")}
                </button>
                <button
                  type="button"
                  className="button button--blue button--small"
                  disabled={!exportSvgMarkup || exporting || copying}
                  onClick={downloadPng}
                >
                  <Download size={13} aria-hidden="true" style={{ marginRight: 5 }} />
                  {exporting ? (zh ? "导出中..." : "Exporting...") : `PNG (${scale}x)`}
                </button>
              </div>
            </div>

            {/* Row 1: Theme + Background + Export Scale */}
            <div className="studio-toolbar" role="toolbar" aria-label={zh ? "配色与清晰度" : "Theme and resolution"}>
              <div className="studio-group" role="group" aria-label={zh ? "主题" : "Theme"}>
                {DIAGRAM_PRESETS.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className={`studio-chip${presetId === item.id ? " is-active" : ""}`}
                    aria-pressed={presetId === item.id}
                    onClick={() => setPresetId(item.id)}
                  >
                    <span className="studio-swatch" style={{ background: item.swatch }} aria-hidden="true" />
                    <span>{zh ? item.zh : item.en}</span>
                  </button>
                ))}
              </div>

              <div className="studio-group" role="group" aria-label={zh ? "背景与清晰度" : "Background and scale"}>
                <button
                  type="button"
                  className={`studio-chip${transparent ? " is-active" : ""}`}
                  aria-pressed={transparent}
                  onClick={() => setTransparent(prev => !prev)}
                >
                  {zh ? "透明底" : "Transparent"}
                </button>
                {([2, 3, 4] as ExportScale[]).map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`studio-chip${scale === option ? " is-active" : ""}`}
                    aria-pressed={scale === option}
                    onClick={() => setScale(option)}
                  >
                    {option}x
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Zoom & Vector SVG Actions */}
            <div className="studio-toolbar studio-toolbar--sub" role="toolbar" aria-label={zh ? "缩放与矢量导出" : "Zoom and SVG actions"}>
              <div className="studio-group" role="group" aria-label={zh ? "预览缩放" : "Preview zoom"}>
                <button
                  type="button"
                  className="studio-chip"
                  aria-label={zh ? "缩小" : "Zoom out"}
                  onClick={() => setZoom(z => Math.max(0.5, Number((z - 0.15).toFixed(2))))}
                >
                  <ZoomOut size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="studio-chip"
                  onClick={() => setZoom(1)}
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  className="studio-chip"
                  aria-label={zh ? "放大" : "Zoom in"}
                  onClick={() => setZoom(z => Math.min(2, Number((z + 0.15).toFixed(2))))}
                >
                  <ZoomIn size={13} aria-hidden="true" />
                </button>
              </div>

              <div className="workspace-actions">
                <button type="button" className="studio-icon-btn" disabled={!exportSvgMarkup} onClick={copySvg}>
                  <Code2 size={13} aria-hidden="true" />
                  <span>{zh ? "复制 SVG" : "Copy SVG"}</span>
                </button>
                <button type="button" className="studio-icon-btn" disabled={!exportSvgMarkup} onClick={downloadSvg}>
                  <Download size={13} aria-hidden="true" />
                  <span>{zh ? "下载 SVG" : "Download SVG"}</span>
                </button>
              </div>
            </div>

            {toast && (
              <div className="studio-toast" role="status">
                <Check size={14} aria-hidden="true" />
                <span>{toast}</span>
              </div>
            )}
            {renderError && <div className="studio-error-banner" role="alert">{renderError}</div>}
            {exportError && <div className="studio-error-banner" role="alert">{exportError}</div>}

            <div className={`studio-preview-stage${transparent ? (activeVisualPreset.dark ? " studio-preview-stage--checker-dark" : " studio-preview-stage--checker") : ""}`}>
              <div className={`mermaid-viewport${renderError ? " mermaid-viewport--stale" : ""}`}>
                <div
                  className={`mermaid-card-preview${transparent ? " mermaid-card-preview--transparent" : ""}`}
                  style={{
                    backgroundColor: transparent ? "transparent" : activeVisualPreset.bg,
                    width: `${Math.round(zoom * 100)}%`,
                    minWidth: zoom > 1 ? `${Math.round(zoom * 100)}%` : undefined,
                  }}
                >
                  <div
                    className="mermaid-svg-host"
                    dangerouslySetInnerHTML={{ __html: previewSvgMarkup }}
                  />
                  {!transparent && previewSvgMarkup && (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 18,
                        paddingTop: 12,
                        borderTop: activeVisualPreset.dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(11,18,32,0.08)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: activeVisualPreset.dark ? "#94A3B8" : "#64748B",
                      }}
                    >
                      Made with NavoKit
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tool-container tool-answer-first" aria-label={zh ? "快速结论" : "Quick answer"}>
          <div className="tool-answer-first__card">
            <span className="tool-answer-first__label">{zh ? "快速结论" : "Quick answer"}</span>
            <p>{answerFirst}</p>
          </div>
        </section>

        <ToolPageContent lang={lang} {...content} />
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
