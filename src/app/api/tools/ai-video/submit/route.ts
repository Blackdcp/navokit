import { NextResponse } from "next/server";

export const maxDuration = 60;

const AGNES_ENDPOINT = "https://apihub.agnes-ai.com/v1/videos";
const MODEL = "agnes-video-v2.0";

const formats = {
  landscape: { width: 1152, height: 768 },
  portrait: { width: 768, height: 1152 },
  square: { width: 768, height: 768 },
} as const;

const durations = {
  "3": 81,
  "5": 121,
} as const;

function isFormat(value: unknown): value is keyof typeof formats {
  return typeof value === "string" && value in formats;
}

function isDuration(value: unknown): value is keyof typeof durations {
  return typeof value === "string" && value in durations;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;
const attempts = new Map<string, number[]>();

function isRateLimited(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const client = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const recent = (attempts.get(client) ?? []).filter(timestamp => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  attempts.set(client, recent);
  return false;
}

function errorMessage(status: number) {
  if (status === 401) return "Video generation is temporarily unavailable.";
  if (status === 503) return "Video generation is busy. Please try again shortly.";
  if (status === 400) return "The video request was rejected. Try revising your prompt.";
  return "The video service could not start this request.";
}

function isTimeoutError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return error.name === "TimeoutError" || error.name === "AbortError";
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.AGNES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Video generation is temporarily unavailable." },
        { status: 503 },
      );
    }
    if (isRateLimited(request)) {
      return NextResponse.json(
        { error: "Generation limit reached. Please try again in a few minutes." },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    }

    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const format = body.format;
    const duration = String(body.duration ?? "");

    if (prompt.length < 10 || prompt.length > 1200) {
      return NextResponse.json(
        { error: "Prompt must be between 10 and 1,200 characters." },
        { status: 400 },
      );
    }
    if (!isFormat(format) || !isDuration(duration)) {
      return NextResponse.json({ error: "Invalid video settings." }, { status: 400 });
    }

    const response = await fetch(AGNES_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        ...formats[format],
        num_frames: durations[duration],
        frame_rate: 24,
      }),
      signal: AbortSignal.timeout(55_000),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.video_id) {
      console.error("Agnes video submit failed", {
        status: response.status,
        providerError: data?.error?.message ?? data?.error ?? null,
      });
      return NextResponse.json(
        { error: errorMessage(response.status) },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 },
      );
    }

    return NextResponse.json({
      videoId: data.video_id,
      status: data.status ?? "queued",
      progress: Number(data.progress) || 0,
      seconds: data.seconds ?? null,
      size: data.size ?? null,
    });
  } catch (error) {
    const timedOut = isTimeoutError(error);
    console.error("Agnes video submit exception", error);
    return NextResponse.json(
      { error: timedOut ? "The video service timed out. Please try again." : "Unable to start video generation." },
      { status: timedOut ? 504 : 500 },
    );
  }
}
