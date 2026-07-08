import type { Metadata } from "next";
import { localizedCanonical, SITE_URL } from "../../../../lib/site";
import { getToolPageContent } from "../../../../lib/toolPageContent";
import { withToolGuideLinks } from "../../../../lib/toolGuideLinks";
import { breadcrumbList, safeJsonLd } from "../../../../lib/schema";
import AiVideoClient from "./ClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "zh" | "en" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const title =
    lang === "zh"
      ? "免费 AI 视频生成器 - 文本生成视频 | NavoKit"
      : "Free AI Video Generator - Create Videos from Text | NavoKit";
  const description =
    lang === "zh"
      ? "将文本提示词生成 AI 短视频。支持横版、竖版和方形画面，无需注册。"
      : "Create short AI videos from text prompts. Choose landscape, portrait, or square formats without signing up.";

  return {
    title,
    description,
    alternates: localizedCanonical(lang, "/tools/free-ai-video-generator"),
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${lang}/tools/free-ai-video-generator`,
      images: [{ url: "/og/tool/free-ai-video-generator?v=20260708", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/tool/free-ai-video-generator?v=20260708"],
    },
  };
}

export default async function AiVideoPage({
  params,
}: {
  params: Promise<{ lang: "zh" | "en" }>;
}) {
  const { lang } = await params;
  const content = withToolGuideLinks(lang, "free-ai-video-generator", getToolPageContent(lang, "free-ai-video-generator"));
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: lang === "zh" ? "NavoKit 免费 AI 视频生成器" : "NavoKit Free AI Video Generator",
        url: `${SITE_URL}/${lang}/tools/free-ai-video-generator`,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
          lang === "zh"
            ? "在线文生视频工具，可将提示词生成短视频。"
            : "An online text-to-video tool that turns prompts into short videos.",
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faqs.map(({ title, text }) => ({
          "@type": "Question",
          name: title,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      },
      breadcrumbList([
        { name: "NavoKit", url: `${SITE_URL}/${lang}` },
        { name: lang === "zh" ? "工具" : "Tools", url: `${SITE_URL}/${lang}/tools` },
        { name: lang === "zh" ? "免费 AI 视频生成器" : "Free AI Video Generator", url: `${SITE_URL}/${lang}/tools/free-ai-video-generator` },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      <AiVideoClient lang={lang} content={content} />
    </>
  );
}
