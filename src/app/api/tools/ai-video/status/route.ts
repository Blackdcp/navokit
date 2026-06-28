import { NextResponse } from 'next/server';

export const maxDuration = 30; // Serverless function timeout: 30s

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const video_id = searchParams.get('video_id');

    if (!video_id) {
      return NextResponse.json({ error: 'video_id is required' }, { status: 400 });
    }

    const apiKey = process.env.AGNES_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Call Agnes AI Status API
    const response = await fetch(`https://apihub.agnes-ai.com/agnesapi?video_id=${video_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      // Disable cache so we always get the latest polling status
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Agnes AI API Error (Status):", data);
      return NextResponse.json(
        { error: data.error?.message || 'Failed to check status' },
        { status: response.status }
      );
    }

    // Extract relevant data for the frontend
    return NextResponse.json({
      status: data.status,
      progress: data.progress,
      video_url: data.remixed_from_video_id || null
    });
  } catch (error) {
    console.error('Video status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
