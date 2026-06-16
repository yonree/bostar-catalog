import { JsonLd } from '@/components/schema/JsonLd';
import type { ArticleView } from '@/lib/cms-data';
import { siteConfig } from '@/lib/site';

export function ArticleJsonLd({ article }: { article: ArticleView }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${siteConfig.url}/knowledge/${article.categorySlug ?? 'articles'}/${article.slug}#article`,
        headline: article.title,
        description: article.excerpt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteConfig.url}/knowledge/${article.categorySlug ?? 'articles'}/${article.slug}`,
        },
author: { '@type': 'IndustrialManufacturer', '@id': `${siteConfig.url}/#corporation`, name: siteConfig.company },
        publisher: { '@type': 'IndustrialManufacturer', '@id': `${siteConfig.url}/#corporation`, name: siteConfig.company },
      }}
    />
  );
}
