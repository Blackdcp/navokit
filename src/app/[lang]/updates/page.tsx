import type { Metadata } from "next";
import UpdatesPage from "../../../components/updates/UpdatesPage";
import { localizedCanonical, siteSocialMetadata } from "../../../lib/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh" }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "zh" ? "更新动态 | NavoKit" : "Updates | NavoKit";
  const description = lang === "zh"
    ? "按日期浏览有来源的产品发布记录、工具指南与技术文章。发现新产品，也深入了解它们背后的方法。"
    : "Explore sourced product launch records, tool guides, and technical articles. Browse NavoKit updates by date and topic.";
  return { title, description, alternates: localizedCanonical(lang, "/updates"), ...siteSocialMetadata(lang, "/updates", title, description) };
}

export default async function UpdatesRoute({ params, searchParams }: { params: Promise<{ lang: "en" | "zh" }>; searchParams: Promise<{ topic?: string | string[]; q?: string | string[]; type?: string | string[] }> }) {
  const [{ lang }, filters] = await Promise.all([params, searchParams]);
  return <UpdatesPage lang={lang} initialTopic={typeof filters.topic === "string" ? filters.topic : "all"} initialQuery={typeof filters.q === "string" ? filters.q : ""} initialKind={typeof filters.type === "string" ? filters.type : "all"} />;
}
