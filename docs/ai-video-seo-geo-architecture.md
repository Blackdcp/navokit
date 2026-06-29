# NavoKit AI Video / SEO / GEO Architecture

Updated: 2026-06-28

This document replaces the previous four-tool plan. PPT to PDF is out of scope.

## Product scope

NavoKit has three focused tools:

1. Free AI Video Generator — primary acquisition tool.
2. Markdown to Image — stable utility and sharing tool.
3. AI Social Post Generator — supporting creator workflow.

The AI Video MVP supports text-to-video only. It exposes landscape, portrait, and square formats with approximate three- and five-second durations. Image-to-video, multiple images, and keyframes are intentionally deferred until the public workflow is stable.

## AI Video request flow

```text
Browser
  -> NavoKit submit Route Handler
  -> validate prompt and product settings
  -> apply abuse controls
  -> AI video service task endpoint
  -> return video_id

Browser polling
  -> NavoKit status Route Handler
  -> AI video service status endpoint
  -> return status, progress, seconds, size, and final URL
```

`AGNES_API_KEY` is server-only. It must never appear in client code, logs, analytics, or URLs.

## Production controls

The code includes a lightweight per-instance submission limit. Before meaningful traffic or promotion, replace it with a persistent shared rate limiter and add a bot challenge such as Cloudflare Turnstile. Monitor:

- submissions, completions, failures, and provider errors;
- completion latency by format and duration;
- estimated provider cost and daily usage;
- repeated IP/device abuse;
- content-policy rejection rate.

Do not advertise unlimited availability. Free usage and provider pricing may change.

## Search architecture

Canonical public URLs:

```text
/{lang}/tools/free-ai-video-generator
/{lang}/tools/markdown-to-image
/{lang}/tools/ai-social-booster
```

Legacy tool URLs permanently redirect to their canonical replacements. Only canonical, available pages belong in the sitemap. English and Chinese pages declare canonical and language alternates.

The homepage features AI Video while preserving NavoKit as a small creator-tool product rather than an AI video-only brand.

## Content and GEO principles

There is no separate machine-only GEO layer. Important information must be visible, specific, and useful:

- explain that video prompts are processed by an external AI video service;
- explain the actual asynchronous workflow;
- show prompt structure and real examples;
- report provider-returned duration and size;
- disclose current modes and limitations;
- explain third-party processing and rights uncertainty;
- connect guides to the exact tool workflow.

Structured data must match visible content. Avoid unsupported promises such as unlimited use, guaranteed speed, no watermark, or commercial rights.

## Release gate

Before enabling production generation:

- revoke any API key exposed in chat, tickets, or logs;
- create a new key and store it as `AGNES_API_KEY` in deployment secrets;
- run successful landscape, portrait, and square tasks;
- verify both supported durations;
- verify busy, invalid-prompt, failed-task, and timeout states;
- confirm the provider's current pricing, retention, and usage terms;
- add persistent rate limiting before promotion.
