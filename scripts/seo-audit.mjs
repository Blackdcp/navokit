#!/usr/bin/env node

const baseUrl = normalizeBaseUrl(process.env.SEO_AUDIT_BASE_URL || process.argv[2] || "http://localhost:3001");
const siteUrl = normalizeBaseUrl(process.env.SEO_AUDIT_SITE_URL || "https://www.navokit.com");
const indexNowKey = "6b62f2c9d6f24ac7afde4a9e8f023e17";

const results = [];

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function absoluteUrl(pathname) {
  return `${baseUrl}${pathname}`;
}

function expectedUrl(pathname) {
  return `${siteUrl}${pathname}`;
}

function record(ok, label, detail = "") {
  results.push({ ok, label, detail });
  const prefix = ok ? "PASS" : "FAIL";
  console.log(`${ok ? "✅" : "❌"} ${prefix} ${label}${detail ? ` — ${detail}` : ""}`);
}

async function fetchText(pathname, options = {}) {
  const response = await fetch(absoluteUrl(pathname), {
    redirect: options.redirect || "follow",
    headers: { "user-agent": "NavoKitSeoAudit/1.0" },
  });
  const text = await response.text();
  return { response, text };
}

function getTitle(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "";
}

function getMetaDescription(html) {
  return html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1]?.trim() || "";
}

function getCanonical(html) {
  return html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]?.trim() || "";
}

