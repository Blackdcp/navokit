import type { ToolContentItem, ToolFact } from "@/types/toolPageContent";
import type { Locale } from "@/types/catalog";

export interface MarkdownUseCaseCopy {
  metaTitle: string;
  metaDescription: string;
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  answerFirst: string;
  initialMarkdown: string;
  howTitle: string;
  facts: ToolFact[];
  steps: ToolContentItem[];
  useCases: ToolContentItem[];
  limitations: ToolContentItem[];
  faqs: ToolContentItem[];
}

export interface MarkdownUseCase {
  slug: string;
  exportFilename: string;
  guideSlug?: string;
  en: MarkdownUseCaseCopy;
  zh: MarkdownUseCaseCopy;
}

export const MARKDOWN_USE_CASES: MarkdownUseCase[] = [
  {
    slug: "chatgpt-to-image",
    exportFilename: "navokit-chatgpt-to-image.png",
    guideSlug: "how-to-export-chatgpt-responses-as-images",
    en: {
      metaTitle: "ChatGPT to Image — Export ChatGPT Responses as Clean PNG | NavoKit",
      metaDescription: "Convert ChatGPT responses into clean, high-resolution PNG image cards directly in your browser. Free, no login, preserves headings, lists, tables, and code blocks.",
      badge: "ChatGPT Export",
      heroTitle: "ChatGPT to Image Converter",
      heroSubtitle: "Paste any ChatGPT answer in Markdown and export a clean, high-DPI PNG card ready for X, LinkedIn, Slack, or documentation—free and rendered locally in your browser.",
      answerFirst: "To export a ChatGPT response as a clean image without awkward scrolling screenshots, click the Copy button in ChatGPT (which copies raw Markdown), paste it into the editor below, and click Download Image. NavoKit renders the headings, bullet points, tables, and code blocks into a crisp 2x PNG locally in your browser with no sign-up and no server upload.",
      initialMarkdown: `# 5-Step Product Launch Checklist

Here is a practical launch sequence for an indie software release:

1. **Validate one core workflow** — Confirm users finish the primary task without instructions.
2. **Prepare clean visual proof** — Export real outputs instead of generic mockups.
3. **Set up basic attribution** — Track UTM links and core completion events.
4. **Ship to targeted communities** — Share where people already ask about the problem.
5. **Review first-week friction** — Fix the top drop-off before scaling traffic.

> Tip: Copy any ChatGPT answer using its Copy icon to preserve Markdown formatting automatically.`,
      howTitle: "How to turn a ChatGPT response into a clean PNG card.",
      facts: [
        { label: "Task", value: "Convert copied ChatGPT Markdown answers into crisp, shareable PNG image cards." },
        { label: "Input", value: "Raw Markdown copied from ChatGPT (headings, numbered lists, quotes, tables, code)." },
        { label: "Output", value: "A high-DPI (2x) PNG image ready for social posts, slides, or team chat." },
        { label: "Privacy", value: "100% client-side browser rendering. Your ChatGPT text is never uploaded or stored." },
      ],
      steps: [
        { title: "Copy from ChatGPT", text: "Use the Copy button below any ChatGPT response so headings, lists, and code fences stay intact as Markdown." },
        { title: "Paste & trim", text: "Paste into the left panel, remove filler greetings, and verify the live visual card on the right." },
        { title: "Download 2x PNG", text: "Click Download Image to save a crisp PNG you can attach directly to X, LinkedIn, Slack, or docs." },
      ],
      useCases: [
        { title: "Share AI insights on X & LinkedIn", text: "Replace cramped mobile screenshots with readable typography and generous margins." },
        { title: "Archive prompt outputs", text: "Save checklists, outlines, and technical explanations as portable visual reference cards." },
        { title: "Team Slack & Notion updates", text: "Drop clean summaries into team channels without losing Markdown formatting." },
        { title: "Newsletter & blog visuals", text: "Turn structured AI comparisons and tables into clean inline graphics." },
      ],
      limitations: [
        { title: "Best for concise cards", text: "Very long multi-page conversations produce tall images; trim to the highest-value section before exporting." },
        { title: "External image links", text: "Remote images embedded via Markdown may be blocked by browser CORS policies during PNG export." },
      ],
      faqs: [
        { title: "How do I copy Markdown directly from ChatGPT?", text: "Click the Copy icon at the bottom of a ChatGPT message instead of manually highlighting text. ChatGPT copies the raw Markdown syntax, which renders cleanly here." },
        { title: "Does NavoKit upload my ChatGPT conversation to a server?", text: "No. All Markdown parsing and PNG rendering happen locally inside your browser. Nothing is sent to or stored on NavoKit servers." },
        { title: "Does it support ChatGPT tables and code blocks?", text: "Yes. GitHub Flavored Markdown (GFM) tables, inline code, fenced code blocks, blockquotes, and nested lists are all supported." },
        { title: "Is it free without creating an account?", text: "Yes. You can paste and export unlimited PNG images with no sign-up, no paywall, and no browser extension required." },
      ],
    },
    zh: {
      metaTitle: "ChatGPT 对话转图片 — 免费把 ChatGPT 回答导出为高清 PNG | NavoKit",
      metaDescription: "免登录将 ChatGPT 的 Markdown 回答一键转为排版整洁的高清 PNG 图片卡片。纯本地浏览器渲染，完整保留标题、列表、表格和代码块。",
      badge: "ChatGPT 导出",
      heroTitle: "ChatGPT 回答转图片工具",
      heroSubtitle: "点击 ChatGPT 自带的复制按钮，把 Markdown 原文粘贴到这里，即可在浏览器本地一键生成适合发朋友圈、小红书、X、LinkedIn 或团队群的高清 PNG 卡片。",
      answerFirst: "想把 ChatGPT 的长回答变成好看的图片、又不想截丑陋的长图？直接点击 ChatGPT 消息底部的「复制」图标（会自动复制原始 Markdown），粘贴到下方左侧编辑器，点击「下载图片」即可。NavoKit 会在浏览器本地将其渲染为 2 倍高清 PNG，免登录、不上传服务器。",
      initialMarkdown: `# 独立产品上线 5 步检查清单

以下是一套适合独立软件发布的轻量上线流程：

1. **验证唯一核心流程** — 确保新用户无需看说明书就能跑通主任务。
2. **准备真实产品输出** — 用真实截图或导出图代替空洞的宣传图。
3. **埋好基础归因数据** — 区分 UTM 来源并追踪核心完成事件。
4. **去痛点现场自然分享** — 在用户已经在讨论该问题的社区提供帮助。
5. **复盘首周流失环节** — 先修掉最大卡点，再放大流量。

> 提示：直接点 ChatGPT 回答下方的复制图标，就能完整保留 Markdown 结构。`,
      howTitle: "三步把 ChatGPT 回答变成可直接分享的高清图片卡片。",
      facts: [
        { label: "核心任务", value: "将复制的 ChatGPT Markdown 回答转为排版清晰的高清 PNG 卡片。" },
        { label: "支持输入", value: "ChatGPT 原始 Markdown（标题、有序/无序列表、引用、表格、代码块）。" },
        { label: "输出结果", value: "2x 高清 PNG 图片，适合社媒分享、汇报配图或知识归档。" },
        { label: "隐私保障", value: "纯浏览器本地渲染，你的 ChatGPT 内容不会上传或保存到服务器。" },
      ],
      steps: [
        { title: "从 ChatGPT 复制原文", text: "点击 ChatGPT 回答底部的复制图标，这样标题、加粗、列表和表格会以 Markdown 格式完整保留。" },
        { title: "粘贴并删去寒暄", text: "粘贴到左侧输入框，删掉开头“好的，没问题”等废话，右侧实时预览卡片排版。" },
        { title: "导出高清 PNG", text: "点击下载图片，得到一张边缘干净、阅读舒适的高清 PNG 卡片。" },
      ],
      useCases: [
        { title: "社媒干货分享", text: "替代密密麻麻的手机截屏，在 X、LinkedIn、小红书和朋友圈发更易读的知识卡片。" },
        { title: "Prompt 结果归档", text: "把高价值清单、提纲和方案定格成独立图片，方便随时翻看。" },
        { title: "群聊与飞书/Slack 同步", text: "把 AI 整理的会议结论或行动项转成整洁图片发到工作群。" },
        { title: "文章与 Newsletter 配图", text: "把结构化表格和要点快速转成文章内嵌图。" },
      ],
      limitations: [
        { title: "建议精简过长对话", text: "如果单次回答超过上千字，导出图会偏长；建议截取核心片段分卡片导出。" },
        { title: "外部图片受跨域限制", text: "Markdown 中如果包含外部图床链接，浏览器 CORS 策略可能会阻止其绘入 PNG。" },
      ],
      faqs: [
        { title: "怎么从 ChatGPT 复制完整的 Markdown 格式？", text: "不要手动拖选文字，直接点击每条 ChatGPT 回复下方的复制按钮，它复制的就是带标题、列表和表格语法的纯 Markdown。" },
        { title: "我的 ChatGPT 内容会上传到服务器吗？", text: "不会。所有解析和 PNG 生成全部在你的浏览器本地完成，NavoKit 不会上传或留存任何文本。" },
        { title: "支持 ChatGPT 输出的表格和代码块吗？", text: "支持。工具内置 GitHub Flavored Markdown (GFM) 渲染，完整支持表格、引用块、列表和代码片段。" },
        { title: "需要注册账号或安装浏览器插件吗？", text: "完全不需要。打开网页即可免费使用，免登录、无插件依赖。" },
      ],
    },
  },
  {
    slug: "claude-to-image",
    exportFilename: "navokit-claude-to-image.png",
    guideSlug: "how-to-export-chatgpt-responses-as-images",
    en: {
      metaTitle: "Claude to Image — Export Claude Responses & Notes as PNG | NavoKit",
      metaDescription: "Turn Claude AI responses, structured outlines, and Markdown artifacts into clean PNG image cards in your browser. Free, private, and no login required.",
      badge: "Claude Export",
      heroTitle: "Claude Response to Image",
      heroSubtitle: "Convert structured Claude outputs, essays, and technical breakdowns into clean PNG cards with zero formatting loss—rendered locally in your browser.",
      answerFirst: "To turn a Claude response or Markdown Artifact into a shareable PNG, copy the response using Claude's Copy button, paste it into the editor below, and export a 2x PNG directly in your browser. Formatting like headings, tables, blockquotes, and code snippets stays intact without installing an extension.",
      initialMarkdown: `# Architecture Trade-offs: Local vs. Cloud Tools

| Dimension | Browser-Local Tool | Cloud-Hosted API Tool |
| --- | --- | --- |
| **Latency** | Instant (0 ms network) | Depends on queue & API |
| **Privacy** | Data stays on device | Sent to third-party servers |
| **Cost** | Zero marginal cost | Per-request compute cost |

## Key Takeaway

Start with **browser-local execution** whenever the task can run client-side—it maximizes speed, trust, and reliability.`,
      howTitle: "From Claude Markdown output to a clean visual card.",
      facts: [
        { label: "Task", value: "Export Claude answers and Markdown Artifacts as high-DPI PNG images." },
        { label: "Input", value: "Markdown copied from Claude chat or Claude Artifacts." },
        { label: "Output", value: "A crisp 2x PNG card preserving tables, hierarchy, and code blocks." },
        { label: "Privacy", value: "Processed entirely in your local browser; nothing is sent to a server." },
      ],
      steps: [
        { title: "Copy from Claude", text: "Click Copy on a Claude reply or copy the Markdown source from a Claude Artifact." },
        { title: "Refine the snippet", text: "Paste into the editor and keep the clearest section, table, or summary." },
        { title: "Export PNG", text: "Download a crisp PNG image ready for X, LinkedIn, presentations, or docs." },
      ],
      useCases: [
        { title: "Export Markdown Artifacts", text: "Turn structured tables, frameworks, and checklists from Claude Artifacts into shareable graphics." },
        { title: "Technical explanations", text: "Share clean architecture notes and comparison tables on social feeds." },
        { title: "Client & stakeholder briefs", text: "Drop readable visual summaries into slide decks or email updates." },
        { title: "Personal knowledge cards", text: "Save distilled research notes as standalone PNG assets." },
      ],
      limitations: [
        { title: "Interactive React/HTML Artifacts", text: "This tool converts Markdown text and tables, not interactive HTML/React code previews." },
        { title: "Long essays", text: "Split long Claude drafts into focused cards so text remains easy to read on mobile feeds." },
      ],
      faqs: [
        { title: "Does this work with Claude Artifacts?", text: "Yes for Markdown, text, and table Artifacts—copy the Markdown content and paste it directly into the editor." },
        { title: "Why export as PNG instead of taking a screenshot?", text: "Browser screenshots depend on window zoom, scrollbars, and UI chrome. Exporting from Markdown gives consistent typography, clean margins, and crisp 2x resolution." },
        { title: "Is my Claude conversation kept private?", text: "Yes. Rendering happens locally in your browser via canvas; NavoKit never uploads or logs your text." },
        { title: "Are GFM comparison tables supported?", text: "Yes. Markdown tables generated by Claude render cleanly with readable borders and spacing." },
      ],
    },
    zh: {
      metaTitle: "Claude 回答转图片 — 免费把 Claude 输出与 Markdown 导出为 PNG | NavoKit",
      metaDescription: "将 Claude 的结构化回答、对比表格和 Markdown Artifact 一键转换为高清 PNG 卡片。纯浏览器本地渲染，免费免登录。",
      badge: "Claude 导出",
      heroTitle: "Claude 回答与表格转图片",
      heroSubtitle: "将 Claude 输出的深度分析、Markdown 对比表格与 Artifact 文本转成排版干净的高清 PNG 卡片，纯本地渲染，不丢格式。",
      answerFirst: "想把 Claude 的结构化回答或 Markdown Artifact 导出成清晰图片？直接点击 Claude 的复制按钮获取原始 Markdown，粘贴到下方左侧编辑器即可在浏览器本地一键导出 2x 高清 PNG，完整保留对比表格、标题层级和代码块，无需插件或登录。",
      initialMarkdown: `# 架构取舍：纯前端本地工具 vs 云端 API 工具

| 对比维度 | 浏览器本地运行 | 云端 API 托管 |
| --- | --- | --- |
| **响应速度** | 毫秒级，无网络等待 | 受队列与接口延迟影响 |
| **数据隐私** | 内容留在用户本机 | 需发送至第三方服务器 |
| **边际成本** | 几乎为零 | 每次调用消耗算力成本 |

## 核心结论

凡是能在浏览器端完成的工具任务，优先采用**本地执行架构**——速度快、隐私强、稳定性高。`,
      howTitle: "把 Claude 的结构化 Markdown 变成即发即用的视觉卡片。",
      facts: [
        { label: "核心任务", value: "将 Claude 回复与 Markdown Artifact 导出为高清 PNG 卡片。" },
        { label: "支持输入", value: "Claude 对话复制的 Markdown、对比表格、引用和代码块。" },
        { label: "输出结果", value: "排版统一、边界清爽的 2x 高清 PNG 图片。" },
        { label: "隐私保障", value: "纯浏览器本地处理，不经过任何后端接口。" },
      ],
      steps: [
        { title: "复制 Claude 输出", text: "点击 Claude 回复底部或 Artifact 里的复制按钮，保留原始 Markdown 语法。" },
        { title: "精炼展示重点", text: "粘贴到左侧编辑框，突出核心表格或结论段落，右侧同步预览。" },
        { title: "下载高清卡片", text: "一键导出 2x PNG，直接发到公众号、X、LinkedIn 或汇报 PPT。" },
      ],
      useCases: [
        { title: "Markdown 表格配图", text: "Claude 很擅长输出对比表，用工具一键转图，比截屏清晰得多。" },
        { title: "技术方案与复盘", text: "把架构分析与代码片段导出成高质感图文卡片。" },
        { title: "团队汇报摘要", text: "快速把长文提炼出的要点做成可贴进 PPT 的视觉块。" },
        { title: "个人知识卡片归档", text: "把精华问答保存成统一风格的 PNG 资料。" },
      ],
      limitations: [
        { title: "不支持交互式网页 Artifact", text: "本工具面向 Markdown 文本与表格；HTML/React 交互式组件暂不支持直接渲染。" },
        { title: "超长文章建议拆分", text: "长篇分析建议按小节分成 2-3 张卡片，移动端阅读体验更好。" },
      ],
      faqs: [
        { title: "支持 Claude Artifacts 里的 Markdown 文档吗？", text: "支持。只要是 Markdown 文档、大纲或表格类 Artifact，复制原文粘贴进来即可实时渲染并导出 PNG。" },
        { title: "为什么比直接系统截图更好？", text: "系统截图受浏览器缩放、窗口宽度和滚动条限制；Markdown 导出能保证统一的字体、留白与 2 倍清晰度。" },
        { title: "导出过程会上传我的内容吗？", text: "不会。所有渲染在本地浏览器中完成，NavoKit 不会收集或保存你的输入。" },
        { title: "表格列数较多时怎么排版？", text: "建议保持 2-4 列简洁文案，预览区所见即所得，确认不换行错位后再下载。" },
      ],
    },
  },
  {
    slug: "obsidian-to-image",
    exportFilename: "navokit-obsidian-note.png",
    guideSlug: "how-to-convert-markdown-to-png",
    en: {
      metaTitle: "Obsidian Note to Image — Convert Obsidian Markdown to PNG | NavoKit",
      metaDescription: "Turn Obsidian Markdown notes into clean, high-resolution PNG cards directly in your browser. No plugins, no account, 100% local rendering.",
      badge: "Obsidian Notes",
      heroTitle: "Obsidian Markdown to Image",
      heroSubtitle: "Export atomic notes, reading highlights, and checklists from Obsidian into crisp PNG cards without installing community plugins.",
      answerFirst: "To export an Obsidian note as a clean PNG without installing third-party Obsidian plugins, copy the Markdown from your note, paste it into NavoKit below, and click Download Image. Your note renders locally in the browser into a sharp 2x PNG while keeping your vault private.",
      initialMarkdown: `# Atomic Note: Evergreen Knowledge

**Core Idea**: Notes become valuable when they are rewritten in your own words and linked to real decisions.

- Keep each note focused on **one concept**
- Write a 2-sentence summary at the top
- Add concrete examples instead of raw quotes
- Review and prune weekly

> "A note you can share in 30 seconds is a note you actually understand."`,
      howTitle: "Share clean Obsidian notes as PNG without extra plugins.",
      facts: [
        { label: "Task", value: "Convert Obsidian Markdown notes into clean, shareable PNG images." },
        { label: "Input", value: "Standard Markdown from Obsidian (headings, lists, quotes, tables, code)." },
        { label: "Output", value: "High-DPI 2x PNG card ready for social feeds, study groups, or docs." },
        { label: "Privacy", value: "Local browser rendering—matches Obsidian's local-first privacy ethos." },
      ],
      steps: [
        { title: "Copy from Obsidian", text: "Select and copy your note in Obsidian's Source or Live Preview mode." },
        { title: "Clean up wiki-links if needed", text: "Paste into the editor and tidy any internal `[[wiki-links]]` or YAML frontmatter you don't want displayed." },
        { title: "Download PNG", text: "Click Download Image to save a crisp visual note card." },
      ],
      useCases: [
        { title: "Book & paper highlights", text: "Turn reading notes into clean cards for X, LinkedIn, or reading clubs." },
        { title: "Study sheets & flashcards", text: "Export concise definitions, formulas, and bullet summaries as images." },
        { title: "Public learning logs", text: "Share evergreen atomic notes without exposing your whole vault." },
        { title: "Team SOP snippets", text: "Convert internal Markdown checklists into clean visual references." },
      ],
      limitations: [
        { title: "Obsidian-specific syntax", text: "Proprietary syntax like `[[wikilinks]]`, callout blocks (`> [!note]`), or Dataview queries render as plain Markdown text unless simplified." },
        { title: "Local vault images", text: "Embedded local attachments (`![[image.png]]`) are not accessible from a web browser and should be omitted." },
      ],
      faqs: [
        { title: "Why use this instead of an Obsidian export plugin?", text: "You don't need to install, trust, or maintain another community plugin. Just paste a note whenever you want a clean PNG." },
        { title: "Does it keep my Obsidian notes private?", text: "Yes. Everything runs locally in your browser; your Markdown text is never transmitted to NavoKit servers." },
        { title: "What happens to YAML frontmatter?", text: "Remove the `---` YAML frontmatter block at the top before exporting so only the readable note body appears in the PNG." },
        { title: "Can I export Markdown checklists and tables?", text: "Yes. GFM task lists (`- [x]`), tables, blockquotes, and code blocks are supported." },
      ],
    },
    zh: {
      metaTitle: "Obsidian 笔记转图片 — 免费把 Obsidian Markdown 导出为 PNG 卡片 | NavoKit",
      metaDescription: "无需安装 Obsidian 社区插件，在浏览器本地把 Obsidian Markdown 笔记一键转为高清 PNG 知识卡片。隐私安全、免费免登录。",
      badge: "Obsidian 笔记",
      heroTitle: "Obsidian 笔记转高清图片",
      heroSubtitle: "无需折腾第三方插件，把 Obsidian 里的卡片笔记、读书摘录与复盘清单直接导出为干净的 2x PNG 卡片，延续本地优先的隐私原则。",
      answerFirst: "不想为了偶尔发图而给 Obsidian 安装额外的社区插件？直接复制 Obsidian 笔记里的 Markdown 原文粘贴到下方编辑器，即可在浏览器本地一键生成 2 倍高清 PNG 图片。全程零上传、不联网处理，完整保留标题、任务清单、引用和表格。",
      initialMarkdown: `# 原子笔记：常青知识的写作原则

**核心观点**：只有用自己的话重写、并能指导真实行动的笔记，才会产生复利。

- 每张卡片只聚焦**一个独立概念**
- 开头用两句话写清核心结论
- 多记具体案例，少做纯原文堆砌
- 每周回顾并合并重复笔记

> 「一张能在 30 秒内讲给别人听的笔记，才是你真正理解的知识。」`,
      howTitle: "免插件把 Obsidian 笔记导出成高颜值知识卡片。",
      facts: [
        { label: "核心任务", value: "将 Obsidian Markdown 笔记转换为适合分享的高清 PNG 卡片。" },
        { label: "支持输入", value: "标准 Markdown 语法（标题、任务列表、表格、引用、代码块）。" },
        { label: "输出结果", value: "2x 高清 PNG 图片，适合社群分享、读书笔记或复盘归档。" },
        { label: "隐私保障", value: "纯浏览器本地渲染，契合 Obsidian 本地优先的隐私理念。" },
      ],
      steps: [
        { title: "复制 Obsidian 笔记", text: "在源码或实时预览模式下复制需要分享的 Markdown 段落。" },
        { title: "清理双链或 YAML", text: "粘贴到左侧编辑框，按需去掉顶部的 YAML 属性或内部 `[[双链]]` 符号。" },
        { title: "导出高清 PNG", text: "点击下载图片，立刻获得排版整洁的知识卡片。" },
      ],
      useCases: [
        { title: "读书笔记分享", text: "把书摘与个人思考做成统一风格的图片卡片发到社交平台。" },
        { title: "学习清单与速查表", text: "将复习要点、命令速查表保存成手机随时可看的图片。" },
        { title: "公开学习日志", text: "在不公开整个 Vault 的前提下，分享单篇高质量原子笔记。" },
        { title: "团队 SOP 卡片", text: "把常用流程清单导出成清爽图片方便协作。" },
      ],
      limitations: [
        { title: "Obsidian 专属语法", text: "如 `[[双链]]`、Dataview 查询或特殊 Callout 语法会按纯文本展示，导出前建议顺手改为标准 Markdown。" },
        { title: "本地附件图片", text: "形如 `![[local.png]]` 的本地库图片无法被网页读取，导出文字卡片时请先移除。" },
      ],
      faqs: [
        { title: "相比 Obsidian 导出图片插件有什么优势？", text: "不用安装和维护第三方插件，不怕版本升级失效，也不受桌面端/移动端环境限制，打开网页粘贴就能出图。" },
        { title: "我的笔记内容会被上传吗？", text: "不会。所有解析和绘图均在你的浏览器本地完成，NavoKit 不会上传或存储笔记内容。" },
        { title: "支持任务清单（Checkbox）吗？", text: "支持。`- [x]` 和 `- [ ]` 这类 GFM 任务清单语法可以直接渲染。" },
        { title: "笔记顶部的 YAML Frontmatter 怎么处理？", text: "建议粘贴后手动删掉顶部 `---` 包裹的属性区块，这样导出的卡片视觉上更干净。" },
      ],
    },
  },
  {
    slug: "linkedin-carousel",
    exportFilename: "navokit-linkedin-card.png",
    guideSlug: "markdown-to-image-for-linkedin-posts",
    en: {
      metaTitle: "Markdown to LinkedIn Image Card — Clean Visual Posts | NavoKit",
      metaDescription: "Turn Markdown frameworks, checklists, and B2B insights into clean, high-contrast PNG cards for LinkedIn posts and carousels. Free and browser-local.",
      badge: "LinkedIn Visuals",
      heroTitle: "Markdown to LinkedIn Image Card",
      heroSubtitle: "Skip heavy design tools. Turn structured Markdown frameworks, checklists, and takeaways into crisp, readable visual cards for LinkedIn posts.",
      answerFirst: "To create a clean LinkedIn graphic without opening Canva or Figma, write your framework or checklist in Markdown below and export a crisp 2x PNG card in one click. High-contrast monochrome typography, bullet lists, and compact tables stay legible on mobile LinkedIn feeds and require zero design setup.",
      initialMarkdown: `# Why Most B2B AI Content Gets Ignored

1. **Zero original data** — Repeating generic definitions everyone already read.
2. **Wall of text** — No visual anchor to stop the feed scroll.
3. **No clear next step** — Readers nod, then keep scrolling.

## What Works Instead

- Lead with **one sharp takeaway**
- Show a real checklist or comparison table
- Keep each visual card under 100 words`,
      howTitle: "Create clean, scannable LinkedIn visual cards straight from Markdown.",
      facts: [
        { label: "Task", value: "Turn Markdown outlines and checklists into crisp PNG cards for LinkedIn." },
        { label: "Input", value: "Short headings, numbered points, bold takeaways, and compact tables." },
        { label: "Output", value: "A sharp 2x PNG image with clean margins and high mobile legibility." },
        { label: "Privacy", value: "100% browser-local rendering; no account or cloud workspace needed." },
      ],
      steps: [
        { title: "Draft one clear takeaway", text: "Write a punchy heading and 3–5 concise bullet points in Markdown." },
        { title: "Check mobile scannability", text: "Preview the card on the right—keep lines short and use bolding sparingly for hierarchy." },
        { title: "Export & upload", text: "Download the PNG and attach it directly to your LinkedIn post or combine multiple cards into a PDF carousel." },
      ],
      useCases: [
        { title: "Single-card framework posts", text: "Pair a crisp checklist graphic with a short LinkedIn text post." },
        { title: "Slide-by-slide carousel assets", text: "Export 5–7 focused cards with consistent styling, then merge into a LinkedIn Document PDF." },
        { title: "DevRel & product updates", text: "Share release highlights and architecture summaries without waiting on design." },
        { title: "Founder & operator playbooks", text: "Turn internal lessons into clean, bookmarkable visual guides." },
      ],
      limitations: [
        { title: "Exports individual PNGs", text: "Each click downloads one PNG card. For a multi-slide LinkedIn PDF carousel, export each slide and combine them with your OS print-to-PDF or PDF merger." },
        { title: "Monochrome editorial style", text: "Designed for clean, high-contrast typography rather than decorative templates or stock illustrations." },
      ],
      faqs: [
        { title: "How many words should I put on one LinkedIn image card?", text: "Aim for 40 to 100 words per card—one clear H1 heading, 3 to 5 bullet points, or a 3-column table so mobile readers can scan it in 3 seconds." },
        { title: "Can I use these PNGs for a LinkedIn carousel?", text: "Yes. Export each section as a separate PNG card so every slide shares identical typography and padding, then combine them into a single PDF to upload as a LinkedIn Document." },
        { title: "Why use Markdown instead of Canva for LinkedIn graphics?", text: "If you already write in Notion, Obsidian, or Docs, pasting Markdown takes 10 seconds and keeps spacing consistent without dragging text boxes." },
        { title: "Is the tool free for commercial LinkedIn posts?", text: "Yes. It is free to use with no account required." },
      ],
    },
    zh: {
      metaTitle: "Markdown 转 LinkedIn 配图卡片 — 一键生成清爽职场图文 | NavoKit",
      metaDescription: "无需打开 Canva 或 Figma，把 Markdown 清单、方法论和对比表格一键导出为适合 LinkedIn 帖子与轮播图的高清 PNG 卡片。",
      badge: "LinkedIn 配图",
      heroTitle: "Markdown 转 LinkedIn 图文卡片",
      heroSubtitle: "跳过繁琐的排版软件。把你的结构化观点、复盘清单或 B2B 对比表格直接转成高对比度、移动端清晰易读的 LinkedIn 配图。",
      answerFirst: "想发高质量 LinkedIn 图文又不想花半小时在 Canva 里拖文本框？直接把 50~100 字的 Markdown 要点粘贴到下方，一键即可导出高对比度、留白克制的 2x PNG 卡片。如果做多页 Carousel（轮播文档），按页分别导出再合并为 PDF 即可保证每一页风格完全统一。",
      initialMarkdown: `# 为什么大多数 B2B 干货帖没人看？

1. **缺少一手观察** — 重复所有人都能搜到的泛泛定义。
2. **纯文字墙** — 信息流里缺少能让人停下来的视觉锚点。
3. **没有可执行结论** — 看完点头，但不知道下一步做什么。

## 更高转发率的做法

- 第一行直接抛**一个反常识结论**
- 配一张清晰清单或对比表格
- 单张图文控制在 100 字以内`,
      howTitle: "从 Markdown 提纲到专业感十足的 LinkedIn 视觉卡片。",
      facts: [
        { label: "核心任务", value: "将 Markdown 清单、观点与表格转为适合 LinkedIn 发布的 PNG 卡片。" },
        { label: "支持输入", value: "标题、要点列表、加粗金句、简洁对比表与引用块。" },
        { label: "输出结果", value: "移动端清晰易读的 2x 高清 PNG 配图。" },
        { label: "隐私保障", value: "纯浏览器本地生成，免登录、无云端存储。" },
      ],
      steps: [
        { title: "提炼单页核心观点", text: "用 1 个标题 + 3~5 条短要点写出这一页最值得收藏的信息。" },
        { title: "检查移动端可读性", text: "在右侧预览留白和断行，避免大段密密麻麻的文字。" },
        { title: "导出并发布", text: "下载 PNG 直接作为单图配图，或多页导出后合并为 PDF 上传为 LinkedIn Carousel。" },
      ],
      useCases: [
        { title: "单图干货帖", text: "把核心框架做成一张干净卡片，提升信息流停留与收藏率。" },
        { title: "多页 Carousel 素材", text: "批量导出 5-7 张排版统一的 PNG，合并为 PDF 文档发布。" },
        { title: "产品与 DevRel 更新", text: "快速把版本亮点或技术架构做成可分享卡片。" },
        { title: "创始人复盘笔记", text: "把内部经验沉淀为可直接传播的视觉指南。" },
      ],
      limitations: [
        { title: "单次导出单张 PNG", text: "每次点击下载当前预览的 1 张 PNG；制作多页 PDF 轮播需分次导出后用系统工具合并。" },
        { title: "极简编辑部风格", text: "专注高对比度文字与表格可读性，不提供花哨插画模板。" },
      ],
      faqs: [
        { title: "单张 LinkedIn 卡片放多少字效果最好？", text: "建议控制在 40~100 字（英文）或 80~150 字（中文）以内，1 个标题配 3~5 条要点，确保手机端 3 秒能扫完。" },
        { title: "怎么用导出的 PNG 做 LinkedIn 轮播（Carousel）？", text: "按页分别粘贴内容并导出 PNG，因为字体和边距完全一致，用系统“打印为 PDF”合并后上传为 LinkedIn Document 即可。" },
        { title: "相比 Canva 有什么优势？", text: "写完文字直接粘贴就能出图，不用反复对齐文本框，10 秒搞定且版式极度克制专业。" },
        { title: "可以免费用于商业账号或公司主页吗？", text: "可以，工具完全免费且无需注册账号。" },
      ],
    },
  },
  {
    slug: "github-readme-card",
    exportFilename: "navokit-github-readme-card.png",
    guideSlug: "github-readme-visual-structure",
    en: {
      metaTitle: "GitHub README & Changelog to Image Card | NavoKit",
      metaDescription: "Turn GitHub README highlights, release changelogs, and Markdown tables into crisp PNG cards for launch posts and docs. Free, local browser export.",
      badge: "Developer Visuals",
      heroTitle: "GitHub README & Changelog to Image",
      heroSubtitle: "Convert release notes, CLI quickstarts, and README feature tables into clean PNG cards for launch threads, Discord announcements, and newsletters.",
      answerFirst: "To turn a GitHub README section or release changelog into a clean launch graphic, paste the Markdown snippet below and download a 2x PNG directly from your browser. Code blocks, badges-free feature lists, and GFM tables stay sharp without cropping awkward GitHub page screenshots.",
      initialMarkdown: `# Release v2.4 — Faster Local Indexing

## What's New

- **3x faster startup** by switching metadata scans to cached manifests
- **Zero-config CLI** — run \`npx mytool init\` to generate defaults
- **Strict TypeScript types** exported for all public hooks

## Breaking Changes

| Old Flag | New Flag | Notes |
| --- | --- | --- |
| \`--silent\` | \`--quiet\` | Aligns with POSIX conventions |
| \`--out\` | \`--output\` | Accepts file or directory path |`,
      howTitle: "Turn raw GitHub Markdown into crisp release & README cards.",
      facts: [
        { label: "Task", value: "Convert GitHub READMEs, changelogs, and release notes into PNG cards." },
        { label: "Input", value: "GitHub Flavored Markdown (GFM): tables, inline code, fenced code blocks, lists." },
        { label: "Output", value: "High-resolution 2x PNG ready for X, Hacker News, Discord, or Slack." },
        { label: "Privacy", value: "100% browser-local rendering—safe for pre-release draft notes." },
      ],
      steps: [
        { title: "Copy a README or Release section", text: "Grab your changelog highlights, feature table, or quickstart commands in raw Markdown." },
        { title: "Preview GFM rendering", text: "Check inline code, code blocks, and tables in the live preview panel." },
        { title: "Download 2x PNG", text: "Export a clean visual card to announce your release on X, LinkedIn, or Discord." },
      ],
      useCases: [
        { title: "Version release announcements", text: "Turn `CHANGELOG.md` entries into visual cards that stand out in feeds." },
        { title: "Open-source launch threads", text: "Show CLI commands and feature comparison tables clearly." },
        { title: "API & SDK quickstarts", text: "Export concise code examples and setup steps for developer docs." },
        { title: "Internal engineering updates", text: "Share clean RFC summaries and migration tables in Slack." },
      ],
      limitations: [
        { title: "Raw HTML in READMEs", text: "Custom HTML tags (like `<div align=\"center\">` or badge `<img>` grids) are not executed; stick to standard GFM Markdown." },
        { title: "Very wide code lines", text: "Wrap long CLI commands or code lines so they stay readable inside the card width." },
      ],
      faqs: [
        { title: "Does it support GitHub Flavored Markdown (GFM)?", text: "Yes. GFM tables, strikethrough, task lists, inline code, and fenced code blocks are rendered cleanly." },
        { title: "Is it safe for unreleased or private repo changelogs?", text: "Yes. All rendering happens locally inside your browser and nothing is transmitted to NavoKit servers." },
        { title: "Why not just screenshot GitHub directly?", text: "GitHub screenshots include repo chrome, mismatched widths, and small fonts. Exporting from Markdown gives a clean, focused editorial card." },
        { title: "Does it work with code blocks and CLI snippets?", text: "Yes. Both inline backticks and multi-line fenced code blocks are formatted with clean monospace styling." },
      ],
    },
    zh: {
      metaTitle: "GitHub README 与更新日志转图片卡片 — 开发者免费导出 PNG | NavoKit",
      metaDescription: "把 GitHub README 亮点、Release 更新日志和 GFM 表格一键转为高清 PNG 卡片，适合开源项目发布、技术社区分享与文档配图。",
      badge: "开发者视觉",
      heroTitle: "GitHub README 与更新日志转图片",
      heroSubtitle: "把项目的 Release Notes、CLI 快速上手命令和 GFM 功能对比表直接转成清爽的 2x PNG 卡片，发 X、技术群或周报再也不用硬截 GitHub 页面。",
      answerFirst: "想把开源项目的 Release 更新日志或 README 亮点做成好看的发布配图？直接把 GFM Markdown 片段粘贴到下方编辑器，浏览器本地即可渲染并导出 2x 高清 PNG。完整支持表格、行内代码与代码块，未公开发布的私密版本说明也能放心在本地处理。",
      initialMarkdown: `# v2.4 版本发布 — 更快的本地索引

## 本次更新

- **启动提速 3 倍**：元数据扫描切换为缓存清单
- **零配置 CLI**：运行 \`npx mytool init\` 即可生成默认配置
- **完整 TypeScript 类型**：所有公开 Hook 均导出严格类型

## 破坏性变更

| 旧参数 | 新参数 | 说明 |
| --- | --- | --- |
| \`--silent\` | \`--quiet\` | 与 POSIX 习惯保持一致 |
| \`--out\` | \`--output\` | 支持传入文件或目录路径 |`,
      howTitle: "把 GitHub 原始 Markdown 变成即发即用的版本发布卡片。",
      facts: [
        { label: "核心任务", value: "将 GitHub README、更新日志和架构笔记导出为高清 PNG 卡片。" },
        { label: "支持输入", value: "GitHub Flavored Markdown (GFM)：表格、行内代码、代码块、任务列表。" },
        { label: "输出结果", value: "适合 X、Discord、掘金、V2EX 或团队群分享的 2x PNG。" },
        { label: "隐私保障", value: "纯浏览器本地渲染，未发布的私密项目更新日志也可安心使用。" },
      ],
      steps: [
        { title: "复制 README 或 Release 片段", text: "从仓库复制核心特性列表、变更日志或快速上手命令的 Markdown 原文。" },
        { title: "检查代码与表格预览", text: "在右侧实时确认代码块换行与表格列宽是否清晰。" },
        { title: "导出 2x PNG", text: "一键下载高清卡片，用于版本发布帖或社区宣传。" },
      ],
      useCases: [
        { title: "版本发布公告", text: "把 `CHANGELOG.md` 重点变更转成一眼能看懂的视觉卡片。" },
        { title: "开源项目冷启动推广", text: "清晰展示安装命令、特性清单与竞品对比表。" },
        { title: "API / SDK 快速上手图", text: "导出简短调用示例放进文档或开发者社群。" },
        { title: "团队技术周报", text: "把 RFC 摘要和迁移参数表转成清晰配图发到工作群。" },
      ],
      limitations: [
        { title: "README 里的原生 HTML", text: "如 `<div align=\"center\">` 或外部徽章图片不会按 HTML 排版，建议使用标准 GFM 语法。" },
        { title: "超长代码行", text: "建议对超长 CLI 命令适当换行，保证卡片整体视觉平衡。" },
      ],
      faqs: [
        { title: "支持 GitHub Flavored Markdown (GFM) 吗？", text: "支持，包括表格、删除线、任务列表、行内代码和围栏代码块。" },
        { title: "未公开的私有仓库更新日志用这个安全吗？", text: "安全。转换完全在你的浏览器本地完成，不会向服务器发送任何文本。" },
        { title: "为什么不直接截 GitHub 网页？", text: "网页截图容易带入无关边框、字体偏小且留白不均；直接由 Markdown 导出能得到统一高质感卡片。" },
        { title: "导出图片有多清晰？", text: "默认按 2 倍像素比（Retina 2x）导出 PNG，在高清屏和手机端都能保持锐利。" },
      ],
    },
  },
  {
    slug: "x-thread-card",
    exportFilename: "navokit-x-card.png",
    guideSlug: "visualize-code-on-x-twitter",
    en: {
      metaTitle: "Markdown to X (Twitter) Image Card — Clean Long-Form Visuals | NavoKit",
      metaDescription: "Turn long-form notes, checklists, and code snippets into crisp, readable PNG cards for X (Twitter) posts and threads. Free, instant, browser-local.",
      badge: "X / Twitter Visuals",
      heroTitle: "Markdown to X (Twitter) Image Card",
      heroSubtitle: "Bypass character limits cleanly. Format structured insights, lists, and code snippets into sharp PNG cards built to stand out in the X timeline.",
      answerFirst: "To post structured notes, tables, or code snippets on X (Twitter) without ugly Notes-app screenshots, paste your Markdown below and export a crisp 2x PNG card in one click. Everything renders locally in your browser with clean margins and zero sign-up.",
      initialMarkdown: `# 3 Rules for Shipping Faster as a Solo Builder

- **Cut scope, not polish** — One sharp workflow beats ten half-built tabs.
- **Measure real actions** — Exports and return visits matter more than pageviews.
- **Ship in public with proof** — Show the actual output, not a promise.

\`\`\`bash
# Ship small, verify fast
npm run build && npm run seo:audit
\`\`\``,
      howTitle: "Turn Markdown notes and code snippets into crisp X timeline cards.",
      facts: [
        { label: "Task", value: "Format Markdown notes, lists, and code blocks into clean PNG cards for X." },
        { label: "Input", value: "Short notes, numbered takeaways, quotes, tables, or code snippets." },
        { label: "Output", value: "Sharp 2x PNG image optimized for mobile & desktop timeline legibility." },
        { label: "Privacy", value: "Runs 100% locally in your browser; zero account or upload required." },
      ],
      steps: [
        { title: "Write your hook & points", text: "Paste a short Markdown note, list, or code snippet into the left panel." },
        { title: "Keep it punchy", text: "Trim extra fluff so the card stays compact and readable without zooming in." },
        { title: "Export & attach to X", text: "Download the 2x PNG and attach it to your tweet or thread." },
      ],
      useCases: [
        { title: "Replace Apple Notes screenshots", text: "Upgrade raw phone screenshots with consistent editorial typography." },
        { title: "Share code & terminal snippets", text: "Post readable CLI commands alongside short context bullets." },
        { title: "Thread summary cards", text: "Pin a visual TL;DR card at the end of a long X thread for bookmarks." },
        { title: "Comparison mini-tables", text: "Post crisp 2–3 column comparison tables that plain tweets can't format." },
      ],
      limitations: [
        { title: "Mind image aspect ratio", text: "Very tall cards get cropped in X timeline previews; keep each card concise or split into 2–4 attached images." },
      ],
      faqs: [
        { title: "Why attach a Markdown image card instead of posting a long tweet?", text: "X plain text cannot render Markdown tables, clean code blocks, or visual hierarchy. A crisp card earns more stops and bookmarks in the feed." },
        { title: "Can I attach multiple cards to one post on X?", text: "Yes. X lets you attach up to 4 images per post—export 2 to 4 concise cards for a mini visual thread." },
        { title: "Does it support code snippets?", text: "Yes. Both inline code and fenced code blocks render cleanly." },
        { title: "Is it free and no-login?", text: "Yes. Open the page, paste Markdown, and download PNGs instantly." },
      ],
    },
    zh: {
      metaTitle: "Markdown 转 X (Twitter) 图文卡片 — 长文与代码片段导出 PNG | NavoKit",
      metaDescription: "把 Markdown 笔记、清单、对比表格和代码片段一键转为适合 X (Twitter) 信息流的高清 PNG 卡片。免登录、纯本地渲染。",
      badge: "X / Twitter 配图",
      heroTitle: "Markdown 转 X (Twitter) 图文卡片",
      heroSubtitle: "告别丑陋的备忘录截图。把观点清单、表格与代码片段一键转成排版克制、信息流一眼就能看清的 2x PNG 卡片。",
      answerFirst: "想在 X (Twitter) 上发带表格、列表或代码块的干货内容，又不想用模糊的手机备忘录截图？把 Markdown 粘贴到下方编辑器，点击下载即可在本地生成 2x 高清 PNG 卡片，免登录、无上传，直接附加到推文或 Thread 中即可。",
      initialMarkdown: `# 独立开发者提速上线的 3 条原则

- **砍范围，不砍质感** — 一个打磨到位的核心流程，胜过十个半成品功能。
- **盯真实动作指标** — 工具导出与回访，远比虚荣浏览量重要。
- **拿真实输出说话** — 展示真实结果，而不是空洞口号。

\`\`\`bash
# 小步快跑，快速验证
npm run build && npm run seo:audit
\`\`\``,
      howTitle: "把 Markdown 笔记和代码片段变成高收藏率的 X 卡片。",
      facts: [
        { label: "核心任务", value: "将 Markdown 要点、表格和代码块转为适合 X 发布的 PNG 卡片。" },
        { label: "支持输入", value: "短笔记、要点清单、引用金句、对比表与代码片段。" },
        { label: "输出结果", value: "移动端和桌面端信息流都清晰锐利的 2x PNG 图片。" },
        { label: "隐私保障", value: "纯浏览器本地渲染，无需登录，不上传草稿。" },
      ],
      steps: [
        { title: "写下核心观点或代码", text: "在左侧粘贴简短的 Markdown 笔记、清单或命令示例。" },
        { title: "控制卡片高度", text: "精简字数，让卡片在 X 信息流里不用点开放大也能一眼读完。" },
        { title: "导出并发布推文", text: "下载 2x PNG 直接附加到推文，或 2-4 张一组发视觉 Thread。" },
      ],
      useCases: [
        { title: "替代备忘录截图", text: "用统一的编辑部排版质感取代凌乱的手机截屏。" },
        { title: "分享代码与 CLI 命令", text: "在代码块旁边配上简短说明，开发者转发率更高。" },
        { title: "Thread 结尾总结卡", text: "在长推文最后附一张 TL;DR 总结图，显著提升收藏率。" },
        { title: "信息流对比表格", text: "弥补纯文本推文无法排表格的短板。" },
      ],
      limitations: [
        { title: "注意图片长宽比", text: "过长的竖图在 X 信息流中会被裁切预览；建议单张精简，或拆成 2-4 张并排附加。" },
      ],
      faqs: [
        { title: "为什么发图比纯文字长推文效果更好？", text: "纯文字推文不支持表格、代码块和层级留白；一张排版干净的卡片在信息流里更容易让人停下阅读和收藏。" },
        { title: "一条推文可以配多张卡片吗？", text: "可以，X 单条推文支持最多 4 张图，把长观点拆成 2-4 张卡片效果非常好。" },
        { title: "支持代码高亮/代码块吗？", text: "支持行内代码和围栏代码块，等宽字体排版清晰易读。" },
        { title: "使用需要登录或付费吗？", text: "不需要，打开网页即可免费无限次本地导出。" },
      ],
    },
  },
];

export function getMarkdownUseCases(): MarkdownUseCase[] {
  return MARKDOWN_USE_CASES;
}

export function getMarkdownUseCase(slug: string): MarkdownUseCase | undefined {
  return MARKDOWN_USE_CASES.find(item => item.slug === slug);
}

export function getMarkdownUseCaseHref(slug: string, lang: Locale): string {
  return `/${lang}/tools/markdown-to-image/${slug}`;
}
