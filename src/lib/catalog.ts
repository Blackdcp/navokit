import type { CatalogProduct, Locale, ProductCategory, ProductCategoryId, ProductEntry, Topic } from "@/types/catalog";
import { knowledgeProducts } from "./catalog-expansion/knowledge";
import { creativeProducts } from "./catalog-expansion/creative";
import { builderProducts } from "./catalog-expansion/builders";

export type { CatalogProduct, Locale, ProductCategory, ProductCategoryId, Topic } from "@/types/catalog";

type TopicEntry = Pick<Topic, "id" | "icon" | "accent"> & Record<Locale, Pick<Topic, "name" | "description" | "kicker">>;

const categories: Array<[ProductCategoryId, string, string, string, string]> = [
  ["assistants", "General assistants", "通用助手", "Conversational help for everyday tasks.", "通过对话处理日常任务。"],
  ["image-design", "Image generation", "图像生成", "Generate and refine visual ideas.", "生成与调整图像、视觉创意。"],
  ["video", "Video creation", "视频创作", "Create, edit, and tell stories with video.", "制作、编辑视频，用影像表达想法。"],
  ["audio", "Audio tools", "音频处理", "Create, transcribe, and work with sound.", "生成、转写与处理音频。"],
  ["coding", "Development", "编程开发", "Build, understand, and improve software.", "构建、理解与改进软件。"],
  ["search-research", "Intelligent search", "智能搜索", "Find relevant information and answers.", "查找相关信息与答案。"],
  ["knowledge-management", "Knowledge management", "知识管理", "Capture, connect, and retrieve your knowledge.", "记录、连接与检索自己的知识。"],
  ["writing", "Writing assistance", "写作辅助", "Draft, edit, and shape your words.", "起草、编辑与打磨文字。"],
  ["hardware", "Smart hardware", "智能硬件", "Discover AI experiences beyond the screen.", "探索屏幕之外的智能设备。"],
  ["companions", "Virtual companions", "虚拟陪伴", "Explore interactive characters and companions.", "探索可交互的虚拟角色与陪伴体验。"],
  ["agents-automation", "Agent builders", "Agent 构建", "Build agents and connect their workflows.", "构建 Agent，连接任务与工作流。"],
  ["productivity", "Productivity", "效率工具", "Make everyday work easier to finish.", "让日常工作更容易完成。"],
  ["3d-generation", "3D generation", "3D 生成", "Create models, scenes, and spatial ideas.", "创作模型、场景与空间内容。"],
  ["research", "Research assistance", "科研辅助", "Work with papers, evidence, and research data.", "辅助处理论文、证据与研究数据。"],
  ["other", "Other products", "其他类型", "Explore products that cross familiar categories.", "发现现有分类之外的新产品。"],
];

export function getProductCategories(lang: Locale): ProductCategory[] {
  return categories.map(([id, en, zh, enDescription, zhDescription]) => ({ id, name: lang === "zh" ? zh : en, description: lang === "zh" ? zhDescription : enDescription }));
}

const topics: TopicEntry[] = [
  { id: "video-workflows", icon: "01", accent: "#0B1220",
    en: { name: "New ways to make video", kicker: "FROM IDEA TO VIDEO", description: "Start with a link, a script, or an idea. Explore tools that change how a video comes together." },
    zh: { name: "视频创作新方式", kicker: "把想法变成影像", description: "从一个链接、一段脚本或一个想法开始，探索视频制作中不同的交互方式。" } },
  { id: "desktop-browser", icon: "02", accent: "#0B1220",
    en: { name: "Help where you already work", kicker: "DESKTOP & BROWSER", description: "Notes at the edge of your screen, agents beside a web page. Find assistants that fit into your workspace." },
    zh: { name: "桌面与浏览器助手", kicker: "在正在工作的地方", description: "屏幕边缘的笔记，网页旁边的 Agent。发现融入日常工作环境的助手。" } },
  { id: "teams-agents", icon: "03", accent: "#0B1220",
    en: { name: "Teams, meet your agents", kicker: "WORKING TOGETHER", description: "Explore how people and agents can share tasks, conversations, and the context behind the work." },
    zh: { name: "团队与 Agent 协作", kicker: "让协作发生", description: "探索人与 Agent 如何共享任务、对话和工作上下文，让团队看见工作如何推进。" } },
  { id: "creator-essentials", icon: "04", accent: "#0B1220",
    en: { name: "Small tools for creators", kicker: "CAPTURE, MAKE, SHARE", description: "Capture an idea, shape a draft, and make something to share. Focused tools for the steps in between." },
    zh: { name: "创作者的轻工具", kicker: "记录、创作、分享", description: "记下一个想法，整理一份草稿，完成一次分享。为创作过程中的小任务寻找工具。" } },
];

