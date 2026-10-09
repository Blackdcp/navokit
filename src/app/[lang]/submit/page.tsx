import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Compass } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SubmissionForm from "@/components/submission/SubmissionForm";
import { getSubmissionEmailConfig } from "@/components/submission/delivery";
import { localizedCanonical, siteSocialMetadata } from "@/lib/site";
import "./submission.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh" }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "zh" ? "提交产品 · NavoKit" : "Submit a product · NavoKit";
  const description = lang === "zh" ? "向 NavoKit 推荐新锐、有独特体验或明确用途的科技产品与开源项目。免费提交，审核后决定是否收录。" : "Recommend an emerging tech product or open-source project with a distinctive experience or a clear use. Free submission, subject to review.";
  return {
    title,
    description,
    ...siteSocialMetadata(lang, "/submit", title, description),
    alternates: localizedCanonical(lang, "/submit"),
  };
}

export default async function SubmitPage({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  const zh = lang === "zh";
  const notes = zh
    ? ["有明确用途，或让人眼前一亮的交互", "提供可访问的官网、演示或开源仓库", "说明当前状态：可用、测试中或等待名单"]
    : ["A clear use or a distinctive way of getting things done", "An accessible official website, demo, or repository", "Its current status: available, beta, or waitlist"];

  return (
    <div className="site-shell submission-shell">
      <SiteHeader lang={lang} />
      <main className="marketing-container submission-page">
        <Link href={`/${lang}/tools`} className="submission-back"><ArrowLeft size={15} />{zh ? "返回产品库" : "Back to products"}</Link>
        <div className="submission-layout">
          <section className="submission-intro">
            <span className="submission-kicker">{zh ? "提交产品" : "Submit a product"}</span>
            <h1>{zh ? <>发现新东西，<br />从你的推荐开始。</> : <>Share a product<br />worth discovering.</>}</h1>
            <p>{zh ? "一个新发布的工具，一种独特的使用体验，或一个解决具体问题的项目。你可以是创造者，也可以是它的使用者。" : "A newly launched tool, a distinctive experience, or a project that solves a specific problem. You can be its maker or someone who uses it."}</p>
            <div className="submission-expectations">
              <span className="submission-symbol"><Compass size={23} strokeWidth={1.6} /></span>
              <h2>{zh ? "我们希望了解" : "What we look for"}</h2>
              <ul>{notes.map(note => <li key={note}><Check size={16} /><span>{note}</span></li>)}</ul>
              <p>{zh ? "提交免费。收到后，我们会核对产品信息，再决定是否收录。提交不保证上线时间、流量或收录结果。" : "Submitting is free. We review the information before deciding whether to list a product. Inclusion, timing, and traffic are not guaranteed."}</p>
            </div>
          </section>
          <SubmissionForm lang={lang} emailConfigured={Boolean(getSubmissionEmailConfig())} />
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
