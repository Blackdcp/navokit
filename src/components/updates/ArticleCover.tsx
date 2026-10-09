import Image from "next/image";
import type { CSSProperties } from "react";
import { getArticleCover } from "../../lib/articleCovers";
import "./article-cover.css";

export default function ArticleCover({ slug, lang, title, className = "", compact = false, thumbnail = false, priority = false }: {
  slug: string;
  lang: "en" | "zh";
  title?: string;
  className?: string;
  compact?: boolean;
  thumbnail?: boolean;
  priority?: boolean;
}) {
  const cover = getArticleCover(slug, lang);
  return (
    <div
      className={`article-cover${compact ? " article-cover--compact" : ""}${thumbnail ? " article-cover--thumbnail" : ""} ${className}`.trim()}
      data-cover-theme={cover.theme}
      style={{ "--cover-background": cover.background, "--cover-ink": cover.ink } as CSSProperties}
      role="img"
      aria-label={title ? `${title} — ${cover.alt}` : cover.alt}
    >
      <Image className="article-cover__art" src={cover.src} alt="" aria-hidden="true" width={1200} height={750} loading={priority ? "eager" : "lazy"} unoptimized />
      <div className="article-cover__caption" aria-hidden="true">
        <span>{cover.eyebrow}</span>
        <strong>{cover.label}</strong>
      </div>
      <span className="article-cover__corner" aria-hidden="true">↗</span>
    </div>
  );
}
