#!/usr/bin/env node

// Read-only HTTP checks. No JavaScript execution, product API calls, or submissions.
// Usage: node scripts/geo-audit.mjs [http://127.0.0.1:3001]
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const site = "https://www.navokit.com";
const organizationId = `${site}/#organization`;
const websiteId = `${site}/#website`;
const moduleCache = new Map();
const pageCache = new Map();
const failures = [];
let checks = 0;

function check(condition, message) {
  checks++;
  if (!condition) failures.push(message);
}

// Only data modules may be evaluated; environment files, app routes, and npm
// imports are excluded. Type-only imports are removed by the TS compiler.
function loadData(filename) {
  const fullPath = path.resolve(filename);
  const relative = path.relative(root, fullPath).split(path.sep).join("/");
  if (!/^src\/lib\/(?:catalog\.ts|productMedia\.ts|catalog-expansion\/[\w-]+\.ts)$/.test(relative)) throw new Error(`Unexpected data dependency: ${relative}`);
  if (moduleCache.has(fullPath)) return moduleCache.get(fullPath).exports;
  const compiledModule = { exports: {} };
  moduleCache.set(fullPath, compiledModule);
  const { outputText } = ts.transpileModule(readFileSync(fullPath, "utf8"), {
    fileName: fullPath, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const localRequire = id => {
    const resolved = id.startsWith("@/") ? path.join(root, "src", id.slice(2))
      : id.startsWith(".") ? path.resolve(path.dirname(fullPath), id) : null;
    if (!resolved) throw new Error(`Non-local data import: ${id}`);
    return loadData(resolved.endsWith(".ts") ? resolved : `${resolved}.ts`);
  };
  new vm.Script(outputText, { filename: fullPath }).runInNewContext({ module: compiledModule, exports: compiledModule.exports, require: localRequire }, { timeout: 3000 });
  return compiledModule.exports;
}

function decode(value = "") {
  return value.replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(([, key, double, single]) => [key.toLowerCase(), decode(double ?? single)]));
}
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(match => attributes(match[0]));
const visibleText = html => decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const sameSet = (left, right) => left.size === right.size && [...left].every(value => right.has(value));
const hasType = (object, type) => [object?.["@type"]].flat().includes(type);
const referenceId = object => typeof object === "string" ? object : object?.["@id"];
const values = value => Array.isArray(value) ? value : value ? [value] : [];
const urls = value => values(value).map(item => typeof item === "string" ? item : item?.url ?? item?.["@id"]).filter(Boolean);

function objects(value) {
  if (!value || typeof value !== "object") return [];
  return [value, ...Object.values(value).flatMap(objects)];
}

async function getPage(base, pathname) {
  if (!pageCache.has(pathname)) pageCache.set(pathname, (async () => {
    const response = await fetch(`${base}${pathname}`, {
      redirect: "manual", signal: AbortSignal.timeout(20000), headers: { "user-agent": "NavoKitGeoAudit/1.0" },
    });
    const html = await response.text();
    const entities = [];
    for (const [, raw] of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try { entities.push(...objects(JSON.parse(raw.trim()))); }
      catch (error) { check(false, `${pathname}: invalid JSON-LD (${error.message})`); }
    }
    const dom = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
    return { status: response.status, html, dom, entities };
  })());
  return pageCache.get(pathname);
}

function basicPage(page, pathname) {
  const canonical = `${site}${pathname}`;
  check(page.status === 200, `${pathname}: expected 200, got ${page.status}`);
  check(tags(page.dom, "link").find(item => item.rel === "canonical")?.href === canonical, `${pathname}: self canonical`);
  check(!tags(page.dom, "meta").some(item => /^(robots|googlebot)$/i.test(item.name) && /noindex|nofollow/i.test(item.content)), `${pathname}: indexable`);
  const footer = page.dom.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1] || "";
  const lang = pathname.split("/")[1];
  check(tags(footer, "a").some(item => item.href === `/${lang}/editorial-policy`), `${pathname}: visible editorial policy footer link`);
}

function checkIdentity(page, pathname) {
  const organizations = page.entities.filter(item => hasType(item, "Organization"));
  const websites = page.entities.filter(item => hasType(item, "WebSite"));
  check(organizations.length > 0 && organizations.every(item => item["@id"] === organizationId) && organizations.some(item => item.name === "NavoKit" && item.url === site), `${pathname}: one stable NavoKit Organization identity`);
  check(websites.length === 1 && websites[0]["@id"] === websiteId && referenceId(websites[0].publisher) === organizationId, `${pathname}: one WebSite linked to publisher`);
}

