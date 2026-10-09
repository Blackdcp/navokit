import { SITE_URL, SUPPORT_EMAIL } from "./site";

export type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** One publisher identity across languages; no invented people or affiliations. */
export function siteEntities() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization", "@id": ORGANIZATION_ID,
        name: "NavoKit", url: SITE_URL, logo: `${SITE_URL}/logo.png`, email: SUPPORT_EMAIL,
        description: "An independent, bilingual technology product discovery and content site. Navigation + tools.",
        publishingPrinciples: [`${SITE_URL}/en/editorial-policy`, `${SITE_URL}/zh/editorial-policy`],
        correctionsPolicy: `${SITE_URL}/en/editorial-policy#corrections`,
      },
      {
        "@type": "WebSite", "@id": WEBSITE_ID,
        name: "NavoKit", url: SITE_URL,
        publisher: { "@id": ORGANIZATION_ID }, inLanguage: ["en", "zh-CN"],
      },
    ],
  };
}

export function pageIdentity(url: string, lang: "en" | "zh") {
  return {
    "@id": `${url}#webpage`, url,
    inLanguage: lang === "zh" ? "zh-CN" : "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

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
