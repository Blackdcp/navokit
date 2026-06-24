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
      <section style={{ maxWidth: 800, margin: "64px auto 96px", padding: "0 24px", textAlign: "left" }}>
          
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#4B5563", marginBottom: 40 }}>
            <strong>{lang === 'zh' ? '定义' : 'Definition'}:</strong> {lang === 'zh' ? 'NavoKit Markdown 转图片工具是一款免费的在线工具，可将 Markdown 格式、ChatGPT 回复以及 AI 生成的文本转换为排版整洁、易于分享的 PNG 图片。' : 'NavoKit Markdown to Image is a free online tool that turns Markdown, ChatGPT responses, and AI-generated text into clean, shareable PNG images.'}
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0B1220", marginBottom: 20 }}>
            {lang === 'zh' ? '用于 ChatGPT 回复' : 'Use it for ChatGPT responses'}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#4B5563", marginBottom: 40 }}>
            {lang === 'zh' ? '粘贴一段 ChatGPT 的回复，保持原有的 Markdown 结构，并将其导出为一张干净的图片卡片以便分享。' : 'Paste a ChatGPT response, keep the Markdown structure, and export it as a clean image card for sharing.'}
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0B1220", marginBottom: 20 }}>
            {lang === 'zh' ? '如何使用' : 'How to Use'}
          </h2>
          <ol style={{ paddingLeft: 20, marginBottom: 40, color: "#4B5563", fontSize: 16, lineHeight: 1.8 }}>
            <li>{lang === 'zh' ? '粘贴您的 Markdown 或 ChatGPT 回复内容。' : 'Paste your Markdown or ChatGPT response.'}</li>
            <li>{lang === 'zh' ? '在右侧预览排版效果。' : 'Preview the formatted result.'}</li>
            <li>{lang === 'zh' ? '如有需要，可修改您的文本格式。' : 'Adjust the text and markdown format if needed.'}</li>
            <li>{lang === 'zh' ? '一键导出为高清图片。' : 'Export it as a clean image.'}</li>
          </ol>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0B1220", marginBottom: 24, paddingTop: 40, borderTop: "1px solid #E5E7EB" }}>
            {lang === 'zh' ? '示例' : 'Example'}
          </h2>
          <div style={{ background: '#F8FAFC', padding: '32px', borderRadius: '16px', border: "1px solid #E5E7EB", marginBottom: 24, fontFamily: 'monospace', color: '#111827', fontSize: 15, lineHeight: 1.6 }}>
            {lang === 'zh' ? (
              <>
                # 产品发布笔记<br/>
                - 核心理念：简单的工具节省大量时间<br/>
                - 目标受众：创作者和营销人员<br/>
                - 输出格式：一张清晰的图片卡片<br/>
                <br/>
                &gt; 小工具，快一点完成工作。
              </>
            ) : (
              <>
                # Product Launch Notes<br/>
                - Main idea: simple tools save time<br/>
                - Audience: creators and marketers<br/>
                - Output: a clean image card<br/>
                <br/>
                &gt; Small tools. Faster work.
              </>
            )}
          </div>
          <p style={{ fontSize: 16, color: "#4B5563", marginBottom: 40, fontStyle: 'italic' }}>
            {lang === 'zh' ? '将类似的 Markdown 内容粘贴到上方编辑器，即可一键导出为精美的分享图片。' : 'Paste Markdown like this into the editor above and export it as a shareable image card.'}
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0B1220", marginBottom: 24, paddingTop: 40, borderTop: "1px solid #E5E7EB" }}>
            {lang === 'zh' ? '适用场景' : 'Use Cases'}
          </h2>
          <ul style={{ paddingLeft: 20, marginBottom: 40, color: "#4B5563", fontSize: 16, lineHeight: 1.8 }}>
            <li>{lang === 'zh' ? '将 ChatGPT 回复导出为图片' : 'Export ChatGPT responses as images'}</li>
            <li>{lang === 'zh' ? '把 Markdown 笔记变成视觉卡片' : 'Turn Markdown notes into visual cards'}</li>
            <li>{lang === 'zh' ? '在社交媒体上分享 AI 生成的答案' : 'Share AI-generated answers on social media'}</li>
            <li>{lang === 'zh' ? '制作排版干净的金句语录卡片' : 'Create clean quote cards'}</li>
            <li>{lang === 'zh' ? '将排版好的文本转成图片用于博客或新闻稿' : 'Turn formatted text into images for newsletters or blogs'}</li>
            <li>{lang === 'zh' ? '保存结构化的 AI 输出作为视觉素材' : 'Save structured AI output as a visual asset'}</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0B1220", marginBottom: 24, paddingTop: 40, borderTop: "1px solid #E5E7EB" }}>
            {lang === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
          </h2>
          <div style={{ marginBottom: 40 }}>
            {[
              { 
                q: lang === 'zh' ? "这款 Markdown 转图片工具是免费的吗？" : "Is this Markdown to Image tool free?", 
                a: lang === 'zh' ? "是的，完全免费。" : "Yes, it is completely free to use." 
              },
              { 
                q: lang === 'zh' ? "我能将 ChatGPT 的回复导出为图片吗？" : "Can I export ChatGPT responses as images?", 
                a: lang === 'zh' ? "可以，只需从 ChatGPT 复制回复并粘贴到这里，它会精美地渲染 Markdown。" : "Yes, just copy the response from ChatGPT and paste it here. It will render the markdown beautifully." 
              },
              { 
                q: lang === 'zh' ? "它支持代码块吗？" : "Does it support code blocks?", 
                a: lang === 'zh' ? "支持，我们对大多数常见编程语言提供代码高亮。" : "Yes, we support code block highlighting for most common programming languages." 
              },
              { 
                q: lang === 'zh' ? "能将 Markdown 导出为 PNG 吗？" : "Can I export Markdown as PNG?", 
                a: lang === 'zh' ? "可以，本工具会生成高质量（视网膜级别）的 PNG 图片。" : "Yes, the tool generates a high-quality (retina-ready) PNG image of your markdown." 
              },
              { 
                q: lang === 'zh' ? "需要注册吗？" : "Do I need to sign up?", 
                a: lang === 'zh' ? "不需要任何注册或登录。" : "No signup or registration is required." 
              },
              { 
                q: lang === 'zh' ? "NavoKit 会保存我粘贴的内容吗？" : "Does NavoKit store my pasted content?", 
                a: lang === 'zh' ? "不会。转换完全在您的浏览器中进行，我们不会上传或存储您的内容。" : "No. The conversion happens entirely in your browser. We do not upload or store your content." 
              },
              { 
                q: lang === 'zh' ? "能去掉水印吗？" : "Can I remove the watermark?", 
                a: lang === 'zh' ? "目前包含微小的水印以帮助支持我们的免费工具。" : "The small watermark is currently fixed to help support our free tools." 
              }
            ].map((faq, i) => (
              <div key={i} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0B1220", marginBottom: 8 }}>{faq.q}</h3>
                <p style={{ fontSize: 16, color: "#4B5563", lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: 48 }}>
            <p style={{ fontSize: 15, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>
              <strong>{lang === 'zh' ? '隐私声明' : 'Privacy Note'}:</strong> {lang === 'zh' ? 'NavoKit Markdown 转图片工具完全在您的浏览器本地运行。您粘贴的任何内容都不会被上传到任何服务器。' : 'NavoKit Markdown to Image runs entirely in your browser. Your pasted content is not uploaded to any server.'}
            </p>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0B1220", marginBottom: 24, paddingTop: 40, borderTop: "1px solid #E5E7EB" }}>
            {lang === 'zh' ? '探索更多工具' : 'Explore More Tools'}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <Link href={`/${lang}/blog/how-to-write-viral-social-media-posts-with-ai`} style={{ textDecoration: "none", color: "#111827", fontWeight: 500, fontSize: 16, padding: "20px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, display: "block", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "#9CA3AF"} onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E7EB"}>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>{lang === 'zh' ? '博客教程' : 'Blog Tutorial'}</div>
              {lang === 'zh' ? '如何用 AI 创作爆款社媒文案' : 'How to Write Viral Social Media Posts with AI'} →
            </Link>
            <Link href={`/${lang}/tools/free-ai-video-generator`} style={{ textDecoration: "none", color: "#111827", fontWeight: 500, fontSize: 16, padding: "20px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, display: "block", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "#9CA3AF"} onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E7EB"}>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>{lang === 'zh' ? 'AI 视频' : 'AI Video'}</div>
              {lang === 'zh' ? '免费 AI 视频生成器' : 'Free AI Video Generator'} →
            </Link>
            <Link href={`/${lang}/tools/ppt-to-pdf`} style={{ textDecoration: "none", color: "#111827", fontWeight: 500, fontSize: 16, padding: "20px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, display: "block", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "#9CA3AF"} onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E7EB"}>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>{lang === 'zh' ? '文档工具' : 'Document'}</div>
              {lang === 'zh' ? 'PPT 转 PDF' : 'PPT to PDF'} →
            </Link>
          </div>
      </section>

      <SiteFooter lang={lang} />
    </div>
  );
}
