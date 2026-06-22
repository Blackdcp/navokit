'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface AiVideoClientProps {
  dict: any;
  lang: string;
}

export default function AiVideoClient({ dict, lang }: AiVideoClientProps) {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<"idle" | "submitting" | "polling" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const startPolling = (vId: string) => {
    setStatus("polling");
    setProgress(0);
    
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/tools/ai-video/status?video_id=${vId}`);
        const data = await res.json();
        
        // If rate limited, just skip this tick and try again next time
        if (res.status === 429 || (data.error && data.error.includes('rate limit'))) {
          console.warn("Rate limited, skipping this poll tick...");
          return; 
        }

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch status');
        }

        if (data.status === 'failed') {
          throw new Error('Video generation failed on the server.');
        }

        setProgress(data.progress || 0);

        if (data.status === 'completed' && data.video_url) {
          setVideoUrl(data.video_url);
          setStatus("success");
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
      } catch (err: any) {
        // Only stop polling for hard errors
        if (!err.message.includes('rate limit')) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStatus("error");
          setErrorMsg(err.message || 'An error occurred during polling.');
        }
      }
    }, 10000); // Increased to 10 seconds to avoid rate limits
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus("submitting");
    setErrorMsg("");
    setVideoId(null);
    setVideoUrl(null);
    setProgress(10);

    try {
      const res = await fetch('/api/tools/ai-video/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit video generation task');
      }

      setVideoId(data.video_id);
      startPolling(data.video_id);

    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "sans-serif" }}>
      <header style={{ background: "#ffffff", borderBottom: "1px solid #eaeaea", padding: "12px 0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
          <Link href={`/${lang}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
             <span style={{ fontSize: 24, color: "#111827" }}>←</span>
             <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
               {lang === 'zh' ? '返回工具集合' : 'Back to Tools'}
             </span>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#111827", marginBottom: 16, letterSpacing: "-0.04em" }}>
          {lang === 'zh' ? '免费 AI 视频生成器' : 'Free AI Video Generator'}
        </h1>
        <p style={{ fontSize: 16, color: "#666666", marginBottom: 48, lineHeight: 1.6 }}>
          {lang === 'zh' 
            ? '瞬间将您的文字想法转化为令人惊叹的电影级视频。完全免费，极速生成。' 
            : 'Convert your text ideas into stunning cinematic videos instantly using advanced AI models.'}
        </p>

        <div 
          style={{
            background: "#ffffff",
            border: "2px solid #eaeaea",
            borderRadius: "16px",
            padding: "48px 24px",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
          }}
        >
          {status === "idle" || status === "error" ? (
            <div>
               <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
               <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                 {lang === 'zh' ? '输入视频提示词' : 'Enter Video Prompt'}
               </div>
               
               <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={lang === 'zh' ? "电影级镜头：一只赛博朋克机器狗走在霓虹灯闪烁的街道上..." : "A cinematic shot of a cyber-dog walking on neon-lit streets..."}
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    height: "120px",
                    padding: "16px",
                    borderRadius: "12px",
                    border: "1px solid #eaeaea",
                    background: "#fafafa",
                    fontSize: "15px",
                    color: "#111827",
                    marginBottom: "24px",
                    resize: "none",
                    fontFamily: "inherit",
                    outline: "none"
                  }}
               />

               {errorMsg && (
                 <div style={{ marginBottom: 24, color: "#e00000", fontSize: 14, fontWeight: 500, padding: "8px 16px", background: "#ffeeee", borderRadius: "8px", display: "inline-block" }}>
                   {errorMsg}
                 </div>
               )}

               <div>
                 <button 
                   onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
                   disabled={!prompt.trim()}
                   className="vercel-button"
                   style={{ padding: "12px 32px", fontSize: 16, cursor: prompt.trim() ? "pointer" : "not-allowed", opacity: prompt.trim() ? 1 : 0.5 }}
                 >
                   {lang === 'zh' ? '开始生成' : 'Start Generation'}
                 </button>
               </div>
            </div>
          ) : (status === "submitting" || status === "polling") ? (
             <div>
               <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
               <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                 {lang === 'zh' ? 'AI 正在渲染视频...' : 'AI is rendering your video...'}
               </div>
               <div style={{ width: "100%", maxWidth: 300, height: 8, background: "#eaeaea", borderRadius: 4, margin: "0 auto", overflow: "hidden" }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: "#111827", transition: "width 0.3s" }} />
               </div>
               <div style={{ marginTop: 12, fontSize: 13, color: "#999" }}>
                 {progress}% - {lang === 'zh' ? '这通常需要 1-2 分钟，请耐心等待' : 'This usually takes 1-2 minutes'}
               </div>
             </div>
          ) : status === "success" ? (
             <div>
               <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
               <div style={{ fontSize: 18, fontWeight: 600, color: "#07c160", marginBottom: 16 }}>
                 {lang === 'zh' ? '视频生成成功！' : 'Video Generated Successfully!'}
               </div>
               
               <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto 32px", borderRadius: "12px", overflow: "hidden", border: "1px solid #eaeaea", background: "#000" }}>
                 {videoUrl && (
                   <video 
                     src={videoUrl} 
                     controls 
                     autoPlay 
                     loop 
                     style={{ width: "100%", display: "block" }}
                   />
                 )}
               </div>

               <button 
                 onClick={(e) => { e.stopPropagation(); setStatus("idle"); setPrompt(""); }}
                 className="vercel-button-secondary"
                 style={{ padding: "10px 24px", marginRight: "16px" }}
               >
                 {lang === 'zh' ? '再生成一个' : 'Generate Another'}
               </button>

               <button 
                 onClick={(e) => { 
                   e.stopPropagation(); 
                   if (!videoUrl) return;
                   
                   // 直接在新标签页打开视频，让用户自行右键保存。
                   // 彻底做到 0 带宽、0 服务器压力！
                   window.open(videoUrl, '_blank');
                 }}
                 className="vercel-button"
                 style={{ padding: "10px 24px", display: "inline-block", background: "#1677ff", borderColor: "#1677ff" }}
               >
                 {lang === 'zh' ? '⬇️ 下载视频 (新窗口打开)' : '⬇️ Download Video'}
               </button>
             </div>
          ) : null}
        </div>

        {/* SEO FAQ Section */}
        <div style={{ marginTop: 80, textAlign: "left", padding: "40px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 32, letterSpacing: "-0.02em" }}>
            {lang === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
          </h2>
          
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
              {lang === 'zh' ? '生成的视频可以商用吗？' : 'Can I use the generated videos commercially?'}
            </h3>
            <p style={{ fontSize: 15, color: "#666666", lineHeight: 1.6 }}>
              {lang === 'zh' ? '可以的，所有的生成结果都归属于您，您可以将其用于广告、社交媒体和其他商业用途。' : 'Yes, all generated results belong to you and can be used for ads, social media, and other commercial purposes.'}
            </p>
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
              {lang === 'zh' ? '视频生成需要多长时间？' : 'How long does generation take?'}
            </h3>
            <p style={{ fontSize: 15, color: "#666666", lineHeight: 1.6 }}>
              {lang === 'zh' ? '通常情况下，一段电影级短视频的生成时间在 1-2 分钟之间，这取决于当前服务器的负载情况。' : 'Typically, a cinematic short video takes between 1-2 minutes to generate, depending on server load.'}
            </p>
          </div>
          
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
              {lang === 'zh' ? '如何让我的视频火爆全网？' : 'How can I make my video go viral?'}
            </h3>
            <p style={{ fontSize: 15, color: "#666666", lineHeight: 1.6 }}>
              {lang === 'zh' ? '生成惊艳的视频后，您可以使用我们的社交媒体推广服务（Social Media Booster），我们可以为您保证上万次的真实曝光。' : 'After generating a stunning video, you can use our Social Media Booster service to guarantee tens of thousands of real views.'}
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
