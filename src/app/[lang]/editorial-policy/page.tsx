import type { Metadata } from "next";
import Link from "next/link";
import SiteInformationPage from "@/components/submission/SiteInformationPage";
import { localizedCanonical, siteSocialMetadata, SITE_URL } from "@/lib/site";
import { breadcrumbList, pageIdentity, safeJsonLd } from "@/lib/schema";

type Locale = "en" | "zh";
const POLICY_DATE = "2026-10-09";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "zh" ? "收录与编辑说明 | NavoKit" : "Editorial & listing policy | NavoKit";
  const description = lang === "zh"
    ? "了解 NavoKit 如何收录产品、标注来源与日期，区分官方资料和实际体验，以及如何反馈更正。"
    : "How NavoKit selects products, identifies sources and dates, distinguishes provider information from hands-on experience, and handles corrections.";
  return { title, description, alternates: localizedCanonical(lang, "/editorial-policy"), ...siteSocialMetadata(lang, "/editorial-policy", title, description) };
}

export default async function EditorialPolicy({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const zh = lang === "zh";
  const title = zh ? "信息从哪里来，如何继续核实。" : "Where the information comes from, and how to check it.";
  const url = `${SITE_URL}/${lang}/editorial-policy`;
  const sections = zh ? [
    { id: "selection", title: "产品收录", paragraphs: ["NavoKit 关注有明确用途、独特体验的新锐科技产品。候选来自产品发布平台、官方社区、开源项目和读者推荐；收录前核对产品身份、官网、主要功能、使用平台与访问条件。", "产品可能属于多个类别。列表顺序用于浏览，不代表质量排名；收录不等于评分、认证或效果保证。NavoKit 自有工具单独标记。"] },
    { id: "sources", title: "资料与实际体验", paragraphs: ["产品简介依据官网、官方文档、代码仓库及注明的发布记录整理。详情页提供产品官网入口与信息核对日期。官方 Logo、界面图、示例和宣传图保留原有身份，图片说明区分其用途。", "资料整理与独立实测分别呈现。当前产品库主要是公开资料整理；需要账号、硬件、模型额度或早期访问资格的条件会在详情页说明。功能、价格和库存请继续到官网确认。"] },
    { id: "articles", title: "文章与引用", paragraphs: ["文章保留原始发布日期；有实际内容更新记录时才显示更新日期。署名用于说明内容责任来源，没有单独作者资料的文章以 NavoKit 标识。", "明确列出的参考资料与正文普通外链分开展示。旧文尚未统一补齐参考资料，普通外链的出现不表示相邻全部观点已得到验证。缺少实测或证据的信息不应被视为购买、研究或经营决策的唯一依据。"] },
    { id: "dates", title: "日期的含义", paragraphs: ["“信息核对”是产品资料被检查的日期；“收录日期”是加入 NavoKit 的日期；“Product Hunt 发布记录”只对应所链接的平台事件，可能是既有产品的新版本。", "这些日期不互相替代。网站重新构建不会自动刷新文章的内容更新日期，也不会把新增收录包装成新的产品发布。"] },
    { id: "funding", title: "广告与合作", paragraphs: ["第三方广告支持网站运营，广告由相应服务商提供。站内工具、外部产品资料和广告具有不同的来源。", "涉及付费推广、客户交付或其他商业关系的内容，应在相关页面明确标注关系与信息提供方。商业合作本身不能替代事实核对，也不构成产品效果保证。"] },
  ] : [
    { id: "selection", title: "Product selection", paragraphs: ["NavoKit focuses on emerging technology products with clear uses and distinctive experiences. Candidates come from launch platforms, official communities, open-source projects, and reader submissions. Product identity, official sites, main features, platforms, and access conditions are checked before listing.", "A product may fit several categories. List order is for browsing, not a quality ranking. Inclusion is not a rating, certification, or performance guarantee. NavoKit utilities are identified separately."] },
    { id: "sources", title: "Sources and hands-on experience", paragraphs: ["Product profiles summarize official sites, documentation, repositories, and identified launch records. Profiles provide an official website link and a details-checked date. Official logos, screenshots, examples, and promotional artwork remain identified, with captions describing their role.", "Source-based descriptions and independent testing are distinct. The current directory primarily summarizes public materials. Account, hardware, credit, or early-access requirements are stated on profiles. Check the provider for current features, prices, and availability."] },
    { id: "articles", title: "Articles and references", paragraphs: ["Articles retain their original publication dates. A modified date is shown only when a content update is recorded. Bylines identify the content's attribution; articles without a separate author record are attributed to NavoKit.", "Explicit references are distinguished from ordinary links in the text. References have not yet been completed throughout the older archive. A link alone does not verify every nearby claim, and material without testing or evidence should not be the sole basis for purchasing, research, or business decisions."] },
    { id: "dates", title: "What dates mean", paragraphs: ["Details checked describes when product information was reviewed. Added to NavoKit describes listing time. A Product Hunt launch record refers only to the linked platform event, which may concern a new version of an existing product.", "These dates are not interchangeable. Rebuilding the site does not automatically change article modification dates or turn new directory entries into product launches."] },
    { id: "funding", title: "Advertising and commercial relationships", paragraphs: ["Third-party advertising supports the site and is supplied by the relevant providers. NavoKit utilities, external product information, and advertisements have different sources.", "Paid promotion, client deliverables, or other commercial relationships should be identified on the relevant page, including who supplied the information. A commercial relationship does not replace factual checks or guarantee product performance."] },
  ];
  return <SiteInformationPage lang={lang} label={zh ? "收录与编辑说明" : "Editorial & listing policy"} title={title} lead={zh ? "让读者知道一条信息的来源、时间与适用范围，也能方便地反馈问题。" : "Make a claim's source, date, and scope clear, and give readers a way to report a problem."}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@graph": [
      { "@type": "WebPage", ...pageIdentity(url, lang), name: title, dateModified: POLICY_DATE },
      breadcrumbList([{ name: "NavoKit", url: `${SITE_URL}/${lang}` }, { name: zh ? "收录与编辑说明" : "Editorial policy", url }]),
    ] }) }} />
    <p>{zh ? "说明更新于" : "Policy updated"} <time dateTime={POLICY_DATE}>{POLICY_DATE}</time></p>
    {sections.map(section => <section className="information-section" id={section.id} key={section.id}><h2>{section.title}</h2><div>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>)}
    <section className="information-section" id="corrections"><h2>{zh ? "反馈与更正" : "Corrections"}</h2><div><p>{zh ? "如果发现网址、功能、日期或引用有误，请发送相关页面地址、需要更正的内容及可核实的来源。反馈会进入人工核对；提交并不表示已自动修改页面。" : "To report an incorrect URL, feature, date, or reference, send the page address, the proposed correction, and a checkable source. Reports require manual review; submitting a report does not automatically change a page."}</p><Link href={`/${lang}/contact`}>{zh ? "联系 NavoKit →" : "Contact NavoKit →"}</Link></div></section>
  </SiteInformationPage>;
}
