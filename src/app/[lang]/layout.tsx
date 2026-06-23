import type { Metadata } from "next";
import "../globals.css";
import { getDictionary } from "../../lib/dictionaries";
import { Analytics } from '@vercel/analytics/react';
export async function generateMetadata({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang);
  
  return {
    metadataBase: new URL("https://navokit.com"),
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: "website",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/twitter-image.png"],
    }
  };
}

export default async function RootLayout({ 
  children,
  params,
}: { 
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body className={lang === 'en' ? 'font-en tracking-tight' : 'font-zh tracking-tight'}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
