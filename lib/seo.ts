import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';

export function createMetadata(title: string, description: string, path = '/'): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.brandEn,
      locale: 'zh_CN',
      type: 'website',
    },
  };
}
