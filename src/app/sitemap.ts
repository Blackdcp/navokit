import { MetadataRoute } from 'next'
import { getProducts } from '../lib/api'
import { getBlogPosts } from '../lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cheng-zi-ai.com'
  const products = getProducts('zh')

  // Only index real product detail pages
  const validProducts = products.filter(p => p.actionType !== 'link')

  const productUrls = validProducts.flatMap(p => [
    {
      url: `${baseUrl}/zh/products/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/products/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  ])

  // Get blog posts for SEO
  const zhPosts = getBlogPosts('zh')
  const enPosts = getBlogPosts('en')
  
  const zhBlogUrls = zhPosts.map(post => ({
    url: `${baseUrl}/zh/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const enBlogUrls = enPosts.map(post => ({
    url: `${baseUrl}/en/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const blogUrls = [...zhBlogUrls, ...enBlogUrls]

  return [
    {
      url: `${baseUrl}/zh`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/zh/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/zh/tools/ppt2pdf`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/tools/ppt2pdf`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/zh/tools/chat-exporter`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/tools/chat-exporter`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/zh/tools/social-booster`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/tools/social-booster`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...productUrls,
    ...blogUrls
  ]
}