function checkPageEntity(entity, pathname) {
  check(entity?.["@id"] === `${site}${pathname}#webpage`, `${pathname}: stable page identity`);
  check(referenceId(entity?.publisher) === organizationId && referenceId(entity?.isPartOf) === websiteId, `${pathname}: publisher and WebSite references`);
}

async function auditCategory(base, catalog, lang, category) {
  const pathname = `/${lang}/categories/${category.id}`;
  const page = await getPage(base, pathname);
  basicPage(page, pathname);
  const alternates = tags(page.dom, "link").filter(item => item.rel === "alternate");
  for (const language of ["en", "zh", "x-default"]) check(alternates.some(item => item.hreflang === language && item.href === `${site}/${language === "x-default" ? "en" : language}/categories/${category.id}`), `${pathname}: ${language} alternate`);
  check(visibleText(page.dom.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "") === category.name, `${pathname}: localized SSR heading`);
  const expected = catalog.getCatalogProducts(lang).filter(product => product.categoryIds.includes(category.id));
  const expectedUrls = new Set(expected.map(product => `${site}${catalog.getProductHref(product, lang)}`));
  const productSection = page.dom.match(/<section\b[^>]*aria-labelledby="category-products"[^>]*>([\s\S]*?)<\/section>/i)?.[1] || "";
  const actualUrls = new Set(tags(productSection, "a").filter(item => item.class?.split(/\s+/).includes("cat-product-card")).map(item => new URL(item.href, site).href));
  check(sameSet(actualUrls, expectedUrls), `${pathname}: SSR cards match category membership`);
  check(expected.every(product => visibleText(productSection).includes(product.name) && visibleText(productSection).includes(product.tagline)), `${pathname}: product names and descriptions are readable without JavaScript`);
  const collection = page.entities.find(item => hasType(item, "CollectionPage") && item.url === `${site}${pathname}`);
  const list = page.entities.find(item => hasType(item, "ItemList") && item["@id"] === referenceId(collection?.mainEntity));
  checkPageEntity(collection, pathname);
  check(list?.numberOfItems === expected.length && list?.itemListOrder === "https://schema.org/ItemListUnordered", `${pathname}: honest unordered product list`);
  check(sameSet(new Set(values(list?.itemListElement).map(item => item.url ?? item.item?.url)), actualUrls), `${pathname}: ItemList and visible cards agree`);
  check(page.entities.some(item => hasType(item, "BreadcrumbList") && item["@id"] === referenceId(collection?.breadcrumb)), `${pathname}: linked breadcrumb schema`);
}

async function auditProduct(base, catalog, media, lang, slug) {
  const product = catalog.getCatalogProduct(lang, slug);
  const pathname = catalog.getProductHref(product, lang);
  const page = await getPage(base, pathname);
  basicPage(page, pathname);
  checkIdentity(page, pathname);
  const webpage = page.entities.find(item => hasType(item, "WebPage") && item.url === `${site}${pathname}`);
  checkPageEntity(webpage, pathname);
  check(webpage?.lastReviewed === product.verifiedAt, `${pathname}: check date is identified as lastReviewed`);
  const aboutId = referenceId(webpage?.about);
  const entity = page.entities.find(item => item["@id"] === aboutId && item["@type"]);
  check(Boolean(aboutId) && referenceId(webpage?.mainEntity) === aboutId, `${pathname}: mainEntity and about share the product identity`);
  check(hasType(entity, product.kind === "hardware" ? "Product" : "SoftwareApplication") && entity?.name === product.name && entity?.url === product.website, `${pathname}: correct software or hardware identity`);
  check(urls(entity?.image).includes(`${site}${media[slug].image}`), `${pathname}: product schema uses its actual preview image`);
  const visibleLinks = new Set(tags(page.dom, "a").map(item => item.href));
  const officialLinks = [product.website, product.repository, product.launchSource].filter(Boolean);
  const provenance = new Set([...product.sourceUrls, ...officialLinks]);
  const citations = new Set([...urls(webpage?.citation), ...urls(entity?.citation)]);
  check(officialLinks.every(url => visibleLinks.has(url)), `${pathname}: official website, repository, and launch record links remain visible when recorded`);
  check(citations.has(product.website) && [...citations].every(url => visibleLinks.has(url) && provenance.has(url)), `${pathname}: citations use visible links with recorded provenance`);
  check(visibleText(page.dom).includes(product.description) && visibleText(page.dom).includes(product.verifiedAt), `${pathname}: description and check date are server-rendered`);
}

