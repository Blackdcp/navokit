# Crawl, indexing, and GEO workflow

NavoKit's foundation is public HTML with clear product descriptions, linked primary sources, language-specific canonical URLs, internal links, and structured data that matches visible content. The sitemap covers products, category pages, collections, articles, and the editorial policy in both languages. `llms.txt` is an optional text index of the same public content; it is not a required crawler protocol or a guarantee of AI citations.

Google states that ordinary SEO requirements also apply to its AI features and that no extra AI text files or special schema are needed. Discovery, indexing, rankings, and citations remain separate outcomes to measure, not claims the implementation can make. [Google's AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)

## One-time setup after deployment

1. Verify `https://www.navokit.com` in Google Search Console and Bing Webmaster Tools using the site's actual owner account.
2. Submit `https://www.navokit.com/sitemap.xml` in both webmaster tools. Use URL Inspection to confirm representative English and Chinese product, category, and article pages are indexed.
3. Verify that the public IndexNow key file matches `INDEXNOW_KEY` before notifications. The submission script checks this before a live POST.
4. Confirm CDN or hosting rules allow normal crawler requests to public HTML, images, robots, and the sitemap. The app's `robots.txt` allows public pages and excludes `/api/`; this iteration does not change individual AI training crawler policies.

Configuration files in the repository do not prove an account is verified or a production URL is indexed. Record those results from the owner dashboards after publishing.

## Google Search Console automation

Ordinary product and article pages use the Search Console sitemap API. The old Google Indexing API job has been removed: that API is restricted to supported job-posting and livestream pages. [Google Indexing API scope](https://developers.google.com/search/apis/indexing-api/v3/using-api)

The `Submit production sitemap` workflow runs after a GitHub deployment is marked successful with `production_environment: true`, or with environment `Production` and `transient_environment: false`. The latter matches this repository's observed Vercel production deployment payload, which leaves the production flag false. It does not run on a source push or a preview deployment. Hosting integrations that do not emit that production deployment event can run it manually after the release is live, setting `production_confirmed` to `true`. The workflow checks out the trusted `main` branch, then validates the public sitemap before any submission.

Configuration:

- Enable the **Google Search Console API** in the service account's Google Cloud project.
- Retain the existing `GCP_SA_KEY` Actions secret containing the service-account JSON. Add that service account to an existing NavoKit Search Console property with owner or full-user access.
- Optional Actions variable `GSC_SITE_URL` selects `https://www.navokit.com/`, `sc-domain:navokit.com`, or `sc-domain:www.navokit.com`. When omitted, the script discovers an authorized property in that order. It never creates properties or selects unrelated sites.

The script uses the `https://www.googleapis.com/auth/webmasters` scope, submits only `https://www.navokit.com/sitemap.xml`, and retrieves its registration receipt. A pending receipt is a successful submission awaiting processing, not proof that any page is indexed. [Sitemap submission API](https://developers.google.com/webmaster-tools/v1/sitemaps/submit), [property discovery API](https://developers.google.com/webmaster-tools/v1/sites/list)

```bash
# Read-only production sitemap validation; no credentials required.
node scripts/submit-sitemap.mjs --dry-run

# After production deployment, with GCP_SA_KEY loaded securely into the environment.
node scripts/submit-sitemap.mjs --submit

# Mocked notification tests; no external requests or real credentials.
node --test scripts/submit-sitemap.test.mjs
```

This Google workflow does not register the sitemap with Bing; complete Bing Webmaster Tools registration separately and use IndexNow for changed-page notifications below.

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
