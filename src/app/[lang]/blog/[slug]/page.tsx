import { getBlogPostBySlug, getBlogPosts } from '../../../../lib/blog'
import { getDictionary } from '../../../../lib/dictionaries'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'
import SiteHeader from '../../../../components/SiteHeader'
import SiteFooter from '../../../../components/SiteFooter'

export async function generateStaticParams() {
  const zhPosts = getBlogPosts('zh')
  const enPosts = getBlogPosts('en')
  
  const zhParams = zhPosts.map((post) => ({
    lang: 'zh',
    slug: post.slug,
  }))
  
  const enParams = enPosts.map((post) => ({
    lang: 'en',
    slug: post.slug,
  }))

  return [...zhParams, ...enParams]
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ lang: 'en' | 'zh', slug: string }>
}) {
  const resolvedParams = await params
  const { lang, slug } = resolvedParams
  const dict = await getDictionary(lang)
  const post = getBlogPostBySlug(lang, slug)

  if (!post) {
    notFound()
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#0B1220", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <SiteHeader lang={lang} />

      <main style={{ flex: 1, width: "100%", paddingBottom: "96px" }}>
        {/* Breadcrumb / Back Link */}
        <div style={{ padding: "32px 24px 0" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Link 
              href={`/${lang}/blog`} 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#6B7280",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 600,
                transition: "color 0.2s"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              {lang === 'zh' ? '返回教程列表' : 'Back to Articles'}
            </Link>
          </div>
        </div>

        <article style={{ maxWidth: 800, margin: "32px auto 0", padding: "0 24px" }}>
          {/* Article Header */}
          <div style={{ marginBottom: 40 }}>
            <span style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "#EFF6FF",
              color: "#2563EB",
              borderRadius: "100px",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16
            }}>
              {lang === 'zh' ? '实操指南' : 'Guides & Tutorials'}
            </span>
            <h1 style={{
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 800,
              color: "#0B1220",
              margin: "0 0 16px",
              letterSpacing: "-0.03em",
              lineHeight: 1.25
            }}>
              {post.title}
            </h1>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 14,
              color: "#6B7280",
              fontWeight: 500,
            }}>
              <span>{post.date}</span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB" }} />
              <span>{lang === 'zh' ? '阅读约 5 分钟' : '5 min read'}</span>
            </div>
          </div>

          {/* Article body in a clean white card */}
          <div style={{
            background: "#ffffff",
            padding: "40px 32px",
            borderRadius: 24,
            border: "1px solid #E5E7EB",
            boxShadow: "0 1px 2px rgba(11,18,32,0.04)"
          }}>
            <div className="prose prose-slate max-w-none" style={{ fontSize: "16px", lineHeight: 1.8, color: "#374151" }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Related Tools Recommendation */}
          <div style={{
            marginTop: 48,
            padding: "40px 32px",
            background: "#fff",
            borderRadius: 24,
            border: "1px solid #E5E7EB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            boxShadow: "0 1px 2px rgba(11,18,32,0.04)"
          }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700, color: "#0B1220" }}>
              {lang === 'zh' ? '💡 想试试上面提到的效果吗？' : '💡 Want to try these workflows?'}
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 15, color: "#6B7280", lineHeight: 1.6, maxWidth: 480 }}>
              {lang === 'zh' 
                ? 'NavoKit 收集了全套 100% 免费的 AI 转换工具与排版神器，打开即用，无需注册。' 
                : 'NavoKit provides a complete suite of 100% free online conversion and post generation tools.'}
            </p>
            <Link 
              href={`/${lang}#tools`} 
              style={{
                display: "inline-block",
                padding: "10px 24px",
                background: "#0B1220",
                color: "#fff",
                borderRadius: 12,
                fontWeight: 650,
                fontSize: 14,
                textDecoration: "none",
                boxShadow: "0 1px 2px rgba(11,18,32,0.08)",
                transition: "opacity 0.2s"
              }}
            >
              {lang === 'zh' ? '浏览免费工具箱' : 'Explore Free Tools'}
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter lang={lang} />
    </div>
  )
}
