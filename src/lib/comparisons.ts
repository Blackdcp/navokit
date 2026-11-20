import { getCatalogProduct, getCatalogProducts, type CatalogProduct, type Locale, type ProductCategoryId } from "./catalog";

export interface ComparisonFaq {
  question: string;
  answer: string;
}

export interface ComparisonCopy {
  verdict: string;
  chooseAIf: string[];
  chooseBIf: string[];
  faqs: ComparisonFaq[];
}

export interface ComparisonPair {
  id: string;
  leftSlug: string;
  rightSlug: string;
  categoryId: ProductCategoryId;
  en: ComparisonCopy;
  zh: ComparisonCopy;
}

export const COMPARISON_PAIRS: ComparisonPair[] = [
  {
    id: "aqua-voice-vs-willow-voice",
    leftSlug: "aqua-voice",
    rightSlug: "willow-voice",
    categoryId: "audio",
    en: {
      verdict: "Both Aqua Voice and Willow Voice turn speech into clean typed text across macOS and Windows. The main documented difference is mobile coverage: Willow Voice also lists iOS support, while Aqua Voice focuses on desktop dictation across macOS and Windows.",
      chooseAIf: [
        "Your primary workflow is desktop-first dictation on macOS or Windows.",
        "You want fast speech-to-text across everyday desktop writing apps.",
      ],
      chooseBIf: [
        "You want voice dictation across macOS, Windows, and iOS devices.",
        "You frequently draft messages or notes on iPhone in addition to desktop.",
      ],
      faqs: [
        { question: "What is the biggest platform difference between Aqua Voice and Willow Voice?", answer: "Based on official product listings, both support macOS and Windows, while Willow Voice also lists iOS support." },
        { question: "Are Aqua Voice and Willow Voice free?", answer: "Both list variable pricing plans on their official websites; check each provider's current pricing page for free trial or tier limits." },
      ],
    },
    zh: {
      verdict: "Aqua Voice 与 Willow Voice 都主打跨应用的高效语音转文字输入，且均支持 macOS 与 Windows。两者在公开资料中最明显的平台差异在于移动端：Willow Voice 额外支持 iOS，而 Aqua Voice 聚焦桌面端听写体验。",
      chooseAIf: [
        "你的核心写作与沟通主要集中在 macOS 或 Windows 桌面端。",
        "希望在各类桌面应用中用自然口语快速输入干净文本。",
      ],
      chooseBIf: [
        "你需要在 macOS、Windows 与 iOS 之间保持一致的语音输入体验。",
        "经常在 iPhone 上口述消息、备忘或草稿。",
      ],
      faqs: [
        { question: "Aqua Voice 和 Willow Voice 在支持平台上有什么区别？", answer: "根据双方官网公开资料，两款产品均支持 macOS 和 Windows，其中 Willow Voice 还提供 iOS 端支持。" },
        { question: "这两款语音输入工具是免费的吗？", answer: "两者的定价方案均标注为按官网方案变化（varies），具体免费额度或订阅档位请以各自官网最新说明为准。" },
      ],
    },
  },
  {
    id: "flora-vs-krev",
    leftSlug: "flora",
    rightSlug: "krev",
    categoryId: "image-design",
    en: {
      verdict: "Both FLORA and KREV are web-based creative workspaces spanning image generation and video creation. Compare them based on how you structure visual production pipelines, multi-model exploration, and asset iteration inside the browser.",
      chooseAIf: [
        "You prefer an infinite visual canvas to connect image and video generation steps.",
        "You want to explore multiple visual variations side by side in a browser workspace.",
      ],
      chooseBIf: [
        "You want a browser-based creative workspace focused on visual image and video generation workflows.",
        "You want to compare output styles and workflow controls against node-canvas tools.",
      ],
      faqs: [
        { question: "Do FLORA and KREV require desktop installation?", answer: "No. Both FLORA and KREV are listed as Web applications that run in the browser." },
        { question: "Can both tools handle image and video workflows?", answer: "Yes. Both products are categorized under Image generation and Video creation in the NavoKit catalog." },
      ],
    },
    zh: {
      verdict: "FLORA 与 KREV 都是基于网页端运行的视觉创作工具，同时覆盖图像生成与视频创作两个场景。选型时可重点对比两者在画布编排、多模型切换与素材迭代上的交互方式。",
      chooseAIf: [
        "偏好在可视化节点画布上串联图像与视频生成步骤。",
        "需要在浏览器中并排对比多组视觉方案与风格迭代。",
      ],
      chooseBIf: [
        "希望在网页端直接完成图像与视频的创意生成工作流。",
        "想与节点画布型工具对比输出风格和工作流控制方式。",
      ],
      faqs: [
        { question: "FLORA 和 KREV 需要下载桌面客户端吗？", answer: "不需要，两者均标注为 Web 网页端应用，直接在浏览器中使用。" },
        { question: "两款产品都同时支持图像和视频吗？", answer: "是的，在 NavoKit 分类中两者均归属「图像生成」与「视频创作」。" },
      ],
    },
  },
  {
    id: "sloyd-vs-hyper3d-rodin",
    leftSlug: "sloyd",
    rightSlug: "hyper3d-rodin",
    categoryId: "3d-generation",
    en: {
      verdict: "Sloyd and Hyper3D Rodin both run in the browser for AI 3D generation. Compare them by your target pipeline: parametric/game-ready 3D asset workflows versus high-detail generative 3D modeling from prompts or images.",
      chooseAIf: [
        "You need fast, customizable 3D assets for games, prototypes, or interactive scenes.",
        "You prefer tweaking parameters and regenerating clean geometry in the browser.",
      ],
      chooseBIf: [
        "You want generative 3D models created from text or reference images.",
        "Your workflow prioritizes detailed mesh generation inside a web workspace.",
      ],
      faqs: [
        { question: "Do Sloyd and Hyper3D Rodin run on the web?", answer: "Yes. Both Sloyd and Hyper3D Rodin are listed as Web-based 3D generation tools." },
        { question: "Which category do both products belong to?", answer: "Both are listed under 3D generation in NavoKit." },
      ],
    },
    zh: {
      verdict: "Sloyd 与 Hyper3D Rodin 都是网页端 3D 生成工具。选型关键在于目标管线：需要快速可调参的游戏/原型资产，还是更偏重由文本/参考图直接生成高精度 3D 模型。",
      chooseAIf: [
        "需要为游戏、原型或交互场景快速产出可定制的 3D 资产。",
        "喜欢在浏览器中通过参数微调快速获得结构干净的几何体。",
      ],
      chooseBIf: [
        "希望直接通过文本提示词或参考图生成 3D 模型。",
        "工作流更看重网页端生成式建模的细节表现。",
      ],
      faqs: [
        { question: "Sloyd 和 Hyper3D Rodin 都支持网页端直接使用吗？", answer: "是的，两者均标注为 Web 网页端 3D 生成产品。" },
        { question: "两者是否提供统一免费方案？", answer: "两者定价均标注为按官网方案变化（varies），导出格式与额度请以官网为准。" },
      ],
    },
  },
  {
    id: "msty-vs-enconvo",
    leftSlug: "msty",
    rightSlug: "enconvo",
    categoryId: "assistants",
    en: {
      verdict: "Msty Studio and Enconvo are both freemium desktop AI assistants. Msty Studio supports macOS, Windows, Linux, and Web, making it suitable for cross-platform teams, whereas Enconvo is built specifically for macOS.",
      chooseAIf: [
        "You work across macOS, Windows, Linux, or Web and want one consistent assistant environment.",
        "You want a cross-platform studio for local and cloud models.",
      ],
      chooseBIf: [
        "You work exclusively on macOS and want a native desktop launcher and assistant workflow.",
        "You want quick macOS-integrated shortcuts alongside everyday apps.",
      ],
      faqs: [
        { question: "Which platforms do Msty Studio and Enconvo support?", answer: "Msty Studio lists macOS, Windows, Linux, and Web support. Enconvo lists macOS support." },
        { question: "Do both offer a freemium tier?", answer: "Yes. Both Msty Studio and Enconvo are listed as freemium products." },
      ],
    },
    zh: {
      verdict: "Msty Studio 与 Enconvo 均为免费增值（Freemium）的桌面端通用 AI 助手。核心差异在平台覆盖：Msty Studio 跨 macOS、Windows、Linux 与 Web，而 Enconvo 深度聚焦 macOS 桌面工作流。",
      chooseAIf: [
        "你在 macOS、Windows、Linux 或网页端多平台切换，希望保持统一使用习惯。",
        "需要一个跨平台的本地与云端模型工作台。",
      ],
      chooseBIf: [
        "你专注在 macOS 环境下工作，希望获得贴合 Mac 交互习惯的快捷启动与助手体验。",
        "希望在日常桌面软件旁随时呼出 AI 工具链。",
      ],
      faqs: [
        { question: "Msty Studio 和 Enconvo 分别支持哪些系统？", answer: "Msty Studio 支持 macOS、Windows、Linux 与 Web；Enconvo 面向 macOS。" },
        { question: "两款产品都有免费版吗？", answer: "是的，两者均标注为 Freemium（免费增值）模式，具体额度以官网为准。" },
      ],
    },
  },
  {
    id: "scira-vs-exa",
    leftSlug: "scira",
    rightSlug: "exa",
    categoryId: "search-research",
    en: {
      verdict: "Scira and Exa sit in the intelligent search category but serve different users. Scira is an interactive search app (Web and self-hosted) built for direct human querying, while Exa provides search infrastructure via API and MCP for developers and AI agents.",
      chooseAIf: [
        "You want a ready-to-use web interface (or self-hosted deployment) for AI-assisted search.",
        "You are an individual user researching answers directly in the browser.",
      ],
      chooseBIf: [
        "You are building AI applications or agents that need programmatic web search via API or MCP.",
        "You want developer-facing search infrastructure rather than a consumer search UI.",
      ],
      faqs: [
        { question: "Is Scira or Exa better for end users vs. developers?", answer: "Scira is listed as a Web and self-hosted search application for direct use, whereas Exa is listed as an API and MCP search service built for developers and agents." },
        { question: "Can Scira be self-hosted?", answer: "Yes. Scira lists both Web and Self-hosted platforms." },
      ],
    },
    zh: {
      verdict: "Scira 与 Exa 同属智能搜索分类，但目标人群截然不同：Scira 是面向终端用户的网页/可自托管 AI 搜索应用，而 Exa 通过 API 与 MCP 为开发者和 AI Agent 提供底层搜索基础设施。",
      chooseAIf: [
        "你想直接在浏览器使用开箱即用的 AI 搜索界面，或自行部署（Self-hosted）。",
        "你需要面向人类阅读的问答与信息检索体验。",
      ],
      chooseBIf: [
        "你是开发者，需要通过 API 或 MCP 给自己的 Agent / 应用接入高质量网页搜索。",
        "你需要程序化调用的搜索基础设施，而非面向消费者的搜索框。",
      ],
      faqs: [
        { question: "普通用户和开发者分别该选 Scira 还是 Exa？", answer: "普通用户直接搜索选 Scira（提供 Web 与自托管）；开发者给 Agent 接搜索能力选 Exa（提供 API 与 MCP）。" },
        { question: "Scira 支持自托管吗？", answer: "是的，公开资料显示 Scira 支持 Web 与 Self-hosted。" },
      ],
    },
  },
  {
    id: "undermind-vs-asta",
    leftSlug: "undermind",
    rightSlug: "asta",
    categoryId: "research",
    en: {
      verdict: "Undermind and Asta are both web-based research assistance tools designed to help work with scientific papers and evidence. Compare their pricing structure (Undermind lists freemium; Asta lists variable access/plans) and how each handles deep literature discovery.",
      chooseAIf: [
        "You want a freemium web tool for deep scientific literature search and discovery.",
        "You frequently map out complex technical or academic topics across papers.",
      ],
      chooseBIf: [
        "You want a web-based scientific research assistant for working with papers and evidence.",
        "You want to compare literature synthesis and citation workflows across research tools.",
      ],
      faqs: [
        { question: "Do Undermind and Asta work in the browser?", answer: "Yes. Both Undermind and Asta are web-based research assistance tools." },
        { question: "Does Undermind have a free tier?", answer: "Undermind is listed as freemium; check its official site for current free-tier query limits." },
      ],
    },
    zh: {
      verdict: "Undermind 与 Asta 都是面向科研论文与证据检索的网页端辅助工具。两者均在浏览器运行，选型时可结合各自对深度文献挖掘的支持程度及官网定价方案进行对比。",
      chooseAIf: [
        "希望使用提供免费增值档位（Freemium）的网页端深度文献检索工具。",
        "经常需要围绕复杂学术或技术问题进行系统性论文摸底。",
      ],
      chooseBIf: [
        "需要面向论文与研究证据的网页端科研助手。",
        "希望对比不同科研工具在文献综述与引用溯源上的表现。",
      ],
      faqs: [
        { question: "Undermind 和 Asta 都需要安装客户端吗？", answer: "不需要，两者均为 Web 网页端工具。" },
        { question: "这两款工具适合什么人群？", answer: "均归属「科研辅助」分类，适合需要高效检索与梳理学术论文的研究者与技术从业者。" },
      ],
    },
  },
  {
    id: "omi-vs-looki-l1",
    leftSlug: "omi",
    rightSlug: "looki-l1",
    categoryId: "hardware",
    en: {
      verdict: "Omi and Looki L1 are both paid smart hardware devices paired with mobile apps. Omi lists broader companion platform support (iOS, Android, macOS, Web), while Looki L1 lists iOS and Android companion apps.",
      chooseAIf: [
        "You want companion access across iOS, Android, macOS, and Web in addition to the wearable hardware.",
        "You want to review transcripts or context on desktop as well as mobile.",
      ],
      chooseBIf: [
        "Your companion workflow is mobile-first on iOS or Android.",
        "You are comparing form factors and capture capabilities across wearable AI hardware.",
      ],
      faqs: [
        { question: "What companion platforms do Omi and Looki L1 support?", answer: "Omi lists iOS, Android, macOS, and Web. Looki L1 lists iOS and Android." },
        { question: "Are both Omi and Looki L1 paid hardware products?", answer: "Yes. Both are physical smart hardware devices listed with paid pricing." },
      ],
    },
    zh: {
      verdict: "Omi 与 Looki L1 均属于付费智能硬件品类。在配套软件生态上，Omi 覆盖 iOS、Android、macOS 与 Web 多端，而 Looki L1 聚焦 iOS 与 Android 移动端配套应用。",
      chooseAIf: [
        "除了手机端，还希望在 macOS 与 Web 网页端随时查阅和管理硬件记录。",
        "看重跨桌面与移动端的完整软件配套覆盖。",
      ],
      chooseBIf: [
        "你的使用场景以 iOS 或 Android 移动端配套为主。",
        "正在对比不同形态穿戴式 AI 硬件的采集能力与佩戴方式。",
      ],
      faqs: [
        { question: "Omi 和 Looki L1 的配套软件平台有什么不同？", answer: "Omi 支持 iOS、Android、macOS 和 Web；Looki L1 支持 iOS 和 Android。" },
        { question: "两款产品都是实体硬件吗？", answer: "是的，两者在 NavoKit 中均归类为「智能硬件（Smart hardware）」。" },
      ],
    },
  },
  {
    id: "granola-vs-tucky",
    leftSlug: "granola",
    rightSlug: "tucky",
    categoryId: "knowledge-management",
    en: {
      verdict: "Granola and Tucky both help capture and organize working knowledge on a freemium model. Granola covers macOS, Windows, iOS, and Android, whereas Tucky is built specifically for macOS.",
      chooseAIf: [
        "You need cross-device access across macOS, Windows, iOS, and Android.",
        "Your primary focus is capturing and structuring meeting notes across platforms.",
      ],
      chooseBIf: [
        "You work on macOS and want a lightweight desktop workspace for notes and writing.",
        "You want a Mac-native knowledge and productivity companion.",
      ],
      faqs: [
        { question: "Which devices do Granola and Tucky support?", answer: "Granola lists macOS, Windows, iOS, and Android. Tucky lists macOS." },
        { question: "Are both Granola and Tucky freemium?", answer: "Yes. Both products list a freemium pricing model." },
      ],
    },
    zh: {
      verdict: "Granola 与 Tucky 均提供免费增值（Freemium）的知识管理与效率体验。核心差异在于跨平台支持：Granola 覆盖 macOS、Windows、iOS 和 Android 全平台，而 Tucky 专注 macOS 桌面端。",
      chooseAIf: [
        "需要在 macOS、Windows、iOS 和 Android 多设备间同步记录与笔记。",
        "核心需求集中在跨平台的会议纪要与结构化整理。",
      ],
      chooseBIf: [
        "你是纯 macOS 用户，偏好轻量、贴近屏幕边缘的桌面写作与知识记录体验。",
        "希望工具同时兼顾知识管理、写作辅助与日常效率。",
      ],
      faqs: [
        { question: "Granola 和 Tucky 在平台覆盖上有什么区别？", answer: "Granola 支持 macOS、Windows、iOS 和 Android；Tucky 专注 macOS 平台。" },
        { question: "两款产品都可以免费开始试用吗？", answer: "是的，两者均标注为 Freemium 模式，具体免费限制请以各自官网为准。" },
      ],
    },
  },
  {
    id: "sim-vs-velozity",
    leftSlug: "sim",
    rightSlug: "velozity",
    categoryId: "agents-automation",
    en: {
      verdict: "Sim and Velozity both belong to the Agent builders and Productivity categories. Sim offers both Web and self-hosted deployment on a freemium model, while Velozity runs as a Web platform with variable pricing.",
      chooseAIf: [
        "You want the option to self-host your agent workflows in addition to using the web app.",
        "You want a freemium entry point to test visual agent orchestration.",
      ],
      chooseBIf: [
        "You prefer a hosted web-based agent automation platform without managing infrastructure.",
        "You want to evaluate alternative workflow builders for team automation.",
      ],
      faqs: [
        { question: "Can Sim or Velozity be self-hosted?", answer: "Sim lists both Web and Self-hosted support; Velozity lists Web support." },
        { question: "What categories do both tools share?", answer: "Both are listed under Agent builders and Productivity." },
      ],
    },
    zh: {
      verdict: "Sim 与 Velozity 均归属「Agent 构建」与「效率工具」分类。两者最直观的差异在于部署选项：Sim 同时支持 Web 与 Self-hosted（自托管）并提供免费增值方案，而 Velozity 为纯 Web 托管平台。",
      chooseAIf: [
        "除了网页端外，还需要自托管（Self-hosted）部署以满足数据合规或私有化需求。",
        "希望通过 Freemium 免费档先快速搭建并测试 Agent 工作流。",
      ],
      chooseBIf: [
        "倾向于免运维的纯网页端 Agent 自动化平台。",
        "希望对比不同托管式工作流编排工具的效率体验。",
      ],
      faqs: [
        { question: "Sim 和 Velozity 哪个支持自托管？", answer: "根据公开资料，Sim 支持 Web 与 Self-hosted；Velozity 标注为 Web 平台。" },
        { question: "两者是否都需要编写代码才能使用？", answer: "具体无代码/代码节点支持程度请查看各自产品详情页与官方文档。" },
      ],
    },
  },
  {
    id: "mochi-desktop-pet-vs-airi",
    leftSlug: "mochi-desktop-pet",
    rightSlug: "airi",
    categoryId: "companions",
    en: {
      verdict: "Mochi Desktop Pet and AIRI are both interactive virtual companions. Mochi Desktop Pet is a freemium macOS app combining companionship with light productivity, while AIRI supports both Web and Desktop platforms.",
      chooseAIf: [
        "You use macOS and want a lightweight freemium desktop companion alongside your work.",
        "You like blending virtual companionship with productivity cues.",
      ],
      chooseBIf: [
        "You want access on both Web and Desktop rather than macOS only.",
        "You are exploring interactive virtual character experiences across platforms.",
      ],
      faqs: [
        { question: "Which platforms do Mochi Desktop Pet and AIRI run on?", answer: "Mochi Desktop Pet lists macOS; AIRI lists Web and Desktop." },
        { question: "Is Mochi Desktop Pet free to try?", answer: "Mochi Desktop Pet is listed as freemium; AIRI lists variable pricing/setup." },
      ],
    },
    zh: {
      verdict: "Mochi Desktop Pet 与 AIRI 均属于虚拟陪伴品类。Mochi Desktop Pet 面向 macOS 并结合了轻量效率体验（Freemium），而 AIRI 同时覆盖 Web 与 Desktop 桌面端。",
      chooseAIf: [
        "你使用 macOS，想要一款轻量、带效率属性且可免费上手的桌面陪伴应用。",
        "偏好常驻 Mac 桌面的轻交互伴侣体验。",
      ],
      chooseBIf: [
        "希望在网页端（Web）和桌面端（Desktop）都能体验虚拟陪伴角色。",
        "不局限于 macOS 单一系统生态。",
      ],
      faqs: [
        { question: "Mochi Desktop Pet 和 AIRI 的运行平台有什么区别？", answer: "Mochi Desktop Pet 支持 macOS；AIRI 支持 Web 与 Desktop。" },
        { question: "这两款产品的定位有什么不同？", answer: "Mochi Desktop Pet 同时归属虚拟陪伴与效率工具；AIRI 专注虚拟陪伴交互体验。" },
      ],
    },
  },
];

