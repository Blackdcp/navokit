import Image from "next/image";
import { Clapperboard, FileImage, Shapes, WandSparkles } from "lucide-react";
import { productMedia } from "@/lib/productMedia";
import type { CatalogProduct } from "@/types/catalog";
import "./catalog.css";

export function ProductLogo({
  product,
  size = 48,
  className = "",
}: {
  product: CatalogProduct;
  size?: number;
  className?: string;
}) {
  const media = productMedia[product.slug];
  const UtilityIcon = product.slug === "markdown-to-image"
    ? FileImage
    : product.slug === "ai-social-booster"
      ? WandSparkles
      : product.slug === "free-ai-video-generator"
        ? Clapperboard
        : Shapes;

  return (
    <span className={`cat-product-logo ${media?.logo ? "cat-product-logo--official" : "cat-product-logo--utility"} ${className}`} style={{ width: size, height: size }}>
      {media?.logo ? (
        <Image src={media.logo} alt={media.logoAlt ?? product.name} width={size} height={size} sizes={`${size}px`} />
      ) : (
        <UtilityIcon size={Math.round(size * .46)} strokeWidth={1.65} aria-hidden="true" />
      )}
    </span>
  );
}

export default ProductLogo;
