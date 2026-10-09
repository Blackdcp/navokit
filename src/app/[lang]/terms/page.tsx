import type { Metadata } from "next";
import Link from "next/link";
import SiteInformationPage from "@/components/submission/SiteInformationPage";
import { localizedCanonical, SUPPORT_EMAIL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh" }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "zh" ? "服务条款 | NavoKit" : "Terms of Service | NavoKit",
    description: lang === "zh" ? "了解 NavoKit 产品发现、内容、产品提交与站内工具的使用条款。" : "Terms for NavoKit product discovery, content, product submissions, and site utilities.",
    alternates: localizedCanonical(lang, "/terms"),
  };
}

export default async function TermsOfServicePage({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  const zh = lang === "zh";
  return (
    <SiteInformationPage lang={lang} narrow label={zh ? "网站政策" : "Site policies"} title={zh ? "服务条款" : "Terms of Service"} lead={zh ? "使用 NavoKit 前，请了解产品信息、提交审核、外部服务和站内工具的适用范围。" : "Before using NavoKit, understand how product information, submission review, external services, and our utilities work."}>
      <p className="information-updated">{zh ? "最后更新：2026 年 10 月 8 日" : "Last updated: October 8, 2026"}</p>
      <article className="information-document">
        {zh ? <>
          <section><h2>1. 网站服务</h2><p>NavoKit 提供科技产品发现、分类与专题、内容和更新动态、产品推荐入口，以及保留的站内工具。访问和使用这些服务时，请遵守本页条款与适用法律。</p><p>我们可能调整网站内容、功能或可用性。涉及第三方服务和共享额度的功能可能暂时不可用，页面展示的信息也可能随产品变化而更新。</p></section>
          <section><h2>2. 产品信息与外部服务</h2><p>产品资料用于帮助你发现和了解产品。收录不代表 NavoKit 对功能、质量、适用性或商业效果的保证。若引用发布平台的日期或排名，其含义仅限于注明的平台、时间和记录。</p><p>功能、价格、试用条件和可用状态请以产品官网为准。外部产品、广告和链接目标由各自的提供方运营；注册、购买或使用外部产品时，需自行核对其条款和隐私政策。</p></section>
          <section><h2>3. 提交产品</h2><p>提交免费。请提供真实的产品信息与可以核对的官方来源，并确保你有权分享相关内容。收到资料后，NavoKit 会进行核对，再决定是否收录、如何分类和展示。提交不保证收录、上线日期、流量或其他效果。</p><p>提交即表示允许我们为审核与展示推荐内容，核对、整理或编辑你提供的公开产品资料。你的联系邮箱用于核实和跟进，不会作为产品资料公开展示。页面显示邮件预览时，仍需由你发送邮件；预览不代表已经提交。</p></section>
          <section><h2>4. 内容与工具使用</h2><p>请勿利用网站进行违法、侵权、欺诈或骚扰活动，不要滥用接口、绕过限流或破坏服务安全。你应确保对输入、上传或提供的内容拥有相应权限。</p><p>你或相应权利人保留原始内容的权利。AI 生成结果需要人工检查，NavoKit 不额外授予第三方 AI 输出的商业使用权。请根据实际用途核对准确性、相关权利与服务商条款。</p><p>文章、产品名称、商标和引用资料的权利属于其各自权利人。引用来源不代表取得转载全文或重新分发产品的许可。</p></section>
          <section><h2>5. 可用性与限制</h2><p>NavoKit 按当前可用状态提供信息和工具。我们尽力维护准确性与可用性，但无法保证内容始终完整、最新或无误，也无法保证生成结果满足所有用途。重要信息应结合原始来源核实，重要文件请保留自己的副本。</p><p>这些说明不排除适用法律要求承担的责任，也不限制你依法享有、不得被排除的权利。</p></section>
          <section><h2>6. 隐私、更新与联系</h2><p>数据处理方式请参阅<Link href={`/${lang}/privacy`}>隐私政策</Link>。本条款可能随网站变化更新，最新日期显示在页首。对产品资料、内容权利或本条款有疑问，请通过邮箱联系我们并提供相关页面。</p><p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p></section>
        </> : <>
          <section><h2>1. The service</h2><p>NavoKit offers tech product discovery, categories and collections, content and updates, product suggestions, and retained site utilities. Follow these terms and applicable law when accessing or using these services.</p><p>We may change the site&apos;s content, features, or availability. Features that depend on third-party services or shared capacity may be temporarily unavailable, and information may change as products develop.</p></section>
          <section><h2>2. Product information and external services</h2><p>Product profiles help you discover and understand products. Inclusion is not a NavoKit guarantee of features, quality, suitability, or commercial results. Dates or ranks quoted from a launch platform refer only to the stated platform, period, and record.</p><p>Check the official provider for current features, pricing, trial conditions, and availability. External products, advertising, and linked websites are operated by their providers. Review their terms and privacy policies before registering, purchasing, or using them.</p></section>
          <section><h2>3. Product submissions</h2><p>Submitting is free. Provide accurate information and verifiable official sources, and make sure you have permission to share the content. We review received information before deciding whether to list a product and how to categorize and present it. Submission does not guarantee inclusion, a publication date, traffic, or other results.</p><p>By submitting, you permit us to verify, organize, or edit the public product information you provide for review and display. Your contact email is used for verification and follow-up, and is not published as product information. If the page shows an email preview, you must still send that email; a preview is not a completed submission.</p></section>
          <section><h2>4. Content and utility use</h2><p>Do not use the site for unlawful activity, infringement, fraud, or harassment. Do not abuse endpoints, bypass rate limits, or compromise service security. Make sure you have the rights needed for content you enter, upload, or provide.</p><p>You or the relevant rights holder retain rights in original content. AI output needs human review. NavoKit does not grant additional commercial rights to output from third-party AI services. Check accuracy, relevant rights, and provider terms for your intended use.</p><p>Articles, product names, trademarks, and referenced material belong to their respective rights holders. A source link does not grant permission to reproduce an entire work or redistribute a product.</p></section>
          <section><h2>5. Availability and limitations</h2><p>NavoKit provides information and utilities as currently available. We work to maintain accuracy and availability, but cannot guarantee that information is always complete, current, or error-free, or that generated results fit every use. Verify important information with original sources and keep your own copies of important files.</p><p>These statements do not exclude responsibilities required by applicable law or limit rights that cannot lawfully be excluded.</p></section>
          <section><h2>6. Privacy, updates, and contact</h2><p>See our <Link href={`/${lang}/privacy`}>Privacy Policy</Link> for data handling. These terms may change as the site evolves; the latest revision date appears above. For questions about product information, content rights, or these terms, email us with the relevant page.</p><p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p></section>
        </>}
      </article>
    </SiteInformationPage>
  );
}
