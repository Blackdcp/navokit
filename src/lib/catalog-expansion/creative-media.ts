import type { ProductMedia } from "@/types/catalog";

/** Official public media; exact download URLs are recorded in docs/catalog-expansion-creative.md. */
export const creativeMedia: Record<string, ProductMedia> = {
  flora: {
    logo: "/products/flora/logo.png", logoAlt: "FLORA", image: "/products/flora/preview.webp",
    imageAlt: { en: "FLORA's official image showing an architectural sketch connected to a rendered variation on its creative canvas.", zh: "FLORA 官方展示图：在创意画布中将建筑草图连接到渲染版本。" },
    sourceUrl: "https://flora.ai/", imageSourceUrl: "https://flora.ai/marketing/KvFrB9O0c0Fi38F2FjdhcbC0.c03e2d97.png", checkedAt: "2026-10-09",
  },
  krev: {
    logo: "/products/krev/logo.png", logoAlt: "KREV", image: "/products/krev/preview.webp",
    imageAlt: { en: "KREV's official promotional image with examples of ecommerce campaign visuals.", zh: "KREV 官方宣传图，展示电商产品与活动视觉示例。" },
    sourceUrl: "https://www.krev.ai/", imageSourceUrl: "https://www.krev.ai/site/og.webp", checkedAt: "2026-10-09",
  },
  "aqua-voice": {
    logo: "/products/aqua-voice/logo.png", logoAlt: "Aqua Voice", image: "/products/aqua-voice/preview.webp",
    imageAlt: { en: "Aqua Voice's official introduction image for its voice dictation product.", zh: "Aqua Voice 官方语音听写产品介绍图。" },
    sourceUrl: "https://aquavoice.com/", imageSourceUrl: "https://aquavoice.com/og.png", checkedAt: "2026-10-09",
  },
  "willow-voice": {
    logo: "/products/willow-voice/logo.png", logoAlt: "Willow Voice", image: "/products/willow-voice/preview.webp",
    imageAlt: { en: "Willow Voice's official promotional image introducing voice dictation; performance wording belongs to the maker.", zh: "Willow Voice 官方语音听写宣传图，图中效率表述为厂商宣传。" },
    sourceUrl: "https://willowvoice.com/", imageSourceUrl: "https://framerusercontent.com/images/r5T99HtXhaeAwk3RmXFH0R99uBY.png", checkedAt: "2026-10-09",
  },
  sloyd: {
    logo: "/products/sloyd/logo.png", logoAlt: "Sloyd", image: "/products/sloyd/preview.webp",
    imageAlt: { en: "Sloyd's official image-to-3D example showing a green creature reference and two 3D model views.", zh: "Sloyd 官方图片转 3D 示例，展示绿色角色参考图与两个模型视图。" },
    sourceUrl: "https://www.sloyd.ai/", imageSourceUrl: "https://www.sloyd.ai/site-assets/6920396c6c7be3661adee331-6920396c6c7be3661adee331_Img-to-3d.avif", checkedAt: "2026-10-09",
  },
  "hyper3d-rodin": {
    logo: "/products/hyper3d-rodin/logo.webp", logoAlt: "Hyper3D", image: "/products/hyper3d-rodin/preview.webp",
    imageAlt: { en: "Hyper3D's official Rodin promotional image with examples of textured 3D objects.", zh: "Hyper3D 官方 Rodin 宣传图，展示多种带纹理的 3D 对象。" },
    sourceUrl: "https://hyper3d.ai/", imageSourceUrl: "https://storage.deemos.dev/assets/og-banner.png", checkedAt: "2026-10-09",
  },
  "mochi-desktop-pet": {
    logo: "/products/mochi-desktop-pet/logo.png", logoAlt: "Mochi Desktop Pet", image: "/products/mochi-desktop-pet/preview.webp",
    imageAlt: { en: "Mochi's creator-provided demonstration showing the pink desktop pet commenting beside a code editor.", zh: "Mochi 作者提供的演示图：粉色桌面宠物在代码编辑器旁作出回应。" },
    sourceUrl: "https://nickmorefun.itch.io/mochi", imageSourceUrl: "https://img.itch.zone/aW1hZ2UvNTA1NTY1Ni8zMDI3NTUwOC5wbmc=/original/4H2AeS.png", checkedAt: "2026-10-09",
  },
  airi: {
    logo: "/products/airi/logo.png", logoAlt: "Project AIRI", image: "/products/airi/preview.webp",
    imageAlt: { en: "Project AIRI's official introduction image with its logo and a blue-haired virtual character.", zh: "Project AIRI 官方介绍图，包含项目标志与蓝发虚拟角色。" },
    sourceUrl: "https://airi.moeru.ai/docs/en/", imageSourceUrl: "https://airi.moeru.ai/docs/open-graph.png", checkedAt: "2026-10-09",
  },
};
