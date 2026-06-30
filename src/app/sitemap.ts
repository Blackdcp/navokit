import { MetadataRoute } from 'next'
import { getBlogPosts } from '../lib/blog'
import { SITE_URL, SUPPORTED_LANGUAGES } from '../lib/site'

function sitemapAlternates(path: string) {
  return {
    languages: {
      en: `${SITE_URL}/en${path}`,
      zh: `${SITE_URL}/zh${path}`,
      "x-default": `${SITE_URL}/en${path}`,
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteLastModified = new Date('2026-06-30')
  const staticPaths = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/tools', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/tools/free-ai-video-generator', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/tools/markdown-to-image', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/tools/ai-social-booster', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/contact', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  const staticUrls = SUPPORTED_LANGUAGES.flatMap(lang =>
    staticPaths.map(item => ({
      url: `${SITE_URL}/${lang}${item.path}`,
      lastModified: siteLastModified,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
      alternates: sitemapAlternates(item.path),
    }))
  )

  const blogUrls = SUPPORTED_LANGUAGES.flatMap(lang =>
    getBlogPosts(lang).map(post => {
      const path = `/blog/${post.slug}`

      return {
        url: `${SITE_URL}/${lang}${path}`,
        lastModified: new Date(post.updatedAt || post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: sitemapAlternates(path),
      }
    })
  )

  return [...staticUrls, ...blogUrls]
}
