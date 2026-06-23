export interface Category {
  id: string;
  name: string;
  nameZh?: string;
  nameEn?: string;
  iconName: string;
}

export const categories: Category[] = [
  { id: "ai_generation", name: "AI 生成", nameZh: "AI 生成", nameEn: "AI Generation", iconName: "cpu" },
  { id: "doc_tools", name: "文档工具", nameZh: "文档工具", nameEn: "Document Tools", iconName: "file-text" },
  { id: "content_tools", name: "创作工具", nameZh: "创作工具", nameEn: "Creator Tools", iconName: "pen-tool" }
];
