import { JsonLd } from '@/components/schema/JsonLd';
import type { ProductView } from '@/lib/cms-data';
import { siteConfig } from '@/lib/site';

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
  const props: Record<string, unknown>[] = [];
  const keyMap: Record<string, string> = {
    材质: 'material',
    材料: 'material',
    重量: 'weight',
    功率: 'power',
    电压: 'voltage',
    电流: 'current',
    气压: 'airPressure',
    喷涂距离: 'sprayDistance',
    粉末粒径: 'powderParticleSize',
    上粉率: 'transferEfficiency',
    膜厚范围: 'filmThicknessRange',
    工作温度: 'operatingTemperature',
  };

  for (const [key, value] of Object.entries(specs)) {
    const mappedName = keyMap[key] || key;
    props.push({ '@type': 'PropertyValue', name: mappedName, value: toPlainText(value) });
  }

  return props;
}

export function ProductJsonLd({ product }: { product: ProductView }) {
  const additionalProperty = extractAdditionalProperty(product.specs);
  const imageUrl = /^https?:\/\//i.test(product.image)
    ? product.image
    : `${siteConfig.url}${product.image.startsWith('/') ? product.image : `/${product.image}`}`;

  additionalProperty.push({
    '@type': 'PropertyValue',
    name: 'certification',
    value: 'ISO 9001',
  });

  additionalProperty.push({
    '@type': 'PropertyValue',
    name: 'manufacturingMethod',
    value: '精密CNC加工，SMT贴片，工业级组装',
  });

  additionalProperty.push({
    '@type': 'PropertyValue',
    name: 'compliance',
    value: 'CE, RoHS',
  });

  if (product.applications.length > 0) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'application',
      value: product.applications.map((item) => toPlainText(item)).join('；'),
    });
  }

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${siteConfig.url}/products/${product.categorySlug}/${product.slug}#product`,
        name: product.name,
        model: product.model,
        sku: product.model,
        mpn: product.model,
        description: toPlainText(product.summary),
        image: imageUrl,
        brand: { '@type': 'Brand', name: siteConfig.brandEn },
        manufacturer: { '@type': 'IndustrialManufacturer', '@id': `${siteConfig.url}/#corporation`, name: siteConfig.company },
        category: product.categoryName,
        additionalProperty,
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          businessFunction: 'https://schema.org/Sell',
          price: '0.00',
          priceCurrency: 'CNY',
          areaServed: { '@type': 'Country', name: 'CN' },
        },
        isRelatedTo: product.applications.map((app) => ({
          '@type': 'Thing',
          name: toPlainText(app),
        })),
      }}
    />
  );
}
