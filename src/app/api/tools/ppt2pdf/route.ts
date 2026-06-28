import { NextResponse } from 'next/server';

export const maxDuration = 60; // Serverless function timeout: 60s
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const gotenbergUrl = process.env.GOTENBERG_URL;
    if (!gotenbergUrl) {
      console.error("GOTENBERG_URL is not set in environment variables");
      return NextResponse.json({ error: '服务端转换引擎未配置，请联系管理员' }, { status: 500 });
    }

    const baseUrl = gotenbergUrl.replace(/\/+$/, '');

    const formData = await req.formData();
    const file = formData.get('files') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Build the multipart body as one fixed-length byte array. Forwarding FormData
    // from Vercel as a stream can leave Gotenberg waiting for the closing boundary.
    const arrayBuffer = await file.arrayBuffer();
    const extension = file.name.toLowerCase().endsWith('.pptx') ? '.pptx' : '.ppt';
    const filename = `presentation${extension}`;
    const boundary = `----NavoKitBoundary${crypto.randomUUID().replaceAll('-', '')}`;
    const encoder = new TextEncoder();
    const preamble = encoder.encode(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="files"; filename="${filename}"\r\n` +
      `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`
    );
    const closing = encoder.encode(`\r\n--${boundary}--\r\n`);
    const outgoingBody = new Uint8Array(
      preamble.byteLength + arrayBuffer.byteLength + closing.byteLength
    );
    outgoingBody.set(preamble, 0);
    outgoingBody.set(new Uint8Array(arrayBuffer), preamble.byteLength);
    outgoingBody.set(closing, preamble.byteLength + arrayBuffer.byteLength);

    const res = await fetch(`${baseUrl}/forms/libreoffice/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': String(outgoingBody.byteLength),
      },
      body: outgoingBody,
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
