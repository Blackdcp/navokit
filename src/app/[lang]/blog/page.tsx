import type { Metadata } from "next";
import { formatBlogIntent, formatDifficulty, formatReadingTime, getBlogPosts } from "../../../lib/blog";
import { getWorkflowRails } from "../../../lib/workflows";
import Link from "next/link";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { localizedCanonical, SITE_URL } from "../../../lib/site";
import { breadcrumbList, safeJsonLd } from "../../../lib/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: lang === "zh" ? "实用 AI 工具指南 | NavoKit" : "Practical AI Tool Guides | NavoKit",
    description:
      lang === "zh"
        ? "阅读 NavoKit 的实用指南，学习如何使用 AI 视频生成、Markdown 图片导出和社媒文案工具完成真实工作流。"
        : "Read practical NavoKit guides for AI video generation, Markdown image export, social copy drafting, and lightweight creator workflows.",
    alternates: localizedCanonical(lang, "/blog"),
    openGraph: {
      title: lang === "zh" ? "实用 AI 工具指南 | NavoKit" : "Practical AI Tool Guides | NavoKit",
      description:
        lang === "zh"
          ? "围绕 NavoKit 免费工具的提示词、检查清单和实用工作流。"
          : "Prompts, checklists, and practical workflows around NavoKit free tools.",
      type: "website",
    },
  };
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}) {
  const { lang } = await params;
  const posts = getBlogPosts(lang);
  const workflowRails = getWorkflowRails(lang).filter(rail => rail.showInBlog !== false);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: lang === "zh" ? "NavoKit 实用 AI 工具指南" : "NavoKit Practical AI Tool Guides",
        url: `${SITE_URL}/${lang}/blog`,
        description:
          lang === "zh"
            ? "围绕 NavoKit 免费工具的提示词、检查清单和实用工作流。"
            : "Prompts, checklists, and practical workflows around NavoKit free tools.",
      },
      {
        "@type": "ItemList",
        name: lang === "zh" ? "NavoKit 指南列表" : "NavoKit guide list",
        itemListElement: posts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: post.title,
          url: `${SITE_URL}/${lang}/blog/${post.slug}`,
          description: post.description,
        })),
      },
      breadcrumbList([
        { name: "NavoKit", url: `${SITE_URL}/${lang}` },
        { name: lang === "zh" ? "指南" : "Guides", url: `${SITE_URL}/${lang}/blog` },
      ]),
    ],
  };

  return (
    <div className="site-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <SiteHeader lang={lang} />

      <main className="marketing-container blog-list-page">
        <header className="blog-list-hero">
          <span className="eyebrow">{lang === "zh" ? "实用指南" : "Practical guides"}</span>
          <h1>{lang === "zh" ? "把工具变成稳定工作流。" : "Turn small tools into steady workflows."}</h1>
          <p>
            {lang === "zh"
              ? "少一点概念，多一点可复用的提示词、检查清单和工具使用方法。"
              : "Less hype, more reusable prompts, checklists, and practical ways to use the tools."}
          </p>
        </header>

        {workflowRails.length > 0 && (
          <nav className="blog-topic-strip" aria-label={lang === "zh" ? "按工作流浏览指南" : "Browse guides by workflow"}>
            {workflowRails.map(rail => (
              <Link key={rail.id} href={`/${lang}${rail.href}`}>
                <strong>{rail.label}</strong>
                <span>{rail.description}</span>
              </Link>
            ))}
          </nav>
        )}

        {posts.length === 0 ? (
          <div className="empty-card">{lang === "zh" ? "暂无文章，敬请期待" : "No posts yet. Stay tuned."}</div>
        ) : (
          <div className="blog-list">
            {posts.map(post => (
              <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="blog-card">
                <div className="blog-card__inner">
                  <div className="blog-card__meta">
                    <span>{post.date}</span>
                    <i />
                    <span className="blog-card__intent">{formatBlogIntent(post.intent, lang)}</span>
                    <i />
                    <span>{formatReadingTime(post, lang)}</span>
                    {post.difficulty && (
                      <>
                        <i />
                        <span>{formatDifficulty(post.difficulty, lang)}</span>
                      </>
                    )}
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                  <div className="read-more-link">
                    <span>{lang === "zh" ? "阅读全文" : "Read article"}</span>
                    <span className="arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
