import fs from "fs";
import path from "path";
import type { Tool } from "../types/tool";

export function getTools(lang: "zh" | "en"): Tool[] {
  const dirPath = path.join(process.cwd(), "src", "content", "tools", lang);

  if (!fs.existsSync(dirPath)) {
    if (lang === "en") {
      return getTools("zh");
    }
    return [];
  }

  const tools = fs
    .readdirSync(dirPath)
    .filter(name => name.endsWith(".json"))
    .map(fileName => {
      const filePath = path.join(dirPath, fileName);
      const fileContents = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileContents) as Tool;
    });

  return tools.sort((a, b) => (a.homePriority ?? 999) - (b.homePriority ?? 999));
}

export function getToolBySlug(lang: "zh" | "en", slug: string): Tool | null {
  const tools = getTools(lang);
  return tools.find(tool => tool.id === slug) ?? null;
}
