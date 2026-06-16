import { JsonLd } from '@/components/schema/JsonLd';
import type { ArticleView } from '@/lib/cms-data';
import { localizeHref } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';

export async function ArticleJsonLd({ article }: { article: ArticleView }) {
  const [site, { locale }] = await Promise.all([getSiteSettings(), getRequestContext()]);
  const articlePath = localizeHref(`/knowledge/${article.categorySlug ?? 'articles'}/${article.slug}`, locale);

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${site.url}${articlePath}#article`,
        headline: article.title,
        description: article.excerpt,
        inLanguage: locale,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${site.url}${articlePath}`,
        },
        author: {
          '@type': 'IndustrialManufacturer',
          '@id': `${site.url}/#corporation`,
          name: site.company,
        },
        publisher: {
          '@type': 'IndustrialManufacturer',
          '@id': `${site.url}/#corporation`,
          name: site.company,
        },
      }}
    />
  );
}
