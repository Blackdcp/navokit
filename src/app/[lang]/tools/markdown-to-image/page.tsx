import { getDictionary } from '../../../../lib/dictionaries';
import ChatExporter from '../../../../components/ChatExporter';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}): Promise<Metadata> {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang);

  return {
    title: dict.tools.chatExporter.meta.title,
    description: dict.tools.chatExporter.meta.description,
    openGraph: {
      title: dict.tools.chatExporter.meta.title,
      description: dict.tools.chatExporter.meta.description,
      type: "website",
      images: [
        {
          url: "/images/tools/markdown-to-image.png",
          width: 1200,
          height: 630,
          alt: dict.tools.chatExporter.meta.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.tools.chatExporter.meta.title,
      description: dict.tools.chatExporter.meta.description,
      images: ["/images/tools/markdown-to-image.png"],
    }
  }
}

export default async function ChatExporterPage({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang);

  return <ChatExporter dict={dict} lang={resolvedParams.lang} />;
}
