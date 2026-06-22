import { getDictionary } from '../../../../lib/dictionaries'
import SocialBoosterClient from '../../../../components/SocialBoosterClient'
import Link from 'next/link'

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
      <header style={{ background: "#ffffff", borderBottom: "1px solid #eaeaea", padding: "12px 0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
          <Link href={`/${lang}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{ width: 24, height: 24, background: "#0a0a0a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "8px solid #ffffff", marginTop: "-2px" }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
              {dict.header.title}
            </span>
          </Link>
          <div style={{ display: "flex", gap: 24, fontSize: 14, fontWeight: 500 }}>
             <Link href={`/${lang}`} style={{ textDecoration: "none", color: "#666" }}>{lang === 'zh' ? '← 返回首页' : '← Back to Home'}</Link>
          </div>
        </div>
      </header>

      <main>
        <SocialBoosterClient dict={dict} lang={lang} />
      </main>
    </div>
  )
}
