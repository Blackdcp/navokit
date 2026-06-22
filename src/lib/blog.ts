import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  language: 'en' | 'zh';
}

export function getBlogPosts(lang: 'en' | 'zh'): BlogPost[] {
  // We keep all SEO generated articles strictly inside `seo-batch` for easy deletion.
  const postsDirectory = path.join(process.cwd(), 'src', 'content', 'blog', lang, 'seo-batch');
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        content,
        language: lang,
      };
    });

  // Sort posts by date descending
  return allPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getBlogPostBySlug(lang: 'en' | 'zh', slug: string): BlogPost | null {
  const posts = getBlogPosts(lang);
  const decodedSlug = decodeURIComponent(slug);
  return posts.find(post => post.slug === decodedSlug || post.slug === slug) || null;
}
