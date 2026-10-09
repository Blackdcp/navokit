import type { Locale, ProductCategoryId } from "@/types/catalog";

export function getCategoryHref(id: ProductCategoryId, lang: Locale) {
  return `/${lang}/categories/${id}`;
}
