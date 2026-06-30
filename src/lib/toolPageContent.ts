import type { ToolPageContentData } from "../types/toolPageContent";

type Lang = "en" | "zh";
type ToolContentFactory = (lang: Lang) => ToolPageContentData;

const aiVideoContent: ToolContentFactory = lang => {
  const zh = lang === "zh";
  return {
    eyebrow: zh ? "使用方式" : "How it works",
    howTitle: zh ? "从一个镜头描述到 AI 视频。" : "From one shot description to an AI video.",
    steps: [
      { title: zh ? "描述镜头" : "Describe one shot", text: zh ? "说明主体、动作、场景、镜头运动、光线和视觉风格。" : "Specify the subject, action, setting, camera movement, lighting, and visual style." },
      { title: zh ? "选择格式" : "Choose the format", text: zh ? "根据 YouTube、Reels 或社交信息流选择横版、竖版或方形。" : "Choose landscape, portrait, or square for YouTube, Reels, or social feeds." },
      { title: zh ? "检查结果" : "Review the result", text: zh ? "查看主体一致性、动作、构图和实际输出规格。" : "Check subject consistency, motion, framing, and the actual output specifications." },
    ],
    useCases: [
      { title: zh ? "社交短视频" : "Social clips", text: zh ? "为帖子和短视频平台制作概念片段。" : "Create concept clips for posts and short-form platforms." },
      { title: zh ? "视觉概念" : "Shot concepts", text: zh ? "快速探索镜头、灯光和运动方向。" : "Explore shots, lighting, and motion direction." },
      { title: zh ? "故事分镜" : "Story beats", text: zh ? "将一个叙事镜头变成动态视觉参考。" : "Turn one narrative shot into a moving visual reference." },
      { title: zh ? "创意测试" : "Creative tests", text: zh ? "在投入正式制作前测试镜头提示词。" : "Test shot prompts before investing in full production." },
    ],
    examples: [
      { title: zh ? "电影感自然镜头" : "Cinematic nature shot", text: "A red fox walking through a snowy forest, soft snowfall, low tracking shot, realistic cinematic style." },
      { title: zh ? "产品镜头" : "Product shot", text: "A perfume bottle on black stone, mist drifting around it, slow product shot, dramatic lighting." },
      { title: zh ? "社交短片" : "Social clip", text: "A cozy desk setup at night, laptop screen glowing, coffee steam rising, slow push-in camera, warm light." },
    ],
    limitations: [
      { title: zh ? "结果可能不完全可控" : "Results are not fully deterministic", text: zh ? "AI 视频可能改变细节、动作或构图。请把结果当作可继续筛选的视觉草稿。" : "AI video may change details, motion, or framing. Treat the result as a visual draft you can review and refine." },
      { title: zh ? "生成速度会变化" : "Generation speed can vary", text: zh ? "AI 视频生成可能受排队和服务状态影响，繁忙时会更慢或失败。" : "AI video generation can be affected by queues and service availability. Busy periods may make tasks slower or fail." },
      { title: zh ? "不要输入敏感内容" : "Avoid sensitive input", text: zh ? "提示词会由 AI 视频服务处理，因此不要提交机密、个人身份或受保护内容。" : "Prompts are processed by an AI video service, so do not submit confidential, identifying, or protected content." },
    ],
    privacy: zh ? "你的提示词和生成设置会由 AI 视频服务处理。NavoKit 不提供视频历史记录，但基础托管日志和服务数据保留政策仍可能适用。" : "Your prompt and generation settings are processed by an AI video service. NavoKit does not provide video history, though hosting logs and service retention policies may still apply.",
    faqs: [
      { title: zh ? "为什么最长是约 18 秒？" : "Why is the maximum about 18 seconds?", text: zh ? "当前 AI 视频服务支持固定帧数档位。NavoKit 开放约 3、5、10 和 18 秒选项；更长视频暂不稳定，因此不作为当前选项。" : "The current AI video service supports fixed frame-count presets. NavoKit exposes approximately 3, 5, 10, and 18 second options; longer videos are not stable enough to offer yet." },
      { title: zh ? "最终视频一定是所选尺寸和时长吗？" : "Will the final video exactly match my settings?", text: zh ? "不一定。AI 视频服务可能会标准化尺寸和时长，结果区域显示的参数才是实际规格。" : "Not always. The AI video service may normalize dimensions and duration; the result details are the actual specifications." },
      { title: zh ? "是否保证无水印或可商用？" : "Is no-watermark or commercial use guaranteed?", text: zh ? "工具可免费使用，但输出条件和使用权仍需以实际结果与适用条款为准。" : "The tool is free to use, but output conditions and usage rights should still be reviewed before commercial use." },
      { title: zh ? "为什么生成会失败？" : "Why can generation fail?", text: zh ? "服务繁忙、内容策略、无效提示词或临时故障都可能导致失败。" : "High demand, content policies, invalid prompts, or temporary service issues can cause failure." },
      { title: zh ? "支持图生视频吗？" : "Does it support image-to-video?", text: zh ? "目前支持文生视频，暂不支持图生视频。" : "This tool supports text-to-video only." },
    ],
    related: [
      { title: zh ? "AI 社交媒体文案" : "AI Social Post Generator", description: zh ? "为视频起草配套社交文案。" : "Draft a social post to accompany the video.", href: `/${lang}/tools/ai-social-booster` },
      { title: zh ? "Markdown 转图片" : "Markdown to Image", description: zh ? "把结构化内容变成分享图片。" : "Turn structured content into a shareable image.", href: `/${lang}/tools/markdown-to-image` },
    ],
    guide: { title: zh ? "如何用文本提示词生成 AI 视频" : "How to generate AI videos from text", description: zh ? "学习提示词结构、格式选择与结果检查。" : "Learn prompt structure, format selection, and result review.", href: `/${lang}/blog/how-to-generate-ai-videos-from-text` },
  };
};

