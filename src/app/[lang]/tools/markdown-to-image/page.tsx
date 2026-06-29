import { getDictionary } from '../../../../lib/dictionaries';
import ChatExporter from '../../../../components/ChatExporter';
import { Metadata } from 'next';
import { localizedCanonical } from '../../../../lib/site';
import { SITE_URL } from '../../../../lib/site';
import { getToolPageContent } from '../../../../lib/toolPageContent';
import { breadcrumbList, safeJsonLd } from '../../../../lib/schema';

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
          url: "/images/tools/markdown-to-image.png",
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
      images: ["/images/tools/markdown-to-image.png"],
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
  const content = getToolPageContent(resolvedParams.lang, "markdown-to-image");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: resolvedParams.lang === "zh" ? "Markdown 转图片" : "Markdown to Image",
        url: `${SITE_URL}/${resolvedParams.lang}/tools/markdown-to-image`,
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
        { name: resolvedParams.lang === "zh" ? "工具" : "Tools", url: `${SITE_URL}/${resolvedParams.lang}/tools` },
        { name: resolvedParams.lang === "zh" ? "Markdown 转图片" : "Markdown to Image", url: `${SITE_URL}/${resolvedParams.lang}/tools/markdown-to-image` },
      ]),
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <ChatExporter dict={dict} lang={resolvedParams.lang} />
    </>
  );
}
