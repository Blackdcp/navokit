import { getProductCategories, type ProductCategoryId } from "@/lib/catalog";

export const SUBMISSION_CATEGORIES = getProductCategories("en").map(category => category.id);

export type SubmissionCategory = ProductCategoryId;
export type SubmissionField = "name" | "url" | "tagline" | "topic" | "email" | "notes";
export type SubmissionErrors = Partial<Record<SubmissionField, string>>;

export interface ProductSubmission {
  name: string;
  url: string;
  tagline: string;
  // Retain the API field name; its value identifies a product category, not an editorial topic.
  topic: SubmissionCategory;
  email: string;
  notes: string;
  language: "en" | "zh";
}

const labelsFor = (lang: "en" | "zh") => Object.fromEntries(
  getProductCategories(lang).map(category => [category.id, category.name]),
) as Record<SubmissionCategory, string>;

export const submissionCategoryLabels = { en: labelsFor("en"), zh: labelsFor("zh") };

export function validateSubmission(input: unknown):
  | { ok: true; data: ProductSubmission }
  | { ok: false; errors: SubmissionErrors; blocked?: boolean } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: { name: "required" } };
  }

  const raw = input as Record<string, unknown>;
  if (raw.company !== undefined && raw.company !== "") {
    return { ok: false, errors: {}, blocked: true };
  }

  const value = (key: string) => typeof raw[key] === "string" ? raw[key].trim() : "";
  const name = value("name");
  const url = value("url");
  const tagline = value("tagline");
  const topic = value("topic");
  const email = value("email");
  const notes = value("notes");
  const errors: SubmissionErrors = {};

  if (!name || name.length > 80 || /[\r\n\x00-\x1f]/.test(name)) errors.name = "name";
  if (!tagline || tagline.length > 200) errors.tagline = "tagline";
  if (!SUBMISSION_CATEGORIES.includes(topic as SubmissionCategory)) errors.topic = "topic";
  if (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) errors.email = "email";
  if (notes.length > 1000) errors.notes = "notes";

  try {
    const parsed = new URL(url);
    if (url.length > 2048 || !["http:", "https:"].includes(parsed.protocol) ||
        !parsed.hostname.includes(".") || parsed.username || parsed.password || /\s/.test(url)) {
      errors.url = "url";
    }
  } catch {
    errors.url = "url";
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { name, url, tagline, topic: topic as SubmissionCategory, email, notes, language: raw.language === "zh" ? "zh" : "en" },
  };
}

export function submissionEmailBody(data: ProductSubmission): string {
  return [
    "NavoKit product submission",
    "",
    `Product: ${data.name}`,
    `Website: ${data.url}`,
    `Summary: ${data.tagline}`,
    `Category: ${submissionCategoryLabels.en[data.topic]}`,
    `Contact email: ${data.email}`,
    `Language: ${data.language}`,
    "",
    "Additional context:",
    data.notes || "—",
  ].join("\n");
}
