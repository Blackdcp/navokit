import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://apihub.agnes-ai.com/v1';

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, language } = await req.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    if (topic.length > 500) {
      return NextResponse.json({ error: 'Topic is too long (max 500 characters)' }, { status: 400 });
    }

    const AGNES_API_KEY = process.env.AGNES_API_KEY;
    if (!AGNES_API_KEY) {
      console.error("Missing AGNES_API_KEY");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const platformName = platform === 'twitter' ? 'Twitter/X' : platform === 'instagram' ? 'Instagram' : 'Xiaohongshu (小红书)';
    
    const prompt = `You are a professional social media copywriter. Create a highly engaging post for ${platformName} about the following topic: "${topic}".
    
Requirements:
1. Write the post in ${language === 'zh' ? 'Chinese (中文)' : 'English'}.
2. Match the specific tone and style of ${platformName} (e.g., short and concise for Twitter, highly visual with emojis for Instagram, engaging and authentic with lots of emojis for Xiaohongshu).
3. Include highly relevant hashtags at the end.
4. Output ONLY the post content, no explanations or introductory text.`;

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AGNES_API_KEY}`
      },
      body: JSON.stringify({
        model: 'agnes-2.0-flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Agnes API Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate content' }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    return NextResponse.json({ content });

  } catch (error) {
    console.error('Social Booster API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
