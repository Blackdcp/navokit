# NavoKit

NavoKit combines navigation and tools: discover emerging technology products, explore practical collections, and follow sourced product launches and technology articles. The bilingual site retains its original monochrome identity and three NavoKit utilities. Its 15 use-case categories cover the industry; customer relationships do not determine the taxonomy.

The product and visual contract lives in `docs/working-backwards-brand-ux.md`. Keep the original logo assets and shared design tokens when adding pages.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3001/zh or http://localhost:3001/en. This project uses Next.js 16; read the bundled guides in `node_modules/next/dist/docs/` before changing routing or framework APIs.

## Structure

- `src/lib/catalog.ts`: bilingual product records, industry categories, and editorial collections. Add official source URLs and distinguish verification/listing dates from launch dates.
- `src/lib/catalog-expansion/`: reviewed product and media batches. Their provenance is recorded in `docs/catalog-expansion-{knowledge,creative,builders}.md`.
- `src/types/catalog.ts`: product and collection contracts. A product may belong to multiple industry categories and editorial collections.
- `src/content/blog/{en,zh}`: article Markdown. Existing article and utility URLs are retained.
- `src/lib/discovery.ts`: combines dated, sourced Product Hunt launch records and original article publications. Article-to-collection associations use explicit workflow metadata or editorial slug mappings; unmatched articles stay in the archive.
- `src/app/[lang]/tools`: searchable directory, external product profiles, and the three retained NavoKit utilities.
- `src/app/[lang]/topics`: collection index and detail pages connecting products and reading.
- `src/app/[lang]/updates`: dated feed; `/blog` is the searchable article archive.
- `src/app/[lang]/submit` and `src/app/api/submissions`: product recommendations for manual review.

## Submission delivery

Copy the relevant settings from `.env.example` into your local or hosting environment. Online submission requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_EMAIL`; `SMTP_FROM` is optional. Port 465 uses implicit TLS; other SMTP ports require STARTTLS.

When SMTP is unconfigured, the form prepares a review email for the visitor to send themselves. It explicitly says that the email has not been sent. It does not pretend to save submissions. SMTP failures retain the entered details and offer the same email fallback. Approved products are currently added manually to the catalog; there is no submission database or admin dashboard.

The API includes validation, body-size limits, same-origin checks, a honeypot, and bounded rate limiting per server instance. A shared rate limiter is needed if stricter limits across multiple instances become necessary.

## Verification

```bash
npm run lint
npm run build
npm run catalog:check
npm run geo:audit -- http://127.0.0.1:3001
npm run crawl:check -- http://127.0.0.1:3001
node scripts/submissions-test.mjs
npm run smoke:test -- http://127.0.0.1:3001
npm run seo:audit -- http://127.0.0.1:3001
```

Submission tests mock SMTP and never send email. Smoke checks validate invalid API requests; live AI generation is opt-in through `SMOKE_TEST_API=1` or `SMOKE_TEST_VIDEO=1` and may use provider credits.

## Content sources

The directory contains 27 reviewed external products and the three existing NavoKit utilities. The 2026-10-09 expansion added 23 products across all 15 categories, with at least two external products per category. Some products serve more than one use case. Each external product has a local official logo, a sourced preview image, bilingual copy, and its verification sources. The original four entries were verified on 2026-10-08; the new batch on 2026-10-09. Descriptions summarize vendor materials; inclusion does not imply hands-on testing. A Product Hunt launch date is neither a company founding date nor a NavoKit listing date.

The agreed intake policy is: discover emerging, distinctive products from Product Hunt, official product communities, or submissions; verify product identity, official availability, concrete features, platform requirements, and source dates; write concise bilingual descriptions; assign relevant categories and collections; then publish a reviewed catalog record. A matching Product Hunt profile is included when confirmed; otherwise official documentation or repositories provide supporting evidence. Do not pad categories with unverified examples or generate launches from catalog insertion dates. `npm run catalog:check -- http://127.0.0.1:3001` checks category coverage, local assets, both languages of product detail pages, and discovery URLs in the sitemap and llms.txt.

The article archive remains unchanged. No AIHOT service, automated importer, database, or admin dashboard is connected. Future source adapters should preserve attribution, original dates, and content type, and stage candidates for review instead of publishing automatically. A feed fetcher can be replaced later without changing product or article URLs.

## GEO foundation

Dedicated bilingual category pages, shared publisher identity, product and article entity links, an editorial policy, explicit reference handling, and crawl checks are documented in `docs/geo-foundation-audit.md`. The existing article archive still needs source review: its 193 localized files have no formal reference lists. Improved markup does not verify those articles or guarantee AI citations. Production indexing and webmaster-account status require separate checks after deployment.

Adsterra and analytics integrations remain in place. No revenue outcome is implied by this iteration; the monthly target needs measurement with real visits and publisher revenue.
