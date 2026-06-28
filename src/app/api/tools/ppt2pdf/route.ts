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

    const formData = await req.formData();

    const res = await fetch(`${baseUrl}/forms/libreoffice/convert`, {
      method: 'POST',
      body: formData,
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
