export type ToolAccent = "blue" | "green" | "yellow";

export type ToolStatus = "available" | "limited" | "coming_soon";

export interface Tool {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  subtitle: string;
  tags: string[];
  features: string[];
  status: ToolStatus;
  provider?: string;
  processingNote?: string;
  limitationNote?: string;
  isFeatured?: boolean;
  homePriority?: number;
  homeAccent?: ToolAccent;
  homeIcon?: string;
  homePreviewTitle?: string;
  homePreviewText?: string;
  homePreviewMeta?: string;
}
