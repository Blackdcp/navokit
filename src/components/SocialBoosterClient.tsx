"use client";

import { useState } from "react";
import SiteFooter from "./SiteFooter";
import ToolPageContent from "./ToolPageContent";
import { trackToolError, trackToolEvent } from "../lib/clientAnalytics";
import { getToolPageContent } from "../lib/toolPageContent";

const outputIds = ["x", "linkedin", "instagram", "hooks"] as const;
type DraftId = typeof outputIds[number];

type Draft = {
  id: DraftId;
  text: string;
};

type SocialCopy = {
  title: string;
  subtitle: string;
  placeholder: string;
  generate: string;
  generating: string;
  inputTitle: string;
  resultTitle: string;
  emptyTitle: string;
  emptyDesc: string;
  guidance: string[];
  outputLabels: Record<DraftId, string>;
  copyAll: string;
  copySection: string;
  copied: string;
  processingNote: string;
};

function isDraftId(value: unknown): value is DraftId {
  return typeof value === "string" && outputIds.includes(value as DraftId);
}

function normalizeDrafts(value: unknown): Draft[] {
  if (!Array.isArray(value)) return [];

  return value
    .map(item => {
      if (!item || typeof item !== "object") return null;
      const id = "id" in item ? item.id : null;
      const text = "text" in item ? item.text : null;
      if (!isDraftId(id) || typeof text !== "string" || !text.trim()) return null;
      return { id, text: text.trim() };
    })
    .filter((item): item is Draft => Boolean(item));
}

function formatDrafts(drafts: Draft[], labels: Record<DraftId, string>) {
  return drafts.map(draft => `${labels[draft.id]}\n${draft.text}`).join("\n\n");
}

export default function SocialBoosterClient({ dict, lang }: { dict: { tools: { socialBooster: SocialCopy } }; lang: "en" | "zh" }) {
  const t = dict.tools.socialBooster;
  const zh = lang === "zh";
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const content = getToolPageContent(lang, "ai-social-booster");
  const orderedDrafts = outputIds
    .map(id => drafts.find(draft => draft.id === id))
    .filter((draft): draft is Draft => Boolean(draft));

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    setDrafts([]);
    setError("");
    trackToolEvent("tool_social_generate_started", {
      tool: "ai_social_booster",
      lang,
      characters: topic.trim().length,
    });
    try {
      const response = await fetch("/api/tools/social-booster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language: lang }),
      });
      if (!response.ok) throw new Error("Generation failed");
      const data = await response.json();
      const nextDrafts = normalizeDrafts(data.drafts);
      if (nextDrafts.length) {
        setDrafts(nextDrafts);
        trackToolEvent("tool_social_generate_succeeded", {
          tool: "ai_social_booster",
          lang,
          draftCount: nextDrafts.length,
        });
      } else if (typeof data.content === "string" && data.content.trim()) {
        setDrafts([{ id: "x", text: data.content.trim() }]);
        trackToolEvent("tool_social_generate_succeeded", {
          tool: "ai_social_booster",
          lang,
          draftCount: 1,
          fallback: true,
        });
      } else {
        throw new Error("Empty result");
      }
    } catch (caught) {
      trackToolError("tool_social_generate_failed", caught, {
        tool: "ai_social_booster",
        lang,
      });
      setError(zh ? "暂时无法生成，请稍后再试。" : "Generation is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  }

  return (
    <>
      <header className="tool-hero tool-container">
        <span className="tool-badge">{zh ? "创作者工具" : "Creator tool"}</span>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </header>

      <section className="tool-workspace tool-container">
        <div className="workspace-panel">
          <div className="workspace-panel__header">
            <div><span>01</span><strong>{t.inputTitle}</strong></div>
            <small>{topic.length}/1000</small>
          </div>
          <div className="social-input-panel">
            <textarea className="navo-input" maxLength={1000} value={topic} onChange={event => setTopic(event.target.value)} placeholder={t.placeholder} />
            <div className="social-guidance" aria-label={zh ? "输出内容" : "Generated outputs"}>
              {t.guidance.map(item => <span key={item}>{item}</span>)}
            </div>
            {error && <p className="inline-error">{error}</p>}
            <button className="button button--blue" disabled={loading || !topic.trim()} onClick={generate}>
              {loading ? t.generating : t.generate}
            </button>
            <small className="processing-note">{t.processingNote}</small>
          </div>
        </div>

        <div className="workspace-panel workspace-panel--preview">
          <div className="workspace-panel__header">
            <div><span>02</span><strong>{t.resultTitle}</strong></div>
            {orderedDrafts.length > 0 && (
              <button className="button button--secondary button--small" onClick={() => copyText(formatDrafts(orderedDrafts, t.outputLabels), "all")}>
                {copied === "all" ? t.copied : t.copyAll}
              </button>
            )}
          </div>
          <div className="social-result">
            {orderedDrafts.length > 0 ? (
              <div className="social-result-grid">
                {orderedDrafts.map(draft => (
                  <article className="social-draft-card" key={draft.id}>
                    <div>
                      <strong>{t.outputLabels[draft.id]}</strong>
                      <button onClick={() => copyText(draft.text, draft.id)}>{copied === draft.id ? t.copied : t.copySection}</button>
                    </div>
                    <p>{draft.text}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>✎</span>
                <strong>{t.emptyTitle}</strong>
                <p>{t.emptyDesc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ToolPageContent lang={lang} {...content} />
      <SiteFooter lang={lang} />
    </>
  );
}
