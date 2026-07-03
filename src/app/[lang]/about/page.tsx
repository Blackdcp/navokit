import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "../../../components/SiteFooter";
import SiteHeader from "../../../components/SiteHeader";
import { localizedCanonical, SITE_URL, SUPPORT_EMAIL } from "../../../lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const title =
    lang === "zh"
      ? "关于 NavoKit - 免费在线 AI 工具"
      : "About NavoKit - Free Online AI Tools for Creators";
  const description =
    lang === "zh"
      ? "了解 NavoKit 如何提供免费的在线 AI 工具、处理工具限制，并保持清晰、可用、透明的产品体验。"
      : "Learn how NavoKit provides free online AI tools with clear workflows, practical limits, and transparent product design.";

  return {
    title,
    description,
    alternates: localizedCanonical(lang, "/about"),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  const zh = lang === "zh";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${SITE_URL}/${lang}/about#about`,
        url: `${SITE_URL}/${lang}/about`,
        name: zh ? "关于 NavoKit - 免费在线 AI 工具" : "About NavoKit - Free Online AI Tools for Creators",
        description: zh
          ? "NavoKit 是一个免费的在线 AI 工具站，帮助用户完成短视频生成、Markdown 图片导出和社交媒体文案起草等具体任务。"
          : "NavoKit is a free online AI tool site for short video generation, Markdown image export, and social post drafting.",
        inLanguage: zh ? "zh-CN" : "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "NavoKit",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        email: SUPPORT_EMAIL,
      },
    ],
  };

  return (
    <div className="site-shell">
      <SiteHeader lang={lang} />

      <main className="marketing-container about-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />

        <section className="about-page__hero">
          <div>
            <span className="eyebrow">{zh ? "关于 NavoKit" : "About NavoKit"}</span>
            <h1>{zh ? "为具体创作任务而生的轻量工具箱。" : "Small tools for practical creative work."}</h1>
            <p>
              {zh
                ? "NavoKit 提供免费的在线 AI 工具，帮助创作者、开发者和运营人员完成一类很具体的任务：生成短视频、把 Markdown 变成可分享图片，或把一个想法整理成社交媒体文案初稿。"
                : "NavoKit provides free online AI tools for creators, developers, and marketers who need to finish specific content tasks: generate short videos, turn Markdown into shareable images, or draft social posts from one idea."}
            </p>
          </div>

          <aside className="about-page__panel" aria-label={zh ? "NavoKit 概览" : "NavoKit overview"}>
            <Image src="/logo-inverse.png" alt="NavoKit" width={1672} height={941} priority />
            <strong>{zh ? "清楚、快速、可用。" : "Clear. Fast. Usable."}</strong>
            <p>
              {zh
                ? "页面先服务用户要完成的工作，再承载搜索内容。工具可用、限制清楚、结果能带走。"
                : "The page starts with the job the user wants to finish. The tool should be usable, the limits should be clear, and the result should be ready to take away."}
            </p>
          </aside>
        </section>

        <section className="about-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{zh ? "我们解决什么" : "What NavoKit is for"}</span>
              <h2>{zh ? "把想法推进到可用素材。" : "Move an idea into a usable asset."}</h2>
            </div>
            <p>
              {zh
                ? "NavoKit 不追求复杂的工作流系统。它更像一个干净的工作台：输入清楚、动作明确、结果可以下载、复制或继续编辑。"
                : "NavoKit is not trying to become a heavy workflow suite. It works more like a clean workbench: clear input, obvious action, and an output you can download, copy, or keep editing."}
            </p>
          </div>

          <div className="about-card-grid">
            {(zh
              ? [
                  ["生成", "把一句视频描述变成短视频片段，用于创意测试、产品镜头或社交内容草稿。"],
                  ["整理", "把 Markdown、AI 回复和结构化笔记导出为干净的 PNG 图片。"],
                  ["发布", "把一个想法改写成适合 X、LinkedIn、Instagram 等渠道的文案初稿。"],
                ]
              : [
                  ["Create", "Turn a shot description into a short AI video for creative tests, product scenes, or social drafts."],
                  ["Package", "Export Markdown, AI responses, and structured notes as clean PNG image cards."],
                  ["Publish", "Rewrite one idea into editable drafts for X, LinkedIn, Instagram, and other social channels."],
                ]
            ).map(([title, text], index) => (
              <div className="about-fact-card" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section about-section--split">
          <div>
            <span className="eyebrow">{zh ? "免费模式" : "Free model"}</span>
            <h2>{zh ? "当前工具免费使用。" : "The current tools are free to use."}</h2>
          </div>
          <div className="about-copy-stack">
            <p>
              {zh
                ? "NavoKit 当前不要求注册，也不向用户收取工具使用费用。为了支持托管、开发和第三方 AI 生成成本，我们未来可能在页面中展示清晰标记的广告。"
                : "NavoKit does not require account registration and does not charge users for the current tools. To support hosting, development, and third-party AI generation costs, we may show clearly labeled advertising in the future."}
            </p>
            <p>
              {zh
                ? "广告不应该伪装成工具按钮，也不应该遮挡核心工作区。我们会优先保证用户可以顺利完成任务。"
                : "Ads should not imitate tool controls or block the core workspace. The priority is still helping users complete the task they came for."}
            </p>
          </div>
        </section>

        <section className="about-section about-section--split">
          <div>
            <span className="eyebrow">{zh ? "透明边界" : "Clear limits"}</span>
            <h2>{zh ? "哪里本地处理，哪里依赖外部服务，需要说清楚。" : "We explain what runs locally and what depends on external services."}</h2>
          </div>
          <div className="about-copy-stack">
            <p>
              {zh
                ? "部分工具，例如 Markdown 转图片，主要在浏览器中完成。AI 视频生成这类任务需要通过外部 AI 视频基础设施处理提示词和生成请求，因此不适合输入敏感或机密内容。"
                : "Some tools, such as Markdown to Image, run mostly in the browser. AI video generation depends on external AI video infrastructure to process prompts and generation requests, so users should not enter sensitive or confidential content."}
            </p>
            <p>
              {zh ? "你可以在隐私政策中查看更完整的数据处理说明。" : "You can read the full data handling notes in the Privacy Policy."}
            </p>
            <Link className="text-link" href={`/${lang}/privacy`}>
              {zh ? "查看隐私政策 →" : "Read the Privacy Policy →"}
            </Link>
          </div>
        </section>

        <section className="about-cta">
          <div>
            <span className="eyebrow">{zh ? "联系" : "Contact"}</span>
            <h2>{zh ? "发现问题，或者有工具建议？" : "Found an issue or have a tool idea?"}</h2>
            <p>
              {zh
                ? "NavoKit 是一个独立工具站。你可以通过邮箱提交问题、产品建议或合作咨询。"
                : "NavoKit is an independent tool site. You can email us about bugs, product feedback, or partnership inquiries."}
            </p>
          </div>
          <Link className="button button--ink" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </Link>
        </section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
