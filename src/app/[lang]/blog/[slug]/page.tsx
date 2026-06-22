import { getBlogPostBySlug, getBlogPosts } from '../../../../lib/blog'
import { getDictionary } from '../../../../lib/dictionaries'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'

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
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: 80 }}>
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
             <Link href={`/${lang}/blog`} style={{ textDecoration: "none", color: "#666" }}>{lang === 'zh' ? '← 返回博客' : '← Back to Blog'}</Link>
          </div>
        </div>
      </header>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px", background: "#fff", marginTop: 40, borderRadius: 8, border: "1px solid #eaeaea" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 12, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          {post.title}
        </h1>
        <div style={{ fontSize: 14, color: "#999", marginBottom: 40, paddingBottom: 24, borderBottom: "1px solid #eaeaea" }}>
          {post.date}
        </div>
        
        <div className="prose prose-slate max-w-none" style={{ lineHeight: 1.8, color: "#333", fontSize: 16 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* monetization block at the end */}
        <div style={{ marginTop: 60, padding: 32, background: "#f0f5ff", borderRadius: 8, border: "1px solid #1677ff", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 20, color: "#111827", fontWeight: 600 }}>
             {lang === 'zh' ? '🔥 需要升级 ChatGPT Plus 或获取 API？' : '🔥 Need ChatGPT Plus or APIs?'}
          </h3>
          <p style={{ margin: "0 0 24px", color: "#666", fontSize: 15 }}>
             {lang === 'zh' ? '安全、稳定、极速交付。查看我们提供的开发者优质资源，直接购买免折腾。' : 'Safe, stable, and instant delivery. Check out our premium resources.'}
          </p>
          <Link href={`/${lang}`} className="vercel-button" style={{ padding: "12px 32px", fontSize: 16, display: "inline-block", textDecoration: "none" }}>
            {lang === 'zh' ? '前往商城选购' : 'Visit Store'}
          </Link>
        </div>
      </article>
    </div>
  )
}
