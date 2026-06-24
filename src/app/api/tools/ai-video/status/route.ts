import { NextResponse } from 'next/server';

export const maxDuration = 60; // Serverless function timeout: 60s

export async function GET(req: Request) {
  let lang = 'en';
  try {
    const { searchParams } = new URL(req.url);
    const video_id = searchParams.get('video_id');
    lang = searchParams.get('lang') || 'en';

    if (!video_id) {
      return NextResponse.json(
        { error: lang === 'zh' ? '缺少 video_id 参数。' : 'video_id is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.AGNES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: lang === 'zh' ? '服务器配置错误。' : 'Server misconfiguration.' },
        { status: 500 }
      );
    }

    // Call Agnes AI Status API with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55s timeout to prevent Serverless timeout

    try {
      const response = await fetch(`https://apihub.agnes-ai.com/agnesapi?video_id=${video_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        cache: 'no-store',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Check if response is JSON to prevent backend crash
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error("Non-JSON upstream status response:", text);
        return NextResponse.json(
          { error: lang === 'zh' ? '无法获取视频生成状态，服务暂时不可用。' : 'Failed to get video status. Upstream service is temporarily unavailable.' },
          { status: 502 }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        console.error("Agnes AI API Error (Status):", data);
        return NextResponse.json(
          { error: data.error?.message || (lang === 'zh' ? '获取状态失败。' : 'Failed to check status.') },
          { status: response.status }
        );
      }

      // Extract relevant data for the frontend and rewrite the URL to hide the backend domain and model path
      const rawUrl = data.remixed_from_video_id || null;
      let videoUrl = null;
      if (rawUrl && rawUrl.startsWith('https://platform-outputs.agnes-ai.space/videos/agnes-video-v2.0/')) {
        videoUrl = rawUrl.replace('https://platform-outputs.agnes-ai.space/videos/agnes-video-v2.0/', '/assets/video/');
      } else {
        videoUrl = rawUrl;
      }

      return NextResponse.json({
        status: data.status,
        progress: data.progress,
        video_url: videoUrl
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        return NextResponse.json(
          { error: lang === 'zh' ? '请求视频服务器超时。' : 'Request to video status server timed out.' },
          { status: 504 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error('Video status error:', error);
    return NextResponse.json(
      { error: lang === 'zh' ? '内部服务器错误。' : 'Internal server error.' },
      { status: 500 }
    );
  }
}