const markdownToImageContent: ToolContentFactory = lang => {
  const zh = lang === "zh";
  return {
    eyebrow: zh ? "使用方式" : "How it works",
    howTitle: zh ? "从 Markdown 到分享图片。" : "From Markdown to a shareable image.",
    steps: [
      { title: zh ? "粘贴内容" : "Paste your content", text: zh ? "粘贴 Markdown、ChatGPT 回复或结构化文本。" : "Paste Markdown, a ChatGPT response, or any structured text." },
      { title: zh ? "检查预览" : "Review the preview", text: zh ? "边输入边查看标题、列表、引用和代码块效果。" : "See headings, lists, quotes, and code blocks update as you type." },
      { title: zh ? "导出 PNG" : "Export the PNG", text: zh ? "下载适合社交媒体、文档或归档的高清图片。" : "Download a high-resolution image for social posts, documents, or archives." },
    ],
    useCases: [
      { title: zh ? "分享 AI 回答" : "Share AI answers", text: zh ? "把有价值的 ChatGPT 或 AI 回复变成可读图片。" : "Turn useful ChatGPT or AI responses into readable visual cards." },
      { title: zh ? "发布技术笔记" : "Publish technical notes", text: zh ? "保留 Markdown 层级、列表和代码结构。" : "Preserve Markdown hierarchy, lists, and code structure." },
      { title: zh ? "保存结构化内容" : "Archive structured content", text: zh ? "将易丢失的聊天内容保存为独立视觉文件。" : "Save transient chat content as a standalone visual file." },
      { title: zh ? "制作内容卡片" : "Create content cards", text: zh ? "为文章、Newsletter 和社交发布制作干净配图。" : "Create clean companion graphics for posts and newsletters." },
    ],
    examples: [
      { title: zh ? "AI 回答卡片" : "AI answer card", text: "# Summary\n\nThree practical takeaways from the conversation:\n\n- Keep the input clear\n- Export the useful result\n- Share the final card" },
      { title: zh ? "技术笔记" : "Technical note", text: "## API checklist\n\n1. Validate input\n2. Return useful errors\n3. Document limits\n\n`status: ready`" },
      { title: zh ? "社交图片" : "Social image", text: "> Small tools help people finish work faster.\n\nUse this as a clean quote card or newsletter visual." },
    ],
    limitations: [
      { title: zh ? "本地渲染受浏览器影响" : "Rendering depends on the browser", text: zh ? "复杂表格、极长内容或特殊 Markdown 插件可能不会完全匹配你的原始编辑器。" : "Complex tables, very long content, or special Markdown plugins may not match your original editor exactly." },
      { title: zh ? "免费版包含品牌标识" : "The free version includes a brand mark", text: zh ? "导出的图片会包含克制的 NavoKit 标识。" : "Exports include a restrained NavoKit mark." },
      { title: zh ? "不是完整设计工具" : "It is not a full design editor", text: zh ? "这个工具专注于把结构化文本快速变成干净图片，不替代 Figma 或 Photoshop。" : "This tool focuses on turning structured text into clean images quickly. It does not replace Figma or Photoshop." },
    ],
    privacy: zh ? "转换和图片渲染在你的浏览器中完成。NavoKit 不会上传或保存你粘贴的 Markdown 内容。" : "Conversion and image rendering happen in your browser. NavoKit does not upload or store the Markdown you paste.",
    faqs: [
      { title: zh ? "支持 ChatGPT 回复吗？" : "Does it work with ChatGPT responses?", text: zh ? "支持。复制回复中的 Markdown 并粘贴到编辑器即可。" : "Yes. Copy the Markdown-formatted response and paste it into the editor." },
      { title: zh ? "支持哪些 Markdown 语法？" : "Which Markdown syntax is supported?", text: zh ? "支持标题、加粗、斜体、列表、链接、引用、表格和代码块等常见语法。" : "It supports common syntax including headings, emphasis, lists, links, quotes, tables, and code blocks." },
      { title: zh ? "需要注册吗？" : "Do I need to sign up?", text: zh ? "不需要。当前版本打开即可使用。" : "No. The current version is ready to use without an account." },
      { title: zh ? "为什么图片包含品牌标识？" : "Why does the image include a brand mark?", text: zh ? "免费版本使用克制的 NavoKit 水印，帮助支持工具持续运营。" : "The free version includes a restrained NavoKit watermark to support the tool." },
    ],
    related: [
      { title: zh ? "AI 视频生成器" : "AI Video Generator", description: zh ? "将文本提示词变成短视频。" : "Turn a text prompt into a short video.", href: `/${lang}/tools/free-ai-video-generator` },
      { title: zh ? "AI 社交媒体文案" : "AI Social Post Generator", description: zh ? "从一个想法起草社交媒体文案。" : "Draft social posts from one idea.", href: `/${lang}/tools/ai-social-booster` },
    ],
    guide: { title: zh ? "如何把 Markdown 转成 PNG" : "How to convert Markdown to PNG", description: zh ? "从结构化文本到清晰分享图片的实用流程。" : "A practical workflow from structured text to a clean shareable image.", href: `/${lang}/blog/how-to-convert-markdown-to-png` },
  };
};

