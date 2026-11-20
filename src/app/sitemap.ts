import { MetadataRoute } from 'next';
import { getBlogPosts } from '../lib/blog';
import { getCatalogProducts, getProductCategories, getProductHref, getTopics } from '../lib/catalog';
import { getAlternativeEligibleSlugs, getAlternativesHref, getComparisonHref, getComparisons } from '../lib/comparisons';
import { getMarkdownUseCaseHref, getMarkdownUseCases } from '../lib/markdownUseCases';
import { SITE_URL, SUPPORTED_LANGUAGES } from '../lib/site';
export const dynamic = 'force-static';
function sitemapAlternates(path: string) {
  return { languages: { en: `${SITE_URL}/en${path}`, zh: `${SITE_URL}/zh${path}`, 'x-default': `${SITE_URL}/en${path}` } };
}
function recordedDate(value?: string | Date) {
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? { lastModified: value } : {};
  if (!value || !Number.isFinite(Date.parse(value))) return {};
  // A recorded calendar day has no time or timezone. Preserve that precision
  // instead of inventing a UTC midnight that can still be in the future.
  const day = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || new Date(day).toISOString().slice(0, 10) !== day) return {};
  if (value !== day && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return {};
  return { lastModified: value };
}
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/tools', '/compare', '/topics', '/updates', '/blog', '/submit', '/about', '/editorial-policy', '/privacy', '/terms', '/contact'];
  const staticUrls: MetadataRoute.Sitemap = SUPPORTED_LANGUAGES.flatMap(lang => paths.map(path => ({
    url: `${SITE_URL}/${lang}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : ['/tools','/compare','/topics','/updates'].includes(path) ? 0.9 : 0.5, alternates: sitemapAlternates(path),
  })));
  const products: MetadataRoute.Sitemap = SUPPORTED_LANGUAGES.flatMap(lang => getCatalogProducts(lang).map(product => ({
    url: `${SITE_URL}${getProductHref(product, lang)}`, ...recordedDate(product.verifiedAt), changeFrequency: 'monthly' as const, priority: 0.8, alternates: sitemapAlternates(product.internalPath || `/tools/${product.slug}`),
  })));
  const categories: MetadataRoute.Sitemap = SUPPORTED_LANGUAGES.flatMap(lang => getProductCategories(lang).map(category => ({
    url: `${SITE_URL}/${lang}/categories/${category.id}`, changeFrequency: 'weekly' as const, priority: 0.8, alternates: sitemapAlternates(`/categories/${category.id}`),
  })));
  const topics: MetadataRoute.Sitemap = SUPPORTED_LANGUAGES.flatMap(lang => getTopics(lang).map(topic => ({
    url: `${SITE_URL}/${lang}/topics/${topic.id}`, changeFrequency: 'weekly' as const, priority: 0.8, alternates: sitemapAlternates(`/topics/${topic.id}`),
  })));
  const markdownUseCases: MetadataRoute.Sitemap = SUPPORTED_LANGUAGES.flatMap(lang => getMarkdownUseCases().map(item => ({
    url: `${SITE_URL}${getMarkdownUseCaseHref(item.slug, lang)}`, changeFrequency: 'monthly' as const, priority: 0.85, alternates: sitemapAlternates(`/tools/markdown-to-image/${item.slug}`),
  })));
  const comparisons: MetadataRoute.Sitemap = SUPPORTED_LANGUAGES.flatMap(lang => getComparisons().map(pair => ({
    url: `${SITE_URL}${getComparisonHref(pair.id, lang)}`, changeFrequency: 'monthly' as const, priority: 0.8, alternates: sitemapAlternates(`/compare/${pair.id}`),
  })));
  const alternatives: MetadataRoute.Sitemap = SUPPORTED_LANGUAGES.flatMap(lang => getAlternativeEligibleSlugs().map(slug => ({
    url: `${SITE_URL}${getAlternativesHref(slug, lang)}`, changeFrequency: 'monthly' as const, priority: 0.75, alternates: sitemapAlternates(`/alternatives/${slug}`),
  })));
  const posts = { en: getBlogPosts('en'), zh: getBlogPosts('zh') };
  const slugs = { en: new Set(posts.en.map(post => post.slug)), zh: new Set(posts.zh.map(post => post.slug)) };
  const articles: MetadataRoute.Sitemap = SUPPORTED_LANGUAGES.flatMap(lang => posts[lang].map(post => {
    const path = `/blog/${post.slug}`;
    return { url: `${SITE_URL}/${lang}${path}`, ...recordedDate(post.updatedAt || post.date), changeFrequency: 'monthly' as const, priority: 0.6,
      ...(slugs.en.has(post.slug) && slugs.zh.has(post.slug) ? { alternates: sitemapAlternates(path) } : {}),
    };
  }));
  return [...staticUrls, ...products, ...markdownUseCases, ...categories, ...comparisons, ...alternatives, ...topics, ...articles];
}
