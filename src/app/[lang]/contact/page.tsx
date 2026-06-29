import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../../../components/SiteFooter";
import SiteHeader from "../../../components/SiteHeader";
import { localizedCanonical } from "../../../lib/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh" }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "zh" ? "联系 NavoKit" : "Contact NavoKit",
    description: lang === "zh" ? "联系 NavoKit，提交问题、产品反馈或合作咨询。" : "Contact NavoKit for bug reports, product feedback, or partnership inquiries.",
    alternates: localizedCanonical(lang, "/contact"),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  const zh = lang === "zh";
  return (
    <div className="site-shell">
      <SiteHeader lang={lang} />
      <main className="marketing-container contact-page">
        <span className="eyebrow">{zh ? "联系我们" : "Contact"}</span>
        <h1>{zh ? "告诉我们哪里可以做得更好。" : "Tell us what could work better."}</h1>
        <p>{zh ? "如果你发现了问题、有产品建议，或希望讨论合作，可以直接发送邮件。请勿在邮件中包含密码、API Key 或其他敏感信息。" : "For bug reports, product feedback, or partnerships, send us an email. Do not include passwords, API keys, or other sensitive information."}</p>
        <Link className="button button--ink" href="mailto:admin@navokit.com">admin@navokit.com</Link>
        <div className="contact-grid">
          <div><strong>{zh ? "问题反馈" : "Bug reports"}</strong><p>{zh ? "请附上页面地址、浏览器和复现步骤。" : "Include the page URL, browser, and steps to reproduce."}</p></div>
          <div><strong>{zh ? "工具建议" : "Tool feedback"}</strong><p>{zh ? "告诉我们你想完成什么任务，以及目前哪里不顺。" : "Tell us the task you want to finish and where the current flow gets in the way."}</p></div>
          <div><strong>{zh ? "合作咨询" : "Partnerships"}</strong><p>{zh ? "简要说明合作方式、受众和预期目标。" : "Briefly describe the partnership, audience, and intended outcome."}</p></div>
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
