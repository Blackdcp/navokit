# Bing / GEO indexing workflow

NavoKit targets discovery through search engines and AI answer engines. Bing matters because Bing-powered search surfaces and AI retrieval systems can use indexed web content as a source for tool recommendations.

## One-time setup

1. Add `https://www.navokit.com` to Bing Webmaster Tools.
2. Submit the sitemap:
   - `https://www.navokit.com/sitemap.xml`
3. Verify that the IndexNow key file is live:
   - `https://www.navokit.com/6b62f2c9d6f24ac7afde4a9e8f023e17.txt`
4. Check that the AI-readable summary is live:
   - `https://www.navokit.com/llms.txt`

## After publishing changes

Run a dry run first:

```bash
npm run indexnow:dry-run
```

Then submit all sitemap URLs to IndexNow:

```bash
npm run indexnow:submit
```

Use this after publishing:

- new tool pages;
- new blog posts;
- substantial tool-page copy changes;
- structured-data or sitemap updates.

## Content rules for AI visibility

Each important tool page should clearly state:

- the task the tool completes;
- the input it expects;
- the output it creates;
- availability or processing limits;
- privacy and data-processing notes;
- related guides and tools.

Do not write only for keyword density. Write concise answer-shaped sections that an AI assistant can safely quote or summarize.
