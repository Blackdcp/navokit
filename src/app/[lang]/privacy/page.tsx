import type { Metadata } from "next";
import SiteInformationPage from "@/components/submission/SiteInformationPage";
import { localizedCanonical, SUPPORT_EMAIL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh" }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "zh" ? "隐私政策 | NavoKit" : "Privacy Policy | NavoKit",
    description: lang === "zh" ? "了解 NavoKit 如何处理产品推荐、访问统计、广告与站内工具相关的数据。" : "How NavoKit handles product submissions, site analytics, advertising, and data used by its utilities.",
    alternates: localizedCanonical(lang, "/privacy"),
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  const zh = lang === "zh";
  return (
    <SiteInformationPage lang={lang} narrow label={zh ? "网站政策" : "Site policies"} title={zh ? "隐私政策" : "Privacy Policy"} lead={zh ? "本页说明浏览产品与内容、推荐产品，以及使用站内工具时，哪些信息可能被处理。" : "This page explains the information involved when you browse products and content, recommend a product, or use a NavoKit utility."}>
      <p className="information-updated">{zh ? "最后更新：2026 年 10 月 8 日" : "Last updated: October 8, 2026"}</p>
      <article className="information-document">
        {zh ? <>
          <section><h2>1. 浏览与外部链接</h2><p>浏览 NavoKit 的产品库、专题和内容无需注册账号。产品官网、发布来源以及文章中的外部链接由各自的运营方提供；访问这些网站后，其隐私政策适用。</p></section>
          <section><h2>2. 产品推荐与联系邮件</h2><p>提交的产品名称、网址、简介、分类、联系邮箱与补充说明用于核对推荐内容和联系核实。产品获收录后，公开产品信息可能出现在网站上，联系邮箱不会展示在产品页面。</p><p>在线发送功能可用时，资料通过邮件服务发送到网站运营方的邮箱。如果页面显示“准备邮件”，内容只是在浏览器中生成预览；你仍需在自己的邮件应用中发送。准备预览并不代表资料已发送或进入审核。</p><p>实际发送的提交与联系邮件可能保存在运营邮箱和邮件服务商的系统中。NavoKit 不提供投稿账户或投稿历史后台。需要查询或删除已提交的信息，可以通过本页邮箱联系我们。</p></section>
          <section><h2>3. 站内工具</h2><p>Markdown 转图片工具在浏览器中排版和导出，输入内容不需要上传到 NavoKit 服务器。AI 社媒文案和 AI 视频生成工具则会通过 NavoKit 接口，把完成请求所需的文本、提示词或设置发送给外部 AI 服务。</p><p>站内工具不提供用户账号或生成历史记录。请求仍可能涉及服务商的处理、日志或缓存；使用前请避免输入敏感或机密信息。外部 AI 服务的使用与保留政策也可能适用。</p></section>
          <section><h2>4. 访问统计与安全</h2><p>托管服务可能处理访问日志和技术信息，用于网站交付、安全和故障排查。NavoKit 使用 Vercel Analytics 了解访问情况；配置启用后，也会使用 Google Analytics 统计页面和工具的使用。</p><p>为限制滥用，部分接口会在服务实例的内存中保留短期请求计数。产品提交接口以网络地址的哈希值作为限流标识，不将这一标识展示为公开产品信息。</p><p>了解服务商的数据处理方式：<a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">Vercel Analytics 隐私说明</a>、<a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">Google 合作网站数据说明</a>。</p></section>
          <section><h2>5. 广告与浏览器设置</h2><p>NavoKit 使用 Adsterra 提供的第三方广告支持网站运营。广告服务可能使用 Cookie 或其他技术处理设备、访问与广告互动信息，具体方式以服务商的说明为准。广告内容由第三方提供。</p><p>你可以阅读 <a href="https://adsterra.com/privacy-policy-managed/" target="_blank" rel="noreferrer">Adsterra 隐私政策</a>和 <a href="https://adsterra.com/cookies/" target="_blank" rel="noreferrer">Cookie 政策</a>，并通过浏览器管理 Cookie、站点存储和权限。阻止相关技术可能影响部分功能、统计或广告展示。</p></section>
          <section><h2>6. 联系与更新</h2><p>如需了解数据处理、更正或删除你提交的信息，请发送邮件并说明相关页面或提交内容。不要在邮件中提供密码或 API Key。</p><p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p><p>网站功能或服务商发生变化时，本页也可能更新，最新日期显示在页首。</p></section>
        </> : <>
          <section><h2>1. Browsing and external links</h2><p>You do not need an account to browse NavoKit products, collections, or content. Product websites, launch sources, and other external links are operated by their respective providers. Their privacy policies apply when you visit them.</p></section>
          <section><h2>2. Product suggestions and email</h2><p>A submitted product name, URL, description, category, contact email, and additional context are used to review the recommendation and follow up. If a product is listed, its public details may appear on the site. Your contact email is not displayed on the product page.</p><p>When online delivery is available, submissions are sent to the site operator through an email service. If the page offers to prepare an email, it creates a preview in your browser; you must still send it from your own email app. Preparing a preview does not send a submission or place it in review.</p><p>Sent submissions and contact messages may remain in the operator&apos;s mailbox and the email provider&apos;s systems. NavoKit does not provide submission accounts or a submission history dashboard. Contact us below to ask about or request deletion of information you submitted.</p></section>
          <section><h2>3. NavoKit utilities</h2><p>Markdown to Image renders and exports in your browser without needing to upload your input to NavoKit servers. The AI Social Post Generator and AI Video Generator send the text, prompts, or settings needed for a request through NavoKit to external AI services.</p><p>These utilities do not provide user accounts or generation history. Requests may still involve provider processing, logs, or caches. Avoid entering sensitive or confidential information. The external AI provider&apos;s use and retention policies may also apply.</p></section>
          <section><h2>4. Analytics and security</h2><p>Hosting services may process access logs and technical information to deliver the site, protect it, and investigate issues. NavoKit uses Vercel Analytics to understand visits. When configured, Google Analytics also measures page and utility usage.</p><p>Some endpoints keep temporary request counts in the running service&apos;s memory to limit abuse. The product submission endpoint uses a hash of the network address as its rate-limit identifier; that identifier is not displayed as public product information.</p><p>Read the providers&apos; explanations: <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">Vercel Analytics privacy</a> and <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">Google&apos;s data use on partner sites</a>.</p></section>
          <section><h2>5. Advertising and browser controls</h2><p>NavoKit uses third-party advertising supplied by Adsterra to support the site. Advertising services may use cookies or other technologies to process device, visit, and ad interaction information. Refer to the provider&apos;s policies for details. Advertising content is supplied by third parties.</p><p>Read Adsterra&apos;s <a href="https://adsterra.com/privacy-policy-managed/" target="_blank" rel="noreferrer">Privacy Policy</a> and <a href="https://adsterra.com/cookies/" target="_blank" rel="noreferrer">Cookies Policy</a>. You can manage cookies, site storage, and permissions in your browser. Blocking these technologies may affect some features, measurement, or advertising.</p></section>
          <section><h2>6. Contact and updates</h2><p>For questions about data processing, or to correct or delete information you submitted, email us with the relevant page or submission details. Do not include passwords or API keys.</p><p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p><p>We may update this page as site features or providers change. The latest revision date appears above.</p></section>
        </>}
      </article>
    </SiteInformationPage>
  );
}
