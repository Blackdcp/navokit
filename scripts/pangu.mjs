import fs from "node:fs";
import path from "node:path";

const dir = "src/content/tools/zh";
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(file => file.endsWith(".json")) : [];

const regex1 = /([\u4e00-\u9fa5])([a-zA-Z0-9])/g;
const regex2 = /([a-zA-Z0-9])([\u4e00-\u9fa5])/g;

function addSpacing(item) {
  if (typeof item === "string") {
    return item.replace(regex1, "$1 $2").replace(regex2, "$1 $2");
  }

  if (Array.isArray(item)) {
    return item.map(addSpacing);
  }

  if (typeof item === "object" && item !== null) {
    return Object.fromEntries(Object.entries(item).map(([key, value]) => [key, addSpacing(value)]));
  }

  return item;
}

for (const file of files) {
  const filePath = path.join(dir, file);
  const tool = JSON.parse(fs.readFileSync(filePath, "utf8"));
  fs.writeFileSync(filePath, `${JSON.stringify(addSpacing(tool), null, 2)}\n`);
}

console.log("Pangu spacing applied to zh tool content.");
