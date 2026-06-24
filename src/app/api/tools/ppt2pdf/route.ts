import { NextResponse } from 'next/server';

export const maxDuration = 60; // Serverless function timeout: 60s

export async function POST(req: Request) {
  try {
    const gotenbergUrl = process.env.GOTENBERG_URL;
    if (!gotenbergUrl) {
      console.error("GOTENBERG_URL is not set in environment variables");
      return NextResponse.json({ error: '服务端转换引擎未配置，请联系管理员' }, { status: 500 });
    }

    const baseUrl = gotenbergUrl.replace(/\/+$/, '');

    // Proxy the raw multipart stream directly to Gotenberg to prevent Node.js fetch hang
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const res = await fetch(`${baseUrl}/forms/libreoffice/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: req.body as any, // Pass the raw ReadableStream
      duplex: 'half' // Required by Node.js when body is a stream
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gotenberg error:", res.status, errText);
      // Expose the raw error from the Gotenberg server to help debugging
      return NextResponse.json({ error: `引擎报错 (${res.status}): ${errText.substring(0, 100)}` }, { status: 502 });
    }

    // Return the PDF stream back to the client
    const pdfBlob = await res.blob();
    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="converted.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error proxying to Gotenberg:', error);
    return NextResponse.json({ error: `连接引擎失败: ${error.message}` }, { status: 500 });
  }
}
