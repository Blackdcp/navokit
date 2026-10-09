import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import SiteInformationPage from "@/components/submission/SiteInformationPage";
import { localizedCanonical, siteSocialMetadata, SUPPORT_EMAIL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh" }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "zh" ? "联系 NavoKit" : "Contact NavoKit";
  const description = lang === "zh" ? "推荐新产品、补充来源、更正信息，或反馈 NavoKit 的使用问题。" : "Suggest a new product, share a source, correct information, or report a problem with NavoKit.";
  return {
    title,
    description,
    alternates: localizedCanonical(lang, "/contact"),
    ...siteSocialMetadata(lang, "/contact", title, description),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  const zh = lang === "zh";
  const emailLink = (subject: string) => `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
  const cards = zh ? [
    { title: "推荐一个产品", text: "发现了新工具、特别的交互，或解决具体问题的项目？通过表单告诉我们它值得关注的原因。", href: `/${lang}/submit`, action: "提交产品" },
    { title: "补充来源或更正", text: "产品信息过时、链接失效或内容需要补充？请附上页面地址、需要修改的内容与可靠来源。", href: emailLink("NavoKit 信息更正"), action: "发送更正" },
    { title: "反馈使用问题", text: "遇到页面或工具异常？请说明页面地址、浏览器和操作步骤，帮助我们定位问题。", href: emailLink("NavoKit 使用问题"), action: "报告问题" },
  ] : [
    { title: "Share a product", text: "Found a new tool, an unusual interaction, or a project with a clear use? Tell us why it deserves a closer look.", href: `/${lang}/submit`, action: "Submit a product" },
    { title: "Add a source or correction", text: "Outdated details, a broken link, or missing context? Include the page URL, your correction, and a reliable source.", href: emailLink("NavoKit correction"), action: "Send a correction" },
    { title: "Report an issue", text: "A page or tool is not working as expected? Share the page URL, browser, and steps that led to the issue.", href: emailLink("NavoKit website issue"), action: "Report an issue" },
  ];

  return (
    <SiteInformationPage
      lang={lang}
      label={zh ? "联系我们" : "Contact"}
      title={zh ? "一个新发现，或一条改进建议。" : "A new discovery, or a way to improve."}
      lead={zh ? "推荐值得尝试的产品，帮助我们把信息做得更准确。选择下面的入口，我们会根据收到的内容跟进。" : "Share something worth trying, or help make the information more useful. Choose the right route below so we have the context to follow up."}
    >
      <div className="information-cards">
        {cards.map((card, index) => <section className="information-card" key={card.title}>
          <span>0{index + 1}</span><h2>{card.title}</h2><p>{card.text}</p>
          <Link href={card.href}>{card.action}<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </section>)}
      </div>
      <section className="information-contact">
        <h2>{zh ? "也可以直接发邮件" : "You can also email us"}</h2>
        <p>{zh ? "产品推荐需经过审核。发送邮件不会自动创建产品页面，也不保证回复或收录时间。请勿包含密码、API Key 或其他敏感信息。" : "Product suggestions are reviewed. Sending an email does not create a listing automatically, and we cannot guarantee a response or listing date. Please leave out passwords, API keys, and other sensitive information."}</p>
        <div className="information-actions"><a href={`mailto:${SUPPORT_EMAIL}`} className="button button--ink"><Mail size={16} aria-hidden="true" />{SUPPORT_EMAIL}</a></div>
      </section>
    </SiteInformationPage>
  );
}
