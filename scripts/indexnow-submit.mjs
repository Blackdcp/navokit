import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const DEFAULT_SITE_URL = "https://www.navokit.com";
const DEFAULT_KEY = "6b62f2c9d6f24ac7afde4a9e8f023e17";
const DEFAULT_ENDPOINT = "https://api.indexnow.org/indexnow";

export function parseOptions(args) {
  const options = { dryRun: false, all: false, urls: [], files: [], help: false };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--all") options.all = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--url" || arg === "--urls-file") {
      const value = args[++index];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value.`);
      options[arg === "--url" ? "urls" : "files"].push(value);
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  if (options.all && (options.urls.length || options.files.length)) throw new Error("Use either --all or a list of changed URLs.");
  return options;
}

export function siteOrigin(value) {
  const parsed = new URL(value);
  if (!/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== "/") {
    throw new Error("SITE_URL must be an http(s) origin without credentials, a path, or query parameters.");
  }
  return parsed.origin;
}

export function normalizeUrl(value, origin) {
  const url = new URL(value, `${origin}/`);
  if (url.origin !== origin || url.username || url.password) throw new Error(`URL does not belong to ${origin}: ${value}`);
  if (url.search || url.hash) throw new Error(`Use the canonical page URL without a query or fragment: ${value}`);
  if (/^\/api(?:\/|$)/.test(url.pathname)) throw new Error(`API routes must not be submitted: ${value}`);
  return url.href;
}

export function sitemapUrls(xml, origin) {
  if (/<sitemapindex\b/i.test(xml)) throw new Error("Expected a URL sitemap, not a sitemap index. Supply changed URLs with --url or --urls-file.");
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(([, value]) => value
    .replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"').replaceAll("&apos;", "'"));
  if (!urls.length) throw new Error("The sitemap contains no page URLs.");
  return [...new Set(urls.map(url => normalizeUrl(url, origin)))];
}

async function fetchText(url) {
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Unable to fetch ${url} (${response.status}).`);
  return response.text();
}

export async function main(args = process.argv.slice(2)) {
  const options = parseOptions(args);
  if (options.help) {
    console.log("Usage: node scripts/indexnow-submit.mjs [--dry-run] [--url /en/tools/example ... | --urls-file changed-urls.txt | --all]\nDry-run with no URL list inspects the sitemap. Live submission requires a URL list or explicit --all. It reports receipt, not indexing.");
    return;
  }
  const origin = siteOrigin(process.env.SITE_URL ?? DEFAULT_SITE_URL);
  const key = process.env.INDEXNOW_KEY ?? DEFAULT_KEY;
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("INDEXNOW_KEY must contain 8–128 letters, digits, or hyphens.");
  const endpoint = process.env.INDEXNOW_ENDPOINT ?? DEFAULT_ENDPOINT;
  const endpointUrl = new URL(endpoint);
  if (endpointUrl.protocol !== "https:" || endpointUrl.username || endpointUrl.password) throw new Error("INDEXNOW_ENDPOINT must be an HTTPS URL without credentials.");
  const sitemapUrl = process.env.SITEMAP_URL ?? `${origin}/sitemap.xml`;
  const keyLocation = `${origin}/${key}.txt`;
  const fromFiles = (await Promise.all(options.files.map(file => readFile(file, "utf8"))))
    .flatMap(contents => contents.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith("#")));
  const changedUrls = [...options.urls, ...fromFiles];
  if (!options.dryRun && !options.all && !changedUrls.length) {
    throw new Error("Specify the pages actually added, changed, or deleted with --url / --urls-file. Use --all only when the whole sitemap needs notification.");
  }
  const urlList = changedUrls.length
    ? [...new Set(changedUrls.map(url => normalizeUrl(url, origin)))]
    : sitemapUrls(await fetchText(sitemapUrl), origin);
  if (!urlList.length || urlList.length > 10000) throw new Error("IndexNow accepts 1–10,000 URLs per request. Split larger change lists.");
  if (options.dryRun) {
    console.log(JSON.stringify({ dryRun: true, endpoint, plannedCount: urlList.length, keyLocation, sample: urlList.slice(0, 10) }, null, 2));
    return;
  }
  const hostedKey = (await fetchText(keyLocation)).trim();
  if (hostedKey !== key) throw new Error("The public IndexNow key file does not match INDEXNOW_KEY. No URLs were submitted.");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(origin).host, key, keyLocation, urlList }),
    signal: AbortSignal.timeout(20000),
  });
  const body = await response.text();
  console.log(JSON.stringify({ endpoint, status: response.status, submittedCount: urlList.length, body: body.slice(0, 1000), note: "A successful response confirms receipt, not crawling, indexing, ranking, or AI citation." }, null, 2));
  if (![200, 202].includes(response.status)) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
}
