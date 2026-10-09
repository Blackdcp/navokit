"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Rocket, Search, X } from "lucide-react";
import type { DiscoveryUpdate } from "../../lib/discovery";
import { getCatalogProduct } from "../../lib/catalog";
import ProductLogo from "../catalog/ProductLogo";
import ArticleCover from "./ArticleCover";
import TopicFilter from "./TopicFilter";
import { getFeedFilterUrl, readFeedFilters, type FeedFilters, type FeedKind } from "./feedFilters";

const PAGE_SIZE = 12;

export default function UpdatesFeed({ lang, entries, topics, archive = false }: {
  lang: "en" | "zh";
  entries: DiscoveryUpdate[];
  topics: { id: string; name: string }[];
  archive?: boolean;
}) {
  const zh = lang === "zh";
  const searchParams = useSearchParams();
  const filtersRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const entryLinks = useRef<(HTMLAnchorElement | null)[]>([]);
  const nextEntryFocus = useRef<number | null>(null);
  const { query, kind, topic } = readFeedFilters(searchParams, topics, archive);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => {
    if (nextEntryFocus.current === null) return;
    entryLinks.current[nextEntryFocus.current]?.focus();
    nextEntryFocus.current = null;
  }, [visibleCount]);
  const matchingEntries = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return entries.filter(entry => {
      const topicNames = topics.filter(item => entry.topicIds.includes(item.id)).map(item => item.name).join(" ");
      return (kind === "all" || entry.kind === kind)
        && (!needle || `${entry.title} ${entry.description} ${entry.label} ${entry.sourceLabel} ${topicNames}`.toLocaleLowerCase().includes(needle));
    });
  }, [entries, kind, query, topics]);
  const filtered = useMemo(() => topic === "all" ? matchingEntries : matchingEntries.filter(entry => entry.topicIds.includes(topic)), [matchingEntries, topic]);
  const topicOptions = useMemo(() => [
    { id: "all", name: zh ? "所有专题" : "All topics", count: matchingEntries.length },
    ...topics.map(item => ({ ...item, count: matchingEntries.filter(entry => entry.topicIds.includes(item.id)).length })),
  ], [matchingEntries, topics, zh]);
  const selectedTopic = topics.find(item => item.id === topic);
  const hasFilters = query.trim().length > 0 || kind !== "all" || topic !== "all";
  const tabs: { value: FeedKind; name: string }[] = [
    { value: "all", name: zh ? "全部动态" : "All updates" },
    { value: "launch", name: zh ? "产品发布" : "Product launches" },
    { value: "article", name: zh ? "文章" : "Articles" },
  ];

  function updateFilters(changes: Partial<FeedFilters>) {
    const url = new URL(window.location.href);
    const next = { ...readFeedFilters(url.searchParams, topics, archive), ...changes };
    nextEntryFocus.current = null;
    setVisibleCount(PAGE_SIZE);
    // Native history integrates with Next's router without remounting this
    // input or issuing a server navigation for every typed character.
    window.history.replaceState(null, "", getFeedFilterUrl(url.href, next));
  }

  function resetFilters() {
    updateFilters({ query: "", kind: "all", topic: "all" });
    searchRef.current?.focus({ preventScroll: true });
  }

  function clearTopic() {
    updateFilters({ topic: "all" });
    filtersRef.current?.querySelector<HTMLButtonElement>(".updates-topic-trigger")?.focus({ preventScroll: true });
  }

  function clearQuery() {
    updateFilters({ query: "" });
    searchRef.current?.focus({ preventScroll: true });
  }

  function loadMore() {
    nextEntryFocus.current = visibleCount;
    setVisibleCount(count => count + PAGE_SIZE);
  }

  return (
    <div className={`updates-feed${archive ? " updates-feed--archive" : ""}`}>
      <div ref={filtersRef} className="updates-filters">
        {!archive && (
          <div className="updates-tabs" role="group" aria-label={zh ? "动态类型" : "Update type"}>
            {tabs.map(tab => (
              <button key={tab.value} type="button" aria-pressed={kind === tab.value} onClick={() => updateFilters({ kind: tab.value })}>
                {tab.name}<span>{tab.value === "all" ? entries.length : entries.filter(entry => entry.kind === tab.value).length}</span>
              </button>
            ))}
          </div>
        )}
        <div className="updates-search-row">
          <label className="updates-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">{zh ? "搜索内容" : "Search content"}</span>
            <input ref={searchRef} type="search" value={query} placeholder={zh ? "搜索产品、文章或主题" : "Search products, articles, or topics"} onChange={event => updateFilters({ query: event.target.value })} />
          </label>
          <TopicFilter lang={lang} value={topic} options={topicOptions} onChange={nextTopic => updateFilters({ topic: nextTopic })} />
        </div>
        {(selectedTopic || query.trim()) && <div className="updates-active-filters" role="group" aria-label={zh ? "当前筛选" : "Active filters"}>
          {selectedTopic && <button type="button" onClick={clearTopic} aria-label={zh ? `清除专题筛选：${selectedTopic.name}` : `Remove topic filter: ${selectedTopic.name}`}><span>{selectedTopic.name}</span><X size={14} aria-hidden="true" /></button>}
          {query.trim() && <button type="button" onClick={clearQuery} aria-label={zh ? `清除搜索：${query}` : `Clear search: ${query}`}><Search size={13} aria-hidden="true" /><span>{query}</span><X size={14} aria-hidden="true" /></button>}
        </div>}
        <div className="updates-results-meta">
          <span role="status" aria-live="polite">{zh ? `${filtered.length} 条内容 · 按日期排序` : `${filtered.length} ${filtered.length === 1 ? "entry" : "entries"} · Newest first`}</span>
          {hasFilters && <button type="button" onClick={resetFilters}><X size={14} aria-hidden="true" />{zh ? "清除筛选" : "Clear filters"}</button>}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="updates-list">
          {filtered.slice(0, visibleCount).map((entry, index) => {
            const product = entry.kind === "launch" && entry.productIds?.[0] ? getCatalogProduct(lang, entry.productIds[0]) : undefined;
            return (
            <article key={entry.id} className={`updates-entry updates-entry--${entry.kind}`}>
              {entry.kind === "article" ? (
                <Link className="updates-entry__cover" href={entry.href} tabIndex={-1} aria-hidden="true">
                  <ArticleCover slug={entry.id.replace(/^article:/, "")} title={entry.title} lang={lang} compact={!archive} priority={archive ? index < 2 : index === 0} />
                </Link>
              ) : (
                <div className="updates-entry__marker" aria-hidden="true">
                  {product ? <ProductLogo product={product} size={48} /> : <Rocket size={19} />}
                </div>
              )}
              <div className="updates-entry__body">
                <div className="updates-entry__meta">
                  <span className="updates-entry__label">{entry.label}</span>
                  <span>{entry.dateLabel} <time dateTime={entry.date}>{entry.date.slice(0, 10)}</time></span>
                </div>
                <h2><Link ref={element => { entryLinks.current[index] = element; }} href={entry.href}>{entry.title}<ArrowUpRight size={19} aria-hidden="true" /></Link></h2>
                <p>{entry.description}</p>
                <div className="updates-entry__footer">
                  <div className="updates-entry__topics">
                    {entry.topicIds.map(id => {
                      const matched = topics.find(item => item.id === id);
                      return matched ? <Link key={id} href={`/${lang}/topics/${id}`}>{matched.name}</Link> : null;
                    })}
                  </div>
                  {entry.sourceUrl ? (
                    <a className="updates-entry__source" href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">{zh ? "查看发布来源" : "View launch source"}<ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> · {entry.sourceLabel}{zh ? "（在新标签页打开）" : " (opens in a new tab)"}</span></a>
                  ) : <span className="updates-entry__publisher">{entry.sourceLabel}</span>}
                </div>
              </div>
            </article>
          );})}
        </div>
      ) : (
        <div className="updates-empty">
          <Search size={28} aria-hidden="true" />
          <h2>{zh ? "没有找到匹配内容" : "No matching entries"}</h2>
          <p>{zh ? "这个筛选下暂时没有内容。试试其他关键词或专题。" : "There are no entries for this selection yet. Try another keyword or topic."}</p>
          <button type="button" className="button button--ink" onClick={resetFilters}>{zh ? "查看全部内容" : "Show all entries"}</button>
        </div>
      )}

      {visibleCount < filtered.length && (
        <div className="updates-load-more">
          <p>{zh ? `已显示 ${Math.min(visibleCount, filtered.length)} / ${filtered.length} 条` : `Showing ${Math.min(visibleCount, filtered.length)} of ${filtered.length}`}</p>
          <button type="button" className="button button--secondary" onClick={loadMore}>{zh ? "加载更多" : "Load more"}<span aria-hidden="true">↓</span></button>
        </div>
      )}
    </div>
  );
}
