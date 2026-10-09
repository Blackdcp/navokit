#!/usr/bin/env node

// Usage: node scripts/catalog-check.mjs [http://127.0.0.1:3001]
// Without a URL this checks local data and assets only. HTTP mode issues GETs
// only to the supplied site's public detail pages, sitemap and llms.txt.
import { readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicRoot = realpathSync(path.join(root, "public"));
const cache = new Map();
const failures = [];
let checks = 0;

function check(condition, message) {
  checks++;
  if (!condition) failures.push(message);
}

// Deliberately load only catalog data modules. No arbitrary require(), app
// routes, environment files, browser code, product APIs or side effects.
function loadData(filename) {
  const fullPath = path.resolve(filename);
  const relative = path.relative(root, fullPath).split(path.sep).join("/");
  if (!/^src\/lib\/(?:catalog\.ts|productMedia\.ts|catalog-expansion\/[\w-]+\.ts)$/.test(relative)) {
    throw new Error(`Unexpected catalog dependency: ${relative}`);
  }
  if (cache.has(fullPath)) return cache.get(fullPath).exports;
  const compiledModule = { exports: {} };
  cache.set(fullPath, compiledModule);
  const { outputText } = ts.transpileModule(readFileSync(fullPath, "utf8"), {
    fileName: fullPath,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const localRequire = id => {
    const resolved = id.startsWith("@/") ? path.join(root, "src", id.slice(2))
      : id.startsWith(".") ? path.resolve(path.dirname(fullPath), id)
        : null;
    if (!resolved) throw new Error(`Non-local catalog import: ${id}`);
    return loadData(resolved.endsWith(".ts") ? resolved : `${resolved}.ts`);
  };
  new vm.Script(outputText, { filename: fullPath }).runInNewContext({ module: compiledModule, exports: compiledModule.exports, require: localRequire }, { timeout: 3000 });
  return compiledModule.exports;
}

const present = value => typeof value === "string" && value.trim().length > 0;
const validDate = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const httpUrl = value => {
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
};
const host = value => new URL(value).hostname.replace(/^www\./, "");
const hasOfficialSource = (product, urls) => urls.some(url => httpUrl(url)
  && (host(url) === host(product.website) || (product.repository && url === product.repository)));

async function inspectImage(asset, label) {
  try {
    if (!present(asset) || !asset.startsWith("/") || asset.startsWith("//") || /[?#]/.test(asset)) {
      throw new Error("expected a local public asset path");
    }
    const file = realpathSync(path.join(publicRoot, asset));
    if (!file.startsWith(`${publicRoot}${path.sep}`)) throw new Error("asset escapes public directory");
    const metadata = await sharp(file).metadata();
    if (!metadata.width || !metadata.height) throw new Error("image has no dimensions");
    // Actual decoding, beyond a readable filename or image header.
    await sharp(file).resize(1, 1).raw().toBuffer();
    check(true, label);
  } catch (error) {
    check(false, `${label}: ${error.message}`);
  }
}

function decodeEntities(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#(?:39|x27);/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function jsonObjects(value) {
  if (!value || typeof value !== "object") return [];
  return [value, ...Object.values(value).flatMap(jsonObjects)];
}

async function get(base, pathname) {
  const response = await fetch(`${base}${pathname}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(20000),
    headers: { "user-agent": "NavoKitCatalogCheck/1.0" },
  });
  return { status: response.status, text: await response.text() };
}

async function checkHttp(base, external, catalog) {
  const [sitemap, llms] = await Promise.all([get(base, "/sitemap.xml"), get(base, "/llms.txt")]);
  check(sitemap.status === 200, `/sitemap.xml: expected 200, got ${sitemap.status}`);
  check(llms.status === 200, `/llms.txt: expected 200, got ${llms.status}`);
  const sitemapUrls = new Set([...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decodeEntities(match[1])));
  const llmsUrls = new Set([...llms.text.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1]));
  const jobs = external.flatMap(product => ["en", "zh"].map(lang => ({ product: catalog.getCatalogProduct(lang, product.slug), lang })));

  async function worker() {
    while (jobs.length) {
      const { product, lang } = jobs.shift();
      const pathname = `/${lang}/tools/${product.slug}`;
      const canonical = `https://www.navokit.com${pathname}`;
      check(sitemapUrls.has(canonical), `${pathname}: missing from sitemap`);
      if (lang === "en") check(llmsUrls.has(canonical), `${pathname}: missing from English llms.txt product index`);
      try {
        const { status, text } = await get(base, pathname);
        check(status === 200, `${pathname}: expected 200, got ${status}`);
        const scripts = [...text.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
        const objects = scripts.flatMap(([, raw]) => jsonObjects(JSON.parse(raw.trim())));
        const webpage = objects.find(item => item["@type"] === "WebPage" && item.url === canonical);
        const expectedType = product.kind === "hardware" ? "Product" : "SoftwareApplication";
        check(webpage?.about?.["@type"] === expectedType, `${pathname}: WebPage.about must be ${expectedType}`);
        check(webpage?.about?.name === product.name && webpage?.about?.url === product.website, `${pathname}: schema product identity must match catalog`);
        const dom = text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
        const visibleLinks = new Set([...dom.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)].map(match => decodeEntities(match[1])));
        const officialLinks = [product.website, product.repository, product.launchSource].filter(present);
        const provenance = new Set([...product.sourceUrls, ...officialLinks]);
        const citations = [webpage?.citation, webpage?.about?.citation].flatMap(value => Array.isArray(value) ? value : value ? [value] : [])
          .map(value => typeof value === "string" ? value : value?.url ?? value?.["@id"]);
        check(officialLinks.every(url => visibleLinks.has(url)), `${pathname}: official website, repository, and launch record links must remain visible when recorded`);
        check(citations.includes(product.website) && citations.every(url => visibleLinks.has(url) && provenance.has(url)), `${pathname}: schema citations must use visible links with recorded provenance`);
      } catch (error) {
        check(false, `${pathname}: ${error.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`HTTP: ${external.length * 2} bilingual detail pages, sitemap, and English llms.txt checked.`);
}

async function main() {
  const arg = process.argv[2];
  if (arg === "--help" || arg === "-h") {
    console.log("Usage: node scripts/catalog-check.mjs [http://127.0.0.1:3001]\nOmit the URL to check local catalog data and images only.");
    return;
  }
  if (process.argv.length > 3 || (arg && !httpUrl(arg))) throw new Error("Supply at most one http(s) base URL.");
  const catalog = loadData(path.join(root, "src/lib/catalog.ts"));
  const { productMedia } = loadData(path.join(root, "src/lib/productMedia.ts"));
  const english = catalog.getCatalogProducts("en");
  const chinese = catalog.getCatalogProducts("zh");
  const external = english.filter(product => product.kind !== "utility" && !product.internalPath);
  const categories = catalog.getProductCategories("en");
  const categoryIds = new Set(categories.map(category => category.id));
  const topicIds = new Set(catalog.getTopics("en").map(topic => topic.id));
  check(categories.length === 15 && categoryIds.size === 15, "Expected 15 unique categories");
  check(new Set(english.map(product => product.slug)).size === english.length, "Duplicate product slugs");
  check(JSON.stringify(english.map(product => product.slug)) === JSON.stringify(chinese.map(product => product.slug)), "English and Chinese catalog slugs differ");

  const coverage = categories.map(category => {
    const count = external.filter(product => product.categoryIds.includes(category.id)).length;
    check(count >= 2, `${category.id}: requires at least 2 external products, found ${count}`);
    return `${category.id}=${count}`;
  });
  for (const [lang, products] of [["en", english], ["zh", chinese]]) {
    for (const product of products) {
      const label = `${lang}/${product.slug}`;
      check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug), `${label}: invalid slug`);
      check(["name", "tagline", "description"].every(field => present(product[field])), `${label}: missing localized copy`);
      check(Array.isArray(product.features) && product.features.length > 0 && product.features.every(present), `${label}: missing features`);
      check(httpUrl(product.website), `${label}: invalid website URL`);
      check(Array.isArray(product.categoryIds) && product.categoryIds.length > 0 && product.categoryIds.every(id => categoryIds.has(id)), `${label}: invalid categories`);
      check(Array.isArray(product.topicIds) && product.topicIds.every(id => topicIds.has(id)), `${label}: invalid topics`);
      check(Boolean(product.launchDate) === Boolean(product.launchSource), `${label}: launch date and source must occur together`);
      if (product.launchDate || product.launchSource) {
        const parts = product.launchSource?.match(/^https:\/\/www\.producthunt\.com\/leaderboard\/daily\/(\d{4})\/(\d{1,2})\/(\d{1,2})\/?$/);
        const expected = parts ? `${parts[1]}-${parts[2].padStart(2, "0")}-${parts[3].padStart(2, "0")}` : "";
        check(validDate(product.launchDate) && product.launchDate === expected, `${label}: PH daily source does not match launch date`);
        check(product.sourceUrls.includes(product.launchSource), `${label}: PH launch source missing from sources`);
      }
    }
  }
  for (const product of external) {
    const label = product.slug;
    check(validDate(product.verifiedAt), `${label}: missing valid verification date`);
    check(Array.isArray(product.sourceUrls) && product.sourceUrls.length >= 2 && product.sourceUrls.every(httpUrl), `${label}: requires at least two valid source URLs`);
    check(hasOfficialSource(product, product.sourceUrls), `${label}: sources lack an official website or repository`);
    const media = productMedia[label];
    check(Boolean(media) && validDate(media.checkedAt), `${label}: missing dated media provenance`);
    check(httpUrl(media?.sourceUrl) && httpUrl(media?.imageSourceUrl), `${label}: missing official media source URLs`);
    check(present(media?.logoAlt) && ["en", "zh"].every(lang => present(media?.imageAlt?.[lang])), `${label}: missing image alt text`);
    await inspectImage(media?.logo, `${label}: local logo decodes`);
    await inspectImage(media?.image, `${label}: local preview decodes`);
  }
  console.log(`Catalog: ${english.length} products, ${external.length} external; ${categories.length} categories.\nCoverage: ${coverage.join(", ")}`);
  if (arg) await checkHttp(arg.replace(/\/+$/, ""), external, catalog);
  if (failures.length) {
    failures.forEach(message => console.error(`FAIL ${message}`));
    console.error(`${failures.length} failed / ${checks} checks.`);
    process.exitCode = 1;
  } else {
    console.log(`PASS ${checks} checks. No product API or submission requests were made.`);
  }
}

main().catch(error => { console.error(`Catalog check stopped: ${error.message}`); process.exitCode = 1; });
