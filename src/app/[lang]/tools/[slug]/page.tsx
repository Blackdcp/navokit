import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/catalog/ProductCard";
import ProductLogo from "@/components/catalog/ProductLogo";
import ProductVisual from "@/components/catalog/ProductVisual";
import { productMedia } from "@/lib/productMedia";
import { getCategoryHref } from "@/lib/categoryRoutes";
import { getCatalogProduct, getCatalogProducts, getPricingLabel, getProductCategories, getProductKindLabel, getTopics, type Locale } from "@/lib/catalog";
import { SITE_URL, localizedCanonical } from "@/lib/site";
import { breadcrumbList, pageIdentity, safeJsonLd } from "@/lib/schema";
import "@/components/catalog/catalog.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCatalogProducts("en").filter(product => !product.internalPath).map(product => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = getCatalogProduct(lang, slug);
  if (!product || product.internalPath) notFound();
  const title = `${product.name} — ${product.tagline} | NavoKit`;
  const description = product.description;
  const image = productMedia[slug]?.image;
  return { title, description, alternates: localizedCanonical(lang, `/tools/${slug}`), openGraph: { title, description, url: `${SITE_URL}/${lang}/tools/${slug}`, type: "website", ...(image ? { images: [{ url: image, alt: productMedia[slug]?.imageAlt?.[lang] ?? product.name }] } : {}) }, twitter: { title, description, card: "summary_large_image", ...(image ? { images: [image] } : {}) } };
}

