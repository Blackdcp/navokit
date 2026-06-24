"use client";

import React, { useState, useRef, useEffect } from "react";
import SiteHeader from "../../../../components/SiteHeader";
import SiteFooter from "../../../../components/SiteFooter";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ClientPpt2PdfPage({ dict, lang }: { dict: any, lang: string }) {
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith('.ppt') && !f.name.toLowerCase().endsWith('.pptx')) {
      setErrorMsg(dict.ppt2pdf.errInvalidExt);
      setStatus("error");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setErrorMsg(dict.ppt2pdf.errTooLarge);
      setStatus("error");
      return;
    }
    setFile(f);
    setStatus("idle");
    setErrorMsg("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setProgress(10);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("files", file); // Gotenberg expects "files" for libreoffice conversion

    try {
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + Math.random() * 10, 90));
      }, 500);

      const res = await fetch("/api/tools/ppt2pdf", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace(/\.pptx?$/i, '.pdf');
        document.body.appendChild(a);
        a.click();
        a.remove();
        setStatus("success");
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.error || dict.ppt2pdf.errServer);
        setStatus("error");
      }
    } catch (e) {
      setErrorMsg(dict.ppt2pdf.errNetwork);
      setStatus("error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "sans-serif" }}>
      <SiteHeader lang={lang} />

      <main style={{ maxWidth: 800, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#111827", marginBottom: 16, letterSpacing: "-0.04em" }}>{dict.ppt2pdf.title}</h1>
        <p style={{ fontSize: 16, color: "#666666", marginBottom: 48, lineHeight: 1.6 }} dangerouslySetInnerHTML={{__html: dict.ppt2pdf.subtitle}}></p>

        <div 
          style={{
            background: "#ffffff",
            border: `2px dashed ${isDragging ? "#1677ff" : "#eaeaea"}`,
            borderRadius: "16px",
            padding: "64px 24px",
            transition: "all 0.2s ease",
            cursor: status === "uploading" ? "default" : "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (status !== "uploading") fileInputRef.current?.click();
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".ppt,.pptx" 
            style={{ display: "none" }} 
          />

          {status === "uploading" ? (
             <div>
               <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
               <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 16 }}>{dict.ppt2pdf.processing}</div>
               <div style={{ width: "100%", maxWidth: 300, height: 8, background: "#eaeaea", borderRadius: 4, margin: "0 auto", overflow: "hidden" }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: "#111827", transition: "width 0.3s" }} />
               </div>
               <div style={{ marginTop: 12, fontSize: 13, color: "#999" }}>{dict.ppt2pdf.processingHint}</div>
             </div>
          ) : status === "success" ? (
             <div>
               <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
               <div style={{ fontSize: 18, fontWeight: 600, color: "#07c160", marginBottom: 16 }}>{dict.ppt2pdf.success}</div>
               <p style={{ color: "#666", marginBottom: 24 }}>{dict.ppt2pdf.downloadHint}</p>
               <button 
                 onClick={(e) => { e.stopPropagation(); setStatus("idle"); setFile(null); }}
                 className="vercel-button-secondary"
                 style={{ padding: "10px 24px" }}
               >
                 {dict.ppt2pdf.convertNext}
               </button>
             </div>
          ) : (
            <div>
               <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
               <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
                 {file ? file.name : dict.ppt2pdf.clickOrDrag}
               </div>
               <p style={{ color: "#999", fontSize: 14 }}>
                 {dict.ppt2pdf.supportText}
               </p>
               
               {errorMsg && (
                 <div style={{ marginTop: 24, color: "#e00000", fontSize: 14, fontWeight: 500, padding: "8px 16px", background: "#ffeeee", borderRadius: "8px", display: "inline-block" }}>
                   {errorMsg}
                 </div>
               )}

               {file && status !== "error" && (
                 <div style={{ marginTop: 32 }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                      className="vercel-button"
                      style={{ padding: "12px 32px", fontSize: 16 }}
                    >
                      {dict.ppt2pdf.startConvert}
                    </button>
                 </div>
               )}
            </div>
          )}
        </div>

        {/* SEO Features Section */}
        <div style={{ marginTop: 80, textAlign: "left", padding: "40px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#0B1220" }}>
            {lang === "zh" ? "核心功能特性" : "Core Features"}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "grid", gap: "16px" }}>
            {[
              lang === "zh" ? "保留所有原始字体和排版" : "Preserve all original fonts and layout",
              lang === "zh" ? "无文件大小限制" : "No file size limits",
              lang === "zh" ? "纯净转换，文件上传处理后立即销毁" : "Secure processing, files are destroyed immediately after conversion"
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

          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 32, letterSpacing: "-0.02em", borderTop: "1px solid #E5E7EB", paddingTop: 40 }}>
            {dict.ppt2pdf.faqTitle}
          </h2>
          
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>{dict.ppt2pdf.faq1q}</h3>
            <p style={{ fontSize: 15, color: "#666666", lineHeight: 1.6 }}>{dict.ppt2pdf.faq1a}</p>
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>{dict.ppt2pdf.faq2q}</h3>
            <p style={{ fontSize: 15, color: "#666666", lineHeight: 1.6 }}>{dict.ppt2pdf.faq2a}</p>
          </div>
          
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>{dict.ppt2pdf.faq3q}</h3>
            <p style={{ fontSize: 15, color: "#666666", lineHeight: 1.6 }}>{dict.ppt2pdf.faq3a}</p>
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
            <Link href={`/${lang}/tools/chat-exporter`} style={{ textDecoration: "none", color: "#2563EB", fontWeight: 600, fontSize: 15, background: "#EFF6FF", padding: "8px 16px", borderRadius: "8px" }}>
              {lang === "zh" ? "ChatGPT 长图导出 →" : "ChatGPT Exporter →"}
            </Link>
            <Link href={`/${lang}/tools/social-booster`} style={{ textDecoration: "none", color: "#2563EB", fontWeight: 600, fontSize: 15, background: "#EFF6FF", padding: "8px 16px", borderRadius: "8px" }}>
              {lang === "zh" ? "社媒文案生成器 →" : "Social Post Generator →"}
            </Link>
          </div>
        </div>

      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
