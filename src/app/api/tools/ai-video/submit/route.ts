import { NextResponse } from 'next/server';

export const maxDuration = 30; // Serverless function timeout: 30s

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.AGNES_API_KEY;
    if (!apiKey) {
      console.error("Missing AGNES_API_KEY");
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Call Agnes AI Video Generation API
    const response = await fetch('https://apihub.agnes-ai.com/v1/videos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "agnes-video-v2.0",
        prompt: prompt,
        height: 768,
        width: 1152,
        num_frames: 81, // 81 frames @ 24 fps = ~3.3 seconds (good for quick free tool)
        frame_rate: 24
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Agnes AI API Error:", data);
      return NextResponse.json(
        { error: data.error?.message || 'Failed to generate video' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      video_id: data.video_id,
      task_id: data.task_id
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
