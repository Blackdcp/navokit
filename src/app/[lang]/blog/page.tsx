import { getBlogPosts } from '../../../lib/blog'
import { getDictionary } from '../../../lib/dictionaries'
import Link from 'next/link'
import SiteHeader from '../../../components/SiteHeader'
import SiteFooter from '../../../components/SiteFooter'

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
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#0B1220", display: "flex", flexDirection: "column" }}>
      <SiteHeader lang={lang} />

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "64px 24px 96px", width: "100%", flex: 1 }}>
        {/* Header section */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            fontWeight: 800,
            color: "#0B1220",
            margin: "0 0 16px"
          }}>
            {lang === 'zh' ? '技术教程与前沿资讯' : 'Blog & Guides'}
          </h1>
          <p style={{
            fontSize: 17,
            color: "#6B7280",
            margin: "0 auto",
            maxWidth: 480,
            lineHeight: 1.6
          }}>
            {lang === 'zh' ? '这里沉淀了我们提高效率、玩转 AI 的前沿技巧和独家指南。' : 'Discover advanced guides, tutorials, and workflows to boost your digital productivity.'}
          </p>
        </div>

        {posts.length === 0 ? (
          <div style={{
            padding: 80,
            background: "#fff",
            borderRadius: 24,
            border: "1px solid #E5E7EB",
            textAlign: "center",
            color: "#6B7280",
            boxShadow: "0 1px 2px rgba(11,18,32,0.04)"
          }}>
            {lang === 'zh' ? '暂无文章，敬请期待' : 'No posts yet. Stay tuned.'}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {posts.map(post => (
              <Link 
                key={post.slug} 
                href={`/${lang}/blog/${post.slug}`} 
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 24,
                  padding: "32px 40px",
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  boxShadow: "0 1px 2px rgba(11,18,32,0.04)",
                  transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                }}
                className="blog-card"
              >
                <div style={{ padding: "0 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{post.date}</span>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB" }} />
                    <span style={{ fontSize: 12, color: "#2563EB", fontWeight: 600 }}>{lang === 'zh' ? '官方指南' : 'Guides'}</span>
                  </div>
                  <h2 style={{
                    fontSize: "clamp(20px, 4vw, 26px)",
                    fontWeight: 760,
                    color: "#0B1220",
                    margin: "0 0 12px",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.25
                  }}>
                    {post.title}
                  </h2>
                  <p style={{
                    fontSize: 15,
                    color: "#6B7280",
                    margin: "0 0 24px",
                    lineHeight: 1.65
                  }}>
                    {post.description}
                  </p>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 14,
                    fontWeight: 650,
                    color: "#0B1220",
                    transition: "color 0.2s"
                  }}
                  className="read-more-link"
                  >
                    <span>{lang === 'zh' ? '阅读全文' : 'Read Article'}</span>
                    <span style={{ transition: "transform 0.2s" }} className="arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter lang={lang} />

      <style>{`
        .blog-card:hover {
          transform: translateY(-2px);
          border-color: #D1D5DB !important;
          box-shadow: 0 12px 30px rgba(11,18,32,0.06) !important;
        }
        .blog-card:hover .read-more-link {
          color: #2563EB !important;
        }
        .blog-card:hover .arrow {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  )
}
