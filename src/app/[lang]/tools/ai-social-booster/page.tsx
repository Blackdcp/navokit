import { getDictionary } from '../../../../lib/dictionaries'
import SocialBoosterClient from '../../../../components/SocialBoosterClient'
import SiteHeader from '../../../../components/SiteHeader'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  
  const title = lang === 'en' 
    ? 'AI Social Post Generator - Twitter, Instagram, Red | NavoKit' 
    : 'AI 社媒文案生成器 - 微博、小红书、朋友圈 | NavoKit'
  const description = lang === 'en' 
    ? 'Convert a simple thought into viral post copy for multiple social platforms instantly using AI.' 
    : '输入一句话，一键生成适配微博、小红书、朋友圈等各大社交平台的网感文案。'

  return {
    title,
    description,
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

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteHeader lang={lang} />

      <main>
        <SocialBoosterClient dict={dict} lang={lang} />
      </main>
    </div>
  )
}