// Every external entry is selected and checked against its recorded sources.
// Features come from their official sites. launchDate points to a dated PH
// record; it does not assert when the company or product first existed.
const products: ProductEntry[] = [
  ...creativeProducts,
  ...builderProducts,
  ...knowledgeProducts,
  {
    slug: "pexo", website: "https://pexo.ai/", kind: "app", pricing: "varies", categoryIds: ["video"], topicIds: ["video-workflows", "creator-essentials"], icon: "P", accent: "#0B1220", platforms: ["Web"], verifiedAt: "2026-10-08", launchDate: "2026-09-30", launchSource: "https://www.producthunt.com/leaderboard/daily/2026/9/30", sourceUrls: ["https://pexo.ai/", "https://www.producthunt.com/products/pexo-2", "https://www.producthunt.com/leaderboard/daily/2026/9/30"],
    en: { name: "Pexo", tagline: "Start a launch video with a link. Refine it through comments.", description: "Pexo builds video projects from links, scripts, or media. Its workflow includes scene planning and conversational revisions, so you can point to a part of the video and describe a change.", features: ["Start from a URL or existing media", "Plan scripts, scenes, and shots", "Request revisions through comments"], bestFor: "Creators and product teams exploring a launch video or product explainer.", requirements: "An online service. Check the current plan and generation credits before starting; output quality has not been independently tested by NavoKit." },
    zh: { name: "Pexo", tagline: "从产品链接开始制作视频，通过评论继续修改。", description: "Pexo 可以用链接、脚本或媒体素材建立视频项目，流程包含分镜规划与对话修改。你可以指出视频中的某个部分，再描述希望如何调整。", features: ["从网址或现有素材开始", "规划脚本、场景与镜头", "通过评论提出修改"], bestFor: "想尝试制作发布视频或产品讲解的创作者与产品团队。", requirements: "在线服务。开始前需查看当前方案与生成额度；NavoKit 尚未独立测试生成质量。" },
  },
  {
    slug: "tucky", website: "https://tucky.io/", kind: "app", pricing: "freemium", categoryIds: ["knowledge-management", "writing", "productivity"], topicIds: ["desktop-browser", "creator-essentials"], icon: "T", accent: "#0B1220", platforms: ["macOS"], verifiedAt: "2026-10-08", launchDate: "2026-09-07", launchSource: "https://www.producthunt.com/leaderboard/daily/2026/9/7", sourceUrls: ["https://tucky.io/", "https://www.producthunt.com/products/tucky", "https://www.producthunt.com/leaderboard/daily/2026/9/7"],
    en: { name: "Tucky", tagline: "Keep notes on your screen edge, with an agent close at hand.", description: "Tucky keeps notes docked to the edge of a Mac screen. Open a note to write, or call its assistant to work with notes and connected apps without moving to a separate AI window.", features: ["Notes docked to the screen edge", "Markdown and checkbox tasks", "AI help with notes and connected apps"], bestFor: "Mac users who want notes and writing help within reach while working.", requirements: "macOS 15 or later, on Apple silicon or Intel. Free and paid options; AI credits and connector access depend on the plan." },
    zh: { name: "Tucky", tagline: "把笔记贴在屏幕边缘，需要时就地唤起 Agent。", description: "Tucky 将笔记停靠在 Mac 屏幕边缘。打开笔记即可书写，也能唤起助手处理笔记与已连接应用中的任务，减少切换到独立 AI 窗口的步骤。", features: ["屏幕边缘停靠笔记", "Markdown 与待办勾选", "结合笔记和应用的 AI 辅助"], bestFor: "希望在工作时随手记录、调用写作辅助的 Mac 用户。", requirements: "需要 macOS 15 或更高版本，支持 Apple silicon 与 Intel。提供免费及付费方案，AI 额度与连接器能力依方案而定。" },
  },
  {
    slug: "velozity", website: "https://getvelozity.com/", kind: "app", pricing: "varies", categoryIds: ["agents-automation", "productivity"], topicIds: ["teams-agents"], icon: "V", accent: "#0B1220", platforms: ["Web"], verifiedAt: "2026-10-08", launchDate: "2026-10-07", launchSource: "https://www.producthunt.com/leaderboard/daily/2026/10/7", sourceUrls: ["https://getvelozity.com/", "https://www.producthunt.com/products/velozity-2", "https://www.producthunt.com/leaderboard/daily/2026/10/7"],
    en: { name: "Velozity", tagline: "Bring teammates and agents into a shared virtual office.", description: "Velozity combines a spatial office with conversations, tasks, and AI agents. Shared spaces let people bring agents into a team conversation and give them files and working context.", features: ["A shared virtual office", "Team spaces with tasks and files", "Agents in shared conversations"], bestFor: "Teams exploring a shared place to coordinate people and AI agents.", requirements: "The official site offers an interactive office demo. Account, integrations, and agent plans need separate setup; team workflows have not been independently tested by NavoKit." },
    zh: { name: "Velozity", tagline: "让团队成员与 Agent 进入同一个虚拟办公室。", description: "Velozity 将空间式办公室、对话、任务与 AI Agent 结合。团队可以在共享空间中将 Agent 加入对话，并提供文件和工作上下文。", features: ["共享虚拟办公室", "包含任务与文件的团队空间", "Agent 参与团队对话"], bestFor: "想探索人与 AI Agent 如何在共同空间协作的团队。", requirements: "官网提供可交互办公室演示。账号、集成与 Agent 方案需另外配置；NavoKit 尚未独立测试团队工作流。" },
  },
  {
    slug: "rill", website: "https://rill.love/", kind: "app", pricing: "free", categoryIds: ["coding", "productivity"], topicIds: ["desktop-browser", "teams-agents"], icon: "R", accent: "#0B1220", platforms: ["macOS"], verifiedAt: "2026-10-08", launchDate: "2026-10-06", launchSource: "https://www.producthunt.com/leaderboard/daily/2026/10/6", sourceUrls: ["https://rill.love/?ref=producthunt", "https://www.producthunt.com/products/rill-3", "https://www.producthunt.com/leaderboard/daily/2026/10/6"],
    en: { name: "Rill Browser", tagline: "Turn the page you are reading into a task for your coding agent.", description: "Rill is a Mac browser that connects a web page to your existing Claude Code or Codex projects. Press ⌘E to pass the current context to an agent, then keep browsing while the task runs.", features: ["Send page context to an agent", "Continue browsing during a task", "Organize tabs and project activity"], bestFor: "Developers who want to turn web references into work in their own projects.", requirements: "Free beta for Apple silicon Macs running macOS 14 or later. AI features require your own compatible Claude Code or Codex installation and plan." },
    zh: { name: "Rill Browser", tagline: "把正在浏览的网页，直接变成编程 Agent 的任务。", description: "Rill 是一款 Mac 浏览器，可将网页内容连接到你已有的 Claude Code 或 Codex 项目。按下 ⌘E 传递当前上下文后，可以继续浏览，等待任务推进。", features: ["将网页上下文交给 Agent", "任务执行时继续浏览", "整理标签页与项目活动"], bestFor: "希望把网页参考资料直接用于自己项目的开发者。", requirements: "免费 Beta，需要搭载 Apple silicon 的 Mac 与 macOS 14 或更高版本。AI 功能需要自己的兼容 Claude Code 或 Codex 安装及方案。" },
  },
  {
    slug: "markdown-to-image", website: "https://www.navokit.com/en/tools/markdown-to-image", internalPath: "/tools/markdown-to-image", kind: "utility", pricing: "free", categoryIds: ["productivity"], topicIds: ["creator-essentials"], icon: "Md", accent: "#0B1220", platforms: ["Web"], sourceUrls: ["https://www.navokit.com/en/tools/markdown-to-image"],
    en: { name: "Markdown to Image", tagline: "Turn notes and AI answers into shareable image cards.", description: "A NavoKit utility for rendering Markdown in your browser and exporting a PNG image.", features: ["Local browser rendering", "Markdown formatting", "PNG export"] },
    zh: { name: "Markdown 转图片", tagline: "将笔记与 AI 回答整理成可分享的图片卡片。", description: "NavoKit 的实用工具，在浏览器中渲染 Markdown 并导出 PNG 图片。", features: ["浏览器本地渲染", "Markdown 排版", "PNG 导出"] },
  },
  {
    slug: "ai-social-booster", website: "https://www.navokit.com/en/tools/ai-social-booster", internalPath: "/tools/ai-social-booster", kind: "utility", pricing: "free", categoryIds: ["writing"], topicIds: ["creator-essentials"], icon: "Aa", accent: "#0B1220", platforms: ["Web"], sourceUrls: ["https://www.navokit.com/en/tools/ai-social-booster"],
    en: { name: "AI Social Post Generator", tagline: "Turn an idea into editable social media drafts.", description: "A NavoKit utility that drafts social copy for review and personalization. Availability depends on the connected AI service.", features: ["Drafts from a short idea", "Multiple social formats", "Editable copy"] },
    zh: { name: "AI 社媒文案", tagline: "从一个想法开始，生成可继续编辑的社媒草稿。", description: "NavoKit 的社媒文案工具，生成的草稿需自行检查与调整。可用性取决于所连接的 AI 服务。", features: ["从简短想法生成草稿", "多种社媒格式", "可编辑文案"] },
  },
  {
    slug: "free-ai-video-generator", website: "https://www.navokit.com/en/tools/free-ai-video-generator", internalPath: "/tools/free-ai-video-generator", kind: "utility", pricing: "free", categoryIds: ["video"], topicIds: ["video-workflows"], icon: "Vi", accent: "#0B1220", platforms: ["Web"], sourceUrls: ["https://www.navokit.com/en/tools/free-ai-video-generator"],
    en: { name: "Free AI Video Generator", tagline: "Try turning a text prompt into a short video.", description: "A NavoKit utility for trying text-to-video generation. Free shared capacity is limited, and requests may need to be retried.", features: ["Text-to-video prompts", "Landscape, portrait, and square formats", "Limited shared capacity"] },
    zh: { name: "AI 视频生成器", tagline: "输入文字描述，尝试生成一段短视频。", description: "NavoKit 的文字转视频工具。免费共享额度有限，繁忙时可能需要重试。", features: ["文字转视频", "横屏、竖屏与方形格式", "有限共享额度"] },
  },
];

