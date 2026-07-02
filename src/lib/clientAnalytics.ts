"use client";

import { track } from "@vercel/analytics";

type ToolEventProperties = Record<string, string | number | boolean | null | undefined>;

function normalizeError(error: unknown) {
  if (error instanceof Error) return error.message.slice(0, 120);
  if (typeof error === "string") return error.slice(0, 120);
  return "unknown";
}

function normalizeProperties(properties: ToolEventProperties) {
  return Object.fromEntries(
    Object.entries(properties).filter((entry): entry is [string, string | number | boolean] => {
      const value = entry[1];
      return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
    })
  );
}

export function trackToolEvent(name: string, properties: ToolEventProperties = {}) {
  try {
    track(name, properties);
  } catch {
    // Analytics must never block the tool experience.
  }

  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;

    window.gtag("event", name, normalizeProperties({
      event_category: "tool",
      ...properties,
    }));
  } catch {
    // Google Analytics must never block the tool experience.
  }
}

export function trackToolError(name: string, error: unknown, properties: ToolEventProperties = {}) {
  trackToolEvent(name, {
    ...properties,
    error: normalizeError(error),
  });
}
