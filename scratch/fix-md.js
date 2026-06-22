const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, '../src/content/blog/zh/seo-batch'),
  path.join(__dirname, '../src/content/blog/en/seo-batch')
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Split into frontmatter and body
    const parts = content.split('---');
    if (parts.length >= 3) {
      let body = parts.slice(2).join('---');
      // Remove the leading H1 title if present
      body = body.replace(/^\s*#\s+[^\n]+\n+/, '\n');
      
      // Fix **"text"** or "**text**" issues to just **text** or "**text**" properly
      body = body.replace(/\*\*"([^"]+)"\*\*/g, '**$1**');
      body = body.replace(/"\*\*([^*]+)\*\*"/g, '**$1**');
      
      // Fix messy triple quotes or double chinese quotes often used by LLMs to wrap prompts
      body = body.replace(/“{2,3}([^”]+)”{2,3}/g, '“$1”');
      body = body.replace(/\"{2,3}([^\"]+)\"{2,3}/g, '"$1"');
      body = body.replace(/>\s*“{2,3}([\s\S]*?)”{2,3}/g, '> “$1”');
      body = body.replace(/>\s*\"{2,3}([\s\S]*?)\"{2,3}/g, '> "$1"');
      
      // Also general cleanup for the specific messy strings
      body = body.replace(/“{2,}/g, '“');
      body = body.replace(/”{2,}/g, '”');
      body = body.replace(/\"{3,}/g, '"');
      body = body.replace(/\'{3,}/g, "'");

      // Replace placeholder
      body = body.replace(/\[你的网站名称\]/g, '橙子 AI');
      body = body.replace(/\[Your Website Name\]/g, 'Chengzi AI');
      
      content = '---' + parts[1] + '---' + body;
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log('Fixed', file);
    }
  }
}
