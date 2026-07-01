"use client";

import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import ToolPageContent from "./ToolPageContent";
import { trackToolError, trackToolEvent } from "../lib/clientAnalytics";
import { getToolPageContent } from "../lib/toolPageContent";

type Dictionary = {
  tools: {
    chatExporter: {
      hero: { title: string; subtitle: string; watermarkText: string };
      editor: { placeholder: string; previewTitle: string; downloadImage: string; downloading: string };
    };
  };
};

const WATERMARK_LOGO_SRC = "/logo-watermark.png";

let watermarkImagePromise: Promise<HTMLImageElement> | null = null;

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

async function loadWatermarkImage() {
  if (watermarkImagePromise) return watermarkImagePromise;

  watermarkImagePromise = fetch(WATERMARK_LOGO_SRC, { cache: "force-cache" })
    .then(response => {
      if (!response.ok) throw new Error(`Unable to fetch NavoKit watermark logo: ${response.status}`);
      return response.blob();
    })
    .then(blobToDataUrl)
    .then(loadImage)
    .catch(() => loadImage(WATERMARK_LOGO_SRC));

  return watermarkImagePromise;
}

function drawImageCoverAt(context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = sourceWidth;
  let sh = sourceHeight;

  if (sourceRatio > targetRatio) {
    sw = sourceHeight * targetRatio;
    sx = (sourceWidth - sw) / 2;
  } else {
    sh = sourceWidth / targetRatio;
    sy = (sourceHeight - sh) / 2;
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

async function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(async image => {
      if (image.complete && image.naturalWidth > 0) return;
      if (typeof image.decode === "function") {
        await image.decode().catch(() => undefined);
      }
    })
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

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

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

export default function ChatExporter({ dict, lang }: { dict: Dictionary; lang: "en" | "zh" }) {
  const [markdown, setMarkdown] = useState("# Project notes\n\n**Small tools** help people finish work faster.\n\n- Clear input\n- Useful output\n- Easy to share");
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const watermarkLogoRef = useRef<HTMLImageElement>(null);
  const zh = lang === "zh";
  const content = getToolPageContent(lang, "markdown-to-image");

  useEffect(() => {
    loadWatermarkImage().catch(() => undefined);
  }, []);

  async function download() {
    if (!previewRef.current) return;
    setExporting(true);
    const exportNode = previewRef.current;
    const watermarkLogo = watermarkLogoRef.current;
    try {
      trackToolEvent("tool_markdown_export_started", {
        tool: "markdown_to_image",
        lang,
        characters: markdown.length,
      });

      const watermarkImage = await loadWatermarkImage();
      await waitForImages(exportNode);

      const rootRect = exportNode.getBoundingClientRect();
      const watermarkRect = watermarkLogo?.getBoundingClientRect();

      const canvas = await htmlToImage.toCanvas(exportNode, {
        pixelRatio: 2,
        backgroundColor: "#FFFFFF",
        cacheBust: true,
      });

      const context = canvas.getContext("2d");
      if (context) {
        const scaleX = canvas.width / rootRect.width;
        const scaleY = canvas.height / rootRect.height;
        const nodeStyle = window.getComputedStyle(exportNode);
        const fallbackWidth = 82;
        const fallbackHeight = 21;
        const fallbackRight = Number.parseFloat(nodeStyle.paddingRight) || 24;
        const fallbackBottom = Number.parseFloat(nodeStyle.paddingBottom) || 24;
        const box =
          watermarkRect && watermarkRect.width > 0 && watermarkRect.height > 0
            ? {
                x: watermarkRect.left - rootRect.left,
                y: watermarkRect.top - rootRect.top,
                width: watermarkRect.width,
                height: watermarkRect.height,
              }
            : {
                x: rootRect.width - fallbackRight - fallbackWidth,
                y: rootRect.height - fallbackBottom - fallbackHeight,
                width: fallbackWidth,
                height: fallbackHeight,
              };

        drawImageCoverAt(context, watermarkImage, box.x * scaleX, box.y * scaleY, box.width * scaleX, box.height * scaleY);
      }

      const blob = await canvasToPngBlob(canvas);
      saveBlob(blob, "navokit-markdown.png");
      trackToolEvent("tool_markdown_export_succeeded", {
        tool: "markdown_to_image",
        lang,
        characters: markdown.length,
      });
    } catch (caught) {
      trackToolError("tool_markdown_export_failed", caught, {
        tool: "markdown_to_image",
        lang,
        characters: markdown.length,
      });
      console.error("Markdown export failed", caught);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="site-shell">
      <SiteHeader lang={lang} />
      <main>
        <header className="tool-hero tool-container">
          <span className="tool-badge">{zh ? "文本与导出" : "Text & Export"}</span>
          <h1>{dict.tools.chatExporter.hero.title}</h1>
          <p>{dict.tools.chatExporter.hero.subtitle}</p>
        </header>

        <section className="tool-workspace tool-container">
          <div className="workspace-panel">
            <div className="workspace-panel__header">
              <div><span>01</span><strong>{zh ? "粘贴 Markdown" : "Paste Markdown"}</strong></div>
              <small>{markdown.length} characters</small>
            </div>
            <textarea className="workspace-textarea" value={markdown} onChange={event => setMarkdown(event.target.value)} placeholder={dict.tools.chatExporter.editor.placeholder} />
          </div>

          <div className="workspace-panel workspace-panel--preview">
            <div className="workspace-panel__header">
              <div><span>02</span><strong>{dict.tools.chatExporter.editor.previewTitle}</strong></div>
              <button className="button button--blue button--small" disabled={!markdown || exporting} onClick={download}>
                {exporting ? dict.tools.chatExporter.editor.downloading : dict.tools.chatExporter.editor.downloadImage}
              </button>
            </div>
            <div className="preview-canvas">
              <div ref={previewRef} className="markdown-export">
                <div className="export-markdown prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown></div>
                <div className="export-watermark">
                  <span>Made with</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={watermarkLogoRef}
                    className="watermark-logo"
                    src={WATERMARK_LOGO_SRC}
                    alt="NavoKit"
                    width={328}
                    height={84}
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ToolPageContent lang={lang} {...content} />
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
