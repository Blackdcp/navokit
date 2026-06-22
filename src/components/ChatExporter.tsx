'use client';

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as htmlToImage from 'html-to-image';
import Link from 'next/link';

export default function ChatExporter({ dict, lang }: { dict: any; lang: string }) {
  const [markdown, setMarkdown] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#1E1E1E', 
      });
      const link = document.createElement('a');
      link.download = 'chat-export.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "sans-serif" }}>
      {/* Standardized Header */}
      <header style={{ background: "#ffffff", borderBottom: "1px solid #eaeaea", padding: "12px 0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
          <Link href={`/${lang}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
             <span style={{ fontSize: 24, color: "#111827" }}>←</span>
             <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{dict.ppt2pdf?.back || (lang === 'zh' ? '返回首页' : 'Back to Home')}</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: 1080, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#111827", marginBottom: 16, letterSpacing: "-0.04em" }}>
          {dict.tools.chatExporter.hero.title}
        </h1>
        <p style={{ fontSize: 16, color: "#666666", marginBottom: 48, lineHeight: 1.6 }}>
          {dict.tools.chatExporter.hero.subtitle}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "32px", textAlign: "left", alignItems: "start" }}>
          
          {/* Left Side: Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Markdown Input</label>
            <textarea
              style={{
                width: "100%",
                height: "600px",
                padding: "16px",
                background: "#ffffff",
                border: "1px solid #eaeaea",
                borderRadius: "12px",
                color: "#111827",
                fontFamily: "monospace",
                fontSize: "14px",
                resize: "none",
                outline: "none",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                transition: "border-color 0.2s"
              }}
              placeholder={dict.tools.chatExporter.editor.placeholder}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = "#1677ff"}
              onBlur={(e) => e.target.style.borderColor = "#eaeaea"}
            />
          </div>

          {/* Right Side: Preview & Export */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{dict.tools.chatExporter.editor.previewTitle}</label>
              <button
                onClick={handleDownload}
                disabled={isGenerating || !markdown}
                className="vercel-button"
                style={{
                  padding: "8px 24px",
                  fontSize: "14px",
                  fontWeight: 500,
                  opacity: (isGenerating || !markdown) ? 0.5 : 1,
                  cursor: (isGenerating || !markdown) ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {isGenerating ? dict.tools.chatExporter.editor.downloading : dict.tools.chatExporter.editor.downloadImage}
              </button>
            </div>

            {/* Render Area Wrapper for clipping */}
            <div style={{
              width: "100%",
              background: "#ffffff",
              border: "1px solid #eaeaea",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
            }}>
              {/* THIS is the div that gets captured */}
              <div 
                ref={previewRef}
                style={{
                  background: "#1E1E1E",
                  color: "#e5e7eb",
                  padding: "32px",
                  minHeight: "600px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  fontFamily: "system-ui, -apple-system, sans-serif"
                }}
              >
                {/* macOS style Window Buttons */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }}></div>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }}></div>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }}></div>
                </div>

                {/* Markdown Content */}
                <div className="prose prose-invert prose-orange max-w-none" style={{ flexGrow: 1 }}>
                  {markdown ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {markdown}
                    </ReactMarkdown>
                  ) : (
                    <div style={{ color: "#6b7280", fontStyle: "italic", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "120px" }}>
                      {dict.tools.chatExporter.editor.placeholder}
                    </div>
                  )}
                </div>

                {/* Viral Watermark */}
                <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9ca3af" }}>
                    <span style={{ fontWeight: 600, color: "#f97316" }}>NavoKit</span>
                    <span>—</span>
                    <span>{dict.tools.chatExporter.hero.watermarkText}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Monetization Banner Below the Tool */}
        <div style={{ marginTop: 80, padding: "40px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #eaeaea" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Want smarter outputs to export?
          </h2>
          <p style={{ fontSize: 16, color: "#666666", marginBottom: 32 }}>
            Stop relying on free AI. Upgrade to a premium intelligence.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link href={`/${lang}/products/gemini-pro`} className="vercel-button" style={{ padding: "12px 24px", fontSize: 16, textDecoration: "none" }}>
              Get Gemini Advanced ($14.99)
            </Link>
            <Link href={`/${lang}/products/account`} className="vercel-button-secondary" style={{ padding: "12px 24px", fontSize: 16, textDecoration: "none" }}>
              Get ChatGPT Plus
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
