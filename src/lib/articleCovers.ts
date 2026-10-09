export type ArticleCoverTheme = "video" | "audio" | "code" | "reasoning" | "agents" | "infrastructure" | "retrieval" | "growth" | "writing";

const themes: Record<ArticleCoverTheme, { en: string; zh: string; background: string; ink: string }> = {
  video: { en: "The moving image", zh: "让画面动起来", background: "#e9ddff", ink: "#362759" },
  audio: { en: "Inside the sound", zh: "声音的细节", background: "#e5f3a5", ink: "#293522" },
  code: { en: "Code, made visible", zh: "让代码被看见", background: "#ffdddb", ink: "#572b3c" },
  reasoning: { en: "How models think", zh: "模型如何思考", background: "#dce7fc", ink: "#173f85" },
  agents: { en: "Connected intelligence", zh: "连接起来的智能", background: "#e7dcfa", ink: "#4b3270" },
  infrastructure: { en: "Under the hood", zh: "计算背后的架构", background: "#fbe2c5", ink: "#643b21" },
  retrieval: { en: "Finding the signal", zh: "从信息中找到线索", background: "#d5eee1", ink: "#215741" },
  growth: { en: "Ideas that travel", zh: "让好想法被发现", background: "#ffe0c9", ink: "#794124" },
  writing: { en: "From thought to form", zh: "从想法到表达", background: "#d8e9f5", ink: "#254b67" },
};

// These are original editorial illustrations, not product screenshots or
// evidence for a claim in an article. Slugs keep both languages consistent.
function getTheme(slug: string): ArticleCoverTheme {
  if (/audio|sound|foley|lipsync/.test(slug)) return "audio";
  if (/video|cinematic|short-film|motion|crowd-dynamics/.test(slug)) return "video";
  if (/code|github|readme|markdown|mermaid|documentation|git-diff|webassembly|wasm/.test(slug)) return "code";
  if (/memory|context|retrieval|rag|vector|search|caching/.test(slug)) return "retrieval";
  if (/agent|mcp|microservices|compound-ai/.test(slug)) return "agents";
  if (/gpu|hardware|hbm|cxl|compute|inference|decoding|bitnet|quantization|edge-ai|webgpu|lora|distillation/.test(slug)) return "infrastructure";
  if (/reason|rlhf|rlvr|rlaif|reward|supervision|alignment|transformer|autoencoder|training|model|benchmark|kimi|neural|data-wall|synthetic|emergent/.test(slug)) return "reasoning";
  if (/social|linkedin|instagram|tiktok|growth|viral|hook|geo-|wealth|enterprise|startup|launch|copywriting|rule/.test(slug)) return "growth";
  return "writing";
}

const focusLabels: [RegExp, string, string][] = [
  [/mcp/, "MCP · Tool connections", "MCP · 工具连接"],
  [/kv-cache|snapkv/, "KV cache", "KV 缓存"],
  [/context|lost-in-the-middle/, "The context window", "上下文窗口"],
  [/memory/, "Agent memory", "Agent 的记忆"],
  [/rag|retrieval|vector/, "Retrieval & knowledge", "检索与知识"],
  [/sound|audio|foley|lipsync/, "Sound & motion", "声音与画面"],
  [/camera|cinematic|lighting/, "Light, camera, motion", "光线、镜头与运动"],
  [/video.*prompt|prompt.*video|short-film/, "Prompt to frame", "从提示词到画面"],
  [/video.*character|character.*video/, "Character continuity", "角色与连续性"],
  [/mermaid|architecture|diagram/, "Visual architecture", "可视化架构"],
  [/github|readme/, "The visual README", "README 的视觉表达"],
  [/markdown|visual.*code|code.*visual/, "Text becomes visual", "让文字成为图像"],
  [/supervision|reason|chain-of|rlvr/, "A path to reasoning", "推理的路径"],
  [/alignment|rlhf|rlaif|reward/, "Learning from feedback", "从反馈中学习"],
  [/gpu|hbm|cxl|hardware/, "Inside AI compute", "走进 AI 算力"],
  [/quantization|bitnet|edge-ai|distillation/, "Smaller, faster models", "更小、更快的模型"],
  [/geo-/, "Beyond the search box", "搜索框之外"],
  [/agent/, "Agents at work", "Agent 如何协作"],
  [/social|linkedin|instagram|tiktok|copywriting/, "Creative distribution", "内容与传播"],
  [/claude|buzzword/, "Words with intent", "让表达更准确"],
];

export function getArticleCover(slug: string, lang: "en" | "zh") {
  const normalized = slug.replace(/^article:/, "").toLowerCase();
  const theme = getTheme(normalized);
  const selected = themes[theme];
  const focus = focusLabels.find(([pattern]) => pattern.test(normalized));
  return {
    theme,
    src: `/article-covers/${theme}.svg`,
    label: focus ? focus[lang === "zh" ? 2 : 1] : selected[lang],
    eyebrow: lang === "zh" ? "NAVOKIT · 阅读笔记" : "NAVOKIT · FIELD NOTES",
    alt: lang === "zh" ? `${selected.zh}主题插画` : `Editorial illustration: ${selected.en.toLowerCase()}`,
    background: selected.background,
    ink: selected.ink,
  };
}
