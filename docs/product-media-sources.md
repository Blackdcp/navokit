# Product media sources

Checked on **2026-10-09 (Asia/Shanghai)**. These assets identify the four products already selected for the catalog. No additional products, independently tested results, or endorsements are implied.

The subsequent 23-product expansion is documented separately in [knowledge sources](catalog-expansion-knowledge.md), [creative sources](catalog-expansion-creative.md), and [builder and hardware sources](catalog-expansion-builders.md), including each exact logo and preview URL.

All media was retrieved from each product's public official homepage or an asset explicitly referenced by that homepage. The logos are actual app icons or brand marks, not initial-letter substitutes. Product images are supplied by the product maker; they are not screenshots of a NavoKit test session. Their original branding is retained. Asset copyright and trademarks remain with their respective owners.

| Product | Local logo | Exact official logo source | Local product image | Exact official image source and context |
| --- | --- | --- | --- | --- |
| [Pexo](https://pexo.ai/) | `/products/pexo/logo.png` | [Homepage favicon](https://pexo.ai/favicon-20260611.ico), a 416×416 PNG despite the `.ico` URL extension | `/products/pexo/preview.webp` | [1440×767 WebP](https://pexo.ai/_next/static/media/refine.97b9dd69.webp), the poster of the homepage's “Chat to refine video” demonstration. It shows the video, timeline, and comment UI. |
| [Tucky](https://tucky.io/) | `/products/tucky/logo.png` | [256×256 app icon](https://tucky.io/icon.png), displayed beside the brand name in the homepage header | `/products/tucky/preview.webp` | [775×1080 screenshot](https://tucky.io/2.webp), the homepage's “Open a note” section. Preserve the screen-edge context when displaying this portrait image. |
| [Velozity](https://getvelozity.com/) | `/products/velozity/logo.png` | [180×180 Apple touch icon](https://getvelozity.com/assets/meta/apple-touch-icon.png), declared in the official homepage metadata | `/products/velozity/preview.webp` | [2400×1260 official social image](https://getvelozity.com/assets/meta/og-card-v3.png), declared in `og:image` and `twitter:image`. Contains the office scene plus the maker's product title. Locally resized to 1600×840 and encoded as WebP. |
| [Rill](https://rill.love/) | `/products/rill/logo.png` | [512×512 app icon](https://rill.love/assets/brand/app-icon-512.png), displayed in the homepage download section | `/products/rill/preview.webp` | [1680×1076 browser screenshot](https://rill.love/assets/shots/hero-1680.jpg), displayed in the official homepage hero. Locally encoded as WebP at the original dimensions. |

Pexo's additional `/products/pexo/deliver.webp` is the unchanged [official “Get a ready-to-post video” demonstration poster](https://pexo.ai/_next/static/media/deliver.db3b118e.webp), 1440×767. It is an optional alternative view, not an independently generated result.

The Pexo, Tucky, and Rill logo pixels and the Pexo/Tucky WebP images are retained unchanged. Velozity's app icon is also unchanged. Image optimization only changes encoding or size; no product interface, wording, logo geometry, or sample result has been fabricated.

The public renderer reads `src/lib/productMedia.ts`. Its `checkedAt` describes media-source verification, independently of the product catalog's existing verification and Product Hunt launch dates. Keep those dates separate. Official demo images may differ from the current app or paid plan, so they must not be presented as evidence of a NavoKit hands-on review.

## NavoKit utility previews

Added on 2026-10-09 using the project's existing tool examples. Tool-specific icons remain in use; these entries do not substitute a third-party logo.

| Tool | Card image | Existing source |
| --- | --- | --- |
| Markdown to Image | `/images/tool-examples/markdown-social-card.png` | Existing exported Markdown card, already used in the tool's examples. |
| AI Social Post Generator | `/images/tool-examples/social-workspace-launch.png` | Existing workspace example showing a launch brief and platform drafts. |
| Free AI Video Generator | `/products/free-ai-video-generator/preview.jpg` | Browser capture of the final frame of `/images/tool-examples/ai-video-red-fox.mp4`, cropped to the image area with player controls excluded. No new generation request was made. |

The Markdown and social workspace previews use `object-fit: contain` so sample text and interface controls remain complete. The video thumbnail is a 16:10 crop of the saved sample, matching the catalog card's media area.
