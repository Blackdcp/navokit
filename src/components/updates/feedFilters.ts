export type FeedKind = "all" | "article" | "launch";

export interface FeedFilters {
  query: string;
  kind: FeedKind;
  topic: string;
}

export function readFeedFilters(params: Pick<URLSearchParams, "get">, topics: readonly { id: string }[], archive = false): FeedFilters {
  const kind = params.get("type");
  return {
    query: params.get("q") ?? "",
    topic: topics.find(topic => topic.id === params.get("topic"))?.id ?? "all",
    kind: !archive && (kind === "article" || kind === "launch") ? kind : "all",
  };
}

/** Preserve unrelated parameters and fragments while replacing feed filters. */
export function getFeedFilterUrl(currentUrl: string, filters: FeedFilters) {
  const url = new URL(currentUrl);
  for (const [key, value] of [
    ["q", filters.query.trim() ? filters.query : ""],
    ["topic", filters.topic === "all" ? "" : filters.topic],
    ["type", filters.kind === "all" ? "" : filters.kind],
  ]) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  return `${url.pathname}${url.search}${url.hash}`;
}