export function getComparisons(): ComparisonPair[] {
  return COMPARISON_PAIRS;
}

export function getComparison(id: string): ComparisonPair | undefined {
  return COMPARISON_PAIRS.find(item => item.id === id);
}

export function getComparisonsForProduct(slug: string): ComparisonPair[] {
  return COMPARISON_PAIRS.filter(item => item.leftSlug === slug || item.rightSlug === slug);
}

export function getComparisonsForCategory(categoryId: ProductCategoryId): ComparisonPair[] {
  return COMPARISON_PAIRS.filter(item => item.categoryId === categoryId);
}

export function getComparisonHref(id: string, lang: Locale): string {
  return `/${lang}/compare/${id}`;
}

export function getAlternativesForProduct(lang: Locale, slug: string): { product: CatalogProduct; alternatives: CatalogProduct[] } | undefined {
  const product = getCatalogProduct(lang, slug);
  if (!product || product.internalPath) return undefined;
  const all = getCatalogProducts(lang);
  const peers = all
    .filter(candidate => candidate.slug !== slug && candidate.categoryIds.some(cat => product.categoryIds.includes(cat)))
    .sort((a, b) => {
      const aOverlap = a.categoryIds.filter(cat => product.categoryIds.includes(cat)).length;
      const bOverlap = b.categoryIds.filter(cat => product.categoryIds.includes(cat)).length;
      return bOverlap - aOverlap;
    });
  return { product, alternatives: peers };
}

const EXCLUDED_ALTERNATIVE_SLUGS = new Set([
  "railmystery",
  "rosebud-ai",
  "odyssey",
  "shift-calendar-alarm",
]);

export function getAlternativeEligibleSlugs(): string[] {
  return getCatalogProducts("en")
    .filter(product => !product.internalPath && !EXCLUDED_ALTERNATIVE_SLUGS.has(product.slug))
    .filter(product => {
      const result = getAlternativesForProduct("en", product.slug);
      return result && result.alternatives.length >= 2;
    })
    .map(product => product.slug);
}

export function getAlternativesHref(slug: string, lang: Locale): string {
  return `/${lang}/alternatives/${slug}`;
}
