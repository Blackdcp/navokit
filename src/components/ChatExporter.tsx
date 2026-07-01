"use client";

import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import ToolPageContent from "./ToolPageContent";
import { getToolPageContent } from "../lib/toolPageContent";

type Dictionary = {
  tools: {
    chatExporter: {
      hero: { title: string; subtitle: string; watermarkText: string };
      editor: { placeholder: string; previewTitle: string; downloadImage: string; downloading: string };
    };
  };
};

const WATERMARK_LOGO_SRC = "/logo.png";
const WATERMARK_CANVAS_WIDTH = 164;
const WATERMARK_CANVAS_HEIGHT = 42;

let watermarkImagePromise: Promise<HTMLImageElement> | null = null;

function loadWatermarkImage() {
  if (watermarkImagePromise) return watermarkImagePromise;

  watermarkImagePromise = new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load NavoKit watermark logo."));
    image.src = WATERMARK_LOGO_SRC;
  });

  return watermarkImagePromise;
}

function drawImageCover(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
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

  context.clearRect(0, 0, width, height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
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
  const watermarkCanvasRef = useRef<HTMLCanvasElement>(null);
  const zh = lang === "zh";
  const content = getToolPageContent(lang, "markdown-to-image");

  async function renderWatermarkLogo() {
    const canvas = watermarkCanvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const image = await loadWatermarkImage();
    drawImageCover(context, image, canvas.width, canvas.height);
  }

  useEffect(() => {
    renderWatermarkLogo().catch(() => undefined);
  }, []);

  async function download() {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      await renderWatermarkLogo();
      await waitForImages(previewRef.current);

      const blob = await htmlToImage.toBlob(previewRef.current, {
        pixelRatio: 2,
        backgroundColor: "#FFFFFF",
        cacheBust: true,
      });

      if (!blob) throw new Error("Unable to export image.");
      saveBlob(blob, "navokit-markdown.png");
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
                  <canvas
                    ref={watermarkCanvasRef}
                    className="watermark-logo"
                    width={WATERMARK_CANVAS_WIDTH}
                    height={WATERMARK_CANVAS_HEIGHT}
                    role="img"
                    aria-label="NavoKit"
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
