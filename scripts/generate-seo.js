const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const API_KEY = 'sk-hQe8X3F1rnujEclYAuRgZEYWEGgZ5B7Gvs9H0Pe964k7nbxg';
const BASE_URL = 'apihub.agnes-ai.com';
const MODEL = 'agnes-2.0-flash';
const BLOG_DIR_ZH = path.join(__dirname, '..', 'src', 'content', 'blog', 'zh', 'seo-batch');
const BLOG_DIR_EN = path.join(__dirname, '..', 'src', 'content', 'blog', 'en', 'seo-batch');

// Ensure directories exist
if (!fs.existsSync(BLOG_DIR_ZH)) fs.mkdirSync(BLOG_DIR_ZH, { recursive: true });
if (!fs.existsSync(BLOG_DIR_EN)) fs.mkdirSync(BLOG_DIR_EN, { recursive: true });

// Example list of keywords to target (Focusing on Tools and Marketing)
const TARGET_KEYWORDS = [
  "2026年海外社交媒体爆款涨粉实操指南",
  "如何免费在线将 PPT 转为无损高清 PDF？",
];

async function generateContent(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (d) => { chunks.push(d); });
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode !== 200) {
          return reject(new Error(`API Error: ${res.statusCode} - ${body}`));
        }
        try {
          const parsed = JSON.parse(body);
          const content = parsed.choices[0].message.content;
          resolve(content);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function generateArticle(keyword) {
  console.log(`\nGenerating SEO articles for keyword: ${keyword}...`);
  
  try {
    const promptZH = `
你是一个专业的 SEO 内容营销专家。请为关键词 "${keyword}" 写一篇长度约 800 字的高质量中文博客文章。
要求：
1. 必须使用 Markdown 格式。
2. 包含一个吸引人的主标题 (# ) 和若干副标题 (## )。
3. 内容必须要真实、有价值、逻辑清晰，排版精美（可以使用粗体、列表等）。符合中国国内用户的阅读习惯。
4. 不要输出任何开场白或解释语，直接输出 Markdown 源码。
5. 在文章的最后，非常自然地引导用户去使用我们网站提供的无风险服务（如：免费的在线工具，或者极其高性价比的海外社媒真人涨粉服务）。
`;

    const promptEN = `
You are a professional SEO Content Marketing Expert. Please write a high-quality, engaging English blog post of around 800 words related to the topic/keyword: "${keyword}".
Requirements:
1. Must be in Markdown format.
2. Include a catchy H1 title (# ) and several H2 subheadings (## ).
3. The content must be authentic, highly valuable, clearly structured, and beautifully formatted (using bolding, bullet points, etc.). The tone should perfectly match the reading habits of a Western/Global audience (e.g., concise, actionable, and engaging).
4. Do NOT output any introductory or conversational remarks; output ONLY the raw Markdown content.
5. At the very end of the article, include a natural Call To Action (CTA) directing users to use our website's risk-free services (such as our free online productivity tools, or our highly effective organic social media follower growth services).
`;

    // Generate in parallel
    const [contentZH, contentEN] = await Promise.all([
      generateContent(promptZH),
      generateContent(promptEN)
    ]);
    
    // Save ZH version
    const slug = keyword.replace(/[\s\？\?]/g, '-').toLowerCase();
    const date = new Date().toISOString().split('T')[0];
    
    const zhDescription = `${keyword} 的全面实战解析与高效工具推荐，提升您的生产力。`;
    const zhMarkdown = `---\ntitle: "${keyword}"\ndescription: "${zhDescription}"\ndate: "${date}"\n---\n\n${contentZH}\n`;
    fs.writeFileSync(path.join(BLOG_DIR_ZH, `${slug}.md`), zhMarkdown, 'utf8');
    console.log(`✅ Saved ZH version: ${slug}.md`);

    // Extract English title for the EN slug
    const enTitleMatch = contentEN.match(/^#\s+(.+)$/m);
    const enTitle = enTitleMatch ? enTitleMatch[1].replace(/["']/g, '') : "SEO Guide";
    const enSlug = enTitle.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase();
    
    const enDescription = `A comprehensive guide and practical tips for ${enTitle}. Boost your productivity and reach.`;
    const enMarkdown = `---\ntitle: "${enTitle}"\ndescription: "${enDescription}"\ndate: "${date}"\n---\n\n${contentEN}\n`;
    fs.writeFileSync(path.join(BLOG_DIR_EN, `${enSlug}.md`), enMarkdown, 'utf8');
    console.log(`✅ Saved EN version: ${enSlug}.md`);

  } catch (error) {
    console.error(`❌ Failed to generate articles for "${keyword}":`, error.message);
  }
}

async function main() {
  for (const keyword of TARGET_KEYWORDS) {
    await generateArticle(keyword);
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log("All dual-language SEO articles generated! Commit and push to Vercel to publish them.");
}

main().catch(console.error);
