import { NextResponse } from 'next/server';

export const maxDuration = 30; // Serverless function timeout: 30s

export async function POST(req: Request) {
  try {
    const { prompt, duration = 81, aspectRatio = 'landscape' } = await req.json();

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

    // Determine dimensions based on aspectRatio
    let width = 1152;
    let height = 768;
    if (aspectRatio === 'portrait') {
      width = 768;
      height = 1152;
    }

    // Determine frames based on duration
    const validDurations = [81, 121, 241, 361];
    let num_frames = 81;
    if (validDurations.includes(Number(duration))) {
      num_frames = Number(duration);
    }

    // Call Agnes AI Video Generation API with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout to prevent Serverless timeout

    try {
      const response = await fetch('https://apihub.agnes-ai.com/v1/videos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "agnes-video-v2.0",
          prompt: prompt,
          height: height,
          width: width,
          num_frames: num_frames,
          frame_rate: 24
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Check if response is JSON to prevent backend crash
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error("Non-JSON upstream response:", text);
        return NextResponse.json(
          { error: '视频生成服务暂时不可用，请稍后再试。 / Upstream service is temporarily unavailable. Please try again later.' },
          { status: 502 }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        console.error("Agnes AI API Error:", data);
        
        const isPolicyViolation = 
          data.code === 'content_policy_violation' || 
          data.error?.code === 'content_policy_violation';
        
        if (isPolicyViolation) {
          return NextResponse.json(
            { error: '提示词未通过内容安全过滤，请修改提示词后重试。 / Prompt triggered content safety policy. Please modify your prompt and try again.' },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: '视频服务器繁忙，请稍后再试。 / Server is currently busy, please try again later.' },
          { status: response.status }
        );
      }

      return NextResponse.json({
        video_id: data.video_id,
        task_id: data.task_id
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        return NextResponse.json(
          { error: '请求视频服务器超时，请稍后再试。 / Request to video server timed out. Please try again.' },
          { status: 504 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