function hasHreflang(html, lang) {
  return new RegExp(`<(?:link)[^>]+rel=["']alternate["'][^>]+(?:hrefLang|hreflang)=["']${escapeRegExp(lang)}["']`, "i").test(html);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractJsonLdTypes(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const types = new Set();
  const parseErrors = [];

  for (const [, raw] of scripts) {
    try {
      const json = JSON.parse(decodeHtmlEntities(raw.trim()));
      collectTypes(json, types);
    } catch (error) {
      parseErrors.push(error instanceof Error ? error.message : String(error));
    }
  }

  return { types, count: scripts.length, parseErrors };
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function collectTypes(value, types) {
  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    value.forEach(item => collectTypes(item, types));
    return;
  }

  if (typeof value["@type"] === "string") {
    types.add(value["@type"]);
  }

  for (const nested of Object.values(value)) {
    collectTypes(nested, types);
  }
}

function checkHtmlPage({ path, titleIncludes, descriptionIncludes, canonical, schemas = [], visibleText = [] }, html) {
  const title = getTitle(html);
  const description = getMetaDescription(html);
  const pageCanonical = getCanonical(html);
  const { types, count, parseErrors } = extractJsonLdTypes(html);

  record(Boolean(title), `${path} has <title>`, title);
  if (titleIncludes) record(title.includes(titleIncludes), `${path} title includes expected text`, titleIncludes);
  record(Boolean(description), `${path} has meta description`, description);
  if (descriptionIncludes) record(description.includes(descriptionIncludes), `${path} description includes expected text`, descriptionIncludes);
  record(pageCanonical === canonical, `${path} canonical is correct`, pageCanonical || "missing");
  record(hasHreflang(html, "en"), `${path} has en hreflang`);
  record(hasHreflang(html, "zh"), `${path} has zh hreflang`);
  record(hasHreflang(html, "x-default"), `${path} has x-default hreflang`);
  record(!/noindex|nofollow/i.test(html), `${path} does not contain noindex/nofollow`);

  if (schemas.length > 0) {
    record(count > 0, `${path} has JSON-LD scripts`, `${count}`);
    record(parseErrors.length === 0, `${path} JSON-LD parses`, parseErrors.join("; "));
    for (const schema of schemas) {
      record(types.has(schema), `${path} has ${schema} schema`, [...types].join(", "));
    }
  }

  for (const text of visibleText) {
    record(html.includes(text), `${path} contains visible text`, text);
  }

  const banned = [
    "1key6868",
    "alipay",
    "wechat-qr",
    "Product principles",
    "产品原则",
    "AI Social Booster",
    "AI 社媒文案",
    "开头钩子",
    "future Pro",
    "后续 Pro",
    "current public version",
    "当前公开版本",
    "中文版仍",
    "全球平台为主",
    "中国本土平台",
    "本土平台",
    "Current focus",
    "后续可",
    "Agnes",
    "agnes-ai",
    "agnes-video",
    "platform-outputs.agnes-ai.space",
  ];
  const foundBanned = banned.filter(term => html.toLowerCase().includes(term.toLowerCase()));
  record(foundBanned.length === 0, `${path} has no old/internal residue`, foundBanned.join(", "));
}

async function auditRootRedirect() {
  const { response } = await fetchText("/", { redirect: "manual" });
  const location = response.headers.get("location") || "";
  record([301, 308].includes(response.status), "/ redirects permanently", `${response.status}`);
  record(location === "/en" || location === expectedUrl("/en"), "/ redirects to /en", location);
}

async function auditRobots() {
  const { response, text } = await fetchText("/robots.txt");
  record(response.status === 200, "/robots.txt returns 200", `${response.status}`);
  record((response.headers.get("content-type") || "").includes("text/plain"), "/robots.txt is text/plain");
  record(text.includes("User-Agent: *"), "/robots.txt has user-agent");
  record(text.includes("Disallow: /api/"), "/robots.txt disallows API routes");
  record(text.includes(`Sitemap: ${expectedUrl("/sitemap.xml")}`), "/robots.txt points to sitemap");
  record(text.includes(`Host: ${siteUrl}`), "/robots.txt declares canonical host");
}

async function auditSitemap() {
  const { response, text } = await fetchText("/sitemap.xml");
  record(response.status === 200, "/sitemap.xml returns 200", `${response.status}`);
  record((response.headers.get("content-type") || "").includes("application/xml"), "/sitemap.xml is application/xml");

  const urlCount = (text.match(/<url>/g) || []).length;
  const xDefaultCount = (text.match(/hreflang="x-default"/g) || []).length;
  record(urlCount >= 20, "/sitemap.xml has expected URL volume", `${urlCount}`);
  record(xDefaultCount === urlCount, "/sitemap.xml has x-default for every URL", `${xDefaultCount}/${urlCount}`);

  const requiredLocs = [
    "/en",
    "/zh",
    "/en/tools",
    "/en/blog",
    "/en/tools/free-ai-video-generator",
    "/en/tools/markdown-to-image",
    "/en/tools/ai-social-booster",
    "/zh/tools/ai-social-booster",
    "/en/about",
    "/zh/about",
    "/en/blog/how-to-convert-markdown-to-png",
    "/zh/blog/how-to-convert-markdown-to-png",
  ];

  for (const loc of requiredLocs) {
    record(text.includes(`<loc>${expectedUrl(loc)}</loc>`), `/sitemap.xml includes ${loc}`);
  }

  const blogAlternatePattern = new RegExp(
    `<loc>${escapeRegExp(expectedUrl("/en/blog/how-to-convert-markdown-to-png"))}</loc>[\\s\\S]*hreflang="zh"[\\s\\S]*${escapeRegExp(expectedUrl("/zh/blog/how-to-convert-markdown-to-png"))}`,
  );
  record(blogAlternatePattern.test(text), "/sitemap.xml has blog hreflang alternates");
}

async function auditGeoDiscovery() {
  const keyPath = `/${indexNowKey}.txt`;
  const key = await fetchText(keyPath);
  record(key.response.status === 200, `${keyPath} IndexNow key file returns 200`, `${key.response.status}`);
  record(key.text.trim() === indexNowKey, `${keyPath} contains IndexNow key`);

  const llms = await fetchText("/llms.txt");
  record(llms.response.status === 200, "/llms.txt returns 200", `${llms.response.status}`);
  record((llms.response.headers.get("content-type") || "").includes("text/plain"), "/llms.txt is text/plain");
  record(llms.text.includes("# NavoKit"), "/llms.txt names NavoKit");
  record(llms.text.includes("Free AI Video Generator"), "/llms.txt includes AI Video tool");
  record(llms.text.includes("Markdown to Image"), "/llms.txt includes Markdown to Image tool");
  record(llms.text.includes("AI Social"), "/llms.txt includes AI Social tool");
  record(llms.text.includes(expectedUrl("/sitemap.xml")), "/llms.txt points to sitemap");
}

async function auditRoutingHygiene() {
  const randomPage = await fetchText("/random-test-path");
  record(randomPage.response.status === 404, "/random-test-path returns 404", `${randomPage.response.status}`);

  const missingAsset = await fetchText("/favicon-does-not-exist.ico");
  record(missingAsset.response.status === 404, "/missing top-level asset returns 404", `${missingAsset.response.status}`);

  const ads = await fetchText("/ads.txt");
  const adsContentType = ads.response.headers.get("content-type") || "";
  const adsIsValidState = ads.response.status === 404 || adsContentType.includes("text/plain");
  record(adsIsValidState, "/ads.txt is not rewritten to an HTML page", `${ads.response.status} ${adsContentType}`);
}

async function auditImages() {
  const assets = [
    "/opengraph-image.png",
    "/twitter-image.png",
    "/logo.png",
    "/logo-inverse.png",
    "/images/tools/free-ai-video-generator.png",
    "/images/tools/markdown-to-image.png",
    "/images/tools/ai-social-booster.png",
  ];

  for (const asset of assets) {
    const response = await fetch(absoluteUrl(asset), { redirect: "follow" });
    record(response.status === 200, `${asset} asset exists`, `${response.status}`);
  }
}

async function auditPages() {
  const pages = [
    {
      path: "/en",
      titleIncludes: "NavoKit",
      descriptionIncludes: "Create short AI videos",
      canonical: expectedUrl("/en"),
      schemas: ["Organization", "WebSite"],
      visibleText: ["Free online AI tools", "Explore tools"],
    },
    {
      path: "/zh",
      titleIncludes: "NavoKit",
      descriptionIncludes: "AI 短视频",
      canonical: expectedUrl("/zh"),
      schemas: ["Organization", "WebSite"],
      visibleText: ["免费 AI 工具箱", "浏览工具"],
    },
    {
      path: "/en/tools",
      titleIncludes: "Free AI Tools",
      descriptionIncludes: "Browse NavoKit tools",
      canonical: expectedUrl("/en/tools"),
      schemas: ["CollectionPage", "ItemList", "BreadcrumbList"],
      visibleText: ["Choose a tool", "Free AI Video Generator"],
    },
    {
      path: "/en/blog",
      titleIncludes: "Practical AI Tool Guides",
      descriptionIncludes: "Read practical NavoKit guides",
      canonical: expectedUrl("/en/blog"),
      schemas: ["CollectionPage", "ItemList", "BreadcrumbList"],
      visibleText: ["Turn small tools into steady workflows", "How to Convert Markdown to PNG"],
    },
    {
      path: "/en/about",
      titleIncludes: "About NavoKit",
      descriptionIncludes: "free online AI tools",
      canonical: expectedUrl("/en/about"),
      schemas: ["AboutPage", "Organization"],
      visibleText: ["Small tools for practical creative work", "The current tools are free to use", "Clear limits"],
    },
    {
      path: "/zh/about",
      titleIncludes: "关于 NavoKit",
      descriptionIncludes: "免费的在线 AI 工具",
      canonical: expectedUrl("/zh/about"),
      schemas: ["AboutPage", "Organization"],
      visibleText: ["为具体创作任务而生", "当前工具免费使用", "透明边界"],
    },
    {
      path: "/en/privacy",
      titleIncludes: "Privacy Policy",
      descriptionIncludes: "Learn how NavoKit handles data",
      canonical: expectedUrl("/en/privacy"),
      visibleText: ["Privacy Policy", "AI Video Generation", "Advertising and Cookies"],
    },
    {
      path: "/en/terms",
      titleIncludes: "Terms of Service",
      descriptionIncludes: "Read the terms",
      canonical: expectedUrl("/en/terms"),
      visibleText: ["Terms of Service", "Description of Service"],
    },
      {
        path: "/en/tools/free-ai-video-generator",
        titleIncludes: "Free AI Video Generator",
      descriptionIncludes: "Create short AI videos",
      canonical: expectedUrl("/en/tools/free-ai-video-generator"),
      schemas: ["WebApplication", "FAQPage", "BreadcrumbList"],
      visibleText: ["Describe the shot", "From one shot description to an AI video", "Questions, answered"],
    },
    {
      path: "/en/tools/markdown-to-image",
      titleIncludes: "Markdown to Image",
      descriptionIncludes: "Turn Markdown",
      canonical: expectedUrl("/en/tools/markdown-to-image"),
      schemas: ["WebApplication", "FAQPage", "BreadcrumbList"],
      visibleText: ["Paste Markdown", "From Markdown to a shareable image", "Questions, answered"],
    },
      {
        path: "/en/tools/ai-social-booster",
        titleIncludes: "AI Social Post Generator",
        descriptionIncludes: "Turn one idea",
        canonical: expectedUrl("/en/tools/ai-social-booster"),
        schemas: ["WebApplication", "FAQPage", "BreadcrumbList"],
        visibleText: ["Describe the idea", "From one idea to several editable drafts", "Questions, answered"],
      },
    {
      path: "/zh/tools/ai-social-booster",
      titleIncludes: "AI 社交媒体文案生成器",
      descriptionIncludes: "X 短帖",
      canonical: expectedUrl("/zh/tools/ai-social-booster"),
      schemas: ["WebApplication", "FAQPage", "BreadcrumbList"],
      visibleText: ["描述你的想法", "从一个想法到多版可编辑初稿", "常见问题"],
    },
    {
      path: "/en/blog/how-to-convert-markdown-to-png",
      titleIncludes: "How to Convert Markdown to PNG",
      descriptionIncludes: "turning Markdown",
      canonical: expectedUrl("/en/blog/how-to-convert-markdown-to-png"),
      schemas: ["BlogPosting", "BreadcrumbList"],
      visibleText: ["Why convert Markdown to an image", "Related tools", "Keep reading"],
    },
    {
      path: "/en/blog/how-to-generate-ai-videos-from-text",
      titleIncludes: "How to Generate an AI Video from a Text Prompt",
      descriptionIncludes: "writing a video prompt",
      canonical: expectedUrl("/en/blog/how-to-generate-ai-videos-from-text"),
      schemas: ["BlogPosting", "BreadcrumbList"],
      visibleText: ["When text-to-video is useful", "Step 1: Write one clear shot", "Privacy and rights"],
    },
    {
      path: "/en/blog/best-ai-video-prompt-examples",
      titleIncludes: "Best AI Video Prompt Examples",
      descriptionIncludes: "prompt patterns",
      canonical: expectedUrl("/en/blog/best-ai-video-prompt-examples"),
      schemas: ["BlogPosting", "BreadcrumbList"],
      visibleText: ["A simple prompt formula", "Product shot prompts", "Prompt patterns to avoid"],
    },
    {
      path: "/zh/blog/how-to-convert-markdown-to-png",
      titleIncludes: "如何把 Markdown 转成 PNG 图片",
      descriptionIncludes: "Markdown",
      canonical: expectedUrl("/zh/blog/how-to-convert-markdown-to-png"),
      schemas: ["BlogPosting", "BreadcrumbList"],
      visibleText: ["为什么要把 Markdown 转成图片", "相关工具"],
    },
  ];

  for (const page of pages) {
    const { response, text } = await fetchText(page.path);
    record(response.status === 200, `${page.path} returns 200`, `${response.status}`);
    checkHtmlPage(page, text);
  }
}

async function main() {
  console.log(`\nNavoKit SEO audit`);
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Canonical site URL: ${siteUrl}\n`);

  try {
    await auditRootRedirect();
    await auditRobots();
    await auditSitemap();
    await auditGeoDiscovery();
    await auditRoutingHygiene();
    await auditImages();
    await auditPages();
  } catch (error) {
    record(false, "audit runtime error", error instanceof Error ? error.message : String(error));
  }

  const failures = results.filter(result => !result.ok);
  console.log(`\nSummary: ${results.length - failures.length}/${results.length} checks passed.`);

  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const failure of failures) {
      console.log(`- ${failure.label}${failure.detail ? `: ${failure.detail}` : ""}`);
    }
    process.exitCode = 1;
  }
}

await main();
