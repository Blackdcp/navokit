export interface WorkflowRail {
  id: string;
  label: string;
  description: string;
  href: string;
  order?: number;
  toolIds?: string[];
  showInHome?: boolean;
  showInBlog?: boolean;
}
