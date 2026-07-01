export type ToolContentItem = { title: string; text: string };
export type ToolContentLink = { title: string; description: string; href: string };
export type ToolFact = { label: string; value: string };
export type ToolExampleImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};
export type ToolExampleVideo = {
  src: string;
  title: string;
  width: number;
  height: number;
};
export type ToolExample = {
  title: string;
  inputLabel?: string;
  input: string;
  outputLabel?: string;
  output?: string;
  image?: ToolExampleImage;
  video?: ToolExampleVideo;
  note?: string;
};
export type ToolExampleType = "markdown" | "video" | "social";

export interface ToolPageContentData {
  eyebrow: string;
  howTitle: string;
  facts?: ToolFact[];
  steps: ToolContentItem[];
  useCases: ToolContentItem[];
  exampleType?: ToolExampleType;
  examples?: ToolExample[];
  limitations?: ToolContentItem[];
  privacy: string;
  faqs: ToolContentItem[];
  related: ToolContentLink[];
  guide?: ToolContentLink;
  guides?: ToolContentLink[];
}
