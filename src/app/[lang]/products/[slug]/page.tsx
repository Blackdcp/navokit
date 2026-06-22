import { notFound } from 'next/navigation'
import { getProductBySlug } from '../../../../lib/api'
import { getDictionary } from '../../../../lib/dictionaries'

import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh'; slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const product = getProductBySlug(resolvedParams.lang, resolvedParams.slug)
  const dict = await getDictionary(resolvedParams.lang)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const title = `${product.title} | ${dict.header.title}`
  const description = product.subtitle.replace(/<[^>]*>?/gm, '') // Remove HTML tags
  const keywords = product.tags

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: "/opengraph-image.png",
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
      images: ["/twitter-image.png"],
    }
  }
}


export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh'; slug: string }>
}) {
  const resolvedParams = await params
  const product = getProductBySlug(resolvedParams.lang, resolvedParams.slug)
  const dict = await getDictionary(resolvedParams.lang)

  if (!product) {
    notFound()
  }


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.subtitle,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": resolvedParams.lang === 'en' ? "USD" : "CNY",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };


  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", color: "#111827", padding: "40px 24px", lineHeight: 1.6 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Header bar */}
      <div style={{ background: "#ffffff", padding: "16px 24px", borderBottom: "1px solid #eaeaea", marginBottom: 40, marginLeft: -24, marginRight: -24, marginTop: -40 }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center" }}>
          <a href={`/${resolvedParams.lang}`} style={{ color: "#666666", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            &larr; {dict.product.back}
          </a>
        </div>
      </div>

      <div className="vercel-card" style={{ maxWidth: 780, margin: "0 auto", padding: "48px" }}>
        
        <div style={{ fontSize: 12, fontWeight: 500, color: "#666666", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
          {product.categoryName}
        </div>
        
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          {product.title}
        </h1>

        <div style={{ marginBottom: 32, display: "flex", alignItems: "baseline" }}>
          {product.price > 0 ? (
             <>
               <span style={{ fontSize: 40, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>{dict.common.currency}{product.price}</span>
             </>
          ) : (
             <span style={{ fontSize: 40, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>{dict.common.free}</span>
          )}
        </div>

        <p style={{ fontSize: 16, color: "#444444", lineHeight: 1.6, marginBottom: 40 }}>
          {product.subtitle}
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
          {product.tags.map(t => (
            <span key={t} style={{ padding: "4px 12px", background: "#fafafa", border: "1px solid #eaeaea", borderRadius: "999px", fontSize: 13, color: "#444444", fontWeight: 500 }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #eaeaea", paddingTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 24px", letterSpacing: "-0.01em" }}>{dict.product.features}</h2>
          <ul style={{ paddingLeft: 0, margin: 0, color: "#444444", lineHeight: 1.8, fontSize: 15, listStyle: "none" }}>
            {product.features.map((f, i) => (
              <li key={i} style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#0a0a0a", marginTop: 2 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {product.warnings && product.warnings.length > 0 && (
          <div style={{ marginTop: 48, padding: "24px", border: "1px solid #eaeaea", borderRadius: "8px", background: "#fafafa" }}>
            <h3 style={{ margin: "0 0 16px", color: "#111827", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              {dict.product.warnings}
            </h3>
            <ul style={{ paddingLeft: 20, margin: 0, color: "#444444", fontSize: 14, lineHeight: 1.6 }}>
              {product.warnings.map((w, i) => (
                <li key={i} style={{ marginBottom: 8 }}>{w}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  )
}
