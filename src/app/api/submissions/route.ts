import { createHash } from "node:crypto";
import nodemailer from "nodemailer";
import { getSubmissionEmailConfig } from "@/components/submission/delivery";
import { submissionEmailBody, validateSubmission } from "@/lib/submissions";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 12_000;
const WINDOW_MS = 15 * 60 * 1000;
// A bounded, per-instance limiter. Shared rate limiting can replace this when traffic grows.
const attempts = new Map<string, { count: number; expires: number }>();

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function isSameOrigin(request: Request): boolean {
  try {
    const url = new URL(request.url);
    // Next can normalize the URL hostname to its bind address. Host preserves the
    // browser's target, including its port. Do not accept forwarded-host overrides.
    const host = request.headers.get("host") ?? url.host;
    if (!/^[a-z\d.:[\]-]+$/i.test(host)) return false;
    const expected = new URL(`${url.protocol}//${host}`).origin;
    return request.headers.get("origin") === expected;
  } catch {
    return false;
  }
}

function consumeAttempt(request: Request): boolean {
  const now = Date.now();
  for (const [key, entry] of attempts) if (entry.expires <= now) attempts.delete(key);
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") || "unknown";
  const key = createHash("sha256").update(address).digest("hex");
  const entry = attempts.get(key);
  if (entry && entry.count >= 3) return false;
  if (!entry && attempts.size >= 10_000) return false;
  attempts.set(key, { count: (entry?.count || 0) + 1, expires: entry?.expires || now + WINDOW_MS });
  return true;
}

async function readLimitedBody(request: Request): Promise<string | null> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return null;
  const reader = request.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return text + decoder.decode();
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      text += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json({ error: "origin" }, 403);
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return json({ error: "content_type" }, 415);
  }

  let input: unknown;
  try {
    const body = await readLimitedBody(request);
    if (body === null) return json({ error: "too_large" }, 413);
    input = JSON.parse(body);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const result = validateSubmission(input);
  if (!result.ok) return json({ error: "validation", fields: result.errors }, 400);

  const config = getSubmissionEmailConfig();
  if (!config) return json({ error: "email_unavailable", fallback: "email" }, 503);
  if (!consumeAttempt(request)) {
    return json({ error: "rate_limit", fallback: "email" }, 429, { "Retry-After": "900" });
  }

  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port !== 465,
    auth: config.auth,
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 12_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  try {
    const info = await transport.sendMail({
      from: { name: "NavoKit submissions", address: config.from },
      to: config.recipient,
      replyTo: result.data.email,
      subject: `[NavoKit] Product submission: ${result.data.name}`,
      text: submissionEmailBody(result.data),
    });
    if (!info.accepted?.length) return json({ error: "delivery_failed", fallback: "email" }, 502);
    return json({ status: "sent_for_review" }, 202);
  } catch {
    // Do not expose SMTP credentials, transport details, or submission content in logs/responses.
    return json({ error: "delivery_failed", fallback: "email" }, 502);
  } finally {
    transport.close();
  }
}
