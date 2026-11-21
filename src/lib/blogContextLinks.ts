import type { BlogPost } from "./blog";
import { getCatalogProduct, type Locale } from "./catalog";
import { getComparison, getComparisonHref } from "./comparisons";
import { getMarkdownUseCase, getMarkdownUseCaseHref } from "./markdownUseCases";

export interface BlogContextLink {
  label: string;
  href: string;
  kind: "workflow" | "comparison";
}

function addUseCase(list: BlogContextLink[], seen: Set<string>, slug: string, lang: Locale) {
  const entry = getMarkdownUseCase(slug);
  if (!entry) return;
  const href = getMarkdownUseCaseHref(slug, lang);
  if (seen.has(href)) return;
  seen.add(href);
  list.push({ label: entry[lang].heroTitle, href, kind: "workflow" });
}

function addComparison(list: BlogContextLink[], seen: Set<string>, pairId: string, lang: Locale) {
  const pair = getComparison(pairId);
  if (!pair) return;
  const left = getCatalogProduct(lang, pair.leftSlug);
  const right = getCatalogProduct(lang, pair.rightSlug);
  if (!left || !right) return;
  const href = getComparisonHref(pair.id, lang);
  if (seen.has(href)) return;
  seen.add(href);
  list.push({ label: `${left.name} vs ${right.name}`, href, kind: "comparison" });
}

/**
 * Connects blog articles to the highest-intent programmatic tool landing pages
 * and head-to-head product comparisons so topical authority flows across the site.
 */
export function getBlogContextLinks(post: BlogPost): BlogContextLink[] {
  const lang = post.language;
  const text = `${post.slug} ${post.title} ${(post.tags ?? []).join(" ")}`.toLowerCase();
  const links: BlogContextLink[] = [];
  const seen = new Set<string>();

  if (/(mermaid|flowchart|sequence|diagram|architecture|流程图|架构图|时序图)/.test(text)) {
    const href = `/${lang}/tools/mermaid-to-image`;
    if (!seen.has(href)) {
      seen.add(href);
      links.push({ label: lang === "zh" ? "Mermaid 流程图转高清 PNG / SVG" : "Mermaid to PNG & SVG Converter", href, kind: "workflow" });
    }
  }
  if (/(chatgpt|openai|prompt-guide|提示词)/.test(text)) {
    addUseCase(links, seen, "chatgpt-to-image", lang);
  }
  if (/claude/.test(text)) {
    addUseCase(links, seen, "claude-to-image", lang);
  }
  if (/obsidian/.test(text)) {
    addUseCase(links, seen, "obsidian-to-image", lang);
  }
  if (/(linkedin|carousel|b2b|轮播|职场)/.test(text)) {
    addUseCase(links, seen, "linkedin-carousel", lang);
  }
  if (/(github|readme|git-diff|changelog|code-to-pitch|mermaid|更新日志|仓库)/.test(text)) {
    addUseCase(links, seen, "github-readme-card", lang);
  }
  if (/(twitter|on-x|code-snippets|推文|代码片段)/.test(text)) {
    addUseCase(links, seen, "x-thread-card", lang);
  }
  if ((/(markdown|卡片|排版|转图)/.test(text) || post.relatedTools.includes("markdown-to-image")) && links.length < 3) {
    addUseCase(links, seen, "chatgpt-to-image", lang);
    addUseCase(links, seen, "linkedin-carousel", lang);
  }

  if (/(video|foley|cinematic|storyboard|short-film|lipsync|视频|分镜|镜头|音效)/.test(text) || post.relatedTools.includes("free-ai-video-generator")) {
    addComparison(links, seen, "flora-vs-krev", lang);
  }
  if (/(rag|search|retrieval|vector|long-context|lost-in-the-middle|geo|生成式引擎|搜索|检索|上下文)/.test(text)) {
    addComparison(links, seen, "scira-vs-exa", lang);
    addComparison(links, seen, "undermind-vs-asta", lang);
  }
  if (/(agent|mcp|swarm|sandbox|workflow|智能体|工作流|沙箱)/.test(text)) {
    addComparison(links, seen, "sim-vs-velozity", lang);
  }
  if (/(memory|knowledge|notes|meeting|记忆|知识|笔记|会议)/.test(text)) {
    addComparison(links, seen, "granola-vs-tucky", lang);
  }
  if (/(local|edge|webgpu|on-device|quantization|slm|本地|端侧|量化)/.test(text)) {
    addComparison(links, seen, "msty-vs-enconvo", lang);
  }
  if (/(voice|audio|speech|语音|音频|变声)/.test(text)) {
    addComparison(links, seen, "aqua-voice-vs-willow-voice", lang);
  }

  return links.slice(0, 4);
}
