import Image from "next/image";
import { productMedia } from "@/lib/productMedia";
import type { CatalogProduct, Locale } from "@/types/catalog";
import ProductLogo from "./ProductLogo";

export function TopicVisual({ products, lang, className = "", compact = false }: {
  products: CatalogProduct[];
  lang: Locale;
  className?: string;
  compact?: boolean;
}) {
  const useLogoCollection = products.filter(product => product.internalPath).length > 1;
  const featured = useLogoCollection ? undefined : products.find(product => productMedia[product.slug]?.image);
  const media = featured ? productMedia[featured.slug] : undefined;
  const visible = products.slice(0, useLogoCollection ? 4 : 3);
  if (!visible.length) return null;

  return <div className={`cat-topic-visual ${media?.image ? `cat-topic-visual--image cat-topic-visual--${featured!.slug}` : "cat-topic-visual--tools"} ${compact ? "cat-topic-visual--compact" : ""} ${className}`}>
    {media?.image && <div className="cat-topic-screen"><Image src={media.image} alt={media.imageAlt?.[lang] ?? featured!.name} fill sizes="(max-width: 520px) calc(100vw - 32px), (max-width: 1000px) 50vw, 560px" /></div>}
    <div className="cat-topic-visual-products">
      {visible.map(product => <div className="cat-topic-visual-product" key={product.slug}>
        <ProductLogo product={product} size={56} />
        {!media?.image && !compact && <span>{product.name}</span>}
      </div>)}
    </div>
  </div>;
}

export default TopicVisual;
