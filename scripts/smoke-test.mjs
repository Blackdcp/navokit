const DEFAULT_BASE_URL = "http://localhost:3001";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

const baseUrl = normalizeBaseUrl(process.env.SMOKE_TEST_BASE_URL || process.argv[2] || DEFAULT_BASE_URL);
const includeApi = process.env.SMOKE_TEST_API === "1";
const includeVideo = process.env.SMOKE_TEST_VIDEO === "1";
const results = [];

function normalizeBaseUrl(value) {
  return String(value).replace(/\/+$/, "");
}

function absoluteUrl(path) {
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function record(status, name, detail = "") {
  results.push({ status, name, detail });
  const color = status === "pass" ? GREEN : status === "warn" ? YELLOW : RED;
  const label = status.toUpperCase().padEnd(4);
  console.log(`${color}${label}${RESET} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fetchWithTimeout(url, init = {}, timeoutMs = 20_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function checkGet(path, options = {}) {
  const { textIncludes = [], contentTypeIncludes } = options;
  const response = await fetchWithTimeout(absoluteUrl(path), { cache: "no-store" });
  if (response.status !== 200) {
    record("fail", `GET ${path}`, `expected 200, received ${response.status}`);
    return;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentTypeIncludes && !contentType.includes(contentTypeIncludes)) {
    record("fail", `GET ${path}`, `expected content-type containing "${contentTypeIncludes}", received "${contentType}"`);
    return;
  }

  if (textIncludes.length) {
    const text = await response.text();
    const missing = textIncludes.filter(value => !text.includes(value));
    if (missing.length) {
      record("fail", `GET ${path}`, `missing text: ${missing.join(", ")}`);
      return;
    }
  }

  record("pass", `GET ${path}`);
}

async function checkJson(path, init, assertion, timeoutMs = 20_000) {
  const response = await fetchWithTimeout(absoluteUrl(path), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  }, timeoutMs);
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    record("fail", `${init.method || "GET"} ${path}`, "response was not JSON");
    return;
  }

  assertion(response, data);
}

async function run() {
  console.log(`Smoke testing ${baseUrl}`);

  await checkGet("/en", { textIncludes: ["NavoKit"] });
  await checkGet("/zh", { textIncludes: ["NavoKit"] });
  await checkGet("/en/tools", { textIncludes: ["Free AI Tools", "Markdown to Image", "Free AI Video Generator"] });
  await checkGet("/en/tools/markdown-to-image", { textIncludes: ["Markdown to Image", "logo-watermark.png", "Made with"] });
  await checkGet("/en/tools/ai-social-booster", { textIncludes: ["AI Social Post Generator", "X post", "LinkedIn post"] });
  await checkGet("/en/tools/free-ai-video-generator", { textIncludes: ["Free AI Video Generator"] });
  await checkGet("/logo-watermark.png", { contentTypeIncludes: "image/png" });
  await checkGet("/sitemap.xml", { contentTypeIncludes: "xml" });
  await checkGet("/robots.txt", { textIncludes: ["Sitemap:"] });

  await checkJson(
    "/api/tools/ai-video/submit",
    {
      method: "POST",
      body: JSON.stringify({ prompt: "short", format: "landscape", duration: "auto" }),
    },
    (response, data) => {
      if (response.status === 400 && typeof data?.error === "string") {
        record("pass", "POST /api/tools/ai-video/submit validation");
      } else {
        record("fail", "POST /api/tools/ai-video/submit validation", `expected 400, received ${response.status}`);
      }
    },
  );

  await checkJson(
    "/api/tools/ai-video/status?video_id=bad",
    { method: "GET" },
    (response, data) => {
      if (response.status === 400 && typeof data?.error === "string") {
        record("pass", "GET /api/tools/ai-video/status validation");
      } else {
        record("fail", "GET /api/tools/ai-video/status validation", `expected 400, received ${response.status}`);
      }
    },
  );

  if (includeApi) {
    await checkJson(
      "/api/tools/social-booster",
      {
        method: "POST",
        body: JSON.stringify({
          topic: "A practical workflow for turning rough notes into social media posts.",
          language: "en",
        }),
      },
      (response, data) => {
        const draftIds = Array.isArray(data?.drafts) ? data.drafts.map(item => item.id).sort().join(",") : "";
        if (response.ok && draftIds === "hooks,instagram,linkedin,x") {
          record("pass", "POST /api/tools/social-booster live API");
        } else {
          record("fail", "POST /api/tools/social-booster live API", `status ${response.status}, ids "${draftIds}"`);
        }
      },
    );
  } else {
    record("warn", "POST /api/tools/social-booster live API", "skipped; set SMOKE_TEST_API=1 to run");
  }

  if (includeVideo) {
    await checkJson(
      "/api/tools/ai-video/submit",
      {
        method: "POST",
        body: JSON.stringify({
          prompt: "A ceramic mug on a desk, morning sunlight, slow cinematic product shot.",
          format: "landscape",
          duration: "3",
        }),
      },
      (response, data) => {
        if (response.ok && typeof data?.videoId === "string") {
          record("pass", "POST /api/tools/ai-video/submit live API", `queued ${data.videoId}`);
          return;
        }
        if ([503, 504].includes(response.status) && typeof data?.error === "string") {
          record("warn", "POST /api/tools/ai-video/submit live API", `provider busy: ${data.error}`);
          return;
        }
        record("fail", "POST /api/tools/ai-video/submit live API", `status ${response.status}`);
      },
      130_000,
    );
  } else {
    record("warn", "POST /api/tools/ai-video/submit live API", "skipped; set SMOKE_TEST_VIDEO=1 to run");
  }

  const counts = results.reduce((acc, result) => {
    acc[result.status] += 1;
    return acc;
  }, { pass: 0, warn: 0, fail: 0 });

  console.log(`\nSummary: ${counts.pass} passed, ${counts.warn} warnings, ${counts.fail} failed`);
  if (counts.fail > 0) process.exit(1);
}

run().catch(error => {
  record("fail", "Smoke test crashed", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
