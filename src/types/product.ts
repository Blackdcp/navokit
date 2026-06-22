export interface Product {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  subtitle: string;
  price: number;
  originalPriceText?: string;
  originalPriceNote?: string;
  tags: string[];
  warnings: string[];
  deliveryNotice: string;
  features: string[];
  inStock: boolean;
  buyButtonText: string;
  orderName: string; // The name used in the order modal
  isHot?: boolean;
  actionType?: "buy" | "consult" | "link";
  linkUrl?: string;
}
