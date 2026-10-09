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
import { createElement, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, ChevronDown } from "lucide-react";
import SiteHeader from "../../../../components/SiteHeader";
import SiteFooter from "../../../../components/SiteFooter";
import type { Metadata } from "next";
import { localizedCanonical, SITE_URL } from "../../../../lib/site";
import { breadcrumbList, safeJsonLd } from "../../../../lib/schema";
import NativeBanner from "../../../../components/NativeBanner";
import AdBanner from "../../../../components/AdBanner";
import { getTopics } from "../../../../lib/catalog";
import { getPostTopicIds } from "../../../../lib/discovery";
import { getArticleHeadings, getArticleLinks, getArticleReferences } from "../../../../components/updates/articleContent";
import ArticleCover from "../../../../components/updates/ArticleCover";
import { getArticleCover } from "../../../../lib/articleCovers";
import "../../../../components/updates/article.css";

export const dynamicParams = false;

function resolveArticleToolHref(href: string | undefined, lang: "en" | "zh") {
  if (!href) return href;
  const legacy = href.match(/^\/(?:(en|zh)\/)?tools\/(markdown-to-image|ai-social-post-generator|ai-video-generator)([?#].*)?$/);
  if (!legacy) return href;
  const destinations: Record<string, string> = {
    "markdown-to-image": "markdown-to-image",
    "ai-social-post-generator": "ai-social-booster",
    "ai-video-generator": "free-ai-video-generator",
  };
  // Older articles predate localized routes and the current tool names.
  return `/${legacy[1] ?? lang}/tools/${destinations[legacy[2]]}${legacy[3] ?? ""}`;
}

export async function generateStaticParams() {
  return ["zh", "en"].flatMap(lang => getBlogPosts(lang as "en" | "zh").map(post => ({ lang, slug: post.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh"; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getBlogPostBySlug(lang, slug);
  if (!post) return {};
  const hasTranslation = Boolean(getBlogPostBySlug(lang === "en" ? "zh" : "en", slug));
  const cover = getArticleCover(post.slug, lang);
  const coverUrl = `${SITE_URL}${cover.src.replace(/\.svg$/, ".png")}`;
  const author = post.author ?? { name: "NavoKit", type: "Organization", url: `${SITE_URL}/${lang}/about` };
  return {
    title: `${post.title} | NavoKit`,
    description: post.description,
    authors: [{ name: author.name, ...(author.url ? { url: author.url } : {}) }],
    alternates: hasTranslation ? localizedCanonical(lang, `/blog/${slug}`) : { canonical: `${SITE_URL}/${lang}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${SITE_URL}/${lang}/blog/${slug}`,
      locale: lang === "zh" ? "zh_CN" : "en_US",
      images: [{ url: coverUrl, width: 1200, height: 750, alt: cover.alt }],
      publishedTime: post.date,
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [coverUrl] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: "en" | "zh"; slug: string }> }) {
  const { lang, slug } = await params;
  const zh = lang === "zh";
  const post = getBlogPostBySlug(lang, slug);
  if (!post) notFound();

  const topicIds = getPostTopicIds(post);
  const postTopics = getTopics(lang).filter(topic => topicIds.includes(topic.id));
  const relatedPosts = [...getRelatedBlogPosts(lang, post), ...getBlogPosts(lang).filter(candidate =>
    candidate.slug !== post.slug && getPostTopicIds(candidate).some(id => topicIds.includes(id)))
  ].filter((candidate, index, all) => all.findIndex(item => item.slug === candidate.slug) === index).slice(0, 3);
  const relatedToolIds = new Set(post.relatedTools);
  const relatedTools = getTools(lang).filter(tool => relatedToolIds.has(tool.id)).slice(0, 3);
  const difficulty = formatDifficulty(post.difficulty, lang);
  const allHeadings = getArticleHeadings(post.content);
  const headings = allHeadings.filter(heading => heading.depth === 2);
  const headingByLine = new Map(allHeadings.map(heading => [heading.line, heading]));
  const references = getArticleReferences(post.content, post.sources);
  const referenceUrls = new Set(references.map(reference => reference.url));
  const otherLinks = getArticleLinks(post.content).filter(link => !referenceUrls.has(link.url));
  const hasTranslation = Boolean(getBlogPostBySlug(zh ? "en" : "zh", slug));
  const hasUpdate = post.updatedAt && post.updatedAt.slice(0, 10) !== post.date.slice(0, 10);
  const pageUrl = `${SITE_URL}/${lang}/blog/${slug}`;
  const organizationId = `${SITE_URL}/#organization`;
  const author = post.author ?? { name: "NavoKit", type: "Organization", url: `${SITE_URL}/${lang}/about` };
  const authorSchema = author.type === "Organization" && author.name.toLowerCase() === "navokit"
    ? { "@id": organizationId }
    : { "@type": author.type, name: author.name, ...(author.url ? { url: author.url } : {}) };
  const coverUrl = `${SITE_URL}${getArticleCover(post.slug, lang).src.replace(/\.svg$/, ".png")}`;
  const renderHeading = (depth: number, line: number | undefined, children: ReactNode) => {
    const heading = line ? headingByLine.get(line) : undefined;
    return createElement(`h${Math.max(depth, 2)}`, { id: heading?.id },
      // Keep previously shared line-based section URLs working.
      depth === 2 && line ? <span id={`section-${line}`} className="reading-anchor-alias" aria-hidden="true" /> : null,
      children,
      heading ? <a className="reading-heading-link" href={`#${heading.id}`} aria-label={zh ? `链接到：${heading.title}` : `Link to: ${heading.title}`}>#</a> : null,
    );
  };
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: post.title,
        description: post.description,
        inLanguage: zh ? "zh-CN" : "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": organizationId },
        mainEntity: { "@id": `${pageUrl}#article` },
      },
      {
        "@type": "BlogPosting",
        "@id": `${pageUrl}#article`,
        url: pageUrl,
        headline: post.title,
        description: post.description,
        image: coverUrl,
        datePublished: post.date,
        ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
        inLanguage: zh ? "zh-CN" : "en",
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        author: authorSchema,
        publisher: { "@id": organizationId },
        ...(postTopics.length ? { about: postTopics.map(topic => ({ "@type": "Thing", name: topic.name, url: `${SITE_URL}/${lang}/topics/${topic.id}` })) } : {}),
        ...(references.length ? { citation: references.map(reference => reference.url) } : {}),
      },
      breadcrumbList([
        { name: "NavoKit", url: `${SITE_URL}/${lang}` },
        { name: zh ? "文章档案" : "Articles", url: `${SITE_URL}/${lang}/blog` },
        { name: post.title, url: `${SITE_URL}/${lang}/blog/${slug}` },
      ]),
    ],
  };

  return (
    <div className="site-shell reading-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <SiteHeader lang={lang} alternatePath={hasTranslation ? undefined : "/blog"} />
      <main id="top" className="marketing-container reading-page">
        <Link href={`/${lang}/blog`} className="reading-back"><ArrowLeft size={17} aria-hidden="true" />{zh ? "返回文章档案" : "Back to articles"}</Link>
        <div className="reading-layout">
          <article className="reading-article">
            <header className="reading-header">
              <div className="reading-kicker"><BookOpen size={16} aria-hidden="true" /><span>{formatBlogIntent(post.intent, lang)}</span><span>NavoKit</span></div>
              <h1>{post.title}</h1>
              {post.description && <p className="reading-description">{post.description}</p>}
              <div className="reading-meta">
                <span>{zh ? "作者" : "By"} {author.url ? <a href={author.url} rel="author">{author.name}</a> : author.name}</span>
                <span>{zh ? "发布于" : "Published"} <time dateTime={post.date}>{post.date.slice(0, 10)}</time></span>
                {hasUpdate && <span>{zh ? "更新于" : "Updated"} <time dateTime={post.updatedAt}>{post.updatedAt!.slice(0, 10)}</time></span>}
                <span>{formatReadingTime(post, lang)}</span>
                {difficulty && <span>{difficulty}</span>}
              </div>
              {postTopics.length > 0 && <nav className="reading-topics" aria-label={zh ? "相关专题" : "Related collections"}>{postTopics.map(topic => <Link key={topic.id} href={`/${lang}/topics/${topic.id}`}>{topic.name}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}</nav>}
            </header>

            <ArticleCover slug={post.slug} title={post.title} lang={lang} className="reading-cover" priority />

            {headings.length > 1 && <details className="reading-mobile-toc"><summary>{zh ? "本文目录" : "On this page"}<ChevronDown size={17} aria-hidden="true" /></summary><nav aria-label={zh ? "文章目录" : "Article contents"}>{headings.map(heading => <a key={heading.id} href={`#${heading.id}`}>{heading.title}</a>)}</nav></details>}

            <div className="reading-body prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                h1: ({ children, node }) => renderHeading(1, node?.position?.start.line, children),
                h2: ({ children, node }) => renderHeading(2, node?.position?.start.line, children),
                h3: ({ children, node }) => renderHeading(3, node?.position?.start.line, children),
                h4: ({ children, node }) => renderHeading(4, node?.position?.start.line, children),
                h5: ({ children, node }) => renderHeading(5, node?.position?.start.line, children),
                h6: ({ children, node }) => renderHeading(6, node?.position?.start.line, children),
                table: ({ children }) => <div className="reading-table" tabIndex={0} role="region" aria-label={zh ? "文章表格，可横向滚动" : "Article table, scroll horizontally"}><table>{children}</table></div>,
                a: ({ href, children }) => {
                  const resolvedHref = resolveArticleToolHref(href, lang);
                  const external = resolvedHref?.startsWith("https://") || resolvedHref?.startsWith("http://");
                  return <a href={resolvedHref} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>;
                },
              }}>{post.content}</ReactMarkdown>
            </div>

            <section className="reading-record" aria-label={zh ? "文章记录与引用" : "Article record and references"}>
              <h2>{zh ? "文章记录与来源" : "Article record and sources"}</h2>
              <p>{zh ? "收录于 NavoKit 文章档案。发布日期与更新日期来自文章记录。" : "Part of the NavoKit article archive. Publication and update dates follow the article’s recorded metadata."}</p>
              <p className="reading-citation"><span>{zh ? "本文链接" : "Article URL"}</span><a href={pageUrl}>{pageUrl}</a></p>
              {references.length > 0 && <h3>{zh ? "参考来源" : "References"}</h3>}
              {references.length > 0 && <ul>{references.map(reference => <li key={reference.url}><a href={reference.url} target="_blank" rel="noopener noreferrer"><span>{reference.title}</span><ArrowUpRight size={16} aria-hidden="true" /></a><span>{reference.hostname}</span></li>)}</ul>}
              {otherLinks.length > 0 && <><h3>{zh ? "文中外部链接" : "Other links in this article"}</h3><ul>{otherLinks.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer"><span>{link.title}</span><ArrowUpRight size={16} aria-hidden="true" /></a><span>{link.hostname}</span></li>)}</ul></>}
            </section>

            <aside className="reading-ad" aria-label={zh ? "广告" : "Advertisement"}>
              <span>{zh ? "广告" : "Advertisement"}</span>
              <AdBanner adKey="344331274ea8dd6662b8d4324302c3af" width={468} height={60} className="hidden sm:flex" />
              <AdBanner adKey="c8f2c965c00540fcd54ab30efc5a218b" width={320} height={50} className="sm:hidden" />
            </aside>

            {relatedTools.length > 0 && <section className="reading-related">
              <div className="reading-section-title"><h2>{zh ? "文中相关工具" : "Related tools"}</h2><Link href={`/${lang}/tools`}>{zh ? "查看产品库" : "See directory"}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
              <div className="reading-tools">{relatedTools.map(tool => <Link key={tool.id} href={`/${lang}/tools/${tool.id}`}><strong>{tool.title}</strong><span>{tool.subtitle}</span><ArrowUpRight size={18} aria-hidden="true" /></Link>)}</div>
            </section>}

            {relatedPosts.length > 0 && <section className="reading-related">
              <div className="reading-section-title"><h2>{zh ? "继续阅读" : "Keep reading"}</h2><Link href={`/${lang}/blog`}>{zh ? "全部文章" : "All articles"}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
              <div className="reading-related-posts">{relatedPosts.map(item => <Link key={item.slug} href={`/${lang}/blog/${item.slug}`}><ArticleCover slug={item.slug} title={item.title} lang={lang} compact /><div className="reading-related-copy"><span>{formatBlogIntent(item.intent, lang)} · {formatReadingTime(item, lang)}</span><h3>{item.title}</h3><span className="reading-related-link">{zh ? "阅读文章" : "Read article"}<ArrowUpRight size={16} aria-hidden="true" /></span></div></Link>)}</div>
            </section>}

            <aside className="reading-ad reading-ad--native" aria-label={zh ? "广告" : "Advertisement"}><span>{zh ? "广告" : "Advertisement"}</span><NativeBanner /></aside>
            <div className="reading-end"><Link className="button button--secondary" href={`/${lang}/blog`}><ArrowLeft size={16} aria-hidden="true" />{zh ? "返回文章档案" : "Back to articles"}</Link><a href="#top" className="reading-top-link">{zh ? "回到顶部 ↑" : "Back to top ↑"}</a></div>
          </article>
          <aside className="reading-sidebar">
            {headings.length > 1 && <nav className="reading-toc" aria-label={zh ? "本文目录" : "On this page"}><h2>{zh ? "本文目录" : "On this page"}</h2>{headings.map(heading => <a key={heading.id} href={`#${heading.id}`}>{heading.title}</a>)}</nav>}
            <section className="reading-sidebar-note"><h2>{zh ? "从阅读到发现" : "From reading to discovery"}</h2><p>{zh ? "浏览产品发布记录，找到值得继续了解的新工具。" : "Explore sourced product launches and find a new tool worth a closer look."}</p><Link href={`/${lang}/updates?type=launch`}>{zh ? "查看产品动态" : "See product launches"}<ArrowUpRight size={16} aria-hidden="true" /></Link></section>
          </aside>
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
