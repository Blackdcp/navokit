"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { getProductKindLabel } from "@/lib/catalog";
import { getCategoryHref } from "@/lib/categoryRoutes";
import type { CatalogProduct, Locale, ProductCategory, ProductCategoryId, Topic } from "@/types/catalog";
import ProductCard from "./ProductCard";
import "./category-pages.css";

type Props = { products: CatalogProduct[]; categories: ProductCategory[]; topics: Topic[]; lang: Locale };

const productKinds = ["app", "api", "open-source", "hardware", "utility"] as const;
type DirectoryFilters = { q: string; category: ProductCategoryId | "all"; topic: string; kind: CatalogProduct["kind"] | "all" };

function readFilters(params: Pick<URLSearchParams, "get">, categories: ProductCategory[], topics: Topic[]): DirectoryFilters {
  return {
    q: params.get("q") ?? "",
    category: categories.find(item => item.id === params.get("category"))?.id ?? "all",
    topic: topics.find(item => item.id === params.get("topic"))?.id ?? "all",
    kind: productKinds.find(value => value === params.get("kind")) ?? "all",
  };
}

function normalizeParams(params: URLSearchParams, categories: ProductCategory[], topics: Topic[]) {
  const filters = readFilters(params, categories, topics);
  for (const key of ["q", "category", "topic", "kind"] as const) {
    const value = filters[key];
    if (!value || (key !== "q" && value === "all")) params.delete(key);
    else params.set(key, value);
  }
  return params.toString();
}

