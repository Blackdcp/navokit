import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const projectRoot = new URL("../", import.meta.url);

// Exercise the actual TypeScript modules with a fake mail transport; no network or credentials.
function loadTypeScript(path, imports = {}) {
  const moduleUrl = new URL(path, projectRoot);
  const source = readFileSync(moduleUrl, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: fileURLToPath(new URL(path, projectRoot)),
  });
  const compiledModule = { exports: {} };
  const localRequire = id => {
    if (Object.hasOwn(imports, id)) return imports[id];
    if (id.startsWith(".")) return loadTypeScript(new URL(`${id}.ts`, moduleUrl), imports);
    if (id.startsWith("@/")) return loadTypeScript(`src/${id.slice(2)}.ts`, imports);
    return require(id);
  };
  new Function("require", "module", "exports", outputText)(localRequire, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}

const catalog = loadTypeScript("src/lib/catalog.ts");
const helpers = loadTypeScript("src/lib/submissions.ts", { "@/lib/catalog": catalog });
const valid = {
  name: "  Useful app  ", url: "https://example.org/tool", tagline: "Helps people create.",
  topic: "video", email: "creator@example.org", notes: "", language: "zh", company: "",
};
const normalized = helpers.validateSubmission(valid);
assert.equal(normalized.ok, true);
assert.equal(normalized.data.name, "Useful app");
assert.match(helpers.submissionEmailBody(normalized.data), /Category: Video creation/);

// The directory, translated form labels, and server validator share one category source.
const categories = catalog.getProductCategories("en");
assert.equal(categories.length, 15);
assert.deepEqual(helpers.SUBMISSION_CATEGORIES, categories.map(category => category.id));
for (const category of helpers.SUBMISSION_CATEGORIES) {
  assert.equal(helpers.validateSubmission({ ...valid, topic: category }).ok, true, category);
  for (const locale of ["en", "zh"]) {
    assert.equal(helpers.submissionCategoryLabels[locale][category], catalog.getProductCategories(locale).find(item => item.id === category).name);
  }
}
for (const [field, value] of [
  ["url", "javascript:alert(1)"], ["url", "https://user:pass@example.org"], ["url", "https://localhost"],
  ["email", "a@example.org\r\nBcc:other@example.org"], ["name", "Name\r\nInjected header"],
  ["name", "x".repeat(81)], ["tagline", "x".repeat(201)], ["notes", "x".repeat(1001)],
  ["topic", "agents-knowledge"], ["topic", "models-api"], ["topic", "infrastructure"], ["topic", "unknown"],
]) {
  const result = helpers.validateSubmission({ ...valid, [field]: value });
  assert.equal(result.ok, false, `${field} should be rejected`);
  assert.ok(result.errors[field]);
}
assert.equal(helpers.validateSubmission(null).ok, false);
assert.equal(helpers.validateSubmission([]).ok, false);
assert.equal(helpers.validateSubmission({ ...valid, company: "Bot" }).ok, false);

let configured = false;
let delivery = "accepted";
let attemptedMessages = 0;
let lastMessage;
const { POST } = loadTypeScript("src/app/api/submissions/route.ts", {
  "@/lib/submissions": helpers,
  "@/components/submission/delivery": {
    getSubmissionEmailConfig: () => configured ? {
      host: "smtp.test", port: 465, auth: { user: "test", pass: "test" },
      recipient: "review@example.org", from: "site@example.org",
    } : null,
  },
  nodemailer: {
    createTransport: () => ({
      sendMail: async message => {
        attemptedMessages++;
        lastMessage = message;
        if (delivery === "error") throw new Error("Simulated transport failure");
        return { accepted: delivery === "accepted" ? ["review@example.org"] : [] };
      },
      close() {},
    }),
  },
});

function request(body = valid, headers = {}, url = "https://navokit.example/api/submissions") {
  return new Request(url, {
    method: "POST",
    headers: { origin: "https://navokit.example", "content-type": "application/json", "x-forwarded-for": "192.0.2.1", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

assert.equal((await POST(request(valid, { origin: "https://other.example" }))).status, 403);
// Next's internal hostname may differ from the browser's actual Host header.
const normalizedLocalUrl = "http://localhost:3001/api/submissions";
assert.equal((await POST(request({}, { host: "127.0.0.1:3001", origin: "http://127.0.0.1:3001" }, normalizedLocalUrl))).status, 400);
assert.equal((await POST(request({}, { host: "127.0.0.1:3001", origin: "http://localhost:3001" }, normalizedLocalUrl))).status, 403);
assert.equal((await POST(request({}, { host: "navokit.example", origin: "https://other.example", "x-forwarded-host": "other.example" }))).status, 403);
assert.equal((await POST(request({}, { host: "navokit.example", origin: "http://navokit.example" }))).status, 403);
assert.equal((await POST(request({}, { host: "navokit.example@other.example", origin: "https://other.example" }))).status, 403);
assert.equal((await POST(request(valid, { "content-type": "text/plain" }))).status, 415);
assert.equal((await POST(request("{"))).status, 400);
assert.equal((await POST(request({ ...valid, url: "javascript:alert(1)" }))).status, 400);
assert.equal((await POST(request({ ...valid, company: "Bot" }))).status, 400);
assert.equal((await POST(request("x".repeat(12_001)))).status, 413);
const unavailable = await POST(request());
assert.equal(unavailable.status, 503);
assert.equal((await unavailable.json()).fallback, "email");
assert.equal(attemptedMessages, 0, "Unconfigured submissions must never report success or send");

configured = true;
const accepted = await POST(request());
assert.equal(accepted.status, 202);
assert.equal((await accepted.json()).status, "sent_for_review");
assert.equal(lastMessage.to, "review@example.org");
assert.equal(lastMessage.replyTo, valid.email);
assert.match(lastMessage.text, /Category: Video creation/);
delivery = "error";
assert.equal((await POST(request())).status, 502);
delivery = "rejected";
assert.equal((await POST(request())).status, 502);
assert.equal((await POST(request())).status, 429);
assert.equal(attemptedMessages, 3);

console.log("Submission checks passed: 15 shared categories, input safety, honest delivery states, and abuse controls. No email sent.");
