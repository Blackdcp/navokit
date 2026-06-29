export type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

export function safeJsonLd(value: JsonLdValue) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function breadcrumbList(items: Array<{ name: string; url: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
