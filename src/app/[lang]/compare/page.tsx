import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getCatalogProduct } from "@/lib/catalog";
import { getAlternativeEligibleSlugs, getAlternativesHref, getComparisonHref, getComparisons } from "@/lib/comparisons";
import { breadcrumbList, pageIdentity, safeJsonLd } from "@/lib/schema";
import { localizedCanonical, SITE_URL, siteSocialMetadata } from "@/lib/site";
import type { Locale } from "@/types/catalog";
import "@/components/catalog/catalog.css";
import "@/components/catalog/category-pages.css";
import "@/components/catalog/compare-pages.css";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const zh = lang === "zh";
  const title = zh
    ? "产品对比与替代方案总览 | NavoKit"
    : "Product Comparisons & Alternatives Directory | NavoKit";
  const description = zh
    ? "基于官方公开资料整理的热门 AI 与效率产品双品对比及同类替代方案，按支持平台、定价模式与适用场景快速决策。"
    : "Browse side-by-side product comparisons and verified alternatives on NavoKit. Compare platforms, pricing models, and documented use cases.";
  return {
    title,
    description,
    alternates: localizedCanonical(lang, "/compare"),
    ...siteSocialMetadata(lang, "/compare", title, description),
  };
}

export default async function CompareIndexPage({ params }: Props) {
  const { lang } = await params;
  const zh = lang === "zh";
  const comparisons = getComparisons();
  const alternativeSlugs = getAlternativeEligibleSlugs();
  const url = `${SITE_URL}/${lang}/compare`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        ...pageIdentity(url, lang),
        name: zh ? "产品对比与替代方案" : "Product Comparisons & Alternatives",
        description: zh
          ? "按产品、平台与定价模式对比同类科技与 AI 工具。"
          : "Side-by-side comparisons and alternatives for emerging technology and AI tools.",
        mainEntity: { "@id": `${url}#comparisons` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#comparisons`,
        name: zh ? "产品对比列表" : "Product comparisons",
        numberOfItems: comparisons.length,
        itemListElement: comparisons.map((pair, index) => {
          const left = getCatalogProduct(lang, pair.leftSlug);
          const right = getCatalogProduct(lang, pair.rightSlug);
          return {
            "@type": "ListItem",
            position: index + 1,
            name: `${left?.name ?? pair.leftSlug} vs ${right?.name ?? pair.rightSlug}`,
            url: `${SITE_URL}${getComparisonHref(pair.id, lang)}`,
          };
        }),
      },
      breadcrumbList([
        { name: "NavoKit", url: `${SITE_URL}/${lang}` },
        { name: zh ? "产品库" : "Products", url: `${SITE_URL}/${lang}/tools` },
        { name: zh ? "产品对比" : "Comparisons", url },
      ]),
    ],
  };

  return (
    <div className="site-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <SiteHeader lang={lang} />
      <main id="main-content" className="marketing-container cat-page">
        <nav className="cat-breadcrumb" aria-label={zh ? "面包屑导航" : "Breadcrumb"}>
          <Link href={`/${lang}`}>NavoKit</Link><span aria-hidden="true">/</span>
          <Link href={`/${lang}/tools`}>{zh ? "产品库" : "Products"}</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{zh ? "产品对比" : "Comparisons"}</span>
        </nav>

        <header className="cat-page-heading">
          <span className="cat-eyebrow">{zh ? "对比与选型" : "COMPARE & DECIDE"}</span>
          <h1>{zh ? "产品对比与同类替代方案" : "Product Comparisons & Alternatives"}</h1>
          <p>
            {zh
              ? "每一页均基于产品官网与开源仓库公开资料整理，列出支持平台、定价模式与核心适用边界，不做商业赞助排名。"
              : "Every page summarizes documented platforms, pricing models, and use-case boundaries from official product sources—no paid rankings."}
          </p>
        </header>

        <section className="cat-related" aria-labelledby="compare-pairs-heading">
          <div className="cat-section-heading">
            <h2 id="compare-pairs-heading">{zh ? `双品深度对比（${comparisons.length} 组）` : `Head-to-head comparisons (${comparisons.length})`}</h2>
          </div>
          <div className="geo-decision-grid">
            {comparisons.map(pair => {
              const left = getCatalogProduct(lang, pair.leftSlug);
              const right = getCatalogProduct(lang, pair.rightSlug);
              if (!left || !right) return null;
              return (
                <Link key={pair.id} href={getComparisonHref(pair.id, lang)} className="geo-decision-card geo-decision-card--link">
                  <h3><span>{left.name} vs {right.name}</span><ArrowUpRight size={15} aria-hidden="true" /></h3>
                  <p>{pair[lang].verdict}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="cat-related" aria-labelledby="alternatives-hub-heading">
          <div className="cat-section-heading">
            <h2 id="alternatives-hub-heading">{zh ? `按产品查找同类替代品（${alternativeSlugs.length} 款）` : `Browse alternatives by product (${alternativeSlugs.length})`}</h2>
          </div>
          <div className="geo-inline-links">
            {alternativeSlugs.map(slug => {
              const product = getCatalogProduct(lang, slug);
              if (!product) return null;
              return (
                <Link key={slug} className="geo-pill-link" href={getAlternativesHref(slug, lang)}>
                  <span>{zh ? `${product.name} 替代品` : `${product.name} alternatives`}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="cat-detail-section cat-source-section">
          <h2>{zh ? "收录与核验说明" : "Editorial standards"}</h2>
          <p>
            {zh
              ? "产品信息均来自官网与公开文档，具体功能与价格以各产品官方页面为准。"
              : "Product details are compiled from official documentation and repositories. Check each provider's site for current features and terms."}
          </p>
          <p><Link href={`/${lang}/editorial-policy`}>{zh ? "了解 NavoKit 收录与更正原则" : "Read NavoKit's editorial policy"}</Link></p>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
