"use client";

import { track } from "@vercel/analytics";

type ToolEventProperties = Record<string, string | number | boolean | null | undefined>;

function normalizeError(error: unknown) {
  if (error instanceof Error) return error.message.slice(0, 120);
  if (typeof error === "string") return error.slice(0, 120);
  return "unknown";
}

export function trackToolEvent(name: string, properties: ToolEventProperties = {}) {
  try {
    track(name, properties);
  } catch {
    // Analytics must never block the tool experience.
  }
}

export function trackToolError(name: string, error: unknown, properties: ToolEventProperties = {}) {
  trackToolEvent(name, {
    ...properties,
    error: normalizeError(error),
  });
}
