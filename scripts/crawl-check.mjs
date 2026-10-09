#!/usr/bin/env node

// Read-only checks for public crawl/discovery signals. No search-engine submissions.
// Usage: node scripts/crawl-check.mjs [http://127.0.0.1:3001]
import { pathToFileURL } from "node:url";

if (["--help", "-h"].includes(process.argv[2])) {
  console.log("Usage: node scripts/crawl-check.mjs [http://127.0.0.1:3001]\nRead-only checks for bilingual sitemap/text-index coverage and category/editorial page metadata.");
  process.exit(0);
}
let base;
const site = "https://www.navokit.com";
const failures = [];
let checks = 0;

export function isRecordedDateCurrent(value, now = Date.now()) {
  const day = value.slice(0, 10);
  const dayTimestamp = Date.parse(day);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(dayTimestamp) || new Date(dayTimestamp).toISOString().slice(0, 10) !== day) return false;
  if (value === day) {
    const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
    const siteDay = ["year", "month", "day"].map(type => parts.find(part => part.type === type).value).join("-");
    return day <= siteDay;
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp <= now;
}

function check(ok, message) {
  checks++;
  if (!ok) failures.push(message);
}
function decode(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;|&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function attr(tag, name) {
  return decode(tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] || "");
}
async function get(path) {
  const response = await fetch(`${base}${path}`, { redirect: "manual", signal: AbortSignal.timeout(20000), headers: { "user-agent": "NavoKitCrawlCheck/1.0" } });
  return { response, text: await response.text() };
}
async function main() {
  if (process.argv.length > 3) throw new Error("Supply at most one http(s) base URL.");
  const supplied = new URL(process.argv[2] || "http://127.0.0.1:3001");
  if (!/^https?:$/.test(supplied.protocol) || supplied.username || supplied.password || supplied.search || supplied.hash || supplied.pathname !== "/") throw new Error("Use an http(s) origin without credentials, a path, or query parameters.");
  base = supplied.origin;
  const [robots, sitemap, llms] = await Promise.all([get("/robots.txt"), get("/sitemap.xml"), get("/llms.txt")]);
  for (const [path, result, mime] of [["/robots.txt", robots, "text/plain"], ["/sitemap.xml", sitemap, "application/xml"], ["/llms.txt", llms, "text/plain"]]) {
    check(result.response.status === 200, `${path}: expected 200, got ${result.response.status}`);
    check(result.response.headers.get("content-type")?.includes(mime), `${path}: expected ${mime}`);
  }
  check(/^User-Agent:\s*\*\s*$/im.test(robots.text), "robots.txt: missing general crawler policy");
  check(/^Allow:\s*\/\s*$/im.test(robots.text), "robots.txt: public pages should be crawlable");
  check(/^Disallow:\s*\/api\/\s*$/im.test(robots.text), "robots.txt: API exclusion missing");
  check(!/^Disallow:\s*\/\s*$/im.test(robots.text), "robots.txt: public crawling is blocked");
  check(robots.text.includes(`Sitemap: ${site}/sitemap.xml`), "robots.txt: missing canonical sitemap location");

  const entries = [...sitemap.text.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    url: decode(block.match(/<loc>([^<]+)<\/loc>/)?.[1] || ""),
    modified: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
    alternates: [...block.matchAll(/<xhtml:link\b[^>]*\/>/g)].map(([tag]) => ({ lang: attr(tag, "hreflang"), href: attr(tag, "href") })),
  }));
  const urls = new Set(entries.map(entry => entry.url));
  check(entries.length > 0 && urls.size === entries.length, "sitemap.xml: empty feed or duplicate URLs");
  for (const entry of entries) {
    const url = new URL(entry.url);
    check(url.origin === site && !url.search && !url.hash && /^\/(en|zh)(\/|$)/.test(url.pathname), `Noncanonical sitemap URL: ${entry.url}`);
    if (entry.modified) check(isRecordedDateCurrent(entry.modified), `Invalid/future lastModified: ${entry.url}`);
    for (const alternate of entry.alternates) check(urls.has(alternate.href), `Missing sitemap language counterpart: ${alternate.href}`);
    const counterpart = `${site}${url.pathname.replace(/^\/(en|zh)(?=\/|$)/, url.pathname.startsWith("/en") ? "/zh" : "/en")}`;
    const expectedAlternates = urls.has(counterpart) ? ["en", "zh", "x-default"] : [];
    check(expectedAlternates.every(lang => entry.alternates.some(item => item.lang === lang)) && entry.alternates.length === expectedAlternates.length, `Incomplete or unavailable hreflang pair: ${entry.url}`);
  }

  const textUrls = [...llms.text.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(([, url]) => url);
  const textUrlSet = new Set(textUrls);
  check(textUrls.length === textUrlSet.size, "llms.txt: duplicate links");
  check(textUrlSet.has(`${site}/sitemap.xml`), "llms.txt: missing sitemap");
  for (const url of textUrlSet) check(url === `${site}/sitemap.xml` || urls.has(url), `llms.txt links to a page outside the sitemap: ${url}`);
  for (const entry of entries.filter(entry => !/\/(privacy|terms)$/.test(entry.url))) check(textUrlSet.has(entry.url), `llms.txt missing public content: ${entry.url}`);

  const categoryEntries = entries.filter(entry => /\/(en|zh)\/categories\/[^/]+$/.test(entry.url));
  for (const lang of ["en", "zh"]) {
    check(categoryEntries.filter(entry => entry.url.startsWith(`${site}/${lang}/`)).length === 15, `Expected 15 ${lang} category pages in sitemap`);
    check(urls.has(`${site}/${lang}/editorial-policy`) && textUrlSet.has(`${site}/${lang}/editorial-policy`), `${lang} editorial policy must be discoverable`);
  }
  const pending = [...categoryEntries.map(entry => entry.url), `${site}/en/editorial-policy`, `${site}/zh/editorial-policy`];
  const pageCount = pending.length;
  async function worker() {
    while (pending.length) {
      const canonical = pending.shift();
      const path = new URL(canonical).pathname;
      try {
        const { response, text } = await get(path);
        check(response.status === 200, `${path}: expected 200, got ${response.status}`);
        check(!/noindex|nofollow/i.test(response.headers.get("x-robots-tag") || ""), `${path}: blocked by X-Robots-Tag`);
        const links = [...text.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => ({ rel: attr(tag, "rel"), lang: attr(tag, "hreflang"), href: attr(tag, "href") }));
        check(links.find(link => link.rel === "canonical")?.href === canonical, `${path}: incorrect canonical`);
        for (const lang of ["en", "zh", "x-default"]) {
          const alternate = links.find(link => link.rel === "alternate" && link.lang === lang);
          check(alternate?.href === `${site}${path.replace(/^\/(en|zh)(?=\/|$)/, `/${lang === "x-default" ? "en" : lang}`)}`, `${path}: incorrect ${lang} hreflang`);
        }
        const robotsTags = [...text.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => tag).filter(tag => ["robots", "googlebot"].includes(attr(tag, "name").toLowerCase()));
        check(!robotsTags.some(tag => /noindex|nofollow/i.test(attr(tag, "content"))), `${path}: blocked by meta robots`);
        check(/<h1\b[^>]*>[\s\S]*?<\/h1>/.test(text), `${path}: missing server-rendered heading`);
        if (path.includes("/categories/")) {
          const productLinks = new Set([...text.matchAll(/href="([^"#?]+)"/g)].map(([, href]) => decode(href)).filter(href => /^\/(en|zh)\/tools\/[^/]+$/.test(href)));
          check(productLinks.size >= 2, `${path}: category content needs crawlable product detail links`);
        }
      } catch (error) { check(false, `${path}: ${error.message}`); }
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`Crawl signals: ${entries.length} canonical sitemap pages; ${textUrls.length} bilingual text-index links; ${pageCount} category/editorial pages checked.`);
  if (failures.length) {
    failures.forEach(message => console.error(`FAIL ${message}`));
    console.error(`${failures.length} failed / ${checks} checks.`);
    process.exitCode = 1;
  } else console.log(`PASS ${checks} checks. Only public GET requests; no indexing submission was made.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(`Crawl check stopped: ${error.message}`); process.exitCode = 1; });
}
