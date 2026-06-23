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
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 80,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href={`/${lang}`}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "transform 0.2s ease",
            }}
          >
            <img
              src="/logo.png"
              alt="NavoKit"
              style={{
                height: 52,
                width: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </Link>
          <Link
            href={`/${lang}`}
            style={{
              textDecoration: "none",
              color: "#6B7280",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "color 0.2s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            {lang === 'zh' ? '返回首页' : 'Back to Home'}
          </Link>
        </div>
      </header>

      <main>
        <SocialBoosterClient dict={dict} lang={lang} />
      </main>
    </div>
  )
}
