import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteInformationPage from "@/components/submission/SiteInformationPage";
import { localizedCanonical, siteSocialMetadata, SITE_URL } from "@/lib/site";
import { pageIdentity, safeJsonLd } from "@/lib/schema";

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh" }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "zh" ? "关于 NavoKit · 导航 + 工具" : "About NavoKit · Navigation + Tools";
  const description = lang === "zh"
    ? "NavoKit 是发现新锐科技产品与实用内容的独立网站。通过产品、专题和动态，探索值得尝试的新体验。"
    : "NavoKit is an independent place to discover emerging tech products and useful ideas through products, collections, and updates.";
  return { title, description, alternates: localizedCanonical(lang, "/about"), ...siteSocialMetadata(lang, "/about", title, description) };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  const zh = lang === "zh";
  const cards = zh ? [
    { title: "发现新产品", text: "关注新锐产品、独特交互与明确用途。了解它有什么新意、适合谁，再到官网继续探索。", href: "/tools", action: "浏览产品" },
    { title: "沿着专题探索", text: "从一个使用场景出发，把相关产品与内容放在一起，找到值得进一步了解的方向。", href: "/topics", action: "查看专题" },
    { title: "跟进新动态", text: "阅读产品发现与技术文章。产品发布记录保留来源与日期，文章保留原始发布日期。", href: "/updates", action: "阅读动态" },
  ] : [
    { title: "Discover new products", text: "Explore emerging products, distinctive interactions, and clear uses. Learn what is different and who it helps, then visit the official site.", href: "/tools", action: "Explore products" },
    { title: "Follow a collection", text: "Start with a practical use. Find related products and ideas together, with a direction for your next discovery.", href: "/topics", action: "View collections" },
    { title: "Catch the latest", text: "Read product discoveries and technology articles. Product launch records retain their sources and dates; articles keep their original publication dates.", href: "/updates", action: "Read updates" },
  ];

  return (
    <SiteInformationPage
      lang={lang}
      label={zh ? "关于 NavoKit" : "About NavoKit"}
      title={zh ? "发现新东西，找到新可能。" : "New discoveries. New possibilities."}
      lead={zh ? "NavoKit 是一个独立的科技产品发现与内容网站。我们关注正在出现的新产品、有辨识度的体验，以及能解决具体问题的小工具。" : "NavoKit is an independent site for discovering tech products and ideas. We look for emerging products, distinctive experiences, and focused tools that solve a real problem."}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "AboutPage", ...pageIdentity(`${SITE_URL}/${lang}/about`, lang), name: zh ? "关于 NavoKit" : "About NavoKit", about: { "@id": `${SITE_URL}/#organization` } }) }} />
      <div className="information-brand">
        <div><h2>Navo + Kit</h2><p>{zh ? "导航 + 工具，是 NavoKit 名字的由来。" : "Navigation + tools. The idea behind the name."}</p></div>
        <p>{zh ? "导航帮你找到方向，工具让想法得以实现。在这里，从一次好奇出发，了解一种新的做事方式。" : "Navigation gives you a direction. Tools help you act on it. Start with something that catches your eye, and discover a different way of getting things done."}</p>
      </div>
      <div className="information-cards">
        {cards.map((card, index) => <section className="information-card" key={card.href}>
          <span>0{index + 1}</span><h2>{card.title}</h2><p>{card.text}</p>
          <Link href={`/${lang}${card.href}`}>{card.action}<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </section>)}
      </div>
      <section className="information-section">
        <h2>{zh ? "让信息可以追溯" : "Keep the sources in view"}</h2>
        <div>
          <p>{zh ? "产品资料会链接到官网与相关发布来源，并区分来源描述和实际体验。发布记录中的日期或名次只对应注明的平台与时间，不代表 NavoKit 的评分或效果保证。" : "Product profiles link to official sites and relevant launch sources, and distinguish source descriptions from hands-on experience. A launch date or rank refers to the stated platform and period; it is not a NavoKit rating or performance guarantee."}</p>
          <p>{zh ? "功能、价格和可用状态会变化，请以产品官网为准。站内保留的 NavoKit 自有工具会单独标记。" : "Features, pricing, and availability can change. Check the provider for current details. Retained NavoKit utilities are identified separately."}</p>
          <Link href={`/${lang}/editorial-policy`}>{zh ? "查看收录、引用与更正说明 →" : "Read our listing, reference, and correction policy →"}</Link>
        </div>
      </section>
      <section className="information-section">
        <h2>{zh ? "一起发现值得尝试的产品" : "Share something worth trying"}</h2>
        <div>
          <p>{zh ? "你可以推荐自己的产品，也可以推荐正在使用的工具或开源项目。提交免费，收到信息后我们会核对，再决定是否收录。" : "Recommend a product you made, a tool you use, or an open-source project. Submitting is free. We check the information before deciding whether to list it."}</p>
          <div className="information-actions"><Link href={`/${lang}/submit`} className="button button--ink">{zh ? "提交产品" : "Submit a product"}</Link><Link href={`/${lang}/contact`} className="button button--secondary">{zh ? "反馈与更正" : "Feedback & corrections"}</Link></div>
        </div>
      </section>
      <section className="information-section">
        <h2>{zh ? "免费浏览" : "Free to explore"}</h2>
        <div><p>{zh ? "产品库与内容免费浏览，第三方广告支持网站运营。广告和外部产品由各自的服务商提供，访问时适用相应的政策。" : "The directory and content are free to browse. Third-party advertising supports the site. Ads and external products are supplied by their providers and have their own policies."}</p><Link href={`/${lang}/privacy`}>{zh ? "了解隐私与数据处理 →" : "Read about privacy and data →"}</Link></div>
      </section>
    </SiteInformationPage>
  );
}
