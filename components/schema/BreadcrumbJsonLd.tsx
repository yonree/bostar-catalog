import { JsonLd } from '@/components/schema/JsonLd';
import { localizeHref } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';

export async function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  const [site, { locale }] = await Promise.all([getSiteSettings(), getRequestContext()]);

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${site.url}${localizeHref(item.path, locale)}`,
        })),
      }}
    />
  );
}
