import type { Metadata } from "next";
import MermaidExporter from "@/components/MermaidExporter";
import { breadcrumbList, pageIdentity, safeJsonLd } from "@/lib/schema";
import { localizedCanonical, SITE_URL } from "@/lib/site";
import type { ToolPageContentData } from "@/types/toolPageContent";

type Props = { params: Promise<{ lang: "en" | "zh" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const zh = lang === "zh";
  const title = zh
    ? "Mermaid 流程图转 PNG / SVG — 免费本地渲染导出高清图表 | NavoKit"
    : "Mermaid to PNG & SVG — Free Browser-Local Diagram Exporter | NavoKit";
  const description = zh
    ? "免费在线将 Mermaid 流程图、时序图、架构图和 ER 图转为 2x 高清 PNG 与矢量 SVG。支持一键复制图片与深浅色主题，纯浏览器本地渲染不上传代码。"
    : "Convert Mermaid flowcharts, sequence diagrams, state machines, and ER diagrams to crisp 2x PNG or vector SVG locally in your browser. Free, no login, light & dark themes.";
  return {
    title,
    description,
    alternates: localizedCanonical(lang, "/tools/mermaid-to-image"),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/tools/mermaid-to-image`,
      type: "website",
      images: [
        {
          url: "/og/tool/mermaid-to-image",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/tool/mermaid-to-image"],
    },
  };
}

export default async function MermaidToImagePage({ params }: Props) {
  const { lang } = await params;
  const zh = lang === "zh";
  const pageUrl = `${SITE_URL}/${lang}/tools/mermaid-to-image`;

  const answerFirst = zh
    ? "想把 ChatGPT、Claude 或技术文档里生成的 Mermaid 代码直接变成能放进 Figma、Keynote 或汇报 PPT 的高清图？粘贴代码即可在浏览器本地渲染为纯原生矢量 SVG（彻底避免 foreignObject 乱码），支持纸白/暖米/午夜/森绿 4 套主题、透明底导出、最高 4x 超清 PNG，以及一键复制 PNG 或 SVG 源码。"
    : "To turn Mermaid diagram syntax from ChatGPT, Claude, or engineering docs into Figma- and Keynote-ready visuals without installing CLI tools, paste your syntax above. NavoKit renders pure native SVG text locally in your browser with 4 themes, transparent PNG backgrounds, up to 4x ultra-HD export, and one-click Copy PNG or Copy SVG.";

  const content: ToolPageContentData = {
    eyebrow: zh ? "使用方式" : "How it works",
    howTitle: zh ? "从 Mermaid 文本到 Figma / PPT 级高清架构图。" : "From Mermaid syntax to slide- and Figma-ready diagrams.",
    facts: zh
      ? [
          { label: "核心任务", value: "将 Mermaid 文本语法渲染为纯原生矢量 SVG 或最高 4x 超清 PNG。" },
          { label: "支持图表", value: "架构图（含 Subgraph）、流程图、时序图、状态机、ER 图与甘特图。" },
          { label: "导出方式", value: "一键复制 PNG / SVG 源码、透明底 2x–4x PNG、以及 Figma 兼容矢量 SVG。" },
          { label: "隐私与安全", value: "纯浏览器本地渲染（strict 安全模式），私有系统架构图绝不上传服务器。" },
        ]
      : [
          { label: "Task", value: "Render Mermaid syntax locally into Figma-compatible vector SVG or 2x–4x ultra-HD PNG." },
          { label: "Supported diagrams", value: "Architecture with subgraphs, flowcharts, sequence diagrams, state machines, ER models, and Gantt charts." },
          { label: "Output formats", value: "One-click Copy PNG, Copy SVG, transparent or themed 2x/3x/4x PNG, and lossless vector SVG." },
          { label: "Privacy", value: "100% browser-local rendering in strict security mode—internal architecture never leaves your device." },
        ],
    steps: zh
      ? [
          { title: "粘贴或选择模板", text: "从 ChatGPT / Claude / Markdown 文档复制 Mermaid 代码，或点击上方内置模板快速开始。" },
          { title: "切换深浅主题", text: "右侧实时预览排版效果，可按 PPT 或博客背景一键切换浅色或深色模式。" },
          { title: "复制或下载", text: "点击「复制 PNG」直接粘贴到 Slack / 飞书 / X，或下载 2x PNG 与可编辑矢量 SVG。" },
        ]
      : [
          { title: "Paste Mermaid syntax", text: "Paste diagram code from ChatGPT, Claude, or docs—or pick one of the built-in templates." },
          { title: "Pick Light or Dark theme", text: "Preview the rendered diagram live and match your slide deck, README, or social feed." },
          { title: "Copy PNG or download SVG", text: "Copy the 2x PNG directly to your clipboard, download PNG, or save lossless vector SVG." },
        ],
    useCases: zh
      ? [
          { title: "导出 AI 生成的流程图", text: "把 ChatGPT / Claude 输出的 Mermaid 代码瞬间转成能贴进文档和汇报的清晰图片。" },
          { title: "技术方案与 RFC 配图", text: "为系统设计文档、API 时序说明导出高分辨率 PNG 或矢量 SVG。" },
          { title: "GitHub README 与博客", text: "统一技术博客与开源仓库的架构图视觉风格。" },
          { title: "社媒与技术分享卡片", text: "深色/浅色一键切换，直接复制到 X、LinkedIn 或技术社群。" },
        ]
      : [
          { title: "Export AI-generated diagrams", text: "Turn Mermaid blocks written by ChatGPT or Claude into slide-ready graphics in seconds." },
          { title: "RFCs & architecture docs", text: "Export high-DPI PNGs or lossless SVGs for Notion, Confluence, Google Docs, or Keynote." },
          { title: "GitHub READMEs & blogs", text: "Keep technical diagrams crisp across platforms that do not natively render Mermaid." },
          { title: "Developer social posts", text: "Switch to dark or light mode and copy PNG directly into X or LinkedIn posts." },
        ],
    limitations: zh
      ? [
          { title: "超大型复杂图", text: "节点极多（如上百个节点）的图表建议优先导出 SVG 矢量图，缩放更清晰。" },
          { title: "严格安全模式", text: "为防 XSS，工具启用了 Mermaid strict 模式，节点内的原生 HTML 点击脚本不会被执行。" },
        ]
      : [
          { title: "Very large graphs", text: "For diagrams with dozens of nodes, download vector SVG so labels remain sharp at any zoom level." },
          { title: "Strict security mode", text: "Interactive click callbacks and raw HTML tags inside nodes are disabled for browser safety." },
        ],
    privacy: zh
      ? "所有 Mermaid 语法解析、SVG 渲染与 PNG 导出均在你的浏览器本地执行，NavoKit 不会上传、存储或记录你的图表代码。"
      : "All Mermaid parsing, SVG rendering, and PNG conversion run locally inside your browser. NavoKit never uploads or stores your diagram source.",
    faqs: zh
      ? [
          { title: "Mermaid 转 PNG 需要安装 CLI 或登录吗？", text: "不需要。打开网页粘贴 Mermaid 语法即可在浏览器本地渲染并导出 2x PNG 或 SVG，完全免费免登录。" },
          { title: "支持导出无损矢量 SVG 吗？", text: "支持。点击「下载 SVG」即可保存标准矢量图，可直接拖入 Figma、Keynote 或网页中使用。" },
          { title: "公司内部架构图用这个工具安全吗？", text: "安全。解析和绘图全部在你的本机浏览器完成，图表源码不会发送到 NavoKit 服务器。" },
          { title: "为什么提示 Mermaid 语法错误？", text: "常见原因是节点文字包含未加引号的括号、冒号或特殊符号。用英文双引号将节点文案包起来（例如 A[\"步骤 (1)\"]）通常即可解决。" },
        ]
      : [
          { title: "Do I need to install Mermaid CLI or create an account?", text: "No. Everything runs directly in your browser with no installation, no login, and no usage cap." },
          { title: "Can I export both PNG and lossless SVG?", text: "Yes. You can download crisp 2x PNG, copy PNG directly to your clipboard, or download vector SVG." },
          { title: "Is it safe for confidential architecture diagrams?", text: "Yes. Rendering happens 100% locally in your browser; your Mermaid code is never sent to NavoKit servers." },
          { title: "How do I fix a Mermaid syntax error?", text: "Most syntax errors come from unquoted special characters like parentheses or colons inside node labels. Wrap labels in double quotes—for example, A[\"Step (1)\"]." },
        ],
    related: [
      {
        title: zh ? "Markdown 转图片" : "Markdown to Image",
        description: zh ? "把 Markdown 笔记、ChatGPT 回答和表格转成高清 PNG 卡片。" : "Turn Markdown notes, ChatGPT answers, and tables into clean PNG cards.",
        href: `/${lang}/tools/markdown-to-image`,
      },
      {
        title: zh ? "GitHub README 与更新日志转图片" : "GitHub README & Changelog to Image",
        description: zh ? "把版本发布说明和 CLI 示例导出为开发者视觉卡片。" : "Export release notes and GFM feature tables as clean visual cards.",
        href: `/${lang}/tools/markdown-to-image/github-readme-card`,
      },
    ],
    guide: {
      title: zh ? "从原始 Mermaid 到高 DPI 技术图表" : "From Raw Mermaid to High-DPI Technical Diagrams",
      description: zh ? "了解如何设计更易读的技术流程图并导出高清视觉资产。" : "Learn how to structure readable technical diagrams and export high-DPI visuals.",
      href: `/${lang}/blog/raw-mermaid-to-high-dpi-technical-diagrams`,
    },
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        ...pageIdentity(pageUrl, lang),
        name: zh ? "Mermaid 流程图转高清 PNG / SVG" : "Mermaid to PNG & SVG Converter",
        description: answerFirst,
      },
      {
        "@type": "WebApplication",
        name: zh ? "Mermaid 转图片" : "Mermaid to Image",
        url: pageUrl,
        description: answerFirst,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faqs.map(({ title, text }) => ({
          "@type": "Question",
          name: title,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      },
      breadcrumbList([
        { name: "NavoKit", url: `${SITE_URL}/${lang}` },
        { name: zh ? "工具" : "Tools", url: `${SITE_URL}/${lang}/tools` },
        { name: zh ? "Mermaid 转图片" : "Mermaid to Image", url: pageUrl },
      ]),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <MermaidExporter lang={lang} content={content} answerFirst={answerFirst} />
    </>
  );
}
