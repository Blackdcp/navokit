import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ProductDirectory from "@/components/catalog/ProductDirectory";
import ProductCard from "@/components/catalog/ProductCard";
import { getCatalogProducts, getProductCategories, getProductHref, getTopics, type Locale } from "@/lib/catalog";
import { localizedCanonical, siteSocialMetadata, SITE_URL } from "@/lib/site";
import { breadcrumbList, pageIdentity, safeJsonLd } from "@/lib/schema";
import "@/components/catalog/catalog.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "zh" ? "产品库：发现新锐 AI 产品与实用工具 | NavoKit" : "Discover emerging AI products & useful tools | NavoKit";
  const description = lang === "zh" ? "发现值得探索的新锐 AI 产品与实用工具。按用途与行业分类浏览，了解具体场景、使用条件和官方来源。" : "Discover emerging AI products and focused tools. Browse by category, explore practical use cases, and check each product's requirements and official sources.";
  return {
    title,
    description,
    alternates: localizedCanonical(lang, "/tools"),
    ...siteSocialMetadata(lang, "/tools", title, description),
  };
}

export default async function ToolsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const zh = lang === "zh";
  const products = getCatalogProducts(lang);
  const topics = getTopics(lang);
  const categories = getProductCategories(lang);
  const url = `${SITE_URL}/${lang}/tools`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", ...pageIdentity(url, lang), name: zh ? "NavoKit 产品库" : "NavoKit product directory", mainEntity: { "@id": `${url}#products` } },
    { "@type": "ItemList", "@id": `${url}#products`, numberOfItems: products.length, itemListOrder: "https://schema.org/ItemListUnordered", itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.name, url: `${SITE_URL}${getProductHref(product, lang)}`, description: product.tagline })) },
    breadcrumbList([{ name: "NavoKit", url: `${SITE_URL}/${lang}` }, { name: zh ? "产品库" : "Products", url: `${SITE_URL}/${lang}/tools` }]),
  ] };

  return <div className="site-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
    <SiteHeader lang={lang} />
    <main className="marketing-container cat-page">
      <header className="cat-page-heading"><span className="cat-eyebrow">{zh ? "产品发现" : "PRODUCT DISCOVERY"}</span><h1>{zh ? "发现下一个值得尝试的产品。" : "Find something worth trying."}</h1><p>{zh ? "关注有新想法、能解决具体问题的产品。按你的用途探索，看看它如何工作，再决定是否试一试。" : "Fresh ideas for specific tasks. Explore what a product does, where it fits, and whether it is right for your next project."}</p></header>
      <Suspense fallback={<div className="cat-product-grid">{products.map(product => <ProductCard key={product.slug} product={product} lang={lang} />)}</div>}><ProductDirectory products={products} categories={categories} topics={topics} lang={lang} /></Suspense>
      <aside className="cat-submit-strip"><div><h2>{zh ? "有一个值得被看见的产品？" : "Building something worth discovering?"}</h2><p>{zh ? "提交产品信息，让更多人发现你的作品。" : "Tell us about it and help more people find your work."}</p></div><Link href={`/${lang}/submit`} className="cat-button cat-button--primary">{zh ? "提交产品" : "Submit a product"}<span aria-hidden="true">↗</span></Link></aside>
    </main>
    <SiteFooter lang={lang} />
  </div>;
}
