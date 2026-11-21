import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChatExporter from "@/components/ChatExporter";
import { getDictionary } from "@/lib/dictionaries";
import { getBlogPostBySlug } from "@/lib/blog";
import { getMarkdownUseCase, getMarkdownUseCaseHref, getMarkdownUseCases } from "@/lib/markdownUseCases";
import { breadcrumbList, pageIdentity, safeJsonLd } from "@/lib/schema";
import { localizedCanonical, SITE_URL } from "@/lib/site";
import type { ToolPageContentData } from "@/types/toolPageContent";

type Props = { params: Promise<{ lang: "en" | "zh"; useCase: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getMarkdownUseCases().map(item => ({ useCase: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, useCase } = await params;
  const entry = getMarkdownUseCase(useCase);
  if (!entry) notFound();
  const copy = entry[lang];
  const path = `/tools/markdown-to-image/${useCase}`;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: localizedCanonical(lang, path),
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: `${SITE_URL}/${lang}${path}`,
      type: "website",
      images: [
        {
          url: `/og/tool/${useCase}`,
          width: 1200,
          height: 630,
          alt: copy.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metaTitle,
      description: copy.metaDescription,
      images: [`/og/tool/${useCase}`],
    },
  };
}

export default async function MarkdownUseCasePage({ params }: Props) {
  const { lang, useCase } = await params;
  const entry = getMarkdownUseCase(useCase);
  if (!entry) notFound();
  const zh = lang === "zh";
  const dict = await getDictionary(lang);
  const copy = entry[lang];
  const pageUrl = `${SITE_URL}${getMarkdownUseCaseHref(entry.slug, lang)}`;

  const linkedPost = entry.guideSlug ? getBlogPostBySlug(lang, entry.guideSlug) : undefined;
  const content: ToolPageContentData = {
    eyebrow: zh ? "使用方式" : "How it works",
    howTitle: copy.howTitle,
    facts: copy.facts,
    steps: copy.steps,
    useCases: copy.useCases,
    limitations: copy.limitations,
    privacy: zh
      ? "转换与 PNG 渲染全部在你的浏览器本地完成。NavoKit 不会上传、存储或记录你粘贴的 Markdown 内容。"
      : "Markdown parsing and PNG rendering run locally inside your browser. NavoKit does not upload, store, or log your pasted text.",
    faqs: copy.faqs,
    related: [
      {
        title: zh ? "Markdown 转图片（通用版）" : "Markdown to Image (Full Editor)",
        description: zh ? "返回通用 Markdown 转 PNG 编辑器。" : "Open the general-purpose Markdown to PNG converter.",
        href: `/${lang}/tools/markdown-to-image`,
      },
      {
        title: zh ? "AI 社交媒体文案" : "AI Social Post Generator",
        description: zh ? "为导出的图片卡片起草配套社交文案。" : "Draft an accompanying social post for your exported image card.",
        href: `/${lang}/tools/ai-social-booster`,
      },
    ],
    ...(linkedPost
      ? {
          guide: {
            title: linkedPost.title,
            description: linkedPost.description,
            href: `/${lang}/blog/${linkedPost.slug}`,
          },
        }
      : {}),
  };

  const siblingLinks = getMarkdownUseCases()
    .filter(item => item.slug !== entry.slug)
    .map(item => ({
      title: item[lang].heroTitle,
      description: item[lang].heroSubtitle,
      href: getMarkdownUseCaseHref(item.slug, lang),
    }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        ...pageIdentity(pageUrl, lang),
        name: copy.metaTitle,
        description: copy.metaDescription,
      },
      {
        "@type": "WebApplication",
        name: copy.heroTitle,
        url: pageUrl,
        description: copy.metaDescription,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: copy.faqs.map(({ title, text }) => ({
          "@type": "Question",
          name: title,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      },
      breadcrumbList([
        { name: "NavoKit", url: `${SITE_URL}/${lang}` },
        { name: zh ? "工具" : "Tools", url: `${SITE_URL}/${lang}/tools` },
        { name: zh ? "Markdown 转图片" : "Markdown to Image", url: `${SITE_URL}/${lang}/tools/markdown-to-image` },
        { name: copy.heroTitle, url: pageUrl },
      ]),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <ChatExporter
        key={entry.slug}
        dict={dict}
        lang={lang}
        content={content}
        initialMarkdown={copy.initialMarkdown}
        exportFilename={entry.exportFilename}
        defaultRatio={entry.defaultRatio}
        defaultTheme={entry.defaultTheme}
        heroBadge={copy.badge}
        heroTitle={copy.heroTitle}
        heroSubtitle={copy.heroSubtitle}
        answerFirst={copy.answerFirst}
        breadcrumbItems={[
          { label: "NavoKit", href: `/${lang}` },
          { label: zh ? "Markdown 转图片" : "Markdown to Image", href: `/${lang}/tools/markdown-to-image` },
          { label: copy.badge },
        ]}
        useCaseLinks={siblingLinks}
      />
    </>
  );
}
