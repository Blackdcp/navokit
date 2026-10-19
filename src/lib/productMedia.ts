/** Verified product imagery and NavoKit tool examples. Provenance: docs/product-media-sources.md. */
import type { ProductMedia } from "@/types/catalog";
import { knowledgeMedia } from "./catalog-expansion/knowledge-media";
import { creativeMedia } from "./catalog-expansion/creative-media";
import { builderMedia } from "./catalog-expansion/builders-media";

export const productMedia: Record<string, ProductMedia> = {
  ...creativeMedia,
  ...builderMedia,
  ...knowledgeMedia,
  "markdown-to-image": {
    image: "/images/tool-examples/markdown-social-card.png",
    imageAlt: {
      en: "A NavoKit Markdown to Image export with a heading, bullet list, and NavoKit signature.",
      zh: "Markdown 转图片导出示例，包含标题、列表和 NavoKit 品牌标识。",
    },
    sourceUrl: "https://www.navokit.com/en/tools/markdown-to-image",
    imageSourceUrl: "/images/tool-examples/markdown-social-card.png",
    checkedAt: "2026-10-09",
  },
  "ai-social-booster": {
    image: "/images/tool-examples/social-workspace-launch.png",
    imageAlt: {
      en: "NavoKit's social writing workspace showing a product launch brief beside editable drafts for several platforms.",
      zh: "AI 社媒文案工作区示例，左侧为产品发布需求，右侧为不同平台的文案草稿。",
    },
    sourceUrl: "https://www.navokit.com/en/tools/ai-social-booster",
    imageSourceUrl: "/images/tool-examples/social-workspace-launch.png",
    checkedAt: "2026-10-09",
  },
  "free-ai-video-generator": {
    image: "/products/free-ai-video-generator/preview.jpg",
    imageAlt: {
      en: "A frame from NavoKit's saved AI video example of a red fox walking through a snowy forest.",
      zh: "AI 视频生成器现有样片画面：一只红狐穿过积雪森林。",
    },
    sourceUrl: "https://www.navokit.com/en/tools/free-ai-video-generator",
    imageSourceUrl: "/images/tool-examples/ai-video-red-fox.mp4",
    checkedAt: "2026-10-09",
  },
  "shift-calendar-alarm": {
    logo: "/products/shift-calendar-alarm/logo.png",
    logoAlt: "Shift Calendar Alarm",
    image: "/products/shift-calendar-alarm/preview.jpg",
    imageAlt: {
      en: "Shift Calendar Alarm showing a monthly shift calendar and synced upcoming iPhone alarms.",
      zh: "班表闹钟展示的月度轮班日历与已自动同步的 iPhone 原生闹钟列表。",
    },
    sourceUrl: "https://shift-calendar-alarm.pages.dev/",
    imageSourceUrl: "https://shift-calendar-alarm.pages.dev/assets/og/en.jpg",
    checkedAt: "2026-10-19",
  },
  yonaris: {
    logo: "/products/yonaris/logo.png",
    logoAlt: "Yonaris",
    image: "/products/yonaris/preview.png",
    imageAlt: {
      en: "Yonaris AI visibility dashboard comparing AI answers with product truth records.",
      zh: "Yonaris AI 可见度诊断界面，对照 AI 回答与结构化产品事实依据。",
    },
    sourceUrl: "https://yonaris.com/",
    checkedAt: "2026-10-19",
  },
  railmystery: {
    logo: "/products/railmystery/logo.png",
    logoAlt: "RailMystery",
    image: "/products/railmystery/preview.png",
    imageAlt: {
      en: "RailMystery’s official tabletop investigation terminal and mobile detective interface.",
      zh: "RailMystery 官方剧本杀推理解谜大屏终端与手机探员交互界面。",
    },
    sourceUrl: "https://railmystery.onrender.com/presale/",
    checkedAt: "2026-10-16",
  },
  pexo: {
    logo: "/products/pexo/logo.png",
    logoAlt: "Pexo",
    image: "/products/pexo/preview.webp",
    imageAlt: {
      en: "Pexo's official demonstration of commenting on a video, with a preview and timeline.",
      zh: "Pexo 官网演示画面：在视频预览和时间轴旁通过批注提出修改。",
    },
    sourceUrl: "https://pexo.ai/",
    imageSourceUrl: "https://pexo.ai/_next/static/media/refine.97b9dd69.webp",
    checkedAt: "2026-10-09",
  },
  tucky: {
    logo: "/products/tucky/logo.png",
    logoAlt: "Tucky",
    image: "/products/tucky/preview.webp",
    imageAlt: {
      en: "Tucky's official screenshot of an open note and other notes docked to the Mac screen edge.",
      zh: "Tucky 官网截图：桌面上展开的笔记，以及停靠在 Mac 屏幕边缘的其他笔记。",
    },
    sourceUrl: "https://tucky.io/",
    imageSourceUrl: "https://tucky.io/2.webp",
    checkedAt: "2026-10-09",
  },
  velozity: {
    logo: "/products/velozity/logo.png",
    logoAlt: "Velozity",
    image: "/products/velozity/preview.webp",
    imageAlt: {
      en: "Velozity's official product image showing a shared office with cabins for people and agents.",
      zh: "Velozity 官方产品图：人与 Agent 在包含独立房间的共享办公室中协作。",
    },
    sourceUrl: "https://getvelozity.com/",
    imageSourceUrl: "https://getvelozity.com/assets/meta/og-card-v3.png",
    checkedAt: "2026-10-09",
  },
  rill: {
    logo: "/products/rill/logo.png",
    logoAlt: "Rill Browser",
    image: "/products/rill/preview.webp",
    imageAlt: {
      en: "Rill's official browser screenshot with grouped tabs, project activity, and tasks from coding agents.",
      zh: "Rill 官网浏览器截图，展示分组标签页、项目活动与编程 Agent 的任务。",
    },
    sourceUrl: "https://rill.love/",
    imageSourceUrl: "https://rill.love/assets/shots/hero-1680.jpg",
    checkedAt: "2026-10-09",
  },
};