const socialBoosterContent: ToolContentFactory = lang => {
  const zh = lang === "zh";
  return {
      eyebrow: zh ? "使用方式" : "How it works",
      howTitle: zh ? "从一个想法到多版可编辑初稿。" : "From one idea to several editable drafts.",
      steps: [
        { title: zh ? "描述真实想法" : "Describe the real idea", text: zh ? "给出主题、背景、感受和希望读者知道的重点。" : "Provide the topic, context, feeling, and what readers should know." },
        { title: zh ? "一次生成多版" : "Generate several versions", text: zh ? "同时得到 X、LinkedIn、Instagram 和开场句的可编辑版本。" : "Get editable versions for X, LinkedIn, Instagram, and short hook ideas at once." },
        { title: zh ? "审阅并修改" : "Review and personalize", text: zh ? "检查事实，加入你的经历和语气，再决定发布哪一版。" : "Check facts, add your experience and voice, then decide which version to publish." },
    ],
    useCases: [
      { title: zh ? "版本更新" : "Release updates", text: zh ? "把版本变化整理成清晰的社交发布初稿。" : "Turn release notes into a clear social update." },
      { title: zh ? "创作灵感" : "Creator ideas", text: zh ? "把零散想法整理成有开头和重点的短文。" : "Shape a rough thought into a short post with a clear opening." },
      { title: zh ? "活动宣传" : "Event promotion", text: zh ? "快速起草活动介绍、时间和行动信息。" : "Draft the event context, timing, and action in one place." },
      { title: zh ? "内容复用" : "Content repurposing", text: zh ? "将文章或笔记的核心观点改写成社交版本。" : "Rewrite the core idea of an article or note for social media." },
    ],
    examples: [
      { title: zh ? "版本更新" : "Release update", text: zh ? "我们刚把 Markdown 转图片工具改成了本地渲染，想发一条简短更新给创作者和开发者。" : "We just moved the Markdown to Image tool to local rendering. Draft a concise update for creators and developers." },
      { title: zh ? "文章复用" : "Repurpose an article", text: zh ? "把一篇关于 AI 视频提示词的教程，改写成 X 上的一条实用帖子。" : "Turn a guide about AI video prompts into a practical post for X." },
      { title: zh ? "活动提醒" : "Event reminder", text: zh ? "为一个线上直播活动写 Instagram 文案，语气清楚、轻松，不要夸张。" : "Write an Instagram caption for an online live session. Keep it clear, relaxed, and not overhyped." },
    ],
    limitations: [
      { title: zh ? "输出只是初稿" : "The output is a draft", text: zh ? "发布前需要检查事实、平台规则和你的真实语气。" : "Review facts, platform rules, and your own voice before publishing." },
      { title: zh ? "不承诺互动结果" : "No engagement guarantees", text: zh ? "工具不会承诺浏览、点赞、关注或转化。" : "The tool does not promise views, likes, followers, or conversions." },
      { title: zh ? "不要输入隐私信息" : "Do not enter private information", text: zh ? "输入会由 AI 服务处理，请避免机密信息和个人身份信息。" : "Your input is processed by an AI service, so avoid confidential or identifying information." },
    ],
    privacy: zh ? "你的输入会由 AI 服务处理，用于生成文案初稿。请勿输入敏感、机密或个人身份信息。" : "Your input is processed by an AI service to generate draft copy. Do not enter sensitive, confidential, or identifying information.",
    faqs: [
      { title: zh ? "生成内容可以直接发布吗？" : "Can I publish the result unchanged?", text: zh ? "不建议。请检查事实、平台规则和语气，并加入你的真实观点。" : "We do not recommend it. Check facts, platform rules, and tone, then add your real perspective." },
      { title: zh ? "会生成哪些内容？" : "Which outputs are included?", text: zh ? "一次生成 X 短帖、LinkedIn 帖子、Instagram 文案和开场句。你可以复制任意版本，再按发布场景继续调整。" : "It generates an X post, a LinkedIn post, an Instagram caption, and short hook ideas in one run. Copy any version and adapt it before publishing." },
      { title: zh ? "它能保证互动量吗？" : "Does it guarantee engagement?", text: zh ? "不能。工具只负责生成初稿，不承诺浏览、点赞或转化结果。" : "No. The tool creates a draft and does not promise views, likes, or conversions." },
    ],
    related: [
      { title: zh ? "Markdown 转图片" : "Markdown to Image", description: zh ? "把长内容变成适合分享的图片。" : "Turn longer content into a shareable image.", href: `/${lang}/tools/markdown-to-image` },
      { title: zh ? "AI 视频生成器" : "AI Video Generator", description: zh ? "为你的内容生成一段短视频。" : "Create a short video for your content.", href: `/${lang}/tools/free-ai-video-generator` },
    ],
    guide: { title: zh ? "如何用 AI 起草社媒文案" : "How to draft social posts with AI", description: zh ? "一套更可靠的生成、审阅与修改流程。" : "A practical generate, review, and edit workflow.", href: `/${lang}/blog/how-to-draft-social-posts-with-ai` },
  };
};

const factories: Record<string, ToolContentFactory> = {
  "free-ai-video-generator": aiVideoContent,
  "markdown-to-image": markdownToImageContent,
  "ai-social-booster": socialBoosterContent,
};

export function getToolPageContent(lang: Lang, toolId: string): ToolPageContentData {
  const factory = factories[toolId];

  if (!factory) {
    throw new Error(`Missing tool page content for ${toolId}`);
  }

  return factory(lang);
}
