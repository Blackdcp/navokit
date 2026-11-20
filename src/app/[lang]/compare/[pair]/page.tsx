import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/catalog/ProductCard";
import { getCatalogProduct, getPricingLabel, getProductCategories, getProductHref, getProductKindLabel } from "@/lib/catalog";
import { getCategoryHref } from "@/lib/categoryRoutes";
import { getAlternativeEligibleSlugs, getAlternativesHref, getComparison, getComparisonHref, getComparisons } from "@/lib/comparisons";
import { breadcrumbList, pageIdentity, safeJsonLd } from "@/lib/schema";
import { localizedCanonical, SITE_URL, siteSocialMetadata } from "@/lib/site";
import type { Locale } from "@/types/catalog";
import "@/components/catalog/catalog.css";
import "@/components/catalog/category-pages.css";
import "@/components/catalog/compare-pages.css";

type Props = { params: Promise<{ lang: Locale; pair: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getComparisons().map(item => ({ pair: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, pair } = await params;
  const entry = getComparison(pair);
  if (!entry) notFound();
  const left = getCatalogProduct(lang, entry.leftSlug);
  const right = getCatalogProduct(lang, entry.rightSlug);
  if (!left || !right) notFound();
  const zh = lang === "zh";
  const title = zh
    ? `${left.name} vs ${right.name} 对比：平台、价格与适用场景 | NavoKit`
    : `${left.name} vs ${right.name}: Platforms, Pricing & Key Differences | NavoKit`;
  const description = entry[lang].verdict;
  const path = `/compare/${pair}`;
  return {
    title,
    description,
    alternates: localizedCanonical(lang, path),
    ...siteSocialMetadata(lang, path, title, description),
  };
}

export default async function ComparePage({ params }: Props) {
  const { lang, pair } = await params;
  const entry = getComparison(pair);
  if (!entry) notFound();
  const left = getCatalogProduct(lang, entry.leftSlug);
  const right = getCatalogProduct(lang, entry.rightSlug);
  if (!left || !right) notFound();

  const zh = lang === "zh";
  const copy = entry[lang];
  const category = getProductCategories(lang).find(item => item.id === entry.categoryId);
  const eligibleAlternatives = new Set(getAlternativeEligibleSlugs());
  const otherComparisons = getComparisons().filter(item => item.id !== entry.id).slice(0, 4);
  const url = `${SITE_URL}${getComparisonHref(entry.id, lang)}`;
  const sources = [...new Set([left.website, right.website, left.repository, right.repository].filter((s): s is string => Boolean(s)))];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        ...pageIdentity(url, lang),
        name: zh ? `${left.name} vs ${right.name} 对比` : `${left.name} vs ${right.name} Comparison`,
        description: copy.verdict,
        citation: sources,
      },
      {
        "@type": "ItemList",
        "@id": `${url}#compared-products`,
        name: `${left.name} vs ${right.name}`,
        numberOfItems: 2,
        itemListElement: [left, right].map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          url: `${SITE_URL}${getProductHref(product, lang)}`,
          description: product.tagline,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: copy.faqs.map(faq => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      breadcrumbList([
        { name: "NavoKit", url: `${SITE_URL}/${lang}` },
        { name: zh ? "产品库" : "Products", url: `${SITE_URL}/${lang}/tools` },
        ...(category ? [{ name: category.name, url: `${SITE_URL}${getCategoryHref(category.id, lang)}` }] : []),
        { name: `${left.name} vs ${right.name}`, url },
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
          {category && (
            <>
              <Link href={getCategoryHref(category.id, lang)}>{category.name}</Link><span aria-hidden="true">/</span>
            </>
          )}
          <span aria-current="page">{left.name} vs {right.name}</span>
        </nav>

        <header className="cat-page-heading">
          <span className="cat-eyebrow">{zh ? "产品对比" : "PRODUCT COMPARISON"}</span>
          <h1>{left.name} vs {right.name}</h1>
          <p>{zh ? `基于官方公开资料整理 ${left.name} 与 ${right.name} 的平台覆盖、定价模式与核心适用场景。` : `Side-by-side comparison of ${left.name} and ${right.name} based on verified official product documentation.`}</p>
        </header>

        <section className="geo-answer-box" aria-label={zh ? "快速结论" : "Quick comparison summary"}>
          <span className="geo-answer-box__label">{zh ? "快速结论" : "Quick takeaway"}</span>
          <p>{copy.verdict}</p>
        </section>

        <section className="cat-related" aria-labelledby="compare-table-heading">
          <div className="cat-section-heading">
            <h2 id="compare-table-heading">{zh ? "核心参数对比" : "Side-by-side facts"}</h2>
          </div>
          <div className="cat-category-table-wrap" role="region" aria-label={zh ? "产品参数对比表" : "Product comparison table"} tabIndex={0}>
            <table className="cat-category-table">
              <thead>
                <tr>
                  <th scope="col">{zh ? "对比维度" : "Dimension"}</th>
                  <th scope="col"><Link href={getProductHref(left, lang)}>{left.name}</Link></th>
                  <th scope="col"><Link href={getProductHref(right, lang)}>{right.name}</Link></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{zh ? "一句话定位" : "Summary"}</th>
                  <td>{left.tagline}</td>
                  <td>{right.tagline}</td>
                </tr>
                <tr>
                  <th scope="row">{zh ? "产品形态" : "Type"}</th>
                  <td>{getProductKindLabel(left.kind, lang)}</td>
                  <td>{getProductKindLabel(right.kind, lang)}</td>
                </tr>
                <tr>
                  <th scope="row">{zh ? "支持平台" : "Platforms"}</th>
                  <td>{left.platforms?.join(" · ") || "—"}</td>
                  <td>{right.platforms?.join(" · ") || "—"}</td>
                </tr>
                <tr>
                  <th scope="row">{zh ? "定价模式" : "Pricing"}</th>
                  <td>{getPricingLabel(left.pricing, lang)}</td>
                  <td>{getPricingLabel(right.pricing, lang)}</td>
                </tr>
                <tr>
                  <th scope="row">{zh ? "适用人群" : "Best for"}</th>
                  <td>{left.bestFor || "—"}</td>
                  <td>{right.bestFor || "—"}</td>
                </tr>
                <tr>
                  <th scope="row">{zh ? "核验日期" : "Details checked"}</th>
                  <td>{left.verifiedAt || "—"}</td>
                  <td>{right.verifiedAt || "—"}</td>
                </tr>
                <tr>
                  <th scope="row">{zh ? "官方入口" : "Official site"}</th>
                  <td><a href={left.website} target="_blank" rel="noopener noreferrer">{left.name} <ArrowUpRight size={14} aria-hidden="true" /></a></td>
                  <td><a href={right.website} target="_blank" rel="noopener noreferrer">{right.name} <ArrowUpRight size={14} aria-hidden="true" /></a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="cat-related" aria-labelledby="compare-decision-heading">
          <div className="cat-section-heading">
            <h2 id="compare-decision-heading">{zh ? "怎么选？" : "Which one fits your workflow?"}</h2>
          </div>
          <div className="geo-decision-grid">
            <div className="geo-decision-card">
              <h3>{zh ? `适合优先看 ${left.name} 的情况` : `Choose ${left.name} if…`}</h3>
              <ul>
                {copy.chooseAIf.map(point => <li key={point}>{point}</li>)}
              </ul>
            </div>
            <div className="geo-decision-card">
              <h3>{zh ? `适合优先看 ${right.name} 的情况` : `Choose ${right.name} if…`}</h3>
              <ul>
                {copy.chooseBIf.map(point => <li key={point}>{point}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="cat-related" aria-labelledby="compare-profiles-heading">
          <div className="cat-section-heading">
            <h2 id="compare-profiles-heading">{zh ? "查看完整产品档案" : "Explore full product profiles"}</h2>
          </div>
          <div className="cat-product-grid">
            <ProductCard product={left} lang={lang} />
            <ProductCard product={right} lang={lang} />
          </div>
          <div className="geo-inline-links">
            {eligibleAlternatives.has(left.slug) && (
              <Link className="geo-pill-link" href={getAlternativesHref(left.slug, lang)}>
                {zh ? `更多 ${left.name} 替代品` : `${left.name} alternatives`}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            )}
            {eligibleAlternatives.has(right.slug) && (
              <Link className="geo-pill-link" href={getAlternativesHref(right.slug, lang)}>
                {zh ? `更多 ${right.name} 替代品` : `${right.name} alternatives`}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            )}
            {category && (
              <Link className="geo-pill-link" href={getCategoryHref(category.id, lang)}>
                {zh ? `浏览全部「${category.name}」` : `Browse all ${category.name}`}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            )}
          </div>
        </section>

        <section className="cat-related" aria-labelledby="compare-faq-heading">
          <div className="cat-section-heading">
            <h2 id="compare-faq-heading">{zh ? "常见问题" : "Frequently asked questions"}</h2>
          </div>
          <div className="geo-faq-list">
            {copy.faqs.map(faq => (
              <div className="geo-faq-item" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {otherComparisons.length > 0 && (
          <section className="cat-related" aria-labelledby="more-comparisons-heading">
            <div className="cat-section-heading">
              <h2 id="more-comparisons-heading">{zh ? "更多产品对比" : "More product comparisons"}</h2>
            </div>
            <div className="geo-inline-links">
              {otherComparisons.map(item => {
                const a = getCatalogProduct(lang, item.leftSlug);
                const b = getCatalogProduct(lang, item.rightSlug);
                if (!a || !b) return null;
                return (
                  <Link key={item.id} className="geo-pill-link" href={getComparisonHref(item.id, lang)}>
                    {a.name} vs {b.name}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="cat-detail-section cat-source-section">
          <h2>{zh ? "说明与信息来源" : "Sources & editorial note"}</h2>
          <p>
            {zh
              ? "本对比页仅基于各产品官网与公开仓库资料整理，不包含主观打分或商业赞助排序。最新价格与功能请以各产品官网为准。"
              : "This comparison summarizes documented facts from official product sites and repositories. Inclusion is not a paid placement or hands-on benchmark score; verify current plans on each official website."}
          </p>
          <p><Link href={`/${lang}/editorial-policy`}>{zh ? "查看 NavoKit 编辑与收录原则" : "Read NavoKit's editorial policy"}</Link></p>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
