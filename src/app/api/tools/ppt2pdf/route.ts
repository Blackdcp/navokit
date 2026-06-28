import { NextResponse } from 'next/server';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

export const maxDuration = 60; // Serverless function timeout: 60s
export const runtime = 'nodejs';
export const preferredRegion = 'sin1';

function postMultipart(urlString: string, body: Buffer, contentType: string) {
  return new Promise<{ status: number; body: Buffer }>((resolve, reject) => {
    const url = new URL(urlString);
    const request = url.protocol === 'https:' ? httpsRequest : httpRequest;
    const outgoingRequest = request(url, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Content-Length': body.byteLength,
      },
    }, (response) => {
      const chunks: Buffer[] = [];

      response.on('data', (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      response.on('end', () => {
        resolve({
          status: response.statusCode ?? 500,
          body: Buffer.concat(chunks),
        });
      });
    });

    outgoingRequest.setTimeout(55_000, () => {
      outgoingRequest.destroy(new Error('Gotenberg request timed out'));
    });
    outgoingRequest.on('error', reject);
    outgoingRequest.end(body);
  });
}

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
    const outgoingBody = Buffer.concat([
      Buffer.from(preamble),
      Buffer.from(arrayBuffer),
      Buffer.from(closing),
    ]);
    const result = await postMultipart(
      `${baseUrl}/forms/libreoffice/convert`,
      outgoingBody,
      `multipart/form-data; boundary=${boundary}`
    );

    if (result.status < 200 || result.status >= 300) {
      const errText = result.body.toString('utf8');
      console.error("Gotenberg error:", result.status, errText);
      // Expose the raw error from the Gotenberg server to help debugging
      return NextResponse.json({ error: `引擎报错 (${result.status}): ${errText.substring(0, 100)}` }, { status: 502 });
    }

    const pdf = new Uint8Array(result.body.byteLength);
    pdf.set(result.body);
    return new NextResponse(pdf.buffer, {
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
