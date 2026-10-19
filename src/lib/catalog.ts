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
    slug: "shift-calendar-alarm",
    website: "https://shift-calendar-alarm.pages.dev/",
    kind: "app",
    pricing: "freemium",
    categoryIds: ["productivity"],
    topicIds: [],
    icon: "SCA",
    accent: "#0B1220",
    platforms: ["iOS"],
    verifiedAt: "2026-10-19",
    addedAt: "2026-10-19",
    sourceUrls: [
      "https://shift-calendar-alarm.pages.dev/",
      "https://apps.apple.com/app/id6760447926",
    ],
    en: {
      name: "Shift Calendar Alarm",
      tagline: "Put your shifts on the calendar and your iPhone alarms set themselves automatically.",
      description: "Shift Calendar Alarm connects shift work schedules directly to native iPhone alarms. By placing shifts onto a visual calendar, the app automatically configures native alarms for the upcoming 60 days. When schedule changes happen, updating the calendar synchronizes alarms automatically, eliminating manual morning resets for rotating rosters, on-call shifts, and irregular working hours.",
      features: [
        "Automatic 60-day sync to native iPhone alarms",
        "Up to 3 customizable alarms per shift type (including day-before alarms)",
        "Reusable shift patterns for fast rotating roster scheduling",
        "Single alarm skipping without modifying shift entries",
        "Alarm Health verification and Home Screen lock/desktop widgets",
      ],
      bestFor: "Nurses, emergency workers, security personnel, transportation staff, and anyone working rotating shifts or irregular rosters.",
      requirements: "Requires iOS 26 or later and uses the native built-in iPhone alarms. Free version includes 3 shift types, 1 pattern, and 8 scheduled shifts; optional Premium subscription removes limits. Data stays on-device with optional iCloud sync.",
    },
    zh: {
      name: "班表闹钟 (Shift Calendar Alarm)",
      tagline: "把班排进日历，未来 60 天 iPhone 原生闹钟自动设好。",
      description: "班表闹钟是一款专为倒班与轮班工作者设计的 iOS 原生排班闹钟应用。用户只需在日历上排好早班、晚班或大夜班，应用便会自动同步设定未来 60 天的 iPhone 系统原生闹钟。遇到临时调班，只需在日历中修改班次，后续闹钟将自动跟随更新，彻底告别每天手动开关或设置闹钟的繁琐与漏设风险。",
      features: [
        "排班自动同步未来 60 天 iPhone 原生闹钟",
        "支持跨天设置：每个班别最多设置 3 个响铃时间点（含前一天提醒）",
        "循环范本排班：一键铺满 2 早 2 晚 2 休等规律轮班周期",
        "单次闹钟独立跳过：临时请假或调休无需更改整条班次",
        "闹钟健康度自检与桌面/锁屏小组件即时查看",
      ],
      bestFor: "护士、医护人员、交通运输员工、安保人员及各类轮班/倒班工作群体。",
      requirements: "支持 iOS 26 或更高版本，调用 iPhone 系统内置原生闹钟。免费版支持 3 个班别、1 组循环范本与 8 条排班记录，提供可选的 Premium 订阅解锁无限排班。数据主要保留在设备本地，支持可选的 iCloud 云端同步。",
    },
  },
  {
    slug: "yonaris",
    website: "https://yonaris.com/",
    kind: "app",
    pricing: "varies",
    categoryIds: ["search-research", "productivity", "agents-automation"],
    topicIds: ["creator-essentials", "teams-agents"],
    icon: "YN",
    accent: "#1C2B29",
    platforms: ["Web"],
    verifiedAt: "2026-10-19",
    addedAt: "2026-10-19",
    sourceUrls: [
      "https://yonaris.com/",
      "https://yonaris.com/product",
      "https://yonaris.com/agent-facts.json",
    ],
    en: {
      name: "Yonaris",
      tagline: "Diagnose how AI models present your product, connecting product facts with AI Visibility.",
      description: "Yonaris helps companies inspect and improve their visibility across AI search and agent recommendations. By comparing generative answers directly against authoritative product sources ('Product Truth'), Yonaris identifies missing capabilities, undocumented conditions, and citation gaps, providing teams with concrete, actionable recommendations on how to structure website copy and agent-readable documentation.",
      features: [
        "AI visibility diagnosis comparing LLM answers to product facts",
        "Structured Product Truth extraction (capabilities, conditions, sources)",
        "Dual-audience alignment for human visitors and autonomous AI agents",
        "Actionable copy and documentation improvement recommendations",
      ],
      bestFor: "B2B product marketing teams, SaaS founders, and growth marketers optimizing for AI Visibility and agent recommendations.",
      requirements: "Web-based diagnostic and consulting platform. Team onboarding, product fact audits, and custom AI visibility reports are arranged directly through Yonaris.",
    },
    zh: {
      name: "Yonaris",
      tagline: "让 AI 说清楚你的产品好在哪，把产品事实、来源依据与 AI Visibility 连接起来。",
      description: "Yonaris 是一款专注于 AI Visibility（AI 可见度诊断）的品牌资产核对平台。它通过对照主流大模型与 AI Agent 在回答客户提问时的真实表述与企业官方产品资料（Product Truth），精准诊断出哪些产品能力被误读、哪些使用前提被遗漏，并为营销与产品团队提供具体到段落的内容改进建议，确保产品优势在 AI 推荐中被准确传达。",
      features: [
        "AI 可见度诊断：核对 LLM 生成回答与官方事实的偏差",
        "结构化 Product Truth 沉淀（产品能力、适用条件、原文来源）",
        "双读者架构协同：让人看到价值，让 Agent 找到可信依据",
        "针对性修改建议：指导官网说明与 FAQ 如何落地补齐事实，提升 AI Visibility",
      ],
      bestFor: "B2B 软件团队、出海 SaaS 创始人及关注 AI Visibility 的内容与产品营销团队。",
      requirements: "Web 在线诊断与咨询平台。团队可携带官网链接及客户常见选型问题接入体验，完整可见度审计与定制方案需通过官网咨询确认。",
    },
  },
  {
    slug: "railmystery",
    website: "https://railmystery.onrender.com/presale/",
    kind: "app",
    pricing: "freemium",
    categoryIds: ["other"],
    topicIds: [],
    icon: "RM",
    accent: "#0B1220",
    platforms: ["Web"],
    verifiedAt: "2026-10-16",
    addedAt: "2026-10-16",
    sourceUrls: [
      "https://railmystery.onrender.com/presale/",
      "https://keithwy1030.itch.io/railmystery",
      "https://www.producthunt.com/products/railmystery",
    ],
    en: {
      name: "RailMystery",
      tagline: "Host-pay fixed-rail AI murder mystery where guests play free and the culprit stays locked.",
      description: "RailMystery is an AI-powered tabletop murder mystery platform that locks story progression to a fixed narrative graph, ensuring mysteries remain solvable without mid-session hallucination. One paid host pass covers the entire table, allowing guest detectives to join and inspect clues 100% free from their mobile browsers without downloads.",
      features: [
        "Fixed-rail story graph ensuring solvable whodunit logic",
        "Host-pay room model where guest detectives play 100% free",
        "Zero app downloads: plays directly in mobile and desktop browsers",
        "AI Dungeon Master narrating dynamic clue reveals and adjudication",
      ],
      bestFor: "Tabletop gaming groups, remote mystery parties, and indie murder mystery enthusiasts.",
      requirements: "Runs in modern desktop and mobile browsers over Wi-Fi, LAN, or voice calls. Only the room host needs a paid host pass; guests connect free via room code.",
    },
    zh: {
      name: "RailMystery",
      tagline: "一人购票全员免费、锁定真凶与确定性故事图谱的 AI 剧本杀平台。",
      description: "RailMystery 是一款基于 AI 的在线剧本杀推理解谜系统。它将剧情推进锁定在确定性的固定故事图谱中，杜绝自由生成式 AI 主持人在中途擅自篡改真凶导致无法破案的问题。采用房主付费制，参与的探员无需下载任何应用，只需手机浏览器输入房间码即可免费入局解谜。",
      features: [
        "固定轨线故事图谱，确保案件逻辑严密可破",
        "房主购票全桌畅玩，客座侦探 100% 免费参与",
        "零应用下载，手机与电脑浏览器扫码即玩",
        "AI DM 实时推进线索侦破、私密道具分发与判决裁定",
      ],
      bestFor: "桌游剧本杀爱好者、远程聚会社交团队与喜欢推理解谜的朋友。",
      requirements: "在现代桌面与移动端浏览器中运行，支持家庭 Wi-Fi、局域网或远程语音开局。仅房主需要购买凭证，玩家凭房间码免费加入。",
    },
  },
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
