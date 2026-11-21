import { getDictionary } from '../../../../lib/dictionaries';
import ChatExporter from '../../../../components/ChatExporter';
import { Metadata } from 'next';
import { localizedCanonical } from '../../../../lib/site';
import { SITE_URL } from '../../../../lib/site';
import { getToolPageContent } from '../../../../lib/toolPageContent';
import { withToolGuideLinks } from '../../../../lib/toolGuideLinks';
import { getMarkdownUseCaseHref, getMarkdownUseCases } from '../../../../lib/markdownUseCases';
import { breadcrumbList, pageIdentity, safeJsonLd } from '../../../../lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}): Promise<Metadata> {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang);

  return {
    title: dict.tools.chatExporter.meta.title,
    description: dict.tools.chatExporter.meta.description,
    alternates: localizedCanonical(resolvedParams.lang, '/tools/markdown-to-image'),
    openGraph: {
      title: dict.tools.chatExporter.meta.title,
      description: dict.tools.chatExporter.meta.description,
      type: "website",
      images: [
        {
          url: "/og/tool/markdown-to-image",
          width: 1200,
          height: 630,
          alt: dict.tools.chatExporter.meta.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.tools.chatExporter.meta.title,
      description: dict.tools.chatExporter.meta.description,
      images: ["/og/tool/markdown-to-image"],
    }
  }
}

export default async function ChatExporterPage({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang);
  const content = withToolGuideLinks(
    resolvedParams.lang,
    "markdown-to-image",
    getToolPageContent(resolvedParams.lang, "markdown-to-image"),
  );
  const pageUrl = `${SITE_URL}/${resolvedParams.lang}/tools/markdown-to-image`;
  const zh = resolvedParams.lang === "zh";
  const answerFirst = zh
    ? "NavoKit Markdown 转图片是一款纯浏览器本地运行的免费视觉卡片工具：粘贴 Markdown、ChatGPT 或 Claude 回答，选择纸白/雾蓝/暖米/午夜/石墨 5 套预设、无衬线/衬线/等宽字体及自适应/4:5/16:9/1:1 画幅，即可一键复制或导出 2x/3x 高清 PNG，免登录零上传。"
    : "NavoKit Markdown to Image is a free, browser-local studio for turning Markdown notes, ChatGPT answers, and tables into clean 2x/3x PNG cards. Pick from 5 light and dark presets, Sans/Serif/Mono typography, Auto/4:5/16:9/1:1 ratios, optional @handle byline, and copy or download PNG with zero login and zero server upload.";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        ...pageIdentity(pageUrl, resolvedParams.lang),
        name: dict.tools.chatExporter.meta.title,
        description: dict.tools.chatExporter.meta.description,
      },
      {
        "@type": "WebApplication",
        name: zh ? "Markdown 转图片" : "Markdown to Image",
        url: pageUrl,
        description: answerFirst,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
        { name: "NavoKit", url: `${SITE_URL}/${resolvedParams.lang}` },
        { name: zh ? "工具" : "Tools", url: `${SITE_URL}/${resolvedParams.lang}/tools` },
        { name: zh ? "Markdown 转图片" : "Markdown to Image", url: pageUrl },
      ]),
    ],
  };
  const useCaseLinks = getMarkdownUseCases().map(item => ({
    title: item[resolvedParams.lang].heroTitle,
    description: item[resolvedParams.lang].heroSubtitle,
    href: getMarkdownUseCaseHref(item.slug, resolvedParams.lang),
  }));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <ChatExporter dict={dict} lang={resolvedParams.lang} content={content} answerFirst={answerFirst} useCaseLinks={useCaseLinks} />
    </>
  );
}
