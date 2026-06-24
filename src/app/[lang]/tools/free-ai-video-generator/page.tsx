import { getDictionary } from '../../../../lib/dictionaries';
import AiVideoClient from './ClientPage';

export async function generateMetadata({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }) {
  const { lang } = await params;
  
  const title = lang === 'en' ? 'Free AI Video Generator - Text to Video | NavoKit' : '免费 AI 视频生成器 - 文本转视频 | NavoKit';
  const description = lang === 'en' ? 'Convert text to stunning cinematic videos instantly using advanced AI models. Free to use.' : '使用高级 AI 模型将文字创意瞬间转化为电影级视频。完全免费使用。';
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: "/images/tools/free-ai-video-generator.png",
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/tools/free-ai-video-generator.png"],
    }
  };
}

export default async function AiVideoGeneratorPage({
  params,
}: {
  params: Promise<{ lang: 'zh' | 'en' }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <AiVideoClient dict={dict} lang={lang} />;
}
