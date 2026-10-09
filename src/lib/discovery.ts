import { formatBlogIntent, formatReadingTime, getBlogPosts, type BlogPost } from "./blog";
import { getCatalogProducts, getProductHref, getTopics } from "./catalog";

export interface DiscoveryUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  kind: "article" | "launch";
  label: string;
  href: string;
  topicIds: string[];
  productIds?: string[];
  sourceUrl?: string;
  sourceLabel: string;
  dateLabel: string;
}

const workflowTopics: Record<string, string[]> = {
  "ai-video": ["video-workflows"],
  "video-creation": ["video-workflows"],
  "content-export": ["creator-essentials"],
  "social-media": ["creator-essentials"],
  "social-drafting": ["creator-essentials"],
  "creator-toolkit": ["creator-essentials"],
};

// Curated associations: a shared word in a title is not enough to recommend
// an article. Unmapped articles remain available in the complete archive.
const editorialSlugs: Record<string, readonly string[]> = {
  "video-workflows": [
    "4k-cinematic-ai-video-volumetric-lighting-prompting", "ai-video-cross-scene-lighting-color-consistency",
    "ai-video-consistent-characters", "ai-video-camera-movement-prompts", "ai-video-ip-adapter-controlnet",
    "crowd-dynamics-multi-actor-generative-video", "ai-video-sound-design-audio-sync-foley",
    "ai-video-aspect-ratio-mastering-outpainting", "ai-video-character-consistency",
    "slow-motion-physics-ai-video-fluid-dynamics", "ai-video-foley-sound-design-dynamics",
    "ai-video-micro-expressions-lipsync",
  ],
  "teams-agents": [
    "agentic-workflow-vs-rag", "agentic-microservices-architecture", "model-context-protocol-mcp-architecture",
    "inter-agent-communication-protocols-post-natural-language", "small-agent-swarms-vs-single-giant-agent",
    "agent-memory-hierarchical-graphs", "multi-modal-rag-enterprise-search", "death-of-generalist-narrow-agents",
  ],
  "creator-essentials": [
    "raw-mermaid-to-high-dpi-technical-diagrams", "api-documentation-carousel-devrel-linkedin",
    "github-readme-visual-structure", "github-readme-visual-facade-design", "code-to-pitch-deck-visual-markdown-fundraising",
    "visualize-code-on-x-twitter", "beautiful-code-snippets-conversion", "markdown-to-visual-carousels",
    "git-diff-visual-changelog-cards", "technical-writing-whitespace-psychology-social",
    "anti-cheat-social-storytelling-copywriting", "contrarian-product-launch-b2b-social-copy",
    "b2b-linkedin-vulnerability-pr-copywriting", "anti-echo-chamber-debate-social-copywriting",
    "micro-contrarian-hook-b2b-social-copywriting", "anti-ai-social-copy-matrix",
  ],
};

export function getPostTopicIds(post: BlogPost): string[] {
  const allowed = new Set(getTopics(post.language).map(topic => topic.id));
  const mapped = Object.entries(editorialSlugs).filter(([, slugs]) => slugs.includes(post.slug)).map(([id]) => id);
  return [...new Set([
    ...(post.topicIds ?? []),
    ...(post.workflowId ? workflowTopics[post.workflowId] ?? [] : []),
    ...mapped,
  ])].filter(id => allowed.has(id));
}

export function getArticleUpdates(lang: "en" | "zh"): DiscoveryUpdate[] {
  const topicNames = new Map(getTopics(lang).map(topic => [topic.id, topic.name]));
  return getBlogPosts(lang).map(post => {
    const topicIds = getPostTopicIds(post);
    const subjects = topicIds.map(id => topicNames.get(id)).filter(Boolean);
    return {
      id: `article:${post.slug}`,
      title: post.title,
      description: [...subjects, formatReadingTime(post, lang)].join(" · "),
      date: post.date,
      kind: "article",
      label: formatBlogIntent(post.intent, lang),
      href: `/${lang}/blog/${post.slug}`,
      topicIds,
      productIds: [...new Set([...post.toolIds, ...post.relatedTools])],
      sourceLabel: lang === "zh" ? "NavoKit 文章档案" : "NavoKit article archive",
      dateLabel: lang === "zh" ? "文章发布" : "Article published",
    };
  });
}

function hasVerifiedLaunchRecord(date?: string, source?: string): boolean {
  if (!date || !source || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) return false;
  try {
    const url = new URL(source);
    const [year, month, day] = date.split("-").map(Number);
    return url.protocol === "https:" && url.hostname === "www.producthunt.com"
      && url.pathname.replace(/\/$/, "") === `/leaderboard/daily/${year}/${month}/${day}`;
  } catch {
    return false;
  }
}

export function getUpdates(lang: "en" | "zh"): DiscoveryUpdate[] {
  // A catalog entry or site collection date never manufactures a launch.
  const launches: DiscoveryUpdate[] = getCatalogProducts(lang)
    .filter(product => hasVerifiedLaunchRecord(product.launchDate, product.launchSource))
    .map(product => ({
      id: `launch:${product.slug}:${product.launchDate}`,
      title: product.name,
      description: product.tagline,
      date: product.launchDate!,
      kind: "launch",
      label: lang === "zh" ? "产品发布" : "Product launch",
      href: getProductHref(product, lang),
      topicIds: product.topicIds,
      productIds: [product.slug],
      sourceUrl: product.launchSource,
      sourceLabel: "Product Hunt",
      dateLabel: lang === "zh" ? "PH 发布" : "PH launch",
    }));
  return [...launches, ...getArticleUpdates(lang)].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}
