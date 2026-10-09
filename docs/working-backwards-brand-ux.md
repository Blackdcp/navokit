# NavoKit product and UX brief

Updated for the product-discovery direction on 2026-10-09. The original monochrome identity remains the design baseline; the earlier own-tools-only positioning is superseded.

## Customer promise

Discover an emerging product, understand the specific task it helps with, and decide whether to try it.

NavoKit combines navigation and tools. It is an independent product-discovery site and technology content archive. Existing NavoKit utilities remain usable; growth centers on external products and useful context.

## Audience and selection

Curious makers, developers, creators, and small teams looking for a useful new way to work. Seek emerging products with a concrete use case or distinctive interaction. Familiar category leaders are not the default editorial focus. Customer relationships do not determine categories or inclusion.

Product Hunt recent launches and dated leaderboards are discovery inputs, not a quality guarantee. Check the official product site before listing a candidate. Never invent products, launch dates, usage figures, rankings, testimonials, or hands-on test results. A PH launch may be a new version of an existing product. Preserve that distinction.

## Visual standards

- Keep the original `public/logo.png` and `public/logo-inverse.png`. Do not replace the brand with an icon from an icon library.
- Calm black, white, and gray surfaces. Color is reserved for actions, focus, status, or a verified product's own identity. No decorative tinted panels, orbit illustrations, or ornamental gradients.
- Show each external product with its verified official logo and useful official interface imagery. Keep source records in `docs/product-media-sources.md`; do not substitute initials or invented marks. Product images retain their own colors.
- Articles have topic-specific editorial covers across archives, updates, collections, home, and article detail. Original vector cover art is illustrative, not a product screenshot or research result. Existing explicit article imagery takes precedence.
- Use a compact homepage introduction, one larger product feature, smaller supporting finds, and illustrated reading cards to create visual hierarchy.
- Reuse `--color-navo-*` from `src/app/globals.css`. Do not build separate palettes for each feature.
- Use the existing 1120px marketing container and 1280px tool workspace container, with 24px desktop / 16px mobile side margins.
- Reuse the original font stacks; prioritize legible Chinese and English text. Body text 16px, secondary text 14px, metadata 12px. Dense labels must remain readable on mobile.
- Shared radii: controls 12px; inputs 16px; cards 20px; panels 24px. Reuse the radius tokens where available.
- Light borders and restrained shadows. Primary actions use the ink button. Hover, active, focus, error, loading, and empty states must be visible and consistent.
- One clear primary task per page. Keep search, filtering, product context, and outbound actions easy to find.
- Honor reduced motion, keyboard access, semantic headings, and small screens. No horizontal page overflow.

## Page responsibilities

- **Home:** introduce the discovery promise, show a small set of sourced new finds, then recent updates, practical collections, categories, and retained NavoKit utilities.
- **Directory:** search by task/product and filter by category/type. Show truthful counts and honest empty states. Categories cover the industry, not just currently listed products.
- **Product:** explain what it does, suitable scenarios, platform/requirements, official links, and source dates. Do not imply personal testing where only vendor material was checked.
- **Collections:** organize related products around actual tasks and interests. Include relevant reading only when the relationship is explicit.
- **Updates:** distinguish product launches from article publication. A launch requires its own dated source; catalog insertion is not a launch.
- **Articles:** preserve existing URLs and dates; treat legacy articles as an archive, not newly verified reporting.
- **Submit:** one product recommendation form, clear review expectations, and honest delivery status. No success state unless delivery is accepted.

## Content and commercial boundaries

AIHOT is a replaceable future content source. This iteration does not imply self-hosted AIHOT, automatic publication, or an operating newsroom. Source content needs attribution and an editorial decision before publication.

Adsterra remains the planned traffic revenue channel. Existing integration is not evidence of traffic or earnings. The $1,000 monthly target needs real visits and revenue measurements.

Client GEO delivery is a possible later use of the site's authority and publishing capability. It does not turn the directory into a customer showcase, and is not presented as a currently launched service.

## Release checks

Review home, directory, a sourced product, collection, updates, archive/article, submission, and supporting pages in both languages. Check desktop and mobile, filtering and URL state, source links, retained utility URLs, form fallback, production build, and SEO metadata. Never send a real submission or invoke paid AI generation as a routine check.
