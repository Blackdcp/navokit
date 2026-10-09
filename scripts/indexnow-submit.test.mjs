import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeUrl, parseOptions, siteOrigin, sitemapUrls } from "./indexnow-submit.mjs";

const origin = "https://www.navokit.com";

test("IndexNow accepts canonical same-origin paths, rejecting lookalike hosts and filtered/API URLs", () => {
  assert.equal(normalizeUrl("/zh/categories/audio", origin), `${origin}/zh/categories/audio`);
  for (const value of [`${origin}.example.org/en/tools`, "https://navokit.com/en/tools", `${origin}/en/tools?category=audio`, `${origin}/en/tools#products`, `${origin}/api/submit`, "https://user:password@www.navokit.com/en/tools"]) {
    assert.throws(() => normalizeUrl(value, origin));
  }
});

test("IndexNow parses explicit changes and rejects ambiguous submission modes", () => {
  assert.deepEqual(parseOptions(["--dry-run", "--url", "/en/tools/pexo", "--url", "/zh/tools/pexo"]), { dryRun: true, all: false, urls: ["/en/tools/pexo", "/zh/tools/pexo"], files: [], help: false });
  assert.throws(() => parseOptions(["--all", "--url", "/en/tools"]));
  assert.throws(() => parseOptions(["--url"]));
  assert.throws(() => parseOptions(["--unexpected"]));
  assert.equal(siteOrigin(`${origin}/`), origin);
  assert.throws(() => siteOrigin(`${origin}/en`));
});

test("IndexNow deduplicates sitemap page URLs and refuses invalid/mixed-origin feeds", () => {
  const xml = `<urlset><url><loc>${origin}/en/tools</loc></url><url><loc>${origin}/en/tools</loc></url></urlset>`;
  assert.deepEqual(sitemapUrls(xml, origin), [`${origin}/en/tools`]);
  assert.throws(() => sitemapUrls(xml.replaceAll(origin, `${origin}.invalid`), origin));
  assert.throws(() => sitemapUrls(`<sitemapindex><sitemap><loc>${origin}/sitemap-1.xml</loc></sitemap></sitemapindex>`, origin));
  assert.throws(() => sitemapUrls("<urlset />", origin));
});
