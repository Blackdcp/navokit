import Image from "next/image";
import { productMedia } from "@/lib/productMedia";
import type { CatalogProduct, Locale } from "@/types/catalog";
import "./catalog.css";

export function ProductVisual({
  product,
  lang,
  className = "",
  sizes = "(max-width: 520px) calc(100vw - 32px), (max-width: 780px) 50vw, 360px",
  eager = false,
  showCaption = false,
}: {
  product: CatalogProduct;
  lang: Locale;
  className?: string;
  sizes?: string;
  eager?: boolean;
  showCaption?: boolean;
}) {
  const media = productMedia[product.slug];
  if (!media?.image) return null;

  const visual = <div className={`cat-product-visual cat-product-visual--${product.slug} ${className}`}>
    <Image
      src={media.image}
      alt={media.imageAlt?.[lang] ?? product.name}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
    />
  </div>;

  if (!showCaption) return visual;
  return <figure className="cat-product-figure">
    {visual}
    <figcaption>
      <span>
        {product.internalPath
          ? (lang === "zh" ? "工具示例画面" : "NavoKit tool example")
          : (lang === "zh" ? "官方产品配图" : "Official product image")}
      </span>
      <span>{lang === "zh" ? "采集于" : "Captured"} <time dateTime={media.checkedAt}>{media.checkedAt}</time></span>
    </figcaption>
  </figure>;
}

export default ProductVisual;
