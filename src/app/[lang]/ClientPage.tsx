import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import ProductLogo from "../../components/catalog/ProductLogo";
import ProductVisual from "../../components/catalog/ProductVisual";
import TopicVisual from "../../components/catalog/TopicVisual";
import ArticleCover from "../../components/updates/ArticleCover";
import { getCatalogProducts, getProductCategories, getProductHref, getTopics } from "../../lib/catalog";
import { getCategoryHref } from "../../lib/categoryRoutes";
import { getUpdates } from "../../lib/discovery";
import "../../components/catalog/catalog.css";
import "./discovery-home.css";

export default function HomePage({ lang }: { lang: "en" | "zh" }) {
  const zh = lang === "zh";
  const products = getCatalogProducts(lang);
  const discoveries = products.filter(product => !product.internalPath);
  const utilities = products.filter(product => product.internalPath);
  const topics = getTopics(lang);
  const categories = getProductCategories(lang);
  const updates = getUpdates(lang);
  const recent = updates.slice(0, 4);
  const articles = updates.filter(item => item.kind === "article").slice(0, 2);
  const spotlight = discoveries.find(product => product.slug === "pexo") ?? discoveries[0];
  const featuredSlugs = ["flora", "sloyd", "msty"];
  const moreFinds = [
    ...featuredSlugs.flatMap(slug => discoveries.filter(product => product.slug === slug)),
    ...discoveries.filter(product => product.slug !== spotlight?.slug && !featuredSlugs.includes(product.slug)),
  ];
  const spotlightHeadline = spotlight?.slug === "pexo"
    ? (zh ? "制作视频，也可以像交流想法一样。" : "Making a video can start with a conversation.")
    : spotlight?.tagline;

  return (
    <div className="site-shell discovery-home">
      <SiteHeader lang={lang} />
      <main id="main-content">
        <section className="marketing-container discover-hero">
          <div>
            <span className="discover-kicker">NAVIGATION + TOOLS</span>
            <h1>{zh ? <>发现新工具，<br className="discover-mobile-break" />打开新可能。</> : "Good finds. New possibilities."}</h1>
            <p>{zh ? "有新意的产品，有意思的用法。为你的下一次创作找点灵感。" : "Fresh products, thoughtful ideas, and a little inspiration for what you make next."}</p>
          </div>
          <div className="discover-search-block">
            <form className="discover-search" action={`/${lang}/tools`}>
              <Search size={20} aria-hidden="true" />
              <label className="sr-only" htmlFor="home-search">{zh ? "搜索产品或用途" : "Search products or tasks"}</label>
              <input id="home-search" name="q" type="search" placeholder={zh ? "找一个产品，或一种新可能" : "Find a product or a new possibility"} />
              <button type="submit" aria-label={zh ? "搜索产品" : "Search products"}><ArrowRight size={20} /></button>
            </form>
            <div className="discover-quicklinks">
              {categories.filter(category => ["video", "coding", "productivity"].includes(category.id)).map(category => <Link href={getCategoryHref(category.id, lang)} key={category.id}>{category.name}<ArrowUpRight size={13} aria-hidden="true" /></Link>)}
            </div>
          </div>
        </section>

        <section className="marketing-container discover-finds" aria-labelledby="featured-heading">
          <div className="discover-section-heading">
            <div><span className="discover-kicker">THE DISCOVERY EDIT</span><h2 id="featured-heading">{zh ? "值得认识的新产品" : "Meet your next find"}</h2></div>
            <Link href={`/${lang}/tools`}>{zh ? "探索产品库" : "Explore all products"}<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          {spotlight ? <div className="discover-showcase">
            <Link className="discover-spotlight" href={getProductHref(spotlight, lang)}>
              <div className="discover-spotlight__visual">
                <ProductVisual product={spotlight} lang={lang} eager sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1168px) 62vw, 700px" />
                <span className="discover-spotlight__label">{zh ? "精选发现" : "IN FOCUS"}<ArrowUpRight size={14} aria-hidden="true" /></span>
                <span className="discover-spotlight__source">{zh ? "官网产品画面" : "Official product preview"}</span>
              </div>
              <div className="discover-spotlight__body">
                <ProductLogo product={spotlight} size={54} />
                <div><span className="discover-product-meta">{spotlight.name} <span>／</span> {categories.find(category => category.id === spotlight.categoryIds[0])?.name}</span><h3>{spotlightHeadline}</h3><p>{spotlight.tagline}</p></div>
                <span className="discover-card-arrow"><ArrowUpRight size={22} aria-hidden="true" /></span>
              </div>
            </Link>
            <div className="discover-find-stack">{moreFinds.slice(0, 3).map(product => <Link className="discover-small-find" href={getProductHref(product, lang)} key={product.slug}>
              <div className="discover-small-find__copy"><ProductLogo product={product} size={40} /><span className="discover-product-meta">{categories.find(category => category.id === product.categoryIds[0])?.name}</span><h3>{product.name}</h3><p>{product.tagline}</p><ArrowUpRight size={17} aria-hidden="true" /></div>
              <ProductVisual product={product} lang={lang} sizes="(max-width: 760px) 38vw, 160px" />
            </Link>)}</div>
          </div> : <div className="discover-empty"><h3>{zh ? "第一批新发现，正在整理。" : "Our first finds are taking shape."}</h3><p>{zh ? "有值得推荐的产品？把它介绍给我们。" : "Know a product worth discovering? Send it our way."}</p><Link className="button button--secondary" href={`/${lang}/submit`}>{zh ? "推荐产品" : "Recommend a product"}</Link></div>}
        </section>

        <div className="marketing-container discover-reading-layout">
          <section aria-labelledby="reading-heading">
            <div className="discover-section-heading"><div><span className="discover-kicker">A LITTLE DEEPER</span><h2 id="reading-heading">{zh ? "新工具之外，再读一点。" : "A little more to think about."}</h2></div><Link href={`/${lang}/blog`}>{zh ? "全部文章" : "All articles"}<ArrowRight size={16} aria-hidden="true" /></Link></div>
            <div className="discover-reading-grid">{articles.map(article => <Link className="discover-reading-card" href={article.href} key={article.id}>
              <ArticleCover slug={article.id.slice("article:".length)} title={article.title} lang={lang} className="discover-reading-cover" />
              <div className="discover-reading-meta"><span>{article.label}</span><time dateTime={article.date}>{article.date.slice(0, 10)}</time></div>
              <h3>{article.title}</h3><span className="discover-reading-more">{zh ? "继续阅读" : "Read the story"}<ArrowUpRight size={15} aria-hidden="true" /></span>
            </Link>)}</div>
          </section>
          <aside className="discover-feed" aria-labelledby="updates-heading">
            <div className="discover-section-heading"><div><span className="discover-kicker">ON THE RADAR</span><h2 id="updates-heading">{zh ? "最近动态" : "On the radar"}</h2></div><Link href={`/${lang}/updates`} aria-label={zh ? "全部动态" : "All updates"}><ArrowUpRight size={20} aria-hidden="true" /></Link></div>
            <div className="discover-feed__list">{recent.map(item => {
              const product = item.kind === "launch" ? products.find(product => item.productIds?.includes(product.slug)) : undefined;
              return <Link className="discover-feed__item" href={item.href} key={item.id}>
                {product ? <ProductLogo product={product} size={44} /> : <ArticleCover slug={item.id.slice("article:".length)} title={item.title} lang={lang} thumbnail className="discover-feed-cover" />}
                <div className="discover-feed__copy"><div><span>{item.kind === "launch" ? item.dateLabel : item.label}</span><time dateTime={item.date}>{item.date.slice(0, 10)}</time></div><h3>{item.title}</h3></div>
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>;
            })}</div>
            <Link className="discover-submit-note" href={`/${lang}/submit`}><span>{zh ? "做了个有意思的产品？" : "Making something interesting?"}<strong>{zh ? "让更多人发现它。" : "Help people find it."}</strong></span><ArrowUpRight size={22} aria-hidden="true" /></Link>
          </aside>
        </div>

        <section className="discover-topics-section" aria-labelledby="topics-heading">
          <div className="marketing-container">
            <div className="discover-section-heading"><div><span className="discover-kicker">FOLLOW A THREAD</span><h2 id="topics-heading">{zh ? "从一个兴趣，继续探索。" : "Follow your curiosity."}</h2></div><Link href={`/${lang}/topics`}>{zh ? "全部专题" : "All collections"}<ArrowRight size={16} aria-hidden="true" /></Link></div>
            <div className="discover-topic-grid">{topics.map(topic => {
              const related = products.filter(product => product.topicIds.includes(topic.id));
              return <Link className="discover-topic" href={`/${lang}/topics/${topic.id}`} key={topic.id}><TopicVisual products={related} lang={lang} compact /><div className="discover-topic__body"><span className="discover-topic-meta">{related.length} {zh ? "个产品" : "products"}</span><h3>{topic.name}<ArrowUpRight size={18} aria-hidden="true" /></h3><p>{topic.description}</p></div></Link>;
            })}</div>
          </div>
        </section>

        <section className="marketing-container discover-categories" aria-labelledby="category-heading">
          <div className="discover-section-heading"><div><span className="discover-kicker">FIND YOUR WAY</span><h2 id="category-heading">{zh ? "按用途，找到方向。" : "Find a starting point."}</h2></div></div>
          <div className="discover-category-grid">{categories.map(category => {
            const count = products.filter(product => product.categoryIds.includes(category.id)).length;
            return <Link href={getCategoryHref(category.id, lang)} key={category.id}><span>{category.name}</span><span className="discover-category-count" aria-label={`${count} ${zh ? "个产品" : "products"}`}>{count}</span><ArrowUpRight size={14} aria-hidden="true" /></Link>;
          })}</div>
        </section>

        <section className="marketing-container discover-utilities" aria-labelledby="utilities-heading">
          <div className="discover-section-heading"><div><span className="discover-kicker">MADE BY NAVOKIT</span><h2 id="utilities-heading">{zh ? "我们的随手工具" : "A few tools of our own"}</h2></div></div>
          <div className="discover-utility-grid">{utilities.map(product => <Link href={getProductHref(product, lang)} key={product.slug}><ProductLogo product={product} size={40} /><div><h3>{product.name}</h3><p>{product.tagline}</p></div><ArrowUpRight size={18} aria-hidden="true" /></Link>)}</div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
