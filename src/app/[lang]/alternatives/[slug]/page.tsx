import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/catalog/ProductCard";
import { getCatalogProduct, getPricingLabel, getProductCategories, getProductHref } from "@/lib/catalog";
import { getCategoryHref } from "@/lib/categoryRoutes";
import { getAlternativeEligibleSlugs, getAlternativesForProduct, getAlternativesHref, getComparisonHref, getComparisonsForProduct } from "@/lib/comparisons";
import { breadcrumbList, pageIdentity, safeJsonLd } from "@/lib/schema";
import { localizedCanonical, SITE_URL, siteSocialMetadata } from "@/lib/site";
import type { Locale } from "@/types/catalog";
import "@/components/catalog/catalog.css";
import "@/components/catalog/category-pages.css";
import "@/components/catalog/compare-pages.css";

type Props = { params: Promise<{ lang: Locale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAlternativeEligibleSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const data = getAlternativesForProduct(lang, slug);
  if (!data || data.alternatives.length < 2) notFound();
  const { product, alternatives } = data;
  const zh = lang === "zh";
  const title = zh
    ? `${product.name} 替代品与同类工具推荐（${alternatives.length} 款）| NavoKit`
    : `${product.name} Alternatives & Similar Tools (${alternatives.length} Options) | NavoKit`;
  const description = zh
    ? `浏览与 ${product.name} 同属相关分类的 ${alternatives.length} 款替代工具，按平台、定价模式与适用场景对比选择。`
    : `Compare ${alternatives.length} verified alternatives to ${product.name} across platforms, pricing models, and use cases on NavoKit.`;
  const path = `/alternatives/${slug}`;
  return {
    title,
    description,
    alternates: localizedCanonical(lang, path),
    ...siteSocialMetadata(lang, path, title, description),
  };
}

export default async function AlternativesPage({ params }: Props) {
  const { lang, slug } = await params;
  const data = getAlternativesForProduct(lang, slug);
  if (!data || data.alternatives.length < 2) notFound();
  const { product, alternatives } = data;
  const zh = lang === "zh";
  const categories = getProductCategories(lang).filter(category => product.categoryIds.includes(category.id));
  const comparisons = getComparisonsForProduct(slug);
  const url = `${SITE_URL}${getAlternativesHref(slug, lang)}`;
  const topNames = alternatives.slice(0, 3).map(item => item.name).join(zh ? "、" : ", ");

  const targetPlatforms = new Set(product.platforms ?? []);
  const freePeers = alternatives.filter(item => item.pricing === "free" || item.pricing === "freemium");
  const webPeers = alternatives.filter(item => item.platforms?.includes("Web"));
  const selfHostedPeers = alternatives.filter(item => item.platforms?.includes("Self-hosted"));
  const broaderPlatformPeers = alternatives.filter(item => (item.platforms ?? []).some(p => !targetPlatforms.has(p)));

  const diffPoints: string[] = [];
  if (freePeers.length > 0) {
    diffPoints.push(
      zh
        ? `提供免费或 Freemium 档位的同类产品：${freePeers.map(p => p.name).join("、")}。`
        : `Free or freemium options in this group: ${freePeers.map(p => p.name).join(", ")}.`,
    );
  }
  if (broaderPlatformPeers.length > 0) {
    const extraPlatforms = [...new Set(broaderPlatformPeers.flatMap(item => (item.platforms ?? []).filter(p => !targetPlatforms.has(p))))];
    diffPoints.push(
      zh
        ? `相比 ${product.name}（${product.platforms?.join(" · ") || "见详情"}），同类替代品额外覆盖了 ${extraPlatforms.join("、")} 平台。`
        : `Beyond ${product.name}'s platforms (${product.platforms?.join(", ") || "see details"}), alternatives add support for ${extraPlatforms.join(", ")}.`,
    );
  }
  if (selfHostedPeers.length > 0) {
    diffPoints.push(
      zh
        ? `支持自托管（Self-hosted）的替代方案：${selfHostedPeers.map(p => p.name).join("、")}。`
        : `Self-hosted alternatives available: ${selfHostedPeers.map(p => p.name).join(", ")}.`,
    );
  } else if (webPeers.length > 0 && !targetPlatforms.has("Web")) {
    diffPoints.push(
      zh
        ? `免安装、可直接在浏览器运行的网页端替代品：${webPeers.map(p => p.name).join("、")}。`
        : `Browser-based (Web) alternatives requiring no desktop install: ${webPeers.map(p => p.name).join(", ")}.`,
    );
  }

  const answerFirst = zh
    ? `如果你正在寻找 ${product.name}（${product.platforms?.join(" / ") || "多端"}，${getPricingLabel(product.pricing, lang)}）的替代方案，NavoKit 当前在同分类中收录了 ${alternatives.length} 款相关产品，包括 ${topNames}${freePeers.length > 0 ? `，其中 ${freePeers.length} 款提供免费或 Freemium 方案` : ""}。下表按平台与定价整理了核心差异。`
    : `Looking for alternatives to ${product.name} (${product.platforms?.join(" / ") || "multi-platform"}, ${getPricingLabel(product.pricing, lang)})? NavoKit lists ${alternatives.length} verified peers in overlapping categories—including ${topNames}${freePeers.length > 0 ? `—with ${freePeers.length} offering free or freemium tiers` : ""}. Compare platforms, pricing, and key differences below.`;

  const faqs = zh
    ? [
        {
          question: `${product.name} 有哪些常见替代工具？`,
          answer: `在 NavoKit 同类目录中，与 ${product.name} 场景相近的产品包括 ${topNames}${alternatives.length > 3 ? ` 等共 ${alternatives.length} 款` : ""}。`,
        },
        ...(freePeers.length > 0
          ? [{
              question: `有没有免费或提供 Freemium 的 ${product.name} 替代品？`,
              answer: `有。当前同分类中标注为免费或 Freemium 的替代产品包括：${freePeers.map(p => `${p.name}（${getPricingLabel(p.pricing, lang)}）`).join("、")}。具体免费额度请以各产品官网为准。`,
            }]
          : []),
        {
          question: `如何判断哪款 ${product.name} 替代品更适合我？`,
          answer: `建议先看支持平台（${product.name} 当前支持 ${product.platforms?.join("、") || "见详情"}），再结合是否需要网页版、自托管或免费档位筛选，并核对官网最新条款。`,
        },
      ]
    : [
        {
          question: `What are the closest alternatives to ${product.name} on NavoKit?`,
          answer: `NavoKit lists ${alternatives.length} peer products in overlapping categories, including ${topNames}.`,
        },
        ...(freePeers.length > 0
          ? [{
              question: `Are there free or freemium alternatives to ${product.name}?`,
              answer: `Yes. Peers listed with free or freemium pricing include ${freePeers.map(p => `${p.name} (${getPricingLabel(p.pricing, lang)})`).join(", ")}. Check each official website for current tier limits.`,
            }]
          : []),
        {
          question: `How should I compare ${product.name} alternatives?`,
          answer: `Compare platform coverage first (${product.name} lists ${product.platforms?.join(", ") || "see details"}), then filter by pricing model, browser vs. desktop availability, or self-hosted options.`,
        },
      ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        ...pageIdentity(url, lang),
        name: zh ? `${product.name} 替代品与同类产品` : `${product.name} Alternatives`,
        description: answerFirst,
        mainEntity: { "@id": `${url}#alternatives` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#alternatives`,
        name: zh ? `${product.name} 替代工具列表` : `${product.name} alternatives`,
        numberOfItems: alternatives.length,
        itemListElement: alternatives.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: `${SITE_URL}${getProductHref(item, lang)}`,
          description: item.tagline,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(faq => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      breadcrumbList([
        { name: "NavoKit", url: `${SITE_URL}/${lang}` },
        { name: zh ? "产品库" : "Products", url: `${SITE_URL}/${lang}/tools` },
        { name: product.name, url: `${SITE_URL}${getProductHref(product, lang)}` },
        { name: zh ? "替代品" : "Alternatives", url },
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
          <Link href={getProductHref(product, lang)}>{product.name}</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{zh ? "替代品" : "Alternatives"}</span>
        </nav>

        <header className="cat-page-heading">
          <span className="cat-eyebrow">{zh ? "同类替代方案" : "ALTERNATIVES"}</span>
          <h1>{zh ? `${product.name} 替代品与同类工具` : `${product.name} Alternatives & Similar Tools`}</h1>
          <p>{product.tagline}</p>
        </header>

        <section className="geo-answer-box" aria-label={zh ? "快速结论" : "Quick summary"}>
          <span className="geo-answer-box__label">{zh ? "快速结论" : "Quick summary"}</span>
          <p>{answerFirst}</p>
          {diffPoints.length > 0 && (
            <ul className="geo-answer-box__list">
              {diffPoints.map(point => <li key={point}>{point}</li>)}
            </ul>
          )}
        </section>

        <section className="cat-related" aria-labelledby="alternatives-table-heading">
          <div className="cat-section-heading">
            <h2 id="alternatives-table-heading">{zh ? "核心维度速览对比" : "At-a-glance comparison"}</h2>
          </div>
          <div className="cat-category-table-wrap" role="region" aria-label={zh ? "替代品对比表" : "Alternatives comparison table"} tabIndex={0}>
            <table className="cat-category-table">
              <thead>
                <tr>
                  <th scope="col">{zh ? "产品" : "Product"}</th>
                  <th scope="col">{zh ? "平台" : "Platforms"}</th>
                  <th scope="col">{zh ? "定价" : "Pricing"}</th>
                  <th scope="col">{zh ? "定位摘要" : "Summary"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row"><Link href={getProductHref(product, lang)}>{product.name} ({zh ? "当前基准" : "Reference"})</Link></th>
                  <td>{product.platforms?.join(" · ") || "—"}</td>
                  <td>{getPricingLabel(product.pricing, lang)}</td>
                  <td>{product.tagline}</td>
                </tr>
                {alternatives.map(item => (
                  <tr key={item.slug}>
                    <th scope="row"><Link href={getProductHref(item, lang)}>{item.name}</Link></th>
                    <td>{item.platforms?.join(" · ") || "—"}</td>
                    <td>{getPricingLabel(item.pricing, lang)}</td>
                    <td>{item.tagline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="cat-related" aria-labelledby="alternatives-cards-heading">
          <div className="cat-section-heading">
            <h2 id="alternatives-cards-heading">{zh ? `共 ${alternatives.length} 款同类产品` : `${alternatives.length} similar products to explore`}</h2>
          </div>
          <div className="cat-product-grid">
            {alternatives.map(item => <ProductCard key={item.slug} product={item} lang={lang} />)}
          </div>
        </section>

        {(comparisons.length > 0 || categories.length > 0) && (
          <section className="cat-related" aria-labelledby="alternatives-next-heading">
            <div className="cat-section-heading">
              <h2 id="alternatives-next-heading">{zh ? "深入对比与分类" : "Dive deeper"}</h2>
            </div>
            <div className="geo-inline-links">
              <Link className="geo-pill-link" href={getProductHref(product, lang)}>
                {zh ? `查看 ${product.name} 详情` : `${product.name} overview`}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
              {comparisons.map(pair => {
                const a = getCatalogProduct(lang, pair.leftSlug);
                const b = getCatalogProduct(lang, pair.rightSlug);
                if (!a || !b) return null;
                return (
                  <Link key={pair.id} className="geo-pill-link" href={getComparisonHref(pair.id, lang)}>
                    {a.name} vs {b.name}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                );
              })}
              {categories.map(category => (
                <Link key={category.id} className="geo-pill-link" href={getCategoryHref(category.id, lang)}>
                  {category.name}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="cat-related" aria-labelledby="alternatives-faq-heading">
          <div className="cat-section-heading">
            <h2 id="alternatives-faq-heading">{zh ? "常见问题" : "Frequently asked questions"}</h2>
          </div>
          <div className="geo-faq-list">
            {faqs.map(faq => (
              <div className="geo-faq-item" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cat-detail-section cat-source-section">
          <h2>{zh ? "说明与信息来源" : "Sources & editorial note"}</h2>
          <p>
            {zh
              ? "替代品列表基于 NavoKit 行业分类自动关联同场景已收录产品，不构成排名或商业背书。具体功能与条款以各产品官网为准。"
              : "Alternatives are grouped by overlapping NavoKit categories from verified catalog records. Listing order is not a ranking or paid endorsement; see each official site for current terms."}
          </p>
          <p><Link href={`/${lang}/editorial-policy`}>{zh ? "查看 NavoKit 编辑与收录原则" : "Read NavoKit's editorial policy"}</Link></p>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
