import type { ToolPageContentData } from "../types/toolPageContent";

type Lang = "en" | "zh";
type ToolContentFactory = (lang: Lang) => ToolPageContentData;

const aiVideoContent: ToolContentFactory = lang => {
  const zh = lang === "zh";
  return {
    eyebrow: zh ? "使用方式" : "How it works",
    howTitle: zh ? "从一个镜头描述到 AI 视频。" : "From one shot description to an AI video.",
    facts: [
      { label: zh ? "任务" : "Task", value: zh ? "将一个文本提示词生成可预览的 AI 短视频。" : "Turn one text prompt into a previewable short AI video." },
      { label: zh ? "输入" : "Input", value: zh ? "视频描述、画面比例，以及可选的固定时长。" : "A video description, aspect ratio, and optional fixed duration." },
      { label: zh ? "输出" : "Output", value: zh ? "生成成功后得到可打开和下载的 MP4 视频。" : "A generated MP4 video that can be opened and downloaded when the task completes." },
      { label: zh ? "可用性" : "Availability", value: zh ? "免费生成使用共享视频容量；队列繁忙时会保留提示词，方便稍后重试。" : "Free generation uses shared video capacity; if the queue is busy, the prompt stays ready for retry." },
    ],
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
    exampleType: "video",
    examples: [
      {
        title: zh ? "真实生成的桌面氛围短片" : "Actual generated desk clip",
        inputLabel: zh ? "生产环境使用的提示词" : "Prompt used in production",
        input: zh ? "夜晚的舒适桌面，笔记本屏幕发光，咖啡热气升起，镜头缓慢推进，暖色灯光。" : "A cozy desk setup at night, laptop screen glowing, coffee steam rising, slow push-in camera, warm light.",
        outputLabel: zh ? "真实生成的 MP4" : "Actual generated MP4",
        output: zh ? "生产环境生成结果\n时长：约 3.4 秒\n尺寸：1088 × 832\n格式：MP4" : "Generated in production\nLength: about 3.4 seconds\nSize: 1088 × 832\nFormat: MP4",
        video: {
          src: "/images/tool-examples/ai-video-cozy-desk.mp4",
          title: zh ? "NavoKit AI 视频生成器真实生成的桌面氛围短片" : "Actual NavoKit AI Video Generator output for a cozy desk prompt",
          width: 1088,
          height: 832,
        },
        note: zh ? "这是通过线上 NavoKit AI Video Generator 真实生成并保存的 MP4 示例。" : "This MP4 was generated through the live NavoKit AI Video Generator and saved as a real product example.",
      },
      {
        title: zh ? "产品展示镜头" : "Product demo shot",
        inputLabel: zh ? "可复制提示词" : "Copyable prompt",
        input: zh ? "黑色岩石上的香水瓶，薄雾缓慢流动，产品慢镜头，戏剧化灯光。" : "A perfume bottle on black stone, mist drifting around it, slow product shot, dramatic lighting.",
          outputLabel: zh ? "真实生成的 MP4" : "Actual generated MP4",
          output: zh ? "生产环境生成结果\n时长：约 3.4 秒\n尺寸：1088 × 832\n格式：MP4" : "Generated in production\nLength: about 3.4 seconds\nSize: 1088 × 832\nFormat: MP4",
          video: {
            src: "/images/tool-examples/ai-video-perfume.mp4",
            title: zh ? "NavoKit AI 视频生成器真实生成的产品展示短片" : "Actual NavoKit AI Video Generator output for a perfume product prompt",
            width: 1088,
            height: 832,
          },
          note: zh ? "这是通过线上 NavoKit AI Video Generator 真实生成并保存的 MP4 示例。" : "This MP4 was generated through the live NavoKit AI Video Generator and saved as a real product example.",
        },
        {
          title: zh ? "真实生成的雪地红狐短片" : "Actual generated fox clip",
          inputLabel: zh ? "可复制提示词" : "Copyable prompt",
          input: zh ? "一只红狐穿过积雪森林，雪花缓慢落下，低机位跟拍，写实电影风格。" : "A red fox walking through a snowy forest, soft snowfall, low tracking shot, realistic cinematic style.",
          outputLabel: zh ? "真实生成的 MP4" : "Actual generated MP4",
          output: zh ? "生产环境生成结果\n时长：约 3.4 秒\n尺寸：1088 × 832\n格式：MP4" : "Generated in production\nLength: about 3.4 seconds\nSize: 1088 × 832\nFormat: MP4",
          video: {
            src: "/images/tool-examples/ai-video-red-fox.mp4",
            title: zh ? "NavoKit AI 视频生成器真实生成的雪地红狐短片" : "Actual NavoKit AI Video Generator output for a red fox prompt",
            width: 1088,
            height: 832,
          },
          note: zh ? "这是通过线上 NavoKit AI Video Generator 真实生成并保存的 MP4 示例。" : "This MP4 was generated through the live NavoKit AI Video Generator and saved as a real product example.",
        },
    ],
    limitations: [
      { title: zh ? "结果可能不完全可控" : "Results are not fully deterministic", text: zh ? "AI 视频可能改变细节、动作或构图。请把结果当作可继续筛选的视觉草稿。" : "AI video may change details, motion, or framing. Treat the result as a visual draft you can review and refine." },
      { title: zh ? "免费容量会排队" : "Free capacity is shared", text: zh ? "免费生成使用共享视频容量。繁忙时创建任务可能需要更久；如果队列满了，保留原提示词稍后重试即可。" : "Free generation uses shared video capacity. Starting a task can take longer during busy periods; if the queue is full, keep the same prompt and try again later." },
      { title: zh ? "不要输入敏感内容" : "Avoid sensitive input", text: zh ? "提示词会由 AI 视频服务处理，因此不要提交机密、个人身份或受保护内容。" : "Prompts are processed by an AI video service, so do not submit confidential, identifying, or protected content." },
    ],
    privacy: zh ? "你的提示词和生成设置会由 AI 视频服务处理。NavoKit 不提供视频历史记录，但基础托管日志和服务数据保留政策仍可能适用。" : "Your prompt and generation settings are processed by an AI video service. NavoKit does not provide video history, though hosting logs and service retention policies may still apply.",
    faqs: [
      { title: zh ? "为什么最长是约 18 秒？" : "Why is the maximum about 18 seconds?", text: zh ? "当前 AI 视频服务支持固定帧数档位。自动模式会优先选择更稳定的短片长度；需要更长叙事时，可在高级选项中使用约 5、10 或 18 秒。" : "The current AI video service supports fixed frame-count presets. Auto mode prioritizes a stable short clip first; use the advanced controls when you need about 5, 10, or 18 seconds." },
      { title: zh ? "最终视频一定是所选尺寸和时长吗？" : "Will the final video exactly match my settings?", text: zh ? "不一定。AI 视频服务可能会标准化尺寸和时长，结果区域显示的参数才是实际规格。" : "Not always. The AI video service may normalize dimensions and duration; the result details are the actual specifications." },
      { title: zh ? "是否保证无水印或可商用？" : "Is no-watermark or commercial use guaranteed?", text: zh ? "工具可免费使用，但输出条件和使用权仍需以实际结果与适用条款为准。" : "The tool is free to use, but output conditions and usage rights should still be reviewed before commercial use." },
      { title: zh ? "为什么生成会失败？" : "Why can generation fail?", text: zh ? "高需求、队列满、内容策略、无效提示词或临时故障都可能导致失败。如果提示词有效但队列繁忙，页面会保留原内容，你可以稍后用同一提示词重试。" : "High demand, a full queue, content policies, invalid prompts, or temporary service issues can cause failure. If the prompt is valid but capacity is busy, the page keeps your input so you can retry with the same prompt later." },
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
    facts: [
      { label: zh ? "任务" : "Task", value: zh ? "将 Markdown、AI 回复或结构化文本转成干净图片。" : "Convert Markdown, AI responses, or structured text into a clean image." },
      { label: zh ? "输入" : "Input", value: zh ? "Markdown 文本、标题、列表、引用、表格或代码块。" : "Markdown text with headings, lists, quotes, tables, or code blocks." },
      { label: zh ? "输出" : "Output", value: zh ? "适合社交、文档或归档使用的 PNG 图片。" : "A PNG image for social sharing, documentation, or archiving." },
      { label: zh ? "隐私" : "Privacy", value: zh ? "转换在浏览器中完成，NavoKit 不上传或保存你的 Markdown。" : "Rendering happens in the browser; NavoKit does not upload or store your Markdown." },
    ],
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
    exampleType: "markdown",
    examples: [
      {
        title: zh ? "ChatGPT 回答导出图" : "ChatGPT answer export",
        inputLabel: zh ? "粘贴到工具里的 Markdown" : "Markdown pasted into the tool",
        input: zh ? "# 项目复盘\n\n这次对话里最有用的 3 个结论：\n\n- 先说清楚用户任务\n- 保留可复用的输出\n- 把结果导出成图片分享" : "# Project recap\n\nThree useful takeaways from this ChatGPT answer:\n\n- Start with the user task\n- Keep the reusable output\n- Export the final result as an image card",
        outputLabel: zh ? "导出 PNG 里的视觉效果" : "How the exported PNG looks",
        output: zh ? "项目复盘\n\n这次对话里最有用的 3 个结论：\n\n• 先说清楚用户任务\n• 保留可复用的输出\n• 把结果导出成图片分享" : "Project recap\n\nThree useful takeaways from this ChatGPT answer:\n\n• Start with the user task\n• Keep the reusable output\n• Export the final result as an image card",
        image: {
          src: "/images/tool-examples/markdown-chatgpt-answer.png",
          alt: zh ? "NavoKit Markdown 转图片导出的项目复盘 PNG 示例" : "Actual NavoKit Markdown to Image PNG export for a project recap",
          width: 1120,
          height: 720,
        },
        note: zh ? "这是按工具导出样式生成的真实 PNG 示例资产，包含 Made with NavoKit 标识。" : "This is a real PNG example asset generated in the same export style, including the Made with NavoKit mark.",
      },
      {
        title: zh ? "技术检查清单导出图" : "Technical checklist export",
        inputLabel: zh ? "粘贴到工具里的 Markdown" : "Markdown pasted into the tool",
        input: zh ? "## API launch checklist\n\n1. Validate input\n2. Return helpful errors\n3. Document limits\n4. Test the retry path\n\n`status: ready`" : "## API launch checklist\n\n1. Validate input\n2. Return helpful errors\n3. Document limits\n4. Test the retry path\n\n`status: ready`",
        outputLabel: zh ? "导出 PNG 里的视觉效果" : "How the exported PNG looks",
        output: "API launch checklist\n\n1. Validate input\n2. Return helpful errors\n3. Document limits\n4. Test the retry path\n\nstatus: ready",
        image: {
          src: "/images/tool-examples/markdown-api-checklist.png",
          alt: zh ? "NavoKit Markdown 转图片导出的 API 发布清单 PNG 示例" : "Actual NavoKit Markdown to Image PNG export for an API launch checklist",
          width: 1120,
          height: 720,
        },
        note: zh ? "适合把技术流程、发布清单、教程步骤变成可分享图片。" : "Good for turning technical workflows, launch checklists, and tutorial steps into shareable visuals.",
      },
      {
        title: zh ? "社交媒体知识卡" : "Social knowledge card",
        inputLabel: zh ? "粘贴到工具里的 Markdown" : "Markdown pasted into the tool",
        input: zh ? "> Small tools help people finish work faster.\n\n适合用作：\n\n- X 图片帖\n- LinkedIn 配图\n- Newsletter 摘要图" : "> Small tools help people finish work faster.\n\nWorks well for:\n\n- X image posts\n- LinkedIn visuals\n- Newsletter recap cards",
        outputLabel: zh ? "导出 PNG 里的视觉效果" : "How the exported PNG looks",
        output: zh ? "“Small tools help people finish work faster.”\n\n适合用作：\n\n• X 图片帖\n• LinkedIn 配图\n• Newsletter 摘要图" : "“Small tools help people finish work faster.”\n\nWorks well for:\n\n• X image posts\n• LinkedIn visuals\n• Newsletter recap cards",
        image: {
          src: "/images/tool-examples/markdown-social-card.png",
          alt: zh ? "NavoKit Markdown 转图片导出的社交知识卡片 PNG 示例" : "Actual NavoKit Markdown to Image PNG export for a social knowledge card",
          width: 1120,
          height: 720,
        },
        note: zh ? "这就是你发到 X 或 LinkedIn 时能被别人一眼读懂的卡片形态。" : "This is the kind of clean card people can read quickly on X or LinkedIn.",
      },
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
      facts: [
        { label: zh ? "任务" : "Task", value: zh ? "把一个想法生成多版社交媒体文案初稿。" : "Turn one idea into several editable social post drafts." },
        { label: zh ? "输入" : "Input", value: zh ? "主题、背景、语气、目标平台和希望读者知道的重点。" : "Topic, context, tone, target platform, and the key point readers should understand." },
        { label: zh ? "输出" : "Output", value: zh ? "X、LinkedIn、Instagram 文案和开场句，可继续编辑。" : "Editable drafts for X, LinkedIn, Instagram, and short hook ideas." },
        { label: zh ? "限制" : "Limit", value: zh ? "输出是初稿，发布前仍需检查事实、平台规则和个人语气。" : "Outputs are drafts; check facts, platform rules, and personal voice before publishing." },
      ],
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
    exampleType: "social",
    examples: [
      {
        title: zh ? "工具发布帖" : "Tool launch post",
        inputLabel: zh ? "用户输入" : "User input",
        input: zh ? "我受够了难看的截图，所以做了一个免费工具，可以把 Markdown 变成干净的图片卡片。想发给创作者和开发者，语气直接，不要像广告。" : "I got tired of ugly screenshots, so I made a free tool that turns Markdown into clean image cards. Write for creators and developers. Keep it direct, not ad-like.",
        outputLabel: zh ? "生产环境生成的工作台截图" : "Production-generated workspace",
        output: zh ? "Turn text into shareable images without the design headache.\n\nNavoKit Markdown to Image converts your notes, checklists, and even ChatGPT answers into clean PNGs instantly.\n\nPerfect for creators and devs who want speed + aesthetics.\n\nnavokit.com/en/tools/markdown-to-image" : "Turn text into shareable images without the design headache.\n\nNavoKit Markdown to Image converts your notes, checklists, and even ChatGPT answers into clean PNGs instantly.\n\nPerfect for creators and devs who want speed + aesthetics.\n\nnavokit.com/en/tools/markdown-to-image",
        image: {
          src: "/images/tool-examples/social-workspace-launch.png",
          alt: zh ? "NavoKit AI Social Post Generator 真实工具工作台截图，展示发布工具的多平台文案草稿" : "Actual NavoKit AI Social Post Generator workspace showing multi-platform launch drafts",
          width: 1220,
          height: 840,
        },
        note: zh ? "这张图按真实 Social Booster 工作台渲染，右侧文案来自线上工具的实际生成结果。" : "This image uses the real Social Booster workspace layout, with drafts generated by the live product.",
      },
      {
        title: zh ? "文章改写" : "Repurpose an article",
        inputLabel: zh ? "用户输入" : "User input",
        input: zh ? "把一篇关于 AI 视频提示词的教程，改写成 X 上的一条实用帖子。需要强开头、3 个具体建议、最后给一个轻量行动。" : "Turn a guide about AI video prompts into a practical post for X. Use a strong opening, three concrete tips, and one lightweight next step.",
        outputLabel: zh ? "生产环境生成的工作台截图" : "Production-generated workspace",
        output: zh ? "Most AI video prompts fail. Why? You describe a vibe, not a shot.\n\nFix it with this structure:\n1. Subject\n2. Action\n3. Setting\n4. Camera movement\n5. Lighting\n6. Style\n\nStop guessing. Start framing." : "Most AI video prompts fail. Why? You describe a vibe, not a shot.\n\nFix it with this structure:\n1. Subject\n2. Action\n3. Setting\n4. Camera movement\n5. Lighting\n6. Style\n\nStop guessing. Start framing.",
        image: {
          src: "/images/tool-examples/social-workspace-video-prompt.png",
          alt: zh ? "NavoKit AI Social Post Generator 真实工具工作台截图，展示 AI 视频提示词文章改写结果" : "Actual NavoKit AI Social Post Generator workspace for an AI video prompt guide",
          width: 1220,
          height: 840,
        },
        note: zh ? "适合把指南文章变成多个平台可继续编辑的社交草稿。" : "Useful when turning a guide into editable drafts for several social platforms.",
      },
      {
        title: zh ? "活动提醒" : "Event reminder",
        inputLabel: zh ? "用户输入" : "User input",
        input: zh ? "为一个线上直播活动写 Instagram 文案，语气清楚、轻松，不要夸张。需要说明时间、主题和观众能得到什么。" : "Write an Instagram caption for an online live session. Keep it clear, relaxed, and not overhyped. Include timing, topic, and what people will learn.",
        outputLabel: zh ? "生产环境生成的工作台截图" : "Production-generated workspace",
        output: zh ? "Stuck with messy notes? Let's fix that.\n\nI'm hosting a live session to show you how to turn those rough drafts into content you can actually publish.\n\nWhen: [Date] at [Time]\nWhat we cover: Structuring your thoughts, editing for impact, and finalizing your pieces." : "Stuck with messy notes? Let's fix that.\n\nI'm hosting a live session to show you how to turn those rough drafts into content you can actually publish.\n\nWhen: [Date] at [Time]\nWhat we cover: Structuring your thoughts, editing for impact, and finalizing your pieces.",
        image: {
          src: "/images/tool-examples/social-workspace-event.png",
          alt: zh ? "NavoKit AI Social Post Generator 真实工具工作台截图，展示活动提醒多平台文案草稿" : "Actual NavoKit AI Social Post Generator workspace showing multi-platform event reminder drafts",
          width: 1220,
          height: 840,
        },
        note: zh ? "重点是给用户一组可继续编辑的草稿，而不是承诺互动或转化。" : "The value is a set of editable drafts, not a promise of engagement or conversion.",
      },
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