export function getCatalogProducts(lang: Locale): CatalogProduct[] {
  return products.map(({ en, zh, ...product }) => ({ ...product, ...(lang === "zh" ? zh : en) }));
}

export function getCatalogProduct(lang: Locale, slug: string) {
  return getCatalogProducts(lang).find(product => product.slug === slug);
}

export function getTopics(lang: Locale): Topic[] {
  return topics.map(({ en, zh, ...topic }) => ({ ...topic, ...(lang === "zh" ? zh : en) }));
}

export function getTopic(lang: Locale, id: string) {
  return getTopics(lang).find(topic => topic.id === id);
}

export function getProductHref(product: CatalogProduct, lang: Locale) {
  return `/${lang}${product.internalPath ?? `/tools/${product.slug}`}`;
}

export function getProductKindLabel(kind: CatalogProduct["kind"], lang: Locale) {
  const labels = { app: ["Application", "应用"], api: ["API service", "API 服务"], "open-source": ["Open source", "开源项目"], hardware: ["Hardware", "硬件设备"], utility: ["NavoKit tool", "站内工具"] };
  return labels[kind][lang === "zh" ? 1 : 0];
}

export function getPricingLabel(pricing: CatalogProduct["pricing"], lang: Locale) {
  const labels = { free: ["Free", "免费"], freemium: ["Free + paid options", "免费 / 可选付费"], paid: ["Paid", "付费"], varies: ["See official pricing", "查看官方定价"] };
  return labels[pricing][lang === "zh" ? 1 : 0];
}
