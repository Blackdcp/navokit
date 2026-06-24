import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface GuidePost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  language: 'en' | 'zh';
}

export function getGuidePosts(lang: 'en' | 'zh'): GuidePost[] {
  const postsDirectory = path.join(process.cwd(), 'src', 'content', 'guides', lang);
  
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

export function getGuidePostBySlug(lang: 'en' | 'zh', slug: string): GuidePost | null {
  const posts = getGuidePosts(lang);
  const decodedSlug = decodeURIComponent(slug);
  return posts.find(post => post.slug === decodedSlug || post.slug === slug) || null;
}
