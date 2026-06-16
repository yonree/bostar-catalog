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
import { localizeHref } from '@/lib/i18n';
import { getSiteSettings } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

function createEntry(siteUrl: string, path: string): MetadataRoute.Sitemap[number][] {
  const zhPath = localizeHref(path, 'zh-CN');
  const enPath = localizeHref(path, 'en');

  return [
    {
      url: `${siteUrl}${zhPath}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'zh-CN': `${siteUrl}${zhPath}`,
          en: `${siteUrl}${enPath}`,
          'x-default': `${siteUrl}${zhPath}`,
        },
      },
    },
    {
      url: `${siteUrl}${enPath}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'zh-CN': `${siteUrl}${zhPath}`,
          en: `${siteUrl}${enPath}`,
          'x-default': `${siteUrl}${zhPath}`,
        },
      },
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, productCategories, products, articleCategories, articles, solutions, cases, downloads, videos] =
    await Promise.all([
      getSiteSettings(),
      getProductCategories(),
      getProducts(),
      getArticleCategories(),
      getArticles(),
      getSolutions(),
      getCases(),
      getDownloads(),
      getVideos(),
    ]);

  const staticPaths = [
    '/',
    '/about',
    '/products',
    '/solutions',
    '/knowledge',
    '/cases',
    '/downloads',
    '/videos',
    '/service',
    '/faq',
    '/contact',
  ];

  return [
    ...staticPaths.flatMap((path) => createEntry(site.url, path)),
    ...productCategories.flatMap((item) => createEntry(site.url, `/products/${item.slug}`)),
    ...products.flatMap((item) => createEntry(site.url, `/products/${item.categorySlug}/${item.slug}`)),
    ...articleCategories.flatMap((item) => createEntry(site.url, `/knowledge/${item.slug}`)),
    ...articles.flatMap((item) => createEntry(site.url, `/knowledge/${item.categorySlug}/${item.slug}`)),
    ...solutions.flatMap((item) => createEntry(site.url, `/solutions/${item.slug}`)),
    ...cases.flatMap((item) => createEntry(site.url, `/cases/${item.slug}`)),
    ...downloads.flatMap((item) => createEntry(site.url, `/downloads/${item.slug}`)),
    ...videos.flatMap((item) => createEntry(site.url, `/videos/${item.slug}`)),
  ];
}
