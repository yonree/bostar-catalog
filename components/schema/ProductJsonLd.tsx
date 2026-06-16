import { JsonLd } from '@/components/schema/JsonLd';
import type { ProductView } from '@/lib/cms-data';
import { localizeHref } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';

function toPlainText(value: string) {
  return value
    .replace(/\[cite_start\]/gi, '')
    .replace(/\[cite:\s*[\d,\s]+\]/gi, '')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/(^|[^\*])\*([^\*].*?[^\*])\*(?!\*)/g, '$1$2')
    .replace(/(^|[^_])_([^_].*?[^_])_(?!_)/g, '$1$2')
    .replace(/\s*\n+\s*/g, ' ')
    .trim();
}

function extractAdditionalProperty(specs: Record<string, string>): Record<string, unknown>[] {
  return Object.entries(specs).map(([key, value]) => ({
    '@type': 'PropertyValue',
    name: key,
    value: toPlainText(value),
  }));
}

export async function ProductJsonLd({ product }: { product: ProductView }) {
  const [site, { locale }] = await Promise.all([getSiteSettings(), getRequestContext()]);
  const productPath = localizeHref(`/products/${product.categorySlug}/${product.slug}`, locale);
  const productUrl = `${site.url}${productPath}`;
  const imageUrl = /^https?:\/\//i.test(product.image)
    ? product.image
    : `${site.url}${product.image.startsWith('/') ? product.image : `/${product.image}`}`;
  const additionalProperty = extractAdditionalProperty(product.specs);

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${site.url}${productPath}#product`,
        name: product.name,
        model: product.model,
        sku: product.model,
        mpn: product.model,
        url: productUrl,
        description: toPlainText(product.summary || product.aiSummary),
        image: imageUrl,
        inLanguage: locale,
        brand: { '@type': 'Brand', name: site.brandEn },
        manufacturer: {
          '@type': 'IndustrialManufacturer',
          '@id': `${site.url}/#corporation`,
          name: site.company,
        },
        category: product.categoryName,
        additionalProperty,
      }}
    />
  );
}
