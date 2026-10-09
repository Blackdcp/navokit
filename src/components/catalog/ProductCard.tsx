import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProductCategories, getProductHref, getProductKindLabel } from "@/lib/catalog";
import type { CatalogProduct, Locale } from "@/types/catalog";
import ProductLogo from "./ProductLogo";
import ProductVisual from "./ProductVisual";
import { productMedia } from "@/lib/productMedia";
import "./catalog.css";

export function ProductCard({ product, lang }: { product: CatalogProduct; lang: Locale }) {
  const category = getProductCategories(lang).find(item => item.id === product.categoryIds[0]);
  return (
    <Link href={getProductHref(product, lang)} className={`cat-product-card ${productMedia[product.slug]?.image ? "cat-product-card--illustrated" : "cat-product-card--compact"}`}>
      <ProductVisual product={product} lang={lang} />
      <div className="cat-card-body">
        <div className="cat-card-top">
          <ProductLogo product={product} />
          <div className="cat-card-heading"><h3>{product.name}</h3><span>{product.internalPath ? getProductKindLabel(product.kind, lang) : category?.name ?? getProductKindLabel(product.kind, lang)}</span></div>
          <ArrowUpRight className="cat-card-arrow" size={18} aria-hidden="true" />
        </div>
        <p>{product.tagline}</p>
        <div className="cat-card-footer"><span>{product.platforms?.length ? product.platforms.join(" · ") : getProductKindLabel(product.kind, lang)}</span><span className="cat-card-cta">{lang === "zh" ? (product.internalPath ? "打开工具" : "认识这个产品") : (product.internalPath ? "Open tool" : "Take a closer look")}<span aria-hidden="true">→</span></span></div>
      </div>
    </Link>
  );
}

export default ProductCard;
