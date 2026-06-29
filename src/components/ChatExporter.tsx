"use client";

import { useRef, useState } from "react";
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

export default function ChatExporter({ dict, lang }: { dict: Dictionary; lang: "en" | "zh" }) {
  const [markdown, setMarkdown] = useState("# Project notes\n\n**Small tools** help people finish work faster.\n\n- Clear input\n- Useful output\n- Easy to share");
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const zh = lang === "zh";
  const content = getToolPageContent(lang, "markdown-to-image");

  async function download() {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, { pixelRatio: 2, backgroundColor: "#FFFFFF" });
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
                <div className="export-watermark"><span className="watermark-symbol">N</span><span>Made with <b>NavoKit</b></span></div>
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