async function auditArticle(base, lang) {
  const pathname = `/${lang}/blog/how-to-convert-markdown-to-png`;
  const page = await getPage(base, pathname);
  basicPage(page, pathname);
  checkIdentity(page, pathname);
  const webpage = page.entities.find(item => hasType(item, "WebPage") && item.url === `${site}${pathname}`);
  const article = page.entities.find(item => hasType(item, "BlogPosting"));
  checkPageEntity(webpage, pathname);
  check(Boolean(article?.["@id"]) && referenceId(webpage?.mainEntity) === article["@id"] && referenceId(article?.mainEntityOfPage) === webpage["@id"], `${pathname}: WebPage and BlogPosting are linked both ways`);
  check(referenceId(article?.publisher) === organizationId, `${pathname}: article has the shared publisher`);
  const ogImage = tags(page.dom, "meta").find(item => item.property === "og:image")?.content;
  check(Boolean(ogImage) && urls(article?.image).includes(ogImage) && ogImage.startsWith(`${site}/article-covers/`), `${pathname}: article-specific OG and schema image agree`);
  const header = page.dom.match(/<header\b[^>]*class="[^"]*reading-header[^"]*"[^>]*>([\s\S]*?)<\/header>/i)?.[1] || "";
  const byline = tags(header, "a").find(item => item.rel?.split(/\s+/).includes("author") || item.href === `/${lang}/editorial-policy`);
  check(Boolean(byline) && /NavoKit/.test(visibleText(header)), `${pathname}: visible linked publisher byline`);
  const body = page.dom.match(/<div\b[^>]*class="[^"]*reading-body[^"]*"[^>]*>([\s\S]*?)<section\b[^>]*class="[^"]*reading-record/i)?.[1] || "";
  check(visibleText(body).length > 600 && /<h2\b/i.test(body) && /<p\b/i.test(body), `${pathname}: substantial article body is readable without JavaScript`);
  const headingIds = [...page.dom.matchAll(/<h[1-6]\b[^>]*>/gi)].map(match => attributes(match[0]).id).filter(Boolean);
  const anchors = new Set(tags(page.dom, "a").map(item => item.href).filter(href => href?.startsWith("#section-")));
  check(anchors.size > 1 && [...anchors].every(href => headingIds.includes(decodeURIComponent(href.slice(1)))), `${pathname}: every contents anchor resolves to a server-rendered heading`);
  check(new Set(headingIds).size === headingIds.length, `${pathname}: heading IDs are unique`);
}

async function main() {
  const arg = process.argv[2];
  if (arg === "--help" || arg === "-h") return console.log("Usage: node scripts/geo-audit.mjs [http://127.0.0.1:3001]\nPublic GET requests only; no JavaScript execution or submissions.");
  const base = new URL(arg || "http://127.0.0.1:3001");
  if (process.argv.length > 3 || !["http:", "https:"].includes(base.protocol) || base.username || base.password || base.pathname !== "/" || base.search || base.hash) throw new Error("Supply at most one http(s) origin, without credentials or a path.");
  const catalog = loadData(path.join(root, "src/lib/catalog.ts"));
  const { productMedia } = loadData(path.join(root, "src/lib/productMedia.ts"));
  const jobs = ["en", "zh"].flatMap(lang => catalog.getProductCategories(lang).map(category => () => auditCategory(base.origin, catalog, lang, category)));
  await Promise.all(Array.from({ length: 4 }, async () => { while (jobs.length) await jobs.shift()(); }));
  for (const lang of ["en", "zh"]) {
    const missingPath = `/${lang}/categories/not-a-real-category`;
    check((await getPage(base.origin, missingPath)).status === 404, `${missingPath}: unlisted category returns 404`);
    await Promise.all(["flora", "omi"].map(slug => auditProduct(base.origin, catalog, productMedia, lang, slug)));
    await auditArticle(base.origin, lang);
    for (const suffix of ["", "/about", "/editorial-policy"]) {
      const pathname = `/${lang}${suffix}`;
      const page = await getPage(base.origin, pathname);
      basicPage(page, pathname);
      checkIdentity(page, pathname);
      if (!suffix) {
        const links = new Set(tags(page.dom, "a").map(item => item.href));
        check(catalog.getProductCategories(lang).every(category => links.has(`/${lang}/categories/${category.id}`)), `${pathname}: all category pages have crawlable homepage links`);
      }
      if (suffix === "/editorial-policy") check(visibleText(page.dom).length > 600 && tags(page.dom, "a").some(item => item.href === `/${lang}/contact`), `${pathname}: substantive editorial and correction information`);
    }
  }
  if (failures.length) {
    failures.forEach(message => console.error(`FAIL ${message}`));
    console.error(`${failures.length} failures / ${checks} checks across ${pageCache.size} public pages.`);
    process.exitCode = 1;
  } else console.log(`PASS ${checks} GEO checks across ${pageCache.size} public pages. HTML and linked entities agree; no JavaScript or external submissions were used.`);
}

main().catch(error => { console.error(`GEO audit stopped: ${error.message}`); process.exitCode = 1; });
