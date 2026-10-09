import type { Metadata } from "next";
import UpdatesPage from "../../../components/updates/UpdatesPage";
import { localizedCanonical, siteSocialMetadata } from "../../../lib/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh" }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "zh" ? "指南与观点 | NavoKit" : "Guides & Perspectives | NavoKit";
  const description = lang === "zh"
    ? "探索 NavoKit 的 AI 技术文章、工具指南与工作流。按专题搜索，找到与你相关的内容。"
    : "Explore AI articles, tool guides, and workflows from NavoKit. Search the archive and browse by topic.";
  return { title, description, alternates: localizedCanonical(lang, "/blog"), ...siteSocialMetadata(lang, "/blog", title, description) };
}

export default async function BlogListPage({ params, searchParams }: { params: Promise<{ lang: "en" | "zh" }>; searchParams: Promise<{ topic?: string | string[]; q?: string | string[] }> }) {
  const [{ lang }, filters] = await Promise.all([params, searchParams]);
  return <UpdatesPage lang={lang} archive initialTopic={typeof filters.topic === "string" ? filters.topic : "all"} initialQuery={typeof filters.q === "string" ? filters.q : ""} />;
}
