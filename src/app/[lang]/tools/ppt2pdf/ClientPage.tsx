"use client";

import { useState, useRef } from "react";
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
      <header style={{ background: "#ffffff", borderBottom: "1px solid #eaeaea", padding: "12px 0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
          <Link href={`/${lang}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
             <span style={{ fontSize: 24, color: "#111827" }}>←</span>
             <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{dict.ppt2pdf.back}</span>
          </Link>
        </div>
      </header>

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
                 {file ? file.name : "{dict.ppt2pdf.clickOrDrag}"}
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

        {/* SEO Magnet FAQ Section */}
        <div style={{ marginTop: 80, textAlign: "left", padding: "40px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 32, letterSpacing: "-0.02em" }}>
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

      </main>
    </div>
  );
}
