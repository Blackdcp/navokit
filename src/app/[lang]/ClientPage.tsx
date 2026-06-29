import Image from "next/image";
import Link from "next/link";
import type { Tool } from "../../types/tool";
import type { WorkflowRail } from "../../types/workflow";
import type { BlogPost } from "../../lib/blog";
import { getToolAccent, getToolIcon, stripHtml } from "../../lib/toolGroups";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

function toolHref(lang: string, tool: Tool) {
  return `/${lang}/tools/${tool.id}`;
}

export default function HomePage({
  tools,
  posts,
  workflowRails,
  lang,
}: {
  dict: unknown;
  tools: Tool[];
  posts: BlogPost[];
  workflowRails: WorkflowRail[];
  lang: string;
}) {
  const zh = lang === "zh";
  const ordered = [...tools].sort((a, b) => (a.homePriority ?? 999) - (b.homePriority ?? 999));
  const featured = ordered.find(tool => tool.isFeatured) ?? ordered[0];
  const heroTools = ordered.slice(0, 4);
  const featuredTools = [
    ...ordered.filter(tool => tool.isFeatured),
    ...ordered.filter(tool => !tool.isFeatured),
  ].slice(0, 6);
  const heroWorkflowRails = workflowRails.filter(rail => rail.showInHome !== false).slice(0, 4);
  const workflowSteps = zh
    ? [
        ["输入", "写一句提示词、粘贴 Markdown，或描述你要发布的想法。"],
        ["处理", "选择工具和格式，让 NavoKit 生成、转换或起草初稿。"],
        ["带走结果", "下载图片、复制文案、预览视频，继续完成下一步工作。"],
      ]
    : [
        ["Input", "Write a prompt, paste Markdown, or describe the idea you want to publish."],
        ["Process", "Choose a tool and format, then generate, convert, or draft the first result."],
        ["Take the result", "Download an image, copy a draft, preview a video, and keep moving."],
      ];

  return (
    <div className="site-shell site-shell--home">
      <SiteHeader lang={lang} />
      <main>
        <section className="home-hero marketing-container">
          <div className="hero-copy">
            <span className="eyebrow">{zh ? "免费 AI 工具箱" : "Free online AI tools"}</span>
            <h1>{zh ? <>小工具，<br />快一点完成工作。</> : <>Small tools.<br />Faster work.</>}</h1>
            <p className="hero-lead">
              {zh
                ? "给创作者、开发者和运营人的免费 AI 工具箱。把内容、文档和想法快速变成可分享、可使用的结果。"
                : "Free AI tools for creators, developers, and marketers. Turn text, files, and ideas into useful, shareable output."}
            </p>
            <div className="hero-actions">
              <Link href={`/${lang}/tools`} className="button button--ink">{zh ? "浏览工具" : "Explore tools"}</Link>
              {featured && <Link href={toolHref(lang, featured)} className="button button--secondary">{zh ? "打开精选工具" : "Open featured tool"}</Link>}
            </div>
            {heroWorkflowRails.length > 0 && (
              <div className="hero-category-row" aria-label={zh ? "工作流主题" : "Workflow topics"}>
                {heroWorkflowRails.map(rail => <span key={rail.id}>{rail.label}</span>)}
              </div>
            )}
          </div>

          <aside className="hero-directory" aria-label={zh ? "热门免费工具" : "Popular free tools"}>
            <div className="hero-directory__header">
              <div>
                <span>{zh ? "热门工具" : "Popular free tools"}</span>
                <h2>{zh ? "先选一个任务。" : "Choose a task first."}</h2>
              </div>
              <Link href={`/${lang}/tools`}>{zh ? "全部工具" : "All tools"} →</Link>
            </div>

            <div className="hero-tool-list">
              {heroTools.map((tool, index) => {
                return (
                  <Link key={tool.id} href={toolHref(lang, tool)} className="hero-tool-row">
                    <span className="hero-tool-row__number">{String(index + 1).padStart(2, "0")}</span>
                    <div className={`tool-icon tool-icon--${getToolAccent(tool, index)}`}>{getToolIcon(tool, index)}</div>
                    <div>
                      <strong>{tool.title}</strong>
                      <p>{stripHtml(tool.subtitle)}</p>
                    </div>
                    <b>→</b>
                  </Link>
                );
              })}
            </div>

            <div className="hero-directory__footer">
              <span>{zh ? "你可以完成什么" : "What you can finish here"}</span>
              <p>{zh ? "生成一段 AI 视频，把 Markdown 导出成图片，或为社交平台起草一版可继续修改的文案。" : "Generate a short AI video, export Markdown as an image, or draft a social post you can keep editing."}</p>
            </div>
          </aside>
        </section>

        <section className="home-workflows marketing-container" aria-label={zh ? "NavoKit 使用方式" : "How NavoKit works"}>
          {workflowSteps.map(([title, text], index) => (
            <div key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </section>

        <section id="tools" className="section marketing-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{zh ? "精选工具" : "Featured tools"}</span>
              <h2>{zh ? "打开一个工具，完成一个小任务。" : "Open one tool. Finish one small task."}</h2>
            </div>
            <p>{zh ? "每个工具都服务一个明确结果：生成视频、导出图片、起草文案。" : "Each tool serves one clear outcome: generate a video, export an image, or draft copy."}</p>
          </div>
          <div className="tools-grid tools-grid--premium">
            {featuredTools.map((tool, index) => {
              return (
                <Link key={tool.id} href={toolHref(lang, tool)} className="tool-card tool-card--premium">
                  <div className="tool-card__top">
                    <div className={`tool-icon tool-icon--${getToolAccent(tool, index)}`}>{getToolIcon(tool, index)}</div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <span className="tool-category">{tool.categoryName}</span>
                  <h3>{tool.title}</h3>
                  <p>{stripHtml(tool.subtitle)}</p>
                  <div className="tool-card__meta">
                    {(tool.tags ?? []).slice(0, 3).map(tag => <i key={tag}>{tag}</i>)}
                  </div>
                  <span className="tool-link">{zh ? "打开工具" : "Open tool"} <b>→</b></span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="section marketing-container guides-preview">
          <div className="section-heading">
            <div><span className="eyebrow">{zh ? "实用指南" : "Practical guides"}</span><h2>{zh ? "把工具变成工作流。" : "Turn tools into workflows."}</h2></div>
            <Link href={`/${lang}/blog`} className="text-link">{zh ? "查看全部指南 →" : "View all guides →"}</Link>
          </div>
          {posts.length > 0 && (
            <div className="guide-grid">
              {posts.map(post => (
                <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="guide-card">
                  <span>{post.date} · {zh ? "指南" : "GUIDE"}</span>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section id="about" className="about-strip">
          <div className="marketing-container about-strip__inner">
            <Image src="/logo.png" alt="" width={1672} height={941} />
            <div>
              <h2>{zh ? "实用的小工具，打开就能用。" : "Useful tools, ready when you are."}</h2>
              <p>{zh ? "从 AI 视频生成到 Markdown 图片导出，NavoKit 帮你把零散输入整理成可以继续使用的内容资产。" : "From AI video generation to Markdown image export, NavoKit helps turn rough input into content assets you can keep using."}</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
