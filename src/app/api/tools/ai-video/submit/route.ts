import { NextResponse } from 'next/server';

export const maxDuration = 30; // Serverless function timeout: 30s

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (prompt.length > 1000) {
      return NextResponse.json({ error: 'Prompt is too long (max 1000 characters)' }, { status: 400 });
    }

    const apiKey = process.env.AGNES_API_KEY;
    if (!apiKey) {
      console.error("Missing AGNES_API_KEY");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
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
      
      const isPolicyViolation = 
        data.code === 'content_policy_violation' || 
        data.error?.code === 'content_policy_violation';
      
      if (isPolicyViolation) {
        return NextResponse.json(
          { error: '提示词触发了内容安全过滤策略（请尝试避免“压迫感”、“高潮”等敏感词）。 / Prompt triggered content safety policy (please avoid words like "oppression", "climax").' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Server is currently busy, please try again later' },
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
