import type { BlogSource } from "../../lib/blog";

/** Keep navigation and citation extraction separate from the unchanged Markdown. */
function proseLines(markdown: string): { text: string; line: number }[] {
  let fence: { marker: string; length: number } | undefined;
  return markdown.split("\n").flatMap((text, index) => {
    const marker = text.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = { marker: marker[1][0], length: marker[1].length };
      else if (marker[1][0] === fence.marker && marker[1].length >= fence.length && /^ {0,3}(`+|~+)\s*$/.test(text)) fence = undefined;
      return [];
    }
    return fence ? [] : [{ text, line: index + 1 }];
  });
}

function plainText(value: string) {
  return value.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").trim();
}

export function getArticleHeadings(markdown: string) {
  const usedIds = new Set<string>();
  return proseLines(markdown).flatMap(({ text, line }) => {
    const match = text.match(/^ {0,3}(#{1,6})[ \t]+(.+)$/);
    if (!match) return [];
    const title = plainText(match[2].replace(/[ \t]+#+[ \t]*$/, ""));
    const base = `section-${title.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "heading"}`;
    let id = base;
    let occurrence = 1;
    while (usedIds.has(id)) id = `${base}-${++occurrence}`;
    usedIds.add(id);
    return [{ id, title, line, depth: match[1].length }];
  });
}

type ArticleLink = BlogSource & { hostname: string };

function linksFromLines(lines: { text: string }[]): ArticleLink[] {
  const links = new Map<string, { url: string; title: string; hostname: string }>();
  for (const { text } of lines) {
    for (const match of text.matchAll(/(?<!!)\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)/g)) {
      try {
        // Complex Markdown destinations remain linked in the article. Avoid
        // manufacturing a truncated citation from nested parentheses or escapes.
        if (/[()\\<>]/.test(match[2])) continue;
        const url = new URL(match[2]);
        if (url.hostname === "navokit.com" || url.hostname.endsWith(".navokit.com")) continue;
        if (!links.has(url.href)) links.set(url.href, { url: url.href, title: plainText(match[1]) || url.hostname, hostname: url.hostname.replace(/^www\./, "") });
      } catch {
        // Preserve the original Markdown while excluding malformed links here.
      }
    }
  }
  return [...links.values()];
}

export function getArticleLinks(markdown: string) {
  return linksFromLines(proseLines(markdown));
}

/** Only an explicit source list is a citation; a product or CTA link is not. */
export function getArticleReferences(markdown: string, sources: BlogSource[] = []): ArticleLink[] {
  let referenceDepth: number | undefined;
  const referenceLines = proseLines(markdown).filter(({ text }) => {
    const heading = text.match(/^ {0,3}(#{1,6})[ \t]+(.+)$/);
    if (heading) {
      const title = plainText(heading[2]).replace(/[ \t]+#+[ \t]*$/, "").replace(/^\d+[.)、]\s*/, "").replace(/[:：]\s*$/, "");
      if (/^(references|sources|source links|参考资料|参考文献|参考来源|资料来源|来源)$/i.test(title)) referenceDepth = heading[1].length;
      else if (referenceDepth && heading[1].length <= referenceDepth) referenceDepth = undefined;
      return false;
    }
    return referenceDepth !== undefined;
  });
  const references = new Map<string, ArticleLink>();
  for (const source of sources) {
    try {
      const url = new URL(source.url);
      if (!["http:", "https:"].includes(url.protocol)) continue;
      references.set(url.href, { ...source, url: url.href, hostname: url.hostname.replace(/^www\./, "") });
    } catch {
      // Invalid source metadata is not published as a citation.
    }
  }
  for (const reference of linksFromLines(referenceLines)) references.set(reference.url, reference);
  return [...references.values()];
}