export default async function ProductPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params;
  const product = getCatalogProduct(lang, slug);
  if (!product || product.internalPath) notFound();
  const zh = lang === "zh";
  const topics = getTopics(lang).filter(topic => product.topicIds.includes(topic.id));
  const categories = getProductCategories(lang).filter(category => product.categoryIds.includes(category.id));
  const related = getCatalogProducts(lang).filter(item => item.slug !== slug && item.categoryIds.some(id => product.categoryIds.includes(id))).slice(0, 3);
  const url = `${SITE_URL}/${lang}/tools/${slug}`;
  const entityId = `${SITE_URL}/en/tools/${slug}#product`;
  const media = productMedia[slug];
  const visibleSources = [...new Set([product.website, product.repository, product.launchSource].filter((source): source is string => Boolean(source)))];
  const about = {
    "@type": product.kind === "hardware" ? "Product" : "SoftwareApplication",
    "@id": entityId,
    name: product.name, url: product.website, description: product.tagline,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    ...(media?.image ? { image: `${SITE_URL}${media.image}` } : {}),
    ...(product.kind === "hardware"
      ? { category: categories.map(category => category.name).join(", ") }
      : { applicationCategory: categories.map(category => category.name).join(", "), operatingSystem: product.platforms?.join(", "), featureList: product.features }),
  };
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", ...pageIdentity(url, lang), name: product.name, description: product.description, lastReviewed: product.verifiedAt, mainEntity: { "@id": entityId }, about, citation: visibleSources, ...(media?.image ? { primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}${media.image}` } } : {}) },
    breadcrumbList([{ name: "NavoKit", url: `${SITE_URL}/${lang}` }, { name: zh ? "产品库" : "Products", url: `${SITE_URL}/${lang}/tools` }, { name: product.name, url }]),
  ] };

  return <div className="site-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
    <SiteHeader lang={lang} />
    <main className="marketing-container cat-page cat-detail">
      <nav className="cat-breadcrumb" aria-label={zh ? "面包屑导航" : "Breadcrumb"}><Link href={`/${lang}/tools`}>{zh ? "产品库" : "Products"}</Link><span aria-hidden="true">/</span><span>{product.name}</span></nav>
      <header className="cat-detail-hero" id="product">
        <ProductLogo product={product} size={88} className="cat-detail-logo" />
        <div className="cat-detail-title"><span className="cat-eyebrow">{getProductKindLabel(product.kind, lang)}</span><h1>{product.name}</h1><p>{product.tagline}</p></div>
        <a className="cat-button cat-button--primary" href={product.website} target="_blank" rel="noopener noreferrer">{zh ? "访问官网" : "Visit website"}<ArrowUpRight size={17} aria-hidden="true" /></a>
      </header>
      <nav className="cat-detail-sections" aria-label={zh ? "本页内容" : "On this page"}><a href="#overview">{zh ? "用途与功能" : "Uses & features"}</a>{product.bestFor && <a href="#use-cases">{zh ? "适用场景" : "Who it helps"}</a>}<a href="#product-facts">{zh ? "使用条件" : "Requirements"}</a><a href="#sources">{zh ? "信息来源" : "Sources"}</a></nav>
      <div className="cat-detail-layout">
        <div className="cat-detail-main">
          <ProductVisual product={product} lang={lang} className="cat-product-visual--detail" sizes="(max-width: 780px) calc(100vw - 32px), (max-width: 1200px) 65vw, 752px" eager showCaption />
          <section className="cat-detail-section" id="overview"><h2>{zh ? `${product.name} 能做什么` : `What ${product.name} does`}</h2><p>{product.description}</p><ul className="cat-feature-list">{product.features.map(feature => <li key={feature}><Check size={18} aria-hidden="true" /><span>{feature}</span></li>)}</ul></section>
          {product.bestFor && <section className="cat-detail-section cat-use-case" id="use-cases"><h2>{zh ? "可以从这个场景开始" : "A place to start"}</h2><p>{product.bestFor}</p></section>}
          {topics.length > 0 && <section className="cat-detail-section"><h2>{zh ? "相关专题" : "Explore the context"}</h2><div className="cat-topic-links">{topics.map(topic => <Link href={`/${lang}/topics/${topic.id}`} key={topic.id}><span>{topic.name}</span><ArrowUpRight size={17} aria-hidden="true" /></Link>)}</div></section>}
          <section className="cat-detail-section cat-source-section" id="sources"><h2>{zh ? "信息来源" : "Sources"}</h2><p>{zh ? "产品介绍依据官方公开资料整理，具体功能与方案以产品官网为准。" : "Product details are summarized from official public materials. See the provider for current features and plans."}{product.launchSource && (zh ? "所列发布记录来自 Product Hunt。" : " The listed launch record comes from Product Hunt.")}</p><p><Link href={`/${lang}/editorial-policy`}>{zh ? "了解收录、引用与更正方式" : "How we list, cite, and correct information"}</Link></p></section>
        </div>
        <aside className="cat-facts" id="product-facts">
          <h2>{zh ? "产品信息" : "At a glance"}</h2>
          <dl>
            <div><dt>{zh ? "行业分类" : "Categories"}</dt><dd>{categories.map(category => <Link className="cat-fact-category" key={category.id} href={getCategoryHref(category.id, lang)}>{category.name}</Link>)}</dd></div>
            {product.platforms?.length ? <div><dt>{zh ? "使用平台" : "Platform"}</dt><dd>{product.platforms.join(" · ")}</dd></div> : null}
            <div><dt>{zh ? "价格" : "Pricing"}</dt><dd>{getPricingLabel(product.pricing, lang)}</dd></div>
          </dl>
          {product.requirements && <p className="cat-requirements">{product.requirements}</p>}
          <dl>
            {product.launchDate && product.launchSource && <div><dt>{zh ? "Product Hunt 发布记录" : "Product Hunt launch record"}</dt><dd><a href={product.launchSource} target="_blank" rel="noopener noreferrer"><time dateTime={product.launchDate}>{product.launchDate}</time> ↗</a></dd></div>}
            {product.addedAt && <div><dt>{zh ? "收录日期" : "Added to NavoKit"}</dt><dd><time dateTime={product.addedAt}>{product.addedAt}</time></dd></div>}
            {product.verifiedAt && <div><dt>{zh ? "信息核对" : "Details checked"}</dt><dd><time dateTime={product.verifiedAt}>{product.verifiedAt}</time></dd></div>}
          </dl>
          {product.repository && <a className="cat-repository" href={product.repository} target="_blank" rel="noopener noreferrer">{zh ? "查看代码仓库" : "View repository"}<ArrowUpRight size={16} aria-hidden="true" /></a>}
          <Link className="cat-correction" href={`/${lang}/contact`}>{zh ? "信息有误？联系我们更正" : "Suggest a correction"}</Link>
        </aside>
      </div>
      {related.length > 0 && <section className="cat-related"><div className="cat-section-heading"><h2>{zh ? "继续发现" : "Keep exploring"}</h2><Link href={`/${lang}/tools`}>{zh ? "浏览产品库" : "All products"}<span aria-hidden="true">→</span></Link></div><div className="cat-product-grid">{related.map(item => <ProductCard key={item.slug} product={item} lang={lang} />)}</div></section>}
    </main>
    <SiteFooter lang={lang} />
  </div>;
}
