import { NextResponse } from 'next/server';

export const maxDuration = 60; // Serverless function timeout: 60s

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('files');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided or invalid file' }, { status: 400 });
    }

    const gotenbergUrl = process.env.GOTENBERG_URL;
    if (!gotenbergUrl) {
      console.error("GOTENBERG_URL is not set in environment variables");
      return NextResponse.json({ error: '服务端转换引擎未配置，请联系管理员' }, { status: 500 });
    }

    const baseUrl = gotenbergUrl.replace(/\/+$/, '');

    // Forward the file to Gotenberg
    // Gotenberg requires multipart/form-data with the key "files"
    const outgoingFormData = new FormData();
    const buffer = await (file as Blob).arrayBuffer();
    const newBlob = new Blob([buffer], { type: (file as Blob).type });
    outgoingFormData.append('files', newBlob, (file as File).name || 'document.pptx');

    const res = await fetch(`${baseUrl}/forms/libreoffice/convert`, {
      method: 'POST',
      body: outgoingFormData,
      // Increase timeout for large conversions if supported by the environment, default fetch handles it but Vercel limits functions to 10s-60s based on plan.
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gotenberg error:", res.status, errText);
      return NextResponse.json({ error: '文档转换引擎处理失败' }, { status: 502 });
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
    return NextResponse.json({ error: '服务器内部处理错误' }, { status: 500 });
  }
}
