import {
  formatBlogIntent,
  formatDifficulty,
  formatReadingTime,
  getBlogPostBySlug,
  getBlogPosts,
  getRelatedBlogPosts,
} from "../../../../lib/blog";
import { getTools } from "../../../../lib/api";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import SiteHeader from "../../../../components/SiteHeader";
import SiteFooter from "../../../../components/SiteFooter";
import type { Metadata } from "next";
import { localizedCanonical, SITE_URL } from "../../../../lib/site";
import { breadcrumbList, safeJsonLd } from "../../../../lib/schema";

export async function generateStaticParams() {
  const zhPosts = getBlogPosts("zh");
  const enPosts = getBlogPosts("en");

  return [
    ...zhPosts.map(post => ({ lang: "zh", slug: post.slug })),
    ...enPosts.map(post => ({ lang: "en", slug: post.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "zh"; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getBlogPostBySlug(lang, slug);
  if (!post) return {};

  return {
    title: `${post.title} | NavoKit`,
    description: post.description,
    alternates: localizedCanonical(lang, `/blog/${slug}`),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${SITE_URL}/${lang}/blog/${slug}`,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: "en" | "zh"; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = getBlogPostBySlug(lang, slug);

  if (!post) {
    notFound();
  }
  const relatedPosts = getRelatedBlogPosts(lang, post);
  const relatedToolIds = new Set(post.relatedTools);
  const relatedTools = getTools(lang).filter(tool => relatedToolIds.has(tool.id)).slice(0, 3);
  const primaryTool = relatedTools[0];
  const difficulty = formatDifficulty(post.difficulty, lang);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updatedAt ?? post.date,
        inLanguage: lang === "zh" ? "zh-CN" : "en",
        mainEntityOfPage: `${SITE_URL}/${lang}/blog/${slug}`,
        publisher: {
          "@type": "Organization",
          name: "NavoKit",
          url: SITE_URL,
          logo: `${SITE_URL}/logo.png`,
        },
        about: [
          post.workflowId,
          ...post.toolIds,
          post.intent,
        ].filter(Boolean),
      },
      breadcrumbList([
        { name: "NavoKit", url: `${SITE_URL}/${lang}` },
        { name: lang === "zh" ? "指南" : "Guides", url: `${SITE_URL}/${lang}/blog` },
        { name: post.title, url: `${SITE_URL}/${lang}/blog/${slug}` },
      ]),
    ],
  };

  return (
    <div className="site-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <SiteHeader lang={lang} />

      <main className="blog-post-page">
        <div className="blog-back-wrap">
          <div className="blog-article">
            <Link href={`/${lang}/blog`} className="blog-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {lang === "zh" ? "返回指南列表" : "Back to guides"}
            </Link>
          </div>
        </div>

        <article className="blog-article blog-article--body">
          <header className="blog-article__header">
            <span>{formatBlogIntent(post.intent, lang)}</span>
            <h1>{post.title}</h1>
            <div>
              <span>{post.date}</span>
              <i />
              <span>{formatReadingTime(post, lang)}</span>
              {difficulty && (
                <>
                  <i />
                  <span>{difficulty}</span>
                </>
              )}
            </div>
          </header>

          {primaryTool && (
            <aside className="article-action-card" aria-label={lang === "zh" ? "可执行下一步" : "Practical next step"}>
              <div>
                <span className="eyebrow">{lang === "zh" ? "可执行下一步" : "Practical next step"}</span>
                <h2>{lang === "zh" ? `用 ${primaryTool.title} 直接跑一遍` : `Try this with ${primaryTool.title}`}</h2>
                <p>
                  {lang === "zh"
                    ? "这篇指南里的方法可以在工具页完成。先用文章里的结构整理输入，再打开工具生成、导出或起草结果。"
                    : "This guide is meant to be executable. Use the workflow above, then open the tool to generate, export, or draft the result."}
                </p>
              </div>
              <Link href={`/${lang}/tools/${primaryTool.id}`} className="button button--blue">
                {lang === "zh" ? "打开相关工具" : "Open related tool"}
              </Link>
            </aside>
          )}

          <div className="article-card">
            <div className="prose prose-slate max-w-none article-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </div>

          {(relatedTools.length > 0 || relatedPosts.length > 0) && (
            <section className="article-related">
              {relatedTools.length > 0 && (
                <div>
                  <span className="eyebrow">{lang === "zh" ? "相关工具" : "Related tools"}</span>
                  <div className="article-related-grid">
                    {relatedTools.map(tool => (
                      <Link key={tool.id} href={`/${lang}/tools/${tool.id}`}>
                        <strong>{tool.title}</strong>
                        <p>{tool.subtitle}</p>
                        <b>{lang === "zh" ? "打开工具 →" : "Open tool →"}</b>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {relatedPosts.length > 0 && (
                <div>
                  <span className="eyebrow">{lang === "zh" ? "继续阅读" : "Keep reading"}</span>
                  <div className="article-related-grid">
                    {relatedPosts.map(item => (
                      <Link key={item.slug} href={`/${lang}/blog/${item.slug}`}>
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                        <b>{lang === "zh" ? "阅读指南 →" : "Read guide →"}</b>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          <div className="article-cta-card">
            <h3>{lang === "zh" ? "想把方法直接跑一遍吗？" : "Want to run the workflow now?"}</h3>
            <p>
              {lang === "zh"
                ? primaryTool
                  ? `打开 ${primaryTool.title}，把上面的流程变成一个可用结果。`
                  : "NavoKit 提供轻量的 AI 生成、内容转换和文案辅助工具，并清晰说明当前限制。"
                : primaryTool
                  ? `Open ${primaryTool.title} and turn the workflow above into a usable result.`
                  : "NavoKit provides lightweight AI generation, content conversion, and writing tools with clear limitations."}
            </p>
            <Link href={primaryTool ? `/${lang}/tools/${primaryTool.id}` : `/${lang}/tools`} className="button button--ink">
              {lang === "zh" ? (primaryTool ? "打开工具" : "浏览工具箱") : (primaryTool ? "Open tool" : "Explore tools")}
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
