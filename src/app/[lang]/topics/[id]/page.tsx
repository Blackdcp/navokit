import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/catalog/ProductCard";
import TopicVisual from "@/components/catalog/TopicVisual";
import ArticleCover from "@/components/updates/ArticleCover";
import { getCatalogProducts, getProductHref, getTopic, getTopics, type Locale } from "@/lib/catalog";
import { getBlogPosts } from "@/lib/blog";
import { getPostTopicIds } from "@/lib/discovery";
import { SITE_URL, localizedCanonical, siteSocialMetadata } from "@/lib/site";
import { breadcrumbList, pageIdentity, safeJsonLd } from "@/lib/schema";
import "@/components/catalog/catalog.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTopics("en").map(topic => ({ id: topic.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const topic = getTopic(lang, id);
  if (!topic) notFound();
  const title = `${topic.name} | NavoKit`;
  const description = topic.description;
  return { title, description, alternates: localizedCanonical(lang, `/topics/${id}`), ...siteSocialMetadata(lang, `/topics/${id}`, title, description) };
}

export default async function TopicPage({ params }: { params: Promise<{ lang: Locale; id: string }> }) {
  const { lang, id } = await params;
  const topic = getTopic(lang, id);
  if (!topic) notFound();
  const zh = lang === "zh";
  const products = getCatalogProducts(lang).filter(product => product.topicIds.includes(id));
  const posts = getBlogPosts(lang).filter(post => getPostTopicIds(post).includes(id)).slice(0, 4);
  const others = getTopics(lang).filter(item => item.id !== id);
  const url = `${SITE_URL}/${lang}/topics/${id}`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", ...pageIdentity(url, lang), name: topic.name, description: topic.description, mainEntity: { "@type": "ItemList", "@id": `${url}#products`, numberOfItems: products.length, itemListOrder: "https://schema.org/ItemListUnordered", itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.name, url: `${SITE_URL}${getProductHref(product, lang)}` })) } },
    breadcrumbList([{ name: "NavoKit", url: `${SITE_URL}/${lang}` }, { name: zh ? "专题" : "Topics", url: `${SITE_URL}/${lang}/topics` }, { name: topic.name, url }]),
  ] };
  return <div className="site-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
    <SiteHeader lang={lang} />
    <main className="marketing-container cat-page">
      <nav className="cat-breadcrumb" aria-label={zh ? "面包屑导航" : "Breadcrumb"}><Link href={`/${lang}/topics`}>{zh ? "专题" : "Topics"}</Link><span aria-hidden="true">/</span><span>{topic.name}</span></nav>
      <header className="cat-topic-hero"><div className="cat-topic-hero-copy"><span className="cat-eyebrow">{topic.kicker}</span><h1>{topic.name}</h1><p>{topic.description}</p></div><TopicVisual products={products} lang={lang} /></header>
      <section className="cat-topic-products"><div className="cat-section-heading"><h2>{zh ? "相关产品" : "Related products"}</h2><span>{products.length} {zh ? "个产品" : "products"}</span></div>{products.length > 0 ? <div className="cat-product-grid">{products.map(product => <ProductCard key={product.slug} product={product} lang={lang} />)}</div> : <div className="cat-empty"><h2>{zh ? "本专题暂未收录产品" : "No products listed in this collection yet"}</h2><p>{zh ? "产品信息将在确认并审核后加入。你可以先阅读下方的相关内容。" : "Products will be added after review. Explore the related reading below in the meantime."}</p></div>}</section>
      {posts.length > 0 && <section className="cat-related"><div className="cat-section-heading"><h2>{zh ? "继续阅读" : "Read a little deeper"}</h2><Link href={`/${lang}/updates?topic=${id}`}>{zh ? "更多内容" : "More reading"}<span aria-hidden="true">→</span></Link></div><div className="cat-reading-grid">{posts.map(post => <Link href={`/${lang}/blog/${post.slug}`} className="cat-reading-card" key={post.slug}><ArticleCover slug={post.slug} title={post.title} lang={lang} compact className="cat-reading-cover" /><div className="cat-reading-body"><div className="cat-reading-meta"><span className="cat-eyebrow">{zh ? "文章" : "ARTICLE"}</span><time dateTime={post.date}>{post.date}</time></div><h3>{post.title}</h3><span className="cat-reading-arrow"><span>{zh ? "阅读文章" : "Read article"}</span><ArrowUpRight size={19} aria-hidden="true" /></span></div></Link>)}</div></section>}
      <section className="cat-related"><div className="cat-section-heading"><h2>{zh ? "看看其他专题" : "Another direction to explore"}</h2></div><div className="cat-topic-links">{others.map(item => <Link href={`/${lang}/topics/${item.id}`} key={item.id}><span>{item.name}</span><ArrowUpRight size={17} aria-hidden="true" /></Link>)}</div></section>
    </main>
    <SiteFooter lang={lang} />
  </div>;
}
