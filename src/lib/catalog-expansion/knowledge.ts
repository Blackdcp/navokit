import type { ProductEntry } from "@/types/catalog";

// Verified against official pages on 2026-10-09. No inferred launch dates.
export const knowledgeProducts: ProductEntry[] = [
  {
    slug: "msty", website: "https://msty.ai/products/studio/", kind: "app", pricing: "freemium",
    categoryIds: ["assistants"], topicIds: ["desktop-browser"], icon: "M", accent: "#0B1220",
    platforms: ["macOS", "Windows", "Linux", "Web"], verifiedAt: "2026-10-09",
    sourceUrls: ["https://msty.ai/products/studio/", "https://docs.msty.ai/studio/getting-started/quick-start"],
    en: { name: "Msty Studio", tagline: "Bring local and online models into one workspace.", description: "Msty Studio combines model conversations, reusable prompts, and document context. Split Chats lets you compare model responses side by side, while Knowledge Stacks keeps reference material close to the conversation.", features: ["Local and hosted model connections", "Side-by-side model conversations", "Document-based Knowledge Stacks"], bestFor: "People who want to choose their models and reuse context across everyday tasks.", requirements: "Desktop installers are available for macOS, Windows, and Linux. Web access and advanced features depend on the plan; local models require suitable hardware and online providers may charge separately." },
    zh: { name: "Msty Studio", tagline: "在一个工作区里，使用本地与在线模型。", description: "Msty Studio 将模型对话、可复用提示词与文档上下文放在同一工作区。Split Chats 可以并排比较回答，Knowledge Stacks 则将参考资料带入对话。", features: ["连接本地与在线模型", "并排比较模型回答", "用文档建立 Knowledge Stacks"], bestFor: "希望自主选择模型，并在日常任务中复用上下文的人。", requirements: "提供 macOS、Windows 与 Linux 安装包。网页版及高级功能依方案而定；本地模型需要相应硬件，在线模型提供商可能另行收费。" },
  },
  {
    slug: "enconvo", website: "https://www.enconvo.com/", kind: "app", pricing: "freemium",
    categoryIds: ["assistants"], topicIds: ["desktop-browser"], icon: "E", accent: "#0B1220",
    platforms: ["macOS"], verifiedAt: "2026-10-09",
    sourceUrls: ["https://www.enconvo.com/", "https://docs.enconvo.ai/"],
    en: { name: "Enconvo", tagline: "Call an AI assistant beside the Mac app you are using.", description: "Enconvo adds a sidebar and selection-based commands to macOS. It can use screen or text context for writing and research, connect local or hosted models, and combine tools into workflows.", features: ["App sidebar and selected-text commands", "Local or hosted model connections", "MCP tools and visual workflows"], bestFor: "Mac users who want AI help inside their existing workspace.", requirements: "Requires macOS 14 or later on Intel or Apple silicon. The free tier has feature limits. Bring your own models or credentials, or choose a Cloud plan; provider charges are separate." },
    zh: { name: "Enconvo", tagline: "在正在使用的 Mac 应用旁，唤起 AI 助手。", description: "Enconvo 通过侧栏与划词命令融入 macOS，可结合屏幕或选中文字进行写作、查找资料，也能连接本地或在线模型，将工具组合为工作流。", features: ["应用侧栏与划词命令", "连接本地或在线模型", "MCP 工具与可视化工作流"], bestFor: "希望在现有工作环境中直接调用 AI 的 Mac 用户。", requirements: "需要 macOS 14 或以上，支持 Intel 与 Apple silicon。免费方案有功能额度限制；可自备模型或凭据，也可选择 Cloud 方案，模型提供商费用另计。" },
  },
  {
    slug: "scira", website: "https://scira.ai/", repository: "https://github.com/zaidmukaddam/scira", kind: "open-source", pricing: "freemium",
    categoryIds: ["search-research"], topicIds: [], icon: "S", accent: "#0B1220",
    platforms: ["Web", "Self-hosted"], verifiedAt: "2026-10-09",
    sourceUrls: ["https://scira.ai/", "https://scira.ai/about", "https://github.com/zaidmukaddam/scira"],
    en: { name: "Scira", tagline: "Follow an answer back to the sources behind it.", description: "Scira searches the web and returns answers with linked citations. Its research workflow breaks questions into smaller searches and exposes the sources, helping you inspect how an answer was assembled.", features: ["Answers with source citations", "Multiple search modes", "Public source code for self-hosting"], bestFor: "Readers who want to inspect sources while exploring a question.", requirements: "The hosted service has free and paid usage tiers. Self-hosting requires deployment work and model/search API credentials. Check cited sources before relying on an answer." },
    zh: { name: "Scira", tagline: "沿着引用，查回答案背后的信息来源。", description: "Scira 搜索网页并给出带有来源链接的回答。研究流程会将问题拆为较小的搜索任务，展示参考来源，方便查看答案如何形成。", features: ["回答附带来源引用", "多种搜索模式", "公开源码，可自行部署"], bestFor: "希望在探索问题时同时核查参考来源的人。", requirements: "托管服务提供免费及付费额度。自行部署需要配置服务及模型、搜索 API 凭据；使用答案前仍需核查引用来源。" },
  },
  {
    slug: "exa", website: "https://exa.ai/", kind: "api", pricing: "varies",
    categoryIds: ["search-research"], topicIds: ["teams-agents"], icon: "E", accent: "#0B1220",
    platforms: ["API", "MCP"], verifiedAt: "2026-10-09",
    sourceUrls: ["https://exa.ai/", "https://exa.ai/docs/reference/search", "https://www.producthunt.com/products/exa-ai"],
    en: { name: "Exa", tagline: "Give an AI application search results it can work with.", description: "Exa provides web search and page-content retrieval through an API. Developers can retrieve relevant URLs and text for assistants or research workflows, and use structured outputs to pass results to the next step.", features: ["Web search API", "Page content and highlights", "Agent and MCP integrations"], bestFor: "Developers adding web retrieval to an assistant or research application.", requirements: "Requires integration and an API account or a compatible MCP client. Usage, limits, and prices depend on the chosen endpoint and plan." },
    zh: { name: "Exa", tagline: "为 AI 应用接入可继续处理的网页搜索结果。", description: "Exa 通过 API 提供网页搜索与内容提取。开发者可为助手或研究流程检索相关网址和正文，再使用结构化结果连接后续步骤。", features: ["网页搜索 API", "正文提取与重点片段", "Agent 与 MCP 集成"], bestFor: "需要为助手或研究应用增加联网检索的开发者。", requirements: "需要接口集成及 API 账号，或兼容的 MCP 客户端。使用额度、限制与费用以所选接口及方案为准。" },
  },
  {
    slug: "undermind", website: "https://www.undermind.ai/", kind: "app", pricing: "freemium",
    categoryIds: ["research"], topicIds: [], icon: "U", accent: "#0B1220",
    platforms: ["Web"], verifiedAt: "2026-10-09",
    sourceUrls: ["https://www.undermind.ai/", "https://www.ycombinator.com/companies/undermind"],
    en: { name: "Undermind", tagline: "Describe a research question, then explore the papers around it.", description: "Undermind searches scientific literature from a natural-language research brief. It follows citation trails, explains relevance, and supports follow-up discussion with references back to papers.", features: ["Question-based literature search", "Paper relevance and citation trails", "Research follow-ups and alerts"], bestFor: "Researchers scoping a literature review or following a research area.", requirements: "An online account is required; searches and advanced analysis have plan-dependent limits. Paper access depends on source availability, and research conclusions need independent checking." },
    zh: { name: "Undermind", tagline: "描述研究问题，再沿着文献与引用深入查找。", description: "Undermind 接受自然语言研究需求，检索科学文献、追踪引用关系，并说明论文与问题的关联。后续讨论可以继续回到相关论文。", features: ["按研究问题查找文献", "论文相关性与引用线索", "研究追问与文献提醒"], bestFor: "正在确定文献综述范围，或持续跟踪一个研究方向的人。", requirements: "需要在线账号，搜索及深入分析额度依方案而定。全文可用性取决于来源，研究结论仍需独立核查。" },
  },
  {
    slug: "asta", website: "https://asta.allen.ai/", kind: "app", pricing: "varies",
    categoryIds: ["research"], topicIds: [], icon: "A", accent: "#0B1220",
    platforms: ["Web"], verifiedAt: "2026-10-09",
    sourceUrls: ["https://asta.allen.ai/", "https://allenai.org/asta/agents", "https://allenai.org/blog/asta"],
    en: { name: "Asta", tagline: "Explore scientific papers and build a cited research report.", description: "Ai2's Asta brings literature search and evidence synthesis into a research interface. Find papers explores relevant studies; Generate a report organizes retrieved evidence into a response with inline citations.", features: ["Find papers from a research question", "Generate reports with inline citations", "Inspect links to supporting studies"], bestFor: "Researchers navigating an unfamiliar topic or comparing scientific evidence.", requirements: "A web-based research service. Available modes and access limits can change; inspect cited papers and the current service terms before using results." },
    zh: { name: "Asta", tagline: "查找科学论文，把文献证据整理成带引用的报告。", description: "Ai2 的 Asta 在同一研究界面提供文献查找与证据综合。Find papers 探索相关研究，Generate a report 则将检索到的证据整理为带行内引用的回答。", features: ["根据研究问题查找论文", "生成带行内引用的报告", "查看支撑结论的研究来源"], bestFor: "正在了解陌生课题，或需要比较科学证据的研究者。", requirements: "在线研究服务，可用模式及访问限制可能调整。使用结果前需阅读引用论文，并查看当前服务条款。" },
  },
  {
    slug: "recall", website: "https://www.recall.it/", kind: "app", pricing: "freemium",
    categoryIds: ["knowledge-management"], topicIds: ["creator-essentials"], icon: "R", accent: "#0B1220",
    platforms: ["Web", "Browser extension"], verifiedAt: "2026-10-09",
    sourceUrls: ["https://www.recall.it/", "https://docs.recall.it/", "https://www.producthunt.com/products/recall-6"],
    en: { name: "Recall", tagline: "Turn things you save into a knowledge base you can question.", description: "Recall collects articles, videos, podcasts, PDFs, and notes in a personal knowledge base. It summarizes saved material, connects related topics, and lets you ask questions against your collection.", features: ["Save and summarize different content formats", "Connected notes and knowledge graph", "Chat with your saved material"], bestFor: "People who regularly save references and want to retrieve their ideas later.", requirements: "Requires an account. Supported imports, AI usage, and available models depend on the plan; some workflows use the browser extension." },
    zh: { name: "Recall", tagline: "将收藏的内容，变成可以提问的个人知识库。", description: "Recall 将文章、视频、播客、PDF 与笔记集中为个人知识库，可以总结保存的资料、连接相关主题，并围绕自己的收藏提问。", features: ["保存与总结多种内容", "关联笔记与知识图谱", "围绕已保存资料对话"], bestFor: "经常收藏参考资料，希望以后能再次找到其中思路的人。", requirements: "需要账号。支持的导入方式、AI 额度及可用模型依方案而定，部分流程需要浏览器扩展。" },
  },
  {
    slug: "lex", website: "https://lex.page/", kind: "app", pricing: "varies",
    categoryIds: ["writing"], topicIds: ["creator-essentials"], icon: "L", accent: "#0B1220",
    platforms: ["Web"], verifiedAt: "2026-10-09",
    sourceUrls: ["https://lex.page/", "https://www.producthunt.com/products/lex-4"],
    en: { name: "Lex", tagline: "Keep writing, with feedback and revisions beside your draft.", description: "Lex is a collaborative document editor with AI feedback and rewriting tools. It combines comments, document versions, and live collaboration, so a draft can develop through both human review and AI suggestions.", features: ["AI feedback and rewriting", "Comments and document versions", "Live collaboration and read-only sharing"], bestFor: "Writers and small teams who want editorial help while keeping control of a draft.", requirements: "Runs in a web browser with an account. Check the current plan for AI allowances; all suggested changes remain for the writer to review." },
    zh: { name: "Lex", tagline: "继续写下去，让反馈与修改围绕草稿展开。", description: "Lex 是带 AI 反馈与改写功能的协作文档编辑器，结合评论、文档版本与实时协作，让草稿在人工审阅及 AI 建议之间逐步完善。", features: ["AI 反馈与段落改写", "评论与文档版本", "实时协作与只读分享"], bestFor: "希望获得编辑建议，同时保留草稿控制权的作者与小团队。", requirements: "在浏览器中使用，需要账号。AI 额度请查看当前方案，所有修改建议都需要作者自行审核。" },
  },
];
