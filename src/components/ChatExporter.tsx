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

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function loadLogoDataUrl() {
  const response = await fetch(WATERMARK_LOGO_SRC, { cache: "force-cache" });

  if (!response.ok) {
    throw new Error(`Unable to load watermark logo: ${response.status}`);
  }

  return blobToDataUrl(await response.blob());
}

async function waitForImage(image: HTMLImageElement) {
  if (image.complete && image.naturalWidth > 0) {
    return;
  }

  if (typeof image.decode === "function") {
    await image.decode().catch(() => undefined);
    return;
  }

  await new Promise<void>(resolve => {
    image.onload = () => resolve();
    image.onerror = () => resolve();
  });
}

async function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(images.map(waitForImage));
}

export default function ChatExporter({ dict, lang }: { dict: Dictionary; lang: "en" | "zh" }) {
  const [markdown, setMarkdown] = useState("# Project notes\n\n**Small tools** help people finish work faster.\n\n- Clear input\n- Useful output\n- Easy to share");
  const [exporting, setExporting] = useState(false);
  const [watermarkLogoSrc, setWatermarkLogoSrc] = useState(WATERMARK_LOGO_SRC);
  const previewRef = useRef<HTMLDivElement>(null);
  const watermarkLogoRef = useRef<HTMLImageElement>(null);
  const zh = lang === "zh";
  const content = getToolPageContent(lang, "markdown-to-image");

  useEffect(() => {
    let cancelled = false;

    loadLogoDataUrl()
      .then(dataUrl => {
        if (!cancelled) setWatermarkLogoSrc(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setWatermarkLogoSrc(WATERMARK_LOGO_SRC);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function ensureWatermarkLogoReady() {
    const image = watermarkLogoRef.current;
    let logoSrc = watermarkLogoSrc;

    if (!logoSrc.startsWith("data:")) {
      logoSrc = await loadLogoDataUrl();
      setWatermarkLogoSrc(logoSrc);
    }

    if (image) {
      image.src = logoSrc;
      await waitForImage(image);
    }
  }

  async function download() {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      await ensureWatermarkLogoReady();
      await waitForImages(previewRef.current);

      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        pixelRatio: 2,
        backgroundColor: "#FFFFFF",
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = "navokit-markdown.png";
      link.href = dataUrl;
      link.click();
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
                  <img ref={watermarkLogoRef} className="watermark-logo" src={watermarkLogoSrc} alt="NavoKit" width={1672} height={941} decoding="async" />
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
