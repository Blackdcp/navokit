'use client';

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as htmlToImage from 'html-to-image';
import Link from 'next/link';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

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
      <SiteHeader lang={lang} />

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
      </main>

      {/* SEO & Features Section */}
      <section style={{ maxWidth: 800, margin: "64px auto 96px", padding: "0 24px" }}>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 24, padding: "48px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#0B1220" }}>
            {lang === "zh" ? "核心功能特性" : "Core Features"}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 48px", display: "grid", gap: "16px" }}>
            {[
              lang === "zh" ? "100% 纯前端渲染，数据绝不上云" : "100% frontend rendering, no data uploaded to cloud",
              lang === "zh" ? "完美支持代码高亮与表格解析" : "Perfect support for code highlighting and tables",
              lang === "zh" ? "macOS 视窗风格沉浸式排版" : "macOS window style immersive layout",
              lang === "zh" ? "支持高清长图一键导出" : "One-click HD image export supported"
            ].map((feature, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: "#4B5563" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#0B1220", borderTop: "1px solid #E5E7EB", paddingTop: 48 }}>
            {lang === "zh" ? "常见问题" : "FAQ"}
          </h2>
          <div style={{ display: "grid", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0B1220", margin: "0 0 8px" }}>
                {lang === "zh" ? "我的聊天记录会被保存吗？" : "Will my chat history be saved?"}
              </h3>
              <p style={{ margin: 0, color: "#6B7280", fontSize: 15, lineHeight: 1.6 }}>
                {lang === "zh" ? "绝对不会。这是一个纯前端工具，所有的转换和图片生成都在您的浏览器中本地进行，不会上传到任何服务器。" : "Absolutely not. This is a pure frontend tool. All conversions and image generations happen locally in your browser and are not uploaded to any server."}
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0B1220", margin: "0 0 8px" }}>
                {lang === "zh" ? "支持哪些 Markdown 语法？" : "What Markdown syntax is supported?"}
              </h3>
              <p style={{ margin: 0, color: "#6B7280", fontSize: 15, lineHeight: 1.6 }}>
                {lang === "zh" ? "支持标准的 Markdown 语法，包括加粗、斜体、列表、链接、图片，并且特别优化了代码块的高亮和表格的解析。" : "It supports standard Markdown syntax, including bold, italics, lists, links, images, and is specially optimized for code block highlighting and table parsing."}
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0B1220", margin: "0 0 8px" }}>
                {lang === "zh" ? "导出的图片很模糊怎么办？" : "What if the exported image is blurry?"}
              </h3>
              <p style={{ margin: 0, color: "#6B7280", fontSize: 15, lineHeight: 1.6 }}>
                {lang === "zh" ? "我们默认使用 @2x 分辨率导出高清图片。如果包含大量内容，生成可能需要几秒钟，请耐心等待高清原图渲染完成。" : "We use @2x resolution by default to export HD images. If it contains a lot of content, generation may take a few seconds, please wait patiently for the HD original image to finish rendering."}
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools Recommendation */}
        <div style={{ marginTop: 40, textAlign: "left", padding: "40px", background: "#ffffff", borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "0 1px 2px rgba(11,18,32,0.04)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#0B1220" }}>
            {lang === "zh" ? "探索更多工具" : "Explore More Tools"}
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 24, fontSize: 15 }}>
            {lang === "zh" ? "NavoKit 还提供了其他多款免费免注册的 AI 工具，提升你的工作效率。" : "NavoKit provides many other free, no-signup AI tools to boost your productivity."}
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href={`/${lang}/tools/social-booster`} style={{ textDecoration: "none", color: "#2563EB", fontWeight: 600, fontSize: 15, background: "#EFF6FF", padding: "8px 16px", borderRadius: "8px" }}>
              {lang === "zh" ? "社媒文案生成器 →" : "Social Post Generator →"}
            </Link>
            <Link href={`/${lang}/tools/ppt2pdf`} style={{ textDecoration: "none", color: "#2563EB", fontWeight: 600, fontSize: 15, background: "#EFF6FF", padding: "8px 16px", borderRadius: "8px" }}>
              {lang === "zh" ? "PPT转PDF →" : "PPT to PDF →"}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter lang={lang} />
    </div>
  );
}
