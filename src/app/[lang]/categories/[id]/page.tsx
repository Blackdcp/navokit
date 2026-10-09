import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/catalog/ProductCard";
import { getCatalogProducts, getProductCategories, getProductHref, getProductKindLabel } from "@/lib/catalog";
import { getCategoryHref } from "@/lib/categoryRoutes";
import { breadcrumbList, safeJsonLd } from "@/lib/schema";
import { localizedCanonical, siteSocialMetadata, SITE_URL } from "@/lib/site";
import type { Locale } from "@/types/catalog";
import "@/components/catalog/catalog.css";
import "@/components/catalog/category-pages.css";

type Props = { params: Promise<{ lang: Locale; id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProductCategories("en").map(category => ({ id: category.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const category = getProductCategories(lang).find(item => item.id === id);
  if (!category) notFound();
  const zh = lang === "zh";
  const title = zh ? `${category.name}产品与工具 | NavoKit` : `${category.name} products & tools | NavoKit`;
  const description = zh
    ? `${category.description}浏览 NavoKit 收录的${category.name}产品，比较用途、平台与使用条件，并查看官方来源。`
    : `${category.description} Explore ${category.name.toLowerCase()} products listed on NavoKit, compare platforms and requirements, and follow their official sources.`;
  return {
    title,
    description,
    alternates: localizedCanonical(lang, `/categories/${id}`),
    ...siteSocialMetadata(lang, `/categories/${id}`, title, description),
  };
}

export default async function CategoryPage({ params }: Props) {
  const { lang, id } = await params;
  const categories = getProductCategories(lang);
  const category = categories.find(item => item.id === id);
  if (!category) notFound();
  const zh = lang === "zh";
  const products = getCatalogProducts(lang).filter(product => product.categoryIds.includes(category.id));
  const others = categories.filter(item => item.id !== id);
  const url = `${SITE_URL}${getCategoryHref(category.id, lang)}`;
  const listId = `${url}#products`;
  const breadcrumbId = `${url}#breadcrumb`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: category.name,
        description: category.description,
        inLanguage: lang === "zh" ? "zh-CN" : "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntity: { "@id": listId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "ItemList",
        "@id": listId,
        name: category.name,
        numberOfItems: products.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          url: `${SITE_URL}${getProductHref(product, lang)}`,
          description: product.tagline,
        })),
      },
      {
        ...breadcrumbList([
          { name: "NavoKit", url: `${SITE_URL}/${lang}` },
          { name: zh ? "产品库" : "Products", url: `${SITE_URL}/${lang}/tools` },
          { name: category.name, url },
        ]),
        "@id": breadcrumbId,
      },
    ],
  };

  return <div className="site-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
    <SiteHeader lang={lang} />
    <main id="main-content" className="marketing-container cat-page">
      <nav className="cat-breadcrumb" aria-label={zh ? "面包屑导航" : "Breadcrumb"}>
        <Link href={`/${lang}`}>NavoKit</Link><span aria-hidden="true">/</span>
        <Link href={`/${lang}/tools`}>{zh ? "产品库" : "Products"}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{category.name}</span>
      </nav>
      <header className="cat-page-heading cat-category-heading">
        <span className="cat-eyebrow">{zh ? "按用途发现产品" : "EXPLORE BY CATEGORY"}</span>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <div className="cat-category-summary">
          <span>{zh ? `已收录 ${products.length} 个产品与工具` : `${products.length} listed products and tools`}</span>
          <Link href={`/${lang}/tools?category=${id}`}>{zh ? "在此分类中搜索" : "Search within this category"}<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </header>

      <section aria-labelledby="category-products">
        <div className="cat-section-heading"><h2 id="category-products">{zh ? "发现相关产品" : "Products to explore"}</h2></div>
        <div className="cat-product-grid">{products.map(product => <ProductCard key={product.slug} product={product} lang={lang} />)}</div>
      </section>

      <section className="cat-related" aria-labelledby="category-comparison">
        <div className="cat-section-heading"><h2 id="category-comparison">{zh ? "使用信息速览" : "At a glance"}</h2></div>
        <div className="cat-category-table-wrap" role="region" aria-label={zh ? "产品平台、类型与信息核验日期" : "Product platforms, types, and verification dates"} tabIndex={0}>
          <table className="cat-category-table">
            <caption>{zh ? "具体使用条件与功能说明，请查看各产品详情。" : "Open a product page for its features and specific requirements."}</caption>
            <thead><tr><th scope="col">{zh ? "产品" : "Product"}</th><th scope="col">{zh ? "平台" : "Platforms"}</th><th scope="col">{zh ? "类型" : "Type"}</th><th scope="col">{zh ? "信息核验" : "Information checked"}</th></tr></thead>
            <tbody>{products.map(product => <tr key={product.slug}>
              <th scope="row"><Link href={getProductHref(product, lang)}>{product.name}</Link></th>
              <td>{product.platforms?.join(" · ") || (zh ? "见产品详情" : "See product details")}</td>
              <td>{getProductKindLabel(product.kind, lang)}</td>
              <td>{product.verifiedAt ? <time dateTime={product.verifiedAt}>{product.verifiedAt}</time> : (zh ? "NavoKit 站内工具" : "NavoKit utility")}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="cat-related cat-detail-section cat-source-section" aria-labelledby="category-sources">
        <h2 id="category-sources">{zh ? "信息从哪里来" : "Where the information comes from"}</h2>
        <p>{zh ? "外部产品信息根据官网、官方文档或开源仓库整理，来源链接与核验日期保留在产品详情中。收录顺序不代表排名，功能表现未全部经过独立实测。平台支持、定价与可用性可能变化，请以官方最新说明为准。" : "External product information is based on official websites, documentation, or source repositories. Each product page retains its sources and check date. Listing order is not a ranking, and features have not all been independently tested. Check the official sources for current platform support, pricing, and availability."}</p>
      </section>

      <section className="cat-related" aria-labelledby="other-categories">
        <div className="cat-section-heading"><h2 id="other-categories">{zh ? "继续探索其他分类" : "Explore other categories"}</h2></div>
        <div className="cat-topic-links">{others.map(item => <Link href={getCategoryHref(item.id, lang)} key={item.id}><span>{item.name}</span><ArrowUpRight size={16} aria-hidden="true" /></Link>)}</div>
      </section>
    </main>
    <SiteFooter lang={lang} />
  </div>;
}
