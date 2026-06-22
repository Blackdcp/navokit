"use client";

import { useState } from 'react';

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
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", border: "1px solid #eaeaea", position: "relative" }}>
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

      {/* Cross-selling Ad Block */}
      <div style={{ marginTop: 40, padding: 32, background: "linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%)", borderRadius: 12, border: "1px solid #1677ff", textAlign: "center" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 20, color: "#111827", fontWeight: 700 }}>
          {t.adTitle}
        </h3>
        <p style={{ margin: "0 0 24px", color: "#4b5563", fontSize: 15, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          {t.adDesc}
        </p>
        <a href={`/${lang}/products/marketing-followers`} className="vercel-button" style={{ padding: "12px 32px", fontSize: 16, display: "inline-block", textDecoration: "none" }}>
          {t.adBtn}
        </a>
      </div>
    </div>
  );
}
