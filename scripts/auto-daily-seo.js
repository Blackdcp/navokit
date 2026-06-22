const fs = require('fs');
const path = require('path');
const https = require('https');
const Parser = require('rss-parser');
const parser = new Parser();

const AGNES_API_KEY = process.env.AGNES_API_KEY || 'sk-hQe8X3F1rnujEclYAuRgZEYWEGgZ5B7Gvs9H0Pe964k7nbxg';
const BASE_URL = 'https://apihub.agnes-ai.com/v1';

async function generateAIContent(topic, language) {
  return new Promise((resolve, reject) => {
    let prompt = '';
    
    if (language === 'zh') {
      prompt = `你是一个顶尖的全球社媒营销专家和技术博主。请根据最新AI热点：【${topic}】，写一篇深度、干货、能吸引大量流量的中文SEO文章。
要求：
1. 第一行必须是一个极具吸引力、带悬念和情感价值的 H1 标题 (# 标题)。
2. 文章结构清晰，有若干 H2 子标题 (## 标题)。
3. 在文章中，极其自然地结合我们网站的业务（如：社交媒体爆款文案生成器、社媒真实涨粉服务、ChatGPT等AI工具代充服务），作为落地实操的工具推荐。
4. 结尾包含极强的 Call to Action（行为号召），引导用户使用我们网站的服务。
5. 必须使用标准、纯净的 Markdown 语法。严禁出现排版错乱、乱码或嵌套错误的标点（比如绝对不要写成 **"文本"** 或 "#标题"），加粗文本直接使用 **文本**。`;
    } else {
      prompt = `You are a top-tier global social media marketing expert and tech blogger. Based on the latest AI news: [${topic}], write an in-depth, actionable, highly viral SEO article in English.
Requirements:
1. The first line MUST be an extremely catchy, viral-style H1 title (# Title).
2. Well-structured with several H2 subheadings (## Subheading).
3. Naturally seamlessly integrate our website's services (e.g., Viral Social Media Post Generator, Real Social Media Followers Growth Service, AI Tool subscriptions/APIs) as recommended actionable tools.
4. End with a strong Call to Action (CTA) encouraging users to try our services.
5. You MUST use standard, clean Markdown formatting. Do not use messy punctuation inside bold text (e.g., never use **"text"**), simply use **text**. Tone must be actionable, energetic, and highly professional.`;
    }

    const payload = JSON.stringify({
      model: 'agnes-2.0-flash',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const options = {
      hostname: 'apihub.agnes-ai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AGNES_API_KEY}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const bodyStr = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode !== 200) {
          reject(new Error(`API Error: ${res.statusCode} ${bodyStr}`));
          return;
        }
        try {
          const data = JSON.parse(bodyStr);
          resolve(data.choices[0]?.message?.content || '');
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${bodyStr}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function saveArticle(content, lang) {
  const isZH = lang === 'zh';
  const matchTitle = isZH ? content.match(/^#\s+(.+)$/m) : content.match(/^#\s+(.+)$/m);
  let title = matchTitle ? matchTitle[1].trim() : (isZH ? "今日热点分析" : "Daily Hot Topic Analysis");
  title = title.replace(/["*]/g, ''); // Clean basic markdown syntax from title
  
  // Remove the H1 title from the content to avoid duplicate titles in the rendered page
  if (matchTitle) {
    content = content.replace(matchTitle[0], '').trim();
  }
  
  let filename = '';
  if (isZH) {
    filename = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').toLowerCase() + '.md';
  } else {
    filename = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '.md';
  }
  filename = filename.replace(/-+/g, '-').replace(/^-|-$/g, ''); // deduplicate dashes
  if (!filename || filename === '.md') {
    filename = `seo-article-${Date.now()}.md`;
  }

  const today = new Date().toISOString().split('T')[0];
  const markdownContent = `---
title: "${title}"
description: "${isZH ? title + ' 的全面实战解析与高效工具推荐。' : 'In-depth analysis and tools for ' + title}"
date: "${today}"
---

${content}
`;

  const dirPath = path.join(process.cwd(), 'src', 'content', 'blog', lang, 'seo-batch');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const fullPath = path.join(dirPath, filename);
  fs.writeFileSync(fullPath, markdownContent, 'utf8');
  console.log(`✅ Saved ${lang.toUpperCase()} version: ${filename}`);
}

async function main() {
  try {
    console.log("Fetching AI Hot HTML...");
    const res = await fetch(`https://aihot.virxact.com/?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch HTML: ${res.status}`);
    }
    
    const html = await res.text();
    // Extract JSON-LD that contains ItemList
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">({[^<]*"ItemList"[^<]*})<\/script>/);
    let topItems = [];
    
    if (jsonLdMatch && jsonLdMatch[1]) {
      try {
        const data = JSON.parse(jsonLdMatch[1]);
        if (data.itemListElement && Array.isArray(data.itemListElement)) {
          topItems = data.itemListElement.slice(0, 2).map(item => ({ title: item.name }));
        }
      } catch (e) {
        console.error("Failed to parse JSON-LD", e);
      }
    }
    
    if (topItems.length === 0) {
      console.log("No items found in HTML JSON-LD.");
      return;
    }

    console.log(`Found ${topItems.length} trending topics. Generating SEO articles...`);

    for (const item of topItems) {
      console.log(`\n--- Processing Topic: ${item.title} ---`);
      
      console.log("Generating ZH article...");
      const contentZH = await generateAIContent(item.title, 'zh');
      saveArticle(contentZH, 'zh');
      
      console.log("Generating EN article...");
      const contentEN = await generateAIContent(item.title, 'en');
      saveArticle(contentEN, 'en');
    }

    console.log("\nAll automated SEO tasks completed successfully!");
  } catch (error) {
    console.error("Fatal Error:", error);
    process.exit(1);
  }
}

main();
