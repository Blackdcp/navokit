import type { ToolContentLink, ToolPageContentData } from "../types/toolPageContent";
import { getBlogPostsForTool } from "./blog";

type Lang = "en" | "zh";

function dedupeLinks(links: ToolContentLink[]) {
  const seen = new Set<string>();

  return links.filter(link => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

export function getToolGuideLinks(lang: Lang, toolId: string, limit = 4): ToolContentLink[] {
  return getBlogPostsForTool(lang, toolId, limit).map(post => ({
    title: post.title,
    description: post.description,
    href: `/${lang}/blog/${post.slug}`,
  }));
}

export function withToolGuideLinks(
  lang: Lang,
  toolId: string,
  content: ToolPageContentData,
  limit = 4,
): ToolPageContentData {
  const guideLinks = dedupeLinks([
    ...(content.guide ? [content.guide] : []),
    ...getToolGuideLinks(lang, toolId, limit),
  ]).slice(0, limit);

  return {
    ...content,
    guides: guideLinks,
  };
}
