import { getBlogPosts } from '../../../lib/blog'
import { getDictionary } from '../../../lib/dictionaries'
import Link from 'next/link'

export default async function BlogListPage({
  params
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}) {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)
  const posts = getBlogPosts(lang)

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: 80 }}>
      {/* Simple Header */}
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
             <Link href={`/${lang}`} style={{ textDecoration: "none", color: "#666" }}>{lang === 'zh' ? '返回首页' : 'Home'}</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 16, letterSpacing: "-0.02em" }}>
          {lang === 'zh' ? '技术教程与资讯' : 'Blog & Guides'}
        </h1>
        <p style={{ fontSize: 16, color: "#666", marginBottom: 48, lineHeight: 1.6 }}>
          {lang === 'zh' ? '发现提高效率、玩转 AI 的前沿技巧。' : 'Discover tips and guides to boost your AI productivity.'}
        </p>

        {posts.length === 0 ? (
          <div style={{ padding: 40, background: "#fff", borderRadius: 8, border: "1px solid #eaeaea", textAlign: "center", color: "#999" }}>
            {lang === 'zh' ? '暂无文章' : 'No posts yet'}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {posts.map(post => (
              <Link 
                key={post.slug} 
                href={`/${lang}/blog/${post.slug}`} 
                className="vercel-card"
                style={{ display: "block", padding: 24, textDecoration: "none", background: "#fff", borderRadius: 8, border: "1px solid #eaeaea" }}
              >
                <div style={{ fontSize: 13, color: "#999", marginBottom: 8, fontWeight: 500 }}>{post.date}</div>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: "0 0 12px", letterSpacing: "-0.01em" }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: 15, color: "#666", margin: 0, lineHeight: 1.5 }}>
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
