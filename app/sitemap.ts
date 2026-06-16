import type { MetadataRoute } from 'next';
import {
  getArticleCategories,
  getArticles,
  getCases,
  getDownloads,
  getProductCategories,
  getProducts,
  getSolutions,
  getVideos,
} from '@/lib/cms-data';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    productCategories,
    products,
    articleCategories,
    articles,
    solutions,
    cases,
    downloads,
    videos,
  ] = await Promise.all([
    getProductCategories(),
    getProducts(),
    getArticleCategories(),
    getArticles(),
    getSolutions(),
    getCases(),
    getDownloads(),
    getVideos(),
  ]);

  const staticRoutes = [
    '',
    '/about',
    '/products',
    '/solutions',
    '/knowledge',
    '/cases',
    '/downloads',
    '/videos',
    '/service',
    '/news',
    '/faq',
    '/contact',
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...productCategories.map((item) => ({
      url: `${siteConfig.url}/products/${item.slug}`,
      lastModified: new Date(),
    })),
    ...products.map((item) => ({
      url: `${siteConfig.url}/products/${item.categorySlug}/${item.slug}`,
      lastModified: new Date(),
    })),
    ...articleCategories.map((item) => ({
      url: `${siteConfig.url}/knowledge/${item.slug}`,
      lastModified: new Date(),
    })),
    ...articles.map((item) => ({
      url: `${siteConfig.url}/knowledge/${item.categorySlug}/${item.slug}`,
      lastModified: new Date(),
    })),
    ...solutions.map((item) => ({
      url: `${siteConfig.url}/solutions/${item.slug}`,
      lastModified: new Date(),
    })),
    ...cases.map((item) => ({
      url: `${siteConfig.url}/cases/${item.slug}`,
      lastModified: new Date(),
    })),
    ...downloads.map((item) => ({
      url: `${siteConfig.url}/downloads/${item.slug}`,
      lastModified: new Date(),
    })),
    ...videos.map((item) => ({
      url: `${siteConfig.url}/videos/${item.slug}`,
      lastModified: new Date(),
    })),
  ];
}
