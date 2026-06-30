const SITE_URL = process.env.SITE_URL ?? "https://www.navokit.com";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "6b62f2c9d6f24ac7afde4a9e8f023e17";
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT ?? "https://api.indexnow.org/indexnow";
const SITEMAP_URL = process.env.SITEMAP_URL ?? `${SITE_URL}/sitemap.xml`;
const DRY_RUN = process.argv.includes("--dry-run");

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&apos;", "'");
}

function unique(values) {
  return [...new Set(values)];
}

async function fetchSitemapUrls() {
  const response = await fetch(SITEMAP_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to fetch sitemap (${response.status}) from ${SITEMAP_URL}`);
  }

  const xml = await response.text();
  const urls = unique(
    [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
      .map(match => decodeXml(match[1].trim()))
      .filter(value => value.startsWith(SITE_URL)),
  );

  if (urls.length === 0) {
    throw new Error(`No ${SITE_URL} URLs found in ${SITEMAP_URL}`);
  }

  return urls;
}

async function main() {
  const host = new URL(SITE_URL).host;
  const keyLocation = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
  const urlList = await fetchSitemapUrls();
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList,
  };

  if (DRY_RUN) {
    console.log(JSON.stringify({
      dryRun: true,
      endpoint: INDEXNOW_ENDPOINT,
      submittedCount: urlList.length,
      keyLocation,
      sample: urlList.slice(0, 10),
    }, null, 2));
    return;
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const body = await response.text();

  console.log(JSON.stringify({
    endpoint: INDEXNOW_ENDPOINT,
    status: response.status,
    submittedCount: urlList.length,
    body: body.slice(0, 1000),
  }, null, 2));

  if (![200, 202].includes(response.status)) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
