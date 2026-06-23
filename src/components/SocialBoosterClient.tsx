"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import SiteFooter from "./SiteFooter";

interface Props {
  dict: any;
  lang: string;
}

export default function SocialBoosterClient({ dict, lang }: Props) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const t = dict.tools.socialBooster || {
    title: "AI Social Media Booster",
    subtitle: "Turn a simple thought into a viral post in seconds.",
    placeholder: "E.g., I had a great coffee today at Starbucks...",
    generate: "Generate Magic",
    generating: "Generating...",
    platforms: { twitter: "Twitter / X", instagram: "Instagram", xiaohongshu: "Xiaohongshu" },
    copy: "Copy Text",
    copied: "Copied!",
    adTitle: "Want to guarantee 1000 likes?",
    adDesc: "Great content needs an initial push. Buy our organic follower packages to trigger the algorithm.",
    adBtn: "View Marketing Services"
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult('');
    setCopied(false);

    try {
      const res = await fetch('/api/tools/social-booster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, language: lang })
      });

      if (!res.ok) throw new Error('Failed to generate');
      const data = await res.json();
      setResult(data.content);
    } catch (err) {
      alert('Error generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em", color: "#111827", margin: "0 0 16px" }}>
          {t.title}
        </h1>
        <p style={{ fontSize: 18, color: "#666", margin: 0 }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", border: "1px solid #eaeaea", marginBottom: 40 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {['twitter', 'instagram', 'xiaohongshu'].map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 8,
                border: platform === p ? "2px solid #000" : "1px solid #eaeaea",
                background: platform === p ? "#000" : "#fff",
                color: platform === p ? "#fff" : "#666",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {t.platforms[p as keyof typeof t.platforms]}
            </button>
          ))}
        </div>

        <textarea
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder={t.placeholder}
          style={{
            width: "100%",
            height: 120,
            padding: 16,
            borderRadius: 8,
            border: "1px solid #eaeaea",
            fontSize: 15,
            resize: "none",
            marginBottom: 24,
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box"
          }}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="vercel-button"
          style={{ width: "100%", padding: "16px 0", fontSize: 16, opacity: loading || !topic.trim() ? 0.5 : 1 }}
        >
          {loading ? t.generating : t.generate}
        </button>
      </div>

      {result && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", border: "1px solid #eaeaea", position: "relative", marginBottom: 64 }}>
          <button
            onClick={handleCopy}
            style={{ position: "absolute", top: 16, right: 16, padding: "6px 12px", background: "#f3f4f6", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" }}
          >
            {copied ? t.copied : t.copy}
          </button>
          <div style={{ whiteSpace: "pre-wrap", fontSize: 16, lineHeight: 1.6, color: "#111827", marginTop: 12 }}>
            {result}
          </div>
        </div>
      )}

      {/* SEO & Features Section */}
      <section style={{ maxWidth: 800, margin: "64px auto 96px", padding: "0" }}>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 24, padding: "48px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#0B1220" }}>
            {lang === "zh" ? "核心功能特性" : "Core Features"}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 48px", display: "grid", gap: "16px" }}>
            {[
              lang === "zh" ? "零配置，输入一句话即可生成" : "Zero configuration, generate with a single sentence",
              lang === "zh" ? "完美适配推特、Instagram和小红书" : "Perfectly adapted for Twitter, Instagram, and Xiaohongshu",
              lang === "zh" ? "使用先进的 Agnes-2.0-Flash 模型" : "Powered by advanced Agnes-2.0-Flash model"
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
                {lang === "zh" ? "这是免费的吗？" : "Is this free?"}
              </h3>
              <p style={{ margin: 0, color: "#6B7280", fontSize: 15, lineHeight: 1.6 }}>
                {lang === "zh" ? "是的，完全免费。无需登录或注册即可生成社交媒体文案初稿，高峰期可能需要短暂排队等待。" : "Yes, it is completely free. Generate social media copy drafts without login or registration. You may need to wait briefly during peak hours."}
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0B1220", margin: "0 0 8px" }}>
                {lang === "zh" ? "支持哪些平台？" : "What platforms are supported?"}
              </h3>
              <p style={{ margin: 0, color: "#6B7280", fontSize: 15, lineHeight: 1.6 }}>
                {lang === "zh" ? "目前支持推特 (Twitter/X)、Instagram 和 小红书。模型会根据不同平台的特性（例如小红书的 Emoji 和标题党风格，推特的精炼风格）自动调整输出。" : "Currently supports Twitter (X), Instagram, and Xiaohongshu. The model automatically adjusts output based on platform characteristics (e.g. Xiaohongshu's emoji and clickbait style, Twitter's concise style)."}
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0B1220", margin: "0 0 8px" }}>
                {lang === "zh" ? "支持其他语言吗？" : "Does it support other languages?"}
              </h3>
              <p style={{ margin: 0, color: "#6B7280", fontSize: 15, lineHeight: 1.6 }}>
                {lang === "zh" ? "您可以输入中文或英文，模型都能理解并生成对应语言的高质量文案。" : "You can input in Chinese or English, and the model will understand and generate high-quality copy in the corresponding language."}
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
            <Link href={`/${lang}/tools/chat-exporter`} style={{ textDecoration: "none", color: "#2563EB", fontWeight: 600, fontSize: 15, background: "#EFF6FF", padding: "8px 16px", borderRadius: "8px" }}>
              {lang === "zh" ? "ChatGPT 长图导出 →" : "ChatGPT Exporter →"}
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
