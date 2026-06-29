export type ToolContentItem = { title: string; text: string };
export type ToolContentLink = { title: string; description: string; href: string };

export interface ToolPageContentData {
  eyebrow: string;
  howTitle: string;
  steps: ToolContentItem[];
  useCases: ToolContentItem[];
  examples?: ToolContentItem[];
  limitations?: ToolContentItem[];
  privacy: string;
  faqs: ToolContentItem[];
  related: ToolContentLink[];
  guide?: ToolContentLink;
}
