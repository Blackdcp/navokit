import fs from "fs";
import path from "path";
import type { WorkflowRail } from "../types/workflow";

export function getWorkflowRails(lang: "en" | "zh"): WorkflowRail[] {
  const filePath = path.join(process.cwd(), "src", "content", "workflows", `${lang}.json`);

  if (!fs.existsSync(filePath)) {
    if (lang === "zh") {
      return getWorkflowRails("en");
    }
    return [];
  }

  const rails = JSON.parse(fs.readFileSync(filePath, "utf8")) as WorkflowRail[];
  return rails.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
