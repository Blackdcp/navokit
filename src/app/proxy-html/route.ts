import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://1key6868.com/', { cache: 'no-store' });
    let html = await res.text();
    
    // Replace the Feishu document link
    html = html.replace(
      'https://my.feishu.cn/wiki/Xg2CwrNGkidqS0kCI8HcfMREnJO',
      'https://xmb12345.feishu.cn/wiki/L0zewiJp8iYepekzCZvcRJ28nTc?from=from_copylink'
    ).replace(
      'https://my.feishu.cn/wiki/Ho3Jw2WLFi0NMxkN4jyclCoknMd',
      'https://xmb12345.feishu.cn/wiki/HZy5wdx05ied2XkZbcIc3fkynCe?renamingWikiNode=false'
    );

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return new NextResponse('Error loading activation page', { status: 500 });
  }
}
