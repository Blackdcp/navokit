import type { Tool, ToolAccent } from "../types/tool";

export interface ToolGroup {
  categoryId: string;
  categoryName: string;
  anchor: string;
  tools: Tool[];
}

const fallbackAccents: ToolAccent[] = ["blue", "green", "yellow"];
const fallbackIcons = ["▶", "▧", "✎", "◇", "↗", "✓"];

export function stripHtml(value: string) {
  return value.replace(/<[^>]*>?/gm, "");
}

export function categoryAnchor(categoryId: string) {
  return categoryId
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function groupToolsByCategory(tools: Tool[]): ToolGroup[] {
  const groups = new Map<string, ToolGroup>();

  tools.forEach(tool => {
    const existing = groups.get(tool.categoryId);

    if (existing) {
      existing.tools.push(tool);
      return;
    }

    groups.set(tool.categoryId, {
      categoryId: tool.categoryId,
      categoryName: tool.categoryName,
      anchor: categoryAnchor(tool.categoryId),
      tools: [tool],
    });
  });

  return Array.from(groups.values());
}

export function getToolAccent(tool: Tool, index: number): ToolAccent {
  return tool.homeAccent ?? fallbackAccents[index % fallbackAccents.length];
}

export function getToolIcon(tool: Tool, index: number): string {
  return tool.homeIcon ?? fallbackIcons[index % fallbackIcons.length];
}
