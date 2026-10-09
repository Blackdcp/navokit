import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type BlogIntent = "how_to" | "examples" | "troubleshooting" | "comparison" | "use_case" | "industry_analysis" | "tool_guide" | "framework";
export type BlogDifficulty = "beginner" | "intermediate" | "advanced";

export interface BlogAuthor {
  name: string;
  type: "Person" | "Organization";
  url?: string;
}

export interface BlogSource {
  url: string;
  title: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  author?: BlogAuthor;
  sources: BlogSource[];
  topicIds?: string[];
  tags?: string[];
  workflowId?: string;
  toolIds: string[];
  relatedTools: string[];
  intent?: BlogIntent;
  difficulty?: BlogDifficulty;
  readingTime: number;
  content: string;
  language: 'en' | 'zh';
}

function publicUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function normalizeAuthor(value: unknown): BlogAuthor | undefined {
  if (typeof value === "string" && value.trim()) {
    const name = value.trim();
    return { name, type: name.toLowerCase() === "navokit" ? "Organization" : "Person" };
  }
  if (!value || typeof value !== "object" || !("name" in value) || typeof value.name !== "string" || !value.name.trim()) return undefined;
  return {
    name: value.name.trim(),
    type: "type" in value && value.type === "Organization" ? "Organization" : "Person",
    url: "url" in value ? publicUrl(value.url) : undefined,
  };
}

function normalizeSources(value: unknown): BlogSource[] {
  const entries = Array.isArray(value) ? value : value ? [value] : [];
  const sources = new Map<string, BlogSource>();
  for (const entry of entries) {
    const url = publicUrl(typeof entry === "string" ? entry : entry?.url);
    if (!url) continue;
    const title = typeof entry?.title === "string" && entry.title.trim() ? entry.title.trim() : new URL(url).hostname;
    sources.set(url, { url, title });
  }
  return [...sources.values()];
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function estimateReadingTime(content: string, lang: "en" | "zh") {
  if (lang === "zh") {
    const chineseCharacters = content.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
    const latinWords = content.match(/[A-Za-z0-9]+/g)?.length ?? 0;
    return Math.max(1, Math.ceil((chineseCharacters / 450) + (latinWords / 220)));
  }

  const words = content.match(/[A-Za-z0-9]+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 220));
}

function normalizeIntent(value: unknown): BlogIntent | undefined {
  const allowed: BlogIntent[] = ["how_to", "examples", "troubleshooting", "comparison", "use_case", "industry_analysis", "tool_guide", "framework"];
  return typeof value === "string" && allowed.includes(value as BlogIntent) ? value as BlogIntent : undefined;
}

function normalizeDifficulty(value: unknown): BlogDifficulty | undefined {
  const allowed: BlogDifficulty[] = ["beginner", "intermediate", "advanced"];
  return typeof value === "string" && allowed.includes(value as BlogDifficulty) ? value as BlogDifficulty : undefined;
}

export function getBlogPosts(lang: 'en' | 'zh'): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), 'src', 'content', 'blog', lang);
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data, content } = matter(fileContents);
      const toolIds = asStringArray(data.toolIds);
      const relatedTools = asStringArray(data.relatedTools);

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
        author: normalizeAuthor(data.author),
        sources: normalizeSources(data.sources ?? data.source),
        topicIds: asStringArray(data.topicIds),
        tags: asStringArray(data.tags),
        workflowId: typeof data.workflowId === "string" ? data.workflowId : undefined,
        toolIds,
        relatedTools: relatedTools.length > 0 ? relatedTools : toolIds,
        intent: normalizeIntent(data.intent),
        difficulty: normalizeDifficulty(data.difficulty),
        readingTime: typeof data.readingTime === "number" ? data.readingTime : estimateReadingTime(content, lang),
        content,
        language: lang,
      };
    });

  // Sort posts by date descending
  return allPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getBlogPostBySlug(lang: 'en' | 'zh', slug: string): BlogPost | null {
  const posts = getBlogPosts(lang);
  const decodedSlug = decodeURIComponent(slug);
  return posts.find(post => post.slug === decodedSlug || post.slug === slug) || null;
}

export function getRelatedBlogPosts(lang: "en" | "zh", post: BlogPost, limit = 3): BlogPost[] {
  const postToolIds = new Set(post.toolIds);

  return getBlogPosts(lang)
    .filter(candidate => candidate.slug !== post.slug)
    .map(candidate => {
      let score = 0;

      if (post.workflowId && candidate.workflowId === post.workflowId) {
        score += 3;
      }

      candidate.toolIds.forEach(toolId => {
        if (postToolIds.has(toolId)) {
          score += 2;
        }
      });

      // An article format alone (for example "analysis") is not a shared subject.
      candidate.topicIds?.forEach(topicId => {
        if (post.topicIds?.includes(topicId)) score += 2;
      });
      candidate.tags?.forEach(tag => {
        if (post.tags?.includes(tag)) score += 2;
      });

      return { candidate, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || (a.candidate.date < b.candidate.date ? 1 : -1))
    .slice(0, limit)
    .map(item => item.candidate);
}

export function getBlogPostsForTool(lang: "en" | "zh", toolId: string, limit = 4): BlogPost[] {
  return getBlogPosts(lang)
    .filter(post => post.toolIds.includes(toolId) || post.relatedTools.includes(toolId))
    .map(post => {
      const primaryMatch = post.toolIds.includes(toolId) ? 2 : 0;
      const relatedMatch = post.relatedTools.includes(toolId) ? 1 : 0;
      const intentWeight = post.intent === "how_to" ? 1 : 0;

      return {
        post,
        score: primaryMatch + relatedMatch + intentWeight,
      };
    })
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, limit)
    .map(item => item.post);
}

export function formatReadingTime(post: Pick<BlogPost, "readingTime">, lang: "en" | "zh") {
  return lang === "zh" ? `阅读约 ${post.readingTime} 分钟` : `${post.readingTime} min read`;
}

export function formatBlogIntent(intent: BlogIntent | undefined, lang: "en" | "zh") {
  const labels = {
    en: {
      how_to: "How-to",
      examples: "Examples",
      troubleshooting: "Troubleshooting",
      comparison: "Comparison",
      use_case: "Use case",
      industry_analysis: "Analysis",
      tool_guide: "Tool guide",
      framework: "Framework",
    },
    zh: {
      how_to: "操作指南",
      examples: "示例",
      troubleshooting: "排错",
      comparison: "对比",
      use_case: "使用场景",
      industry_analysis: "行业分析",
      tool_guide: "工具指南",
      framework: "方法框架",
    },
  };

  return intent ? labels[lang][intent] : lang === "zh" ? "指南" : "Guide";
}

export function formatDifficulty(difficulty: BlogDifficulty | undefined, lang: "en" | "zh") {
  const labels = {
    en: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
    zh: {
      beginner: "入门",
      intermediate: "进阶",
      advanced: "高级",
    },
  };

  return difficulty ? labels[lang][difficulty] : undefined;
}
