import { getDictionary } from '../../../../lib/dictionaries'
import SocialBoosterClient from '../../../../components/SocialBoosterClient'
import SiteHeader from '../../../../components/SiteHeader'

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
