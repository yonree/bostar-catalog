import { JsonLd } from '@/components/schema/JsonLd';
import { localizeHref } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';
import { getLocalizedSiteDescription } from '@/lib/site-copy';
import { getSiteSettings } from '@/lib/site-settings';

export async function WebSiteJsonLd() {
  const [site, { locale }] = await Promise.all([getSiteSettings(), getRequestContext()]);

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        name: site.brandEn,
        alternateName: [site.brandCn, 'BOSTAR Industrial Coating Equipment'],
        url: site.url,
        description: getLocalizedSiteDescription(locale, site),
        inLanguage: ['zh-CN', 'en'],
        publisher: {
          '@type': 'IndustrialManufacturer',
          '@id': `${site.url}/#corporation`,
          name: site.company,
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${site.url}${localizeHref('/search', locale)}?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        ],
      }}
    />
  );
}