function replaceSearch(url: URL, search: string) {
  url.search = search;
  // Next.js syncs its search-param hook with native history, without an RSC fetch.
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

export default function ProductDirectory({ products, categories, topics, lang }: Props) {
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);
  const serializedParams = searchParams.toString();
  const { q: query, category, topic, kind } = readFilters(searchParams, categories, topics);

  useEffect(() => {
    const url = new URL(window.location.href);
    // An earlier render must never replace a newer keystroke or navigation.
    if (url.searchParams.toString() !== serializedParams) return;
    const normalized = normalizeParams(new URLSearchParams(serializedParams), categories, topics);
    if (normalized !== serializedParams) replaceSearch(url, normalized);
  }, [serializedParams, categories, topics]);

  const updateFilters = (changes: Partial<Record<keyof DirectoryFilters, string>>) => {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(changes)) url.searchParams.set(key, value);
    replaceSearch(url, normalizeParams(url.searchParams, categories, topics));
  };
  const zh = lang === "zh";
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const categoryIsEmpty = category !== "all" && !products.some(product => product.categoryIds.includes(category));
  const directoryIsEmpty = products.length === 0;
  const filtered = products.filter(product =>
    (category === "all" || product.categoryIds.includes(category)) &&
    (topic === "all" || product.topicIds.includes(topic)) &&
    (kind === "all" || product.kind === kind) &&
    (!normalizedQuery || [product.name, product.slug, product.tagline, product.description, product.bestFor ?? "", ...product.features, ...categories.filter(item => product.categoryIds.includes(item.id)).map(item => item.name)].join(" ").toLocaleLowerCase().includes(normalizedQuery))
  );
  const reset = () => {
    updateFilters({ q: "", category: "all", topic: "all", kind: "all" });
    searchRef.current?.focus();
  };
  const clearQuery = () => {
    updateFilters({ q: "" });
    searchRef.current?.focus({ preventScroll: true });
  };
  const clearTopic = () => {
    updateFilters({ topic: "all" });
    searchRef.current?.focus();
  };

  return (
    <section className="cat-directory" aria-label={zh ? "搜索和浏览产品" : "Search and browse products"}>
      <div className="cat-search-row">
        <div className="cat-search"><Search size={19} aria-hidden="true" /><label className="cat-sr-only" htmlFor="product-search">{zh ? "搜索产品" : "Search products"}</label><input ref={searchRef} id="product-search" type="search" value={query} onChange={event => updateFilters({ q: event.target.value })} placeholder={zh ? "搜索产品名称、用途或关键词…" : "Search by name, task, or keyword…"} />{query && <button type="button" onClick={clearQuery} aria-label={zh ? "清空搜索" : "Clear search"}><X size={17} aria-hidden="true" /></button>}</div>
        <div className="cat-select-wrap"><label className="cat-sr-only" htmlFor="product-kind">{zh ? "产品类型" : "Product type"}</label><select id="product-kind" value={kind} onChange={event => updateFilters({ kind: event.target.value })}><option value="all">{zh ? "所有类型" : "All types"}</option>{productKinds.map(value => <option key={value} value={value}>{getProductKindLabel(value, lang)}</option>)}</select></div>
      </div>
      <div className="cat-mobile-category"><label htmlFor="product-category">{zh ? "按行业分类" : "Explore categories"}</label><select id="product-category" value={category} onChange={event => updateFilters({ category: event.target.value })}><option value="all">{zh ? "全部产品" : "All products"} ({products.length})</option>{categories.map(item => <option value={item.id} key={item.id}>{item.name} ({products.filter(product => product.categoryIds.includes(item.id)).length})</option>)}</select></div>
      <div className="cat-directory-layout">
        <aside className="cat-category-nav"><h2>{zh ? "按行业分类" : "Explore categories"}</h2><div role="group" aria-label={zh ? "按行业分类筛选" : "Filter by industry category"}>
          <button className={category === "all" ? "cat-category-filter is-active" : "cat-category-filter"} onClick={() => updateFilters({ category: "all" })} aria-pressed={category === "all"}>{zh ? "全部产品" : "All products"}<span>{products.length}</span></button>
          {categories.map(item => <button className={category === item.id ? "cat-category-filter is-active" : "cat-category-filter"} key={item.id} onClick={() => updateFilters({ category: item.id })} aria-pressed={category === item.id}>{item.name}<span>{products.filter(product => product.categoryIds.includes(item.id)).length}</span></button>)}
        </div></aside>
        <div className="cat-directory-results">
          <div className="cat-results-bar"><p aria-live="polite">{zh ? `找到 ${filtered.length} 个产品` : `${filtered.length} ${filtered.length === 1 ? "product" : "products"} to explore`}</p>{(query || category !== "all" || topic !== "all" || kind !== "all") && <button onClick={reset}>{zh ? "重置筛选" : "Reset filters"}</button>}</div>
          {category !== "all" && <Link className="cat-category-intro-link" href={getCategoryHref(category, lang)}>{zh ? "查看分类介绍" : "Explore this category"}<ArrowRight size={15} aria-hidden="true" /></Link>}
          {topic !== "all" && <div className="cat-active-topic"><span>{zh ? "专题" : "Topic"}: {topics.find(item => item.id === topic)?.name}</span><button type="button" onClick={clearTopic} aria-label={zh ? "移除专题筛选" : "Remove topic filter"}><X size={15} aria-hidden="true" /></button></div>}
          {filtered.length > 0 ? <div className="cat-product-grid cat-product-grid--directory">{filtered.map(product => <ProductCard key={product.slug} product={product} lang={lang} />)}</div> : <div className="cat-empty"><Search size={28} aria-hidden="true" /><h2>{directoryIsEmpty ? (zh ? "产品库暂未收录产品" : "No products have been listed yet") : categoryIsEmpty ? (zh ? "该分类暂未收录产品" : "No products listed in this category yet") : (zh ? "还没有找到匹配的产品" : "No products match yet")}</h2><p>{directoryIsEmpty || categoryIsEmpty ? (zh ? "产品信息将在确认并审核后收录。你也可以通过提交入口推荐产品。" : "Products will be listed after review. You can suggest a product through the submission form.") : (zh ? "试试更短的关键词，或移除一些筛选条件。" : "Try a shorter search or remove a filter to explore more products.")}</p>{!directoryIsEmpty && <button className="cat-button cat-button--primary" onClick={reset}>{zh ? "查看已收录产品" : "View listed products"}</button>}</div>}
        </div>
      </div>
    </section>
  );
}
