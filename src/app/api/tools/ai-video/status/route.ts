import { NextResponse } from "next/server";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const VIDEO_ID_PATTERN = /^video_[A-Za-z0-9+/=_-]{4,500}$/;
const PROVIDER_VIDEO_PATH = /^\/videos\/agnes-video-v2\.0\/(.+)$/;

function toPublicVideoUrl(value: unknown) {
  if (typeof value !== "string" || !value) return null;

  try {
    const url = new URL(value);
    const match = url.pathname.match(PROVIDER_VIDEO_PATH);
    if (!match) return null;
    return `/assets/video/${match[1]}`;
  } catch {
    const match = value.match(PROVIDER_VIDEO_PATH);
    if (!match) return null;
    return `/assets/video/${match[1]}`;
  }
}

export async function GET(request: Request) {
  try {
    const apiKey = process.env.AGNES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Video generation is temporarily unavailable." },
        { status: 503 },
      );
    }

    const videoId = new URL(request.url).searchParams.get("video_id") ?? "";
    if (!VIDEO_ID_PATTERN.test(videoId)) {
      return NextResponse.json({ error: "Invalid video ID." }, { status: 400 });
    }

    const endpoint = new URL("https://apihub.agnes-ai.com/agnesapi");
    endpoint.searchParams.set("video_id", videoId);
    endpoint.searchParams.set("model_name", "agnes-video-v2.0");

    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      console.error("Agnes video status failed", {
        status: response.status,
        providerError: data?.error?.message ?? data?.error ?? null,
      });
      const status = response.status === 404 ? 404 : response.status === 503 ? 503 : 502;
      return NextResponse.json(
        { error: status === 404 ? "Video task not found." : "Unable to check video status." },
        { status },
      );
    }

    const status = ["queued", "in_progress", "completed", "failed"].includes(data.status)
      ? data.status
      : "in_progress";

    return NextResponse.json({
      status,
      progress: Math.max(0, Math.min(100, Number(data.progress) || 0)),
      videoUrl: status === "completed" ? toPublicVideoUrl(data.remixed_from_video_id) : null,
      seconds: data.seconds ?? null,
      size: data.size ?? null,
      error: status === "failed" ? "Video generation failed. Try a different prompt." : null,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    console.error("Agnes video status exception", error);
    return NextResponse.json(
      { error: timedOut ? "Status check timed out." : "Unable to check video status." },
      { status: timedOut ? 504 : 500 },
    );
  }
}
