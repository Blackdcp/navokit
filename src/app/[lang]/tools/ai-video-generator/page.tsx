import { getDictionary } from '../../../../lib/dictionaries';
import AiVideoClient from './ClientPage';

export async function generateMetadata({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return {
    title: lang === 'en' ? 'Free AI Video Generator - Text to Video | ChengZi AI' : '免费 AI 视频生成器 - 文字生视频 | 橙子 AI',
    description: lang === 'en' ? 'Convert text to stunning cinematic videos instantly using advanced AI models. Free to use.' : '使用高级 AI 模型将文字创意瞬间转化为电影级视频。完全免费使用。',
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
