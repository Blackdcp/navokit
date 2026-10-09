import type { ProductMedia } from "@/types/catalog";

/** Official imagery; exact logo sources are recorded in docs/catalog-expansion-builders.md. */
export const builderMedia: Record<string, ProductMedia> = {
  "onlook": {
    "logo": "/products/onlook/logo.png",
    "logoAlt": "Onlook",
    "image": "/products/onlook/preview.webp",
    "imageAlt": {
      "en": "An official Onlook interface screenshot showing the visual editor beside a web page.",
      "zh": "Onlook 官方界面截图，展示网页旁的可视化编辑器。"
    },
    "sourceUrl": "https://www.onlook.com/",
    "imageSourceUrl": "https://raw.githubusercontent.com/onlook-dev/onlook/main/docs/public/images/onlook-interface.png",
    "checkedAt": "2026-10-09"
  },
  "sim": {
    "logo": "/products/sim/logo.png",
    "logoAlt": "Sim",
    "image": "/products/sim/preview.webp",
    "imageAlt": {
      "en": "Sim’s official workflow editor screenshot with an empty canvas and workspace navigation.",
      "zh": "Sim 官方工作流编辑器截图，展示空白画布与工作空间导航。"
    },
    "sourceUrl": "https://docs.sim.ai/introduction",
    "imageSourceUrl": "https://docs.sim.ai/static/introduction.png?dpl=dpl_97jVbYyNq22hj8qW5iWXUAsiQ8RP",
    "checkedAt": "2026-10-09"
  },
  "omi": {
    "logo": "/products/omi/logo.png",
    "logoAlt": "Omi",
    "image": "/products/omi/preview.webp",
    "imageAlt": {
      "en": "Omi’s official product photograph of its wearable pendant.",
      "zh": "Omi 官方可穿戴吊坠产品照片。"
    },
    "sourceUrl": "https://www.omi.me/",
    "imageSourceUrl": "https://cdn.shopify.com/s/files/1/0879/7490/4100/files/omi-hero-wide-v3.webp",
    "checkedAt": "2026-10-09"
  },
  "looki-l1": {
    "logo": "/products/looki-l1/logo.png",
    "logoAlt": "Looki",
    "image": "/products/looki-l1/preview.webp",
    "imageAlt": {
      "en": "Looki’s official lifestyle image showing its camera worn on a shirt and a companion-app recap.",
      "zh": "Looki 官方生活场景图，展示佩戴在衣服上的相机与配套应用回顾。"
    },
    "sourceUrl": "https://www.looki.ai/",
    "imageSourceUrl": "https://www.looki.ai/cdn/shop/files/Homepage-KV_PC_webp.webp?v=1783654692&width=1600",
    "checkedAt": "2026-10-09"
  },
  "rosebud-ai": {
    "logo": "/products/rosebud-ai/logo.png",
    "logoAlt": "Rosebud AI",
    "image": "/products/rosebud-ai/preview.webp",
    "imageAlt": {
      "en": "Rosebud AI’s official promotional image with a game preview beside its creator interface.",
      "zh": "Rosebud AI 官方宣传图，展示游戏预览与创作界面。"
    },
    "sourceUrl": "https://rosebud.ai/",
    "imageSourceUrl": "https://rosebud.ai/_next/static/media/rosebud-og-img.1yqlqo5pvhv8-.jpg",
    "checkedAt": "2026-10-09"
  },
  "odyssey": {
    "logo": "/products/odyssey/logo.png",
    "logoAlt": "Odyssey",
    "image": "/products/odyssey/preview.webp",
    "imageAlt": {
      "en": "Odyssey’s official brand artwork used by its world-model website.",
      "zh": "Odyssey 世界模型官网使用的官方品牌展示图。"
    },
    "sourceUrl": "https://odyssey.systems/",
    "imageSourceUrl": "https://framerusercontent.com/images/Ztmb5fzsBj2oaVgWRUqBnP4yRU.jpg",
    "checkedAt": "2026-10-09"
  },
  "granola": {
    "logo": "/products/granola/logo.png",
    "logoAlt": "Granola",
    "image": "/products/granola/preview.webp",
    "imageAlt": {
      "en": "Granola’s official image of a meeting note beside a video call and transcription indicator.",
      "zh": "Granola 官方展示图：视频会议旁的笔记与转写状态。"
    },
    "sourceUrl": "https://www.granola.ai/",
    "imageSourceUrl": "https://www.granola.ai/homepageAssets/features/feature-humans.webp",
    "checkedAt": "2026-10-09"
  }
};
