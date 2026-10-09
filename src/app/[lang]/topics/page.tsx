import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TopicVisual from "@/components/catalog/TopicVisual";
import { getCatalogProducts, getTopics, type Locale } from "@/lib/catalog";
import { SITE_URL, localizedCanonical, siteSocialMetadata } from "@/lib/site";
import { breadcrumbList, pageIdentity, safeJsonLd } from "@/lib/schema";
import "@/components/catalog/catalog.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "zh" ? "场景专题：从正在做的事开始 | NavoKit" : "Collections: start with what you want to do | NavoKit";
  const description = lang === "zh" ? "从视频创作、桌面与浏览器、团队 Agent 协作和轻量创作出发，探索相关新产品与内容。" : "Explore emerging products through video creation, desktop and browser workflows, team collaboration with agents, and everyday creative tasks.";
  return { title, description, alternates: localizedCanonical(lang, "/topics"), ...siteSocialMetadata(lang, "/topics", title, description) };
}

export default async function TopicsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const zh = lang === "zh";
  const topics = getTopics(lang);
  const products = getCatalogProducts(lang);
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", ...pageIdentity(`${SITE_URL}/${lang}/topics`, lang), name: zh ? "NavoKit 专题" : "NavoKit topics", hasPart: topics.map(topic => ({ "@type": "CollectionPage", "@id": `${SITE_URL}/${lang}/topics/${topic.id}#webpage`, name: topic.name, url: `${SITE_URL}/${lang}/topics/${topic.id}` })) },
    breadcrumbList([{ name: "NavoKit", url: `${SITE_URL}/${lang}` }, { name: zh ? "专题" : "Topics", url: `${SITE_URL}/${lang}/topics` }]),
  ] };
  return <div className="site-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
    <SiteHeader lang={lang} />
    <main className="marketing-container cat-page">
      <header className="cat-page-heading"><span className="cat-eyebrow">{zh ? "场景专题" : "CURATED COLLECTIONS"}</span><h1>{zh ? "从正在做的事开始。" : "Start with what you want to do."}</h1><p>{zh ? "想做一段视频、整理桌面上的想法，或让团队与 Agent 一起工作？沿着具体场景，发现新的产品与方法。" : "Make a video, capture an idea, or bring agents into your team's work. Follow a practical scenario to discover a different way to do it."}</p></header>
      <div className="cat-topic-grid">{topics.map(topic => {
        const topicProducts = products.filter(product => product.topicIds.includes(topic.id));
        return <Link className="cat-topic-card" key={topic.id} href={`/${lang}/topics/${topic.id}`}>
          <TopicVisual products={topicProducts} lang={lang} />
          <div className="cat-topic-card-body">
            <div className="cat-topic-card-top"><span className="cat-eyebrow">{topic.kicker}</span><ArrowUpRight size={20} aria-hidden="true" /></div>
            <h2>{topic.name}</h2><p>{topic.description}</p>
            <div className="cat-topic-card-footer"><span>{topicProducts.length} {zh ? "个相关产品" : "related products"}</span><span>{zh ? "进入专题" : "Explore collection"} →</span></div>
          </div>
        </Link>;
      })}</div>
      <aside className="cat-note"><p>{zh ? "已经知道要找什么？产品库提供搜索与行业分类，帮你直接找到相关工具。" : "Already know what you need? Search the product directory or browse by industry category."}</p><Link href={`/${lang}/tools`}>{zh ? "前往产品库" : "Explore the directory"} →</Link></aside>
    </main>
    <SiteFooter lang={lang} />
  </div>;
}
