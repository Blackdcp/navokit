import { getBlogPosts } from "../../lib/blog";
import { getCatalogProducts, getProductCategories, getProductHref, getTopics } from "../../lib/catalog";
import { SITE_URL, SUPPORTED_LANGUAGES, type SupportedLanguage } from "../../lib/site";

export const dynamic = "force-static";

function line(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function link(label: string, pathname: string, description?: string) {
  const safeLabel = line(label).replace(/([\\[\]])/g, "\\$1");
  return `- [${safeLabel}](${SITE_URL}${pathname})${description ? ` — ${line(description)}` : ""}`;
}

function edition(lang: SupportedLanguage) {
  const zh = lang === "zh";
  const navigation = [
    ["", zh ? "首页" : "Home"],
    ["/tools", zh ? "产品库" : "Product directory"],
    ["/topics", zh ? "专题" : "Collections"],
    ["/updates", zh ? "更新动态" : "Updates"],
    ["/blog", zh ? "文章" : "Articles"],
    ["/submit", zh ? "提交产品" : "Submit a product"],
    ["/about", zh ? "关于 NavoKit" : "About NavoKit"],
    ["/editorial-policy", zh ? "编辑与收录原则" : "Editorial policy"],
    ["/contact", zh ? "联系与纠错" : "Contact and corrections"],
  ];

  return [
    `## ${zh ? "中文 · 导航" : "English · Explore"}`, "",
    ...navigation.map(([path, label]) => link(label, `/${lang}${path}`)), "",
    `## ${zh ? "中文 · 产品分类" : "English · Product categories"}`, "",
    ...getProductCategories(lang).map(category => link(category.name, `/${lang}/categories/${category.id}`, category.description)), "",
    `## ${zh ? "中文 · 产品" : "English · Products"}`, "",
    ...getCatalogProducts(lang).map(product => link(product.name, getProductHref(product, lang), `${product.tagline}${product.internalPath ? zh ? "（NavoKit 站内工具）" : " (NavoKit utility)" : ""}`)), "",
    `## ${zh ? "中文 · 专题" : "English · Collections"}`, "",
    ...getTopics(lang).map(topic => link(topic.name, `/${lang}/topics/${topic.id}`, topic.description)), "",
    `## ${zh ? "中文 · 文章归档" : "English · Article archive"}`, "",
    ...getBlogPosts(lang).map(post => link(post.title, `/${lang}/blog/${post.slug}`, `${zh ? "发布于" : "Published"} ${post.date}.`)), "",
  ];
}

export function GET() {
  const body = [
    "# NavoKit", "",
    "> Navigation + tools: an independent discovery site for emerging technology products, useful tools, and technology content.", "",
    "NavoKit helps readers discover products, explore topic collections, and follow sourced product launches and published articles. English and Chinese editions are available. Directory inclusion is not a rating or endorsement. Official product sites are the source for current features and terms.", "",
    "This optional text index points to public pages. It does not replace those pages, their source references, or the sitemap.", "",
    "NavoKit（导航 + 工具）提供新锐科技产品发现、专题及科技文章。收录不代表评分或背书，产品当前功能与条款以官网为准。本文本索引指向公开页面，具体内容和出处请阅读页面。", "",
    link("Sitemap / 网站地图", "/sitemap.xml"), "",
    ...SUPPORTED_LANGUAGES.flatMap(edition),
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
