export type ToolContentItem = { title: string; text: string };
export type ToolContentLink = { title: string; description: string; href: string };
export type ToolFact = { label: string; value: string };

export interface ToolPageContentData {
  eyebrow: string;
  howTitle: string;
  facts?: ToolFact[];
  steps: ToolContentItem[];
  useCases: ToolContentItem[];
  examples?: ToolContentItem[];
  limitations?: ToolContentItem[];
  privacy: string;
  faqs: ToolContentItem[];
  related: ToolContentLink[];
  guide?: ToolContentLink;
}
