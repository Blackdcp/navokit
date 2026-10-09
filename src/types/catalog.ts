export type Locale = "en" | "zh";

export type ProductCategoryId =
  | "assistants" | "image-design" | "video" | "audio" | "coding"
  | "search-research" | "knowledge-management" | "writing" | "hardware"
  | "companions" | "agents-automation" | "productivity" | "3d-generation"
  | "research" | "other";

export interface CatalogProduct {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  website: string;
  repository?: string;
  kind: "app" | "api" | "open-source" | "hardware" | "utility";
  pricing: "free" | "freemium" | "paid" | "varies";
  topicIds: string[];
  categoryIds: ProductCategoryId[];
  features: string[];
  icon: string;
  accent: string;
  addedAt?: string;
  verifiedAt?: string;
  /** Date of the linked Product Hunt launch record, not the first product release. */
  launchDate?: string;
  launchSource?: string;
  platforms?: string[];
  bestFor?: string;
  requirements?: string;
  internalPath?: string;
  sourceUrls: string[];
}

export type ProductCopy = Pick<CatalogProduct, "name" | "tagline" | "description" | "features" | "bestFor" | "requirements">;
export type ProductEntry = Omit<CatalogProduct, keyof ProductCopy> & Record<Locale, ProductCopy>;

export interface ProductMedia {
  logo?: string;
  logoAlt?: string;
  image?: string;
  imageAlt?: Record<Locale, string>;
  sourceUrl: string;
  imageSourceUrl?: string;
  checkedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  kicker: string;
  icon: string;
  accent: string;
}

export interface ProductCategory {
  id: ProductCategoryId;
  name: string;
  description: string;
}
