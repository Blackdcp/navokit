import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../../../components/SiteFooter";
import SiteHeader from "../../../components/SiteHeader";
import { getTools } from "../../../lib/api";
import { localizedCanonical, SITE_URL } from "../../../lib/site";
import { getToolAccent, getToolIcon, groupToolsByCategory } from "../../../lib/toolGroups";
import { breadcrumbList, safeJsonLd } from "../../../lib/schema";

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh" }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "zh" ? "免费 AI 工具 | NavoKit 小工具箱" : "Free AI Tools | NavoKit",
    description: lang === "zh" ? "浏览 NavoKit 的 AI 视频生成、Markdown 转图片和社媒文案工具。" : "Browse NavoKit tools for AI video generation, Markdown image export, and social post drafting.",
    alternates: localizedCanonical(lang, "/tools"),
  };
}

export default async function ToolsPage({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  const zh = lang === "zh";
  const tools = getTools(lang);
  const groups = groupToolsByCategory(tools);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: zh ? "NavoKit 免费 AI 工具" : "NavoKit Free AI Tools",
        url: `${SITE_URL}/${lang}/tools`,
        description: zh
          ? "NavoKit 的免费在线工具集合，包含 AI 视频生成、Markdown 图片导出和社媒文案工具。"
          : "A collection of free online tools for AI video generation, Markdown image export, and social copy drafting.",
      },
      {
        "@type": "ItemList",
        name: zh ? "NavoKit 工具列表" : "NavoKit tool list",
        itemListElement: tools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.title,
          url: `${SITE_URL}/${lang}/tools/${tool.id}`,
          description: tool.subtitle,
        })),
      },
      breadcrumbList([
        { name: "NavoKit", url: `${SITE_URL}/${lang}` },
        { name: zh ? "工具" : "Tools", url: `${SITE_URL}/${lang}/tools` },
      ]),
    ],
  };

  return (
    <div className="site-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <SiteHeader lang={lang} />
      <main className="marketing-container listing-page listing-page--premium">
        <header className="listing-hero listing-hero--premium">
          <span className="eyebrow">{zh ? "NavoKit 工具箱" : "NavoKit tools"}</span>
          <h1>{zh ? "选择一个工具，完成一件小任务。" : "Choose a tool and finish one small task."}</h1>
          <p>{zh ? "生成视频、导出图片、起草文案。每个工具都尽量保持轻量、直接、打开即用。" : "Generate videos, export images, and draft social copy. Each tool is lightweight, direct, and ready to use."}</p>
        </header>

        <div className="tool-category-stack">
          {groups.map(group => (
            <section key={group.categoryId} id={group.anchor} className="tool-category-section">
              <div className="tool-category-section__header">
                <span className="eyebrow">{group.categoryName}</span>
                <p>
                  {zh
                    ? `${group.tools.length} 个工具，围绕一个明确任务集合。`
                    : `${group.tools.length} ${group.tools.length === 1 ? "tool" : "tools"} for one clear workflow area.`}
                </p>
              </div>
              <div className="tool-index">
                {group.tools.map((tool, index) => (
                  <Link key={tool.id} href={`/${lang}/tools/${tool.id}`} className="tool-index-row">
                    <span className="tool-index-row__number">{String(index + 1).padStart(2, "0")}</span>
                    <div className={`tool-icon tool-icon--${getToolAccent(tool, index)}`}>{getToolIcon(tool, index)}</div>
                    <div>
                      <span className="tool-category">{tool.categoryName}</span>
                      <h2>{tool.title}</h2>
                      <p>{tool.subtitle}</p>
                    </div>
                    <b>{zh ? "打开" : "Open"} →</b>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
