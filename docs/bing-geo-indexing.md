# Crawl, indexing, and GEO workflow

NavoKit's foundation is public HTML with clear product descriptions, linked primary sources, language-specific canonical URLs, internal links, and structured data that matches visible content. The sitemap covers products, category pages, collections, articles, and the editorial policy in both languages. `llms.txt` is an optional text index of the same public content; it is not a required crawler protocol or a guarantee of AI citations.

Google states that ordinary SEO requirements also apply to its AI features and that no extra AI text files or special schema are needed. Discovery, indexing, rankings, and citations remain separate outcomes to measure, not claims the implementation can make. [Google's AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)

## One-time setup after deployment

1. Verify `https://www.navokit.com` in Google Search Console and Bing Webmaster Tools using the site's actual owner account.
2. Submit `https://www.navokit.com/sitemap.xml` in both webmaster tools. Use URL Inspection to confirm representative English and Chinese product, category, and article pages are indexed.
3. Verify that the public IndexNow key file matches `INDEXNOW_KEY` before notifications. The submission script checks this before a live POST.
4. Confirm CDN or hosting rules allow normal crawler requests to public HTML, images, robots, and the sitemap. The app's `robots.txt` allows public pages and excludes `/api/`; this iteration does not change individual AI training crawler policies.

Configuration files in the repository do not prove an account is verified or a production URL is indexed. Record those results from the owner dashboards after publishing.

## Google Search Console submission

For the October 9, 2026 release, the owner chose a direct Vercel production deployment and manual sitemap updates. The existing GitHub Actions workflow was not changed or activated by this release. Its historical Google Indexing API approach is not appropriate for ordinary articles: that API is restricted to supported job-posting and livestream pages. Do not use it for this manual release. [Google Indexing API scope](https://developers.google.com/search/apis/indexing-api/v3/using-api)

After the production site is verified, resubmit `https://www.navokit.com/sitemap.xml` in the existing NavoKit Search Console property. Bing Webmaster Tools must be updated separately. A successful submission confirms receipt, not indexing.

A tested optional manual script is available for a future release with API credentials. It uses the Search Console sitemap API, selects only an existing authorized NavoKit property, validates the live sitemap and retrieves a receipt. It is not connected to an automatic workflow.

```bash
# Read-only production sitemap validation; no credentials required.
node scripts/submit-sitemap.mjs --dry-run

# Optional manual API submission after production verification.
# Requires Search Console API access and GCP_SA_KEY loaded securely.
node scripts/submit-sitemap.mjs --submit

# Mocked notification tests; no external requests or real credentials.
node --test scripts/submit-sitemap.test.mjs
```

Optional API configuration requires the Google Search Console API enabled and the existing service account granted owner or full-user access to the NavoKit property. `GSC_SITE_URL` can select `https://www.navokit.com/`, `sc-domain:navokit.com`, or `sc-domain:www.navokit.com`; otherwise the script discovers an authorized NavoKit property. This release does not create credentials or grant access. [Sitemap API](https://developers.google.com/webmaster-tools/v1/sitemaps/submit)

## Validate before publishing

Against a running local server:

```bash
npm run seo:audit -- http://127.0.0.1:3001
node scripts/crawl-check.mjs http://127.0.0.1:3001
node --test scripts/indexnow-submit.test.mjs
```

The crawl check verifies public discovery resources, bilingual coverage, existing language alternatives, canonical URLs, real recorded dates, and rendered category/editorial pages. It makes only read-only requests to the supplied host.

Preview the production URL list from a local sitemap without submitting:

```bash
SITEMAP_URL=http://127.0.0.1:3001/sitemap.xml npm run indexnow:dry-run
```

The sitemap retains canonical production URLs even when fetched locally. Do not set `SITE_URL` to localhost for a production notification.

## Notify only published changes

Prefer the pages actually added, substantially changed, or deleted. An IndexNow receipt does not confirm that those URLs are crawled or indexed. The protocol accepts up to 10,000 URLs in one POST. [IndexNow documentation](https://www.indexnow.org/documentation)

For example, after publishing updates to an existing product:

```bash
npm run indexnow:dry-run -- --url /en/tools/pexo --url /zh/tools/pexo
npm run indexnow:submit -- --url /en/tools/pexo --url /zh/tools/pexo
```

For a release with many changes, supply a UTF-8 file containing one canonical URL or site-relative path per line. Blank lines and lines beginning with `#` are ignored. Include affected category or collection pages when their visible content changed.

```bash
npm run indexnow:dry-run -- --urls-file /tmp/navokit-changed-urls.txt
npm run indexnow:submit -- --urls-file /tmp/navokit-changed-urls.txt
```

A live request with no URL list stops instead of resubmitting every page. `--all` is available for a release that genuinely changes the whole sitemap; do not repeatedly send unchanged URLs. Dry-run without a list remains a convenient sitemap inspection.

## Content and measurement

- Make the product's purpose, audience, workflow, platform, and requirements visible in ordinary page text. Record official sources and the actual verification date.
- Use publication dates for articles and actual revision dates for substantive updates. Do not refresh `lastModified` merely because a build ran. Omit unavailable dates. [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- Keep product inclusion, first-party utility ownership, advertisements, and commercial collaboration understandable. Do not manufacture ratings, review experience, or launch dates.
- Monitor indexed canonical pages, search impressions/clicks, referring AI/search domains, and outbound product visits. Separate observed traffic and citations from estimates. Google AI feature traffic is included in Search Console's Web reporting, rather than a separate guaranteed GEO signal. [Google's measurement guidance](https://developers.google.com/search/docs/appearance/ai-features#measure-performance)
- Recheck cited sources and requirements when a product changes. Correct the page first, then notify published changes.
