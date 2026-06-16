import { JsonLd } from '@/components/schema/JsonLd';
import { getSiteSettings } from '@/lib/site-settings';

export async function WebSiteJsonLd() {
  const site = await getSiteSettings();
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        name: site.brandEn,
        alternateName: [site.brandCn, '博士达静电喷涂设备官网'],
        url: site.url,
        description: site.description,
        inLanguage: ['zh', 'en'],
        publisher: { '@type': 'IndustrialManufacturer', '@id': `${site.url}/#corporation`, name: site.company },
        potentialAction: [
          {
            '@type': 'SearchAction',
            'target': {
              '@type': 'EntryPoint',
              urlTemplate: `${site.url}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        ],
      }}
    />
  );
}
