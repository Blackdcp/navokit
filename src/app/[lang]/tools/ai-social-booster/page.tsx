import { getDictionary } from '../../../../lib/dictionaries'
import SocialBoosterClient from '../../../../components/SocialBoosterClient'
import SiteHeader from '../../../../components/SiteHeader'
import { Metadata } from 'next'
import { localizedCanonical } from '../../../../lib/site'
import { SITE_URL } from '../../../../lib/site'
import { getToolPageContent } from '../../../../lib/toolPageContent'
import { breadcrumbList, safeJsonLd } from '../../../../lib/schema'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  
  const title = lang === 'en' 
    ? 'AI Social Post Generator - Draft Posts for Social Media | NavoKit'
    : 'AI 社交媒体文案生成器 - 快速生成社交媒体文案初稿 | NavoKit'
  const description = lang === 'en' 
    ? 'Turn one idea into editable drafts for X, LinkedIn, Instagram, and hooks, then review and personalize before publishing.'
    : '输入一个想法，生成 X 短帖、LinkedIn 帖子、Instagram 文案和开场句，发布前可继续修改。'

  return {
    title,
    description,
    alternates: localizedCanonical(lang, '/tools/ai-social-booster'),
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: "/images/tools/ai-social-booster.png",
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/tools/ai-social-booster.png"],
    }
  }
}

export default async function SocialBoosterPage({
  params
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}) {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)
  const content = getToolPageContent(lang, "ai-social-booster")
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: lang === "zh" ? "AI 社交媒体文案生成器" : "AI Social Post Generator",
        url: `${SITE_URL}/${lang}/tools/ai-social-booster`,
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
        { name: "NavoKit", url: `${SITE_URL}/${lang}` },
        { name: lang === "zh" ? "工具" : "Tools", url: `${SITE_URL}/${lang}/tools` },
        { name: lang === "zh" ? "AI 社交媒体文案生成器" : "AI Social Post Generator", url: `${SITE_URL}/${lang}/tools/ai-social-booster` },
      ]),
    ],
  }

  return (
    <div className="site-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <SiteHeader lang={lang} />

      <main>
        <SocialBoosterClient dict={dict} lang={lang} />
      </main>
    </div>
  )
}
