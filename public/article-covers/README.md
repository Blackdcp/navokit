# NavoKit editorial illustrations

These nine SVGs are original, code-drawn cover illustrations for the NavoKit article archive. They represent subjects (video storyboards, audio waveforms, code, reasoning paths, agent orchestration, compute, retrieval, distribution, and writing). They are not product screenshots, logos, measured charts, or technical evidence for an article.

`src/lib/articleCovers.ts` selects a subject and bilingual short caption from the article slug. `ArticleCover` renders that artwork with its caption and accessible description. The Markdown archive and its publication dates are unchanged.

Keep official product identities separate in `public/products/` and the product media manifest; never use these editorial illustrations as a substitute for a vendor logo or a claimed screenshot.
