import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { isRecordedDateCurrent } from "./crawl-check.mjs";

const now = Date.parse("2026-10-08T17:24:00Z"); // 2026-10-09 01:24 in Shanghai.

test("calendar dates use the site's Shanghai day without inventing a UTC time", () => {
  assert.equal(isRecordedDateCurrent("2026-10-09", now), true);
  assert.equal(isRecordedDateCurrent("2026-10-08", now), true);
  assert.equal(isRecordedDateCurrent("2026-10-10", now), false);
  assert.equal(isRecordedDateCurrent("2026-10-09", Date.parse("2026-10-08T15:59:59Z")), false);
  assert.equal(isRecordedDateCurrent("2026-10-09", Date.parse("2026-10-08T16:00:00Z")), true);
});

test("timestamps retain instant-level future checks and explicit timezones", () => {
  assert.equal(isRecordedDateCurrent("2026-10-08T17:24:00Z", now), true);
  assert.equal(isRecordedDateCurrent("2026-10-09T01:24:00+08:00", now), true);
  assert.equal(isRecordedDateCurrent("2026-10-09T01:24:01+08:00", now), false);
  assert.equal(isRecordedDateCurrent("2026-10-09T00:00:00Z", now), false);
  assert.equal(isRecordedDateCurrent("2026-10-08T17:24:00", now), false);
});

test("invalid calendar days are rejected even when Date.parse normalizes them", () => {
  for (const value of ["2026-02-29", "2026-02-30", "2026-02-30T01:00:00+08:00", "2026-13-01", "2026-10-00", "2026-10-32", "2026-10-09T99:00:00Z", "invalid"]) {
    assert.equal(isRecordedDateCurrent(value, now), false, value);
  }
  assert.equal(isRecordedDateCurrent("2024-02-29", now), true);
});

test("sitemap preserves recorded date precision and timezone instead of adding UTC midnight", () => {
  const timestamp = "2026-10-09T01:24:00+08:00";
  const realDate = new Date("2026-10-08T17:24:00Z");
  const samples = ["2026-10-09", timestamp, realDate, "2026-02-30", "2026-02-30T01:00:00+08:00"];
  const imports = {
    "../lib/blog": { getBlogPosts: () => [] },
    "../lib/catalog": {
      getCatalogProducts: () => samples.map((verifiedAt, index) => ({ slug: `sample-${index}`, verifiedAt })),
      getProductCategories: () => [],
      getProductHref: (product, lang) => `/${lang}/tools/${product.slug}`,
      getTopics: () => [],
    },
    "../lib/site": { SITE_URL: "https://www.navokit.com", SUPPORTED_LANGUAGES: ["en", "zh"] },
  };
  const source = readFileSync(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const compiledModule = { exports: {} };
  new vm.Script(outputText).runInNewContext({ module: compiledModule, exports: compiledModule.exports, Date, require: id => {
    if (!(id in imports)) throw new Error(`Unexpected sitemap import: ${id}`);
    return imports[id];
  } }, { timeout: 3000 });
  const entries = compiledModule.exports.default();
  const modified = index => entries.find(entry => entry.url.endsWith(`/en/tools/sample-${index}`)).lastModified;
  assert.equal(modified(0), "2026-10-09");
  assert.equal(modified(1), timestamp);
  assert.equal(modified(2), realDate);
  assert.equal(modified(3), undefined);
  assert.equal(modified(4), undefined);
});
