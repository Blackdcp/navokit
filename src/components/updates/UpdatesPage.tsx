import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import AdBanner from "../AdBanner";
import { getArticleUpdates, getUpdates } from "../../lib/discovery";
import { getTopics } from "../../lib/catalog";
import { breadcrumbList, pageIdentity, safeJsonLd } from "../../lib/schema";
import { SITE_URL } from "../../lib/site";
import UpdatesFeed from "./UpdatesFeed";
import { readFeedFilters } from "./feedFilters";
import "./updates.css";

export default function UpdatesPage({ lang, archive = false, initialTopic = "all", initialQuery = "", initialKind = "all" }: { lang: "en" | "zh"; archive?: boolean; initialTopic?: string; initialQuery?: string; initialKind?: string }) {
  const zh = lang === "zh";
  const entries = archive ? getArticleUpdates(lang) : getUpdates(lang);
  const hasLaunches = entries.some(entry => entry.kind === "launch");
  const topics = getTopics(lang);
  const title = archive ? (zh ? "指南与观点" : "Guides & perspectives") : (zh ? "发现，持续更新。" : "Keep your discoveries current.");
  const description = archive
    ? (zh ? "AI 技术、创作方法与工作流。按主题查找文章，慢慢读，接着试。" : "AI technology, creative methods, and workflows. Find a subject, take a closer look, and put it into practice.")
    : hasLaunches
      ? (zh ? "关注新产品，也留一点时间深入阅读。这里按日期整理产品发布记录与 NavoKit 文章。" : "Keep up with product launches and make time for a closer read. Explore sourced launch records and articles, in date order.")
      : (zh ? "浏览 NavoKit 已发布的文章，按日期与专题继续探索。" : "Browse published NavoKit articles and explore more by date and topic.");
  const pathname = archive ? "/blog" : "/updates";
  const url = `${SITE_URL}/${lang}${pathname}`;
  const initialFilters = readFeedFilters(new URLSearchParams({ q: initialQuery, topic: initialTopic, type: initialKind }), topics, archive);
  const query = initialFilters.query.trim().toLocaleLowerCase();
  const schemaEntries = entries.filter(entry => {
    const topicNames = topics.filter(topic => entry.topicIds.includes(topic.id)).map(topic => topic.name).join(" ");
    return (initialFilters.kind === "all" || entry.kind === initialFilters.kind)
      && (initialFilters.topic === "all" || entry.topicIds.includes(initialFilters.topic))
      && (!query || `${entry.title} ${entry.description} ${entry.label} ${entry.sourceLabel} ${topicNames}`.toLocaleLowerCase().includes(query));
  });
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", ...pageIdentity(url, lang), name: title, description, mainEntity: { "@id": `${url}#entries` } },
      { "@type": "ItemList", "@id": `${url}#entries`, name: title, numberOfItems: schemaEntries.length, itemListElement: schemaEntries.map((entry, index) => ({ "@type": "ListItem", position: index + 1, name: entry.title, url: `${SITE_URL}${entry.href}` })) },
      breadcrumbList([{ name: "NavoKit", url: `${SITE_URL}/${lang}` }, { name: zh ? (archive ? "文章" : "更新动态") : (archive ? "Articles" : "Updates"), url: `${SITE_URL}/${lang}${pathname}` }]),
    ],
  };

  return (
    <div className="site-shell updates-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <SiteHeader lang={lang} />
      <main className="marketing-container updates-page">
        <header className="updates-hero">
          <div>
            <span className="updates-eyebrow">{archive ? (zh ? "NAVOKIT 文章档案" : "THE NAVOKIT ARCHIVE") : (zh ? "NAVOKIT 更新动态" : "THE NAVOKIT FEED")}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <Link className="updates-hero-link" href={`/${lang}/${archive ? "updates" : "tools"}`}>{archive ? (zh ? "查看全部动态" : "See all updates") : (zh ? "探索产品库" : "Explore the directory")}<ArrowUpRight size={18} aria-hidden="true" /></Link>
        </header>

        <div className="updates-layout">
          <UpdatesFeed key={`${lang}:${archive ? "archive" : "feed"}`} lang={lang} entries={entries} topics={topics.map(({ id, name }) => ({ id, name }))} archive={archive} />
          <aside className="updates-sidebar">
            <section className="updates-sidebar-card">
              <h2>{zh ? "沿着兴趣，继续探索" : "Follow your curiosity"}</h2>
              <p>{zh ? "把同一个领域的工具和内容放在一起，更容易找到下一步。" : "Find tools and reading around the same subject, all in one place."}</p>
              <nav aria-label={zh ? "浏览专题" : "Browse topics"}>
                {topics.map(topic => <Link key={topic.id} href={`/${lang}/topics/${topic.id}`}><span>{topic.name}</span><ArrowUpRight size={16} aria-hidden="true" /></Link>)}
              </nav>
            </section>
            <section className="updates-sidebar-note">
              <h2>{zh ? "找到值得分享的产品？" : "Found something useful?"}</h2>
              <p>{zh ? "欢迎推荐你正在做、或正在用的工具。" : "Recommend a product you are building or enjoy using."}</p>
              <Link href={`/${lang}/submit`}>{zh ? "提交产品" : "Submit a product"}<ArrowUpRight size={16} aria-hidden="true" /></Link>
            </section>
            <p className="updates-date-note">{zh ? "文章显示原始发布日期。" : "Articles retain their original publication dates."}{hasLaunches && (zh ? "产品日期对应 Product Hunt 发布记录，不代表产品首次上线或加入 NavoKit 的时间。" : " Product dates refer to Product Hunt launches, rather than a product’s first-ever release or its addition to NavoKit.")}</p>
            {!archive && <Link className="updates-archive-link" href={`/${lang}/blog`}>{zh ? "浏览文章归档" : "Browse the article archive"}<span aria-hidden="true">→</span></Link>}
          </aside>
        </div>
        <aside className="updates-ad" aria-label={zh ? "广告" : "Advertisement"}>
          <span>{zh ? "广告" : "Advertisement"}</span>
          <AdBanner adKey="5681eab12afa08484fbf5519ae7b0dfd" width={728} height={90} className="hidden md:flex" />
          <AdBanner adKey="c8f2c965c00540fcd54ab30efc5a218b" width={320} height={50} className="md:hidden" />
        </aside>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
