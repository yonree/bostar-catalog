import {
  productCategories as seedProductCategories,
  products as seedProducts,
  type Product,
  type ProductCategory,
} from '@/lib/data';

export type LegacyCompatibilityRecord = {
  legacyCategorySlug: string;
  canonicalCategorySlug: string;
  entityType: 'product-category' | 'product-detail';
  productSlug?: string;
  source: 'seed-audit';
  verificationStatus: 'approved';
  zhPath: string;
  enPath: string;
  expectedStatus: '200';
  redirectPolicy: 'KEEP_200';
  dataFallbackPolicy: 'seed-when-db-missing';
  businessEvidence: string;
};

function normalizeLegacySlug(value: string) {
  const decoded = (() => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  })();

  return decoded.trim().replace(/\s+/g, '-');
}

const productCompatibilityManifest: LegacyCompatibilityRecord[] = [
  {
    legacyCategorySlug: 'Manual-Electrostatic-Liquid-Spray-Gun',
    canonicalCategorySlug: 'Manual-Electrostatic-Liquid-Spray-Gun',
    entityType: 'product-category',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath: '/products/Manual-Electrostatic-Liquid-Spray-Gun',
    enPath: '/en/products/Manual-Electrostatic-Liquid-Spray-Gun',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'planning/gate1a/url/url-decision-manifest.csv:95 RESTORE_200 for legacy liquid category landing page',
  },
  {
    legacyCategorySlug: 'Manual-Electrostatic-Liquid-Spray-Gun',
    canonicalCategorySlug: 'Manual-Electrostatic-Liquid-Spray-Gun',
    entityType: 'product-detail',
    productSlug: 'bsd-3009a-manual-liquid-electrostatic-spray-gun',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath:
      '/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun',
    enPath:
      '/en/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'planning/gate1a/url/url-decision-manifest.csv:96 KEEP_200 for verified manual liquid detail URL',
  },
  {
    legacyCategorySlug: 'Manual-Electrostatic-Liquid-Spray-Gun',
    canonicalCategorySlug: 'Manual-Electrostatic-Liquid-Spray-Gun',
    entityType: 'product-detail',
    productSlug: 'manual-liquid-electrostatic-spray-gun',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath:
      '/products/Manual-Electrostatic-Liquid-Spray-Gun/manual-liquid-electrostatic-spray-gun',
    enPath:
      '/en/products/Manual-Electrostatic-Liquid-Spray-Gun/manual-liquid-electrostatic-spray-gun',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'planning/gate1a/url/url-decision-manifest.csv:97 KEEP_200 for verified manual liquid detail URL',
  },
  {
    legacyCategorySlug: 'Automatic-Electrostatic-Liquid-Spray-Gun',
    canonicalCategorySlug: 'Automatic-Electrostatic-Liquid-Spray-Gun',
    entityType: 'product-category',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath: '/products/Automatic-Electrostatic-Liquid-Spray-Gun',
    enPath: '/en/products/Automatic-Electrostatic-Liquid-Spray-Gun',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'Approved legacy liquid family carried by audited seed data and restored route matrix evidence',
  },
  {
    legacyCategorySlug: 'Automatic-Electrostatic-Liquid-Spray-Gun',
    canonicalCategorySlug: 'Automatic-Electrostatic-Liquid-Spray-Gun',
    entityType: 'product-detail',
    productSlug: 'bsd-3029-automatic-liquid-electrostatic-spray-gun',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath:
      '/products/Automatic-Electrostatic-Liquid-Spray-Gun/bsd-3029-automatic-liquid-electrostatic-spray-gun',
    enPath:
      '/en/products/Automatic-Electrostatic-Liquid-Spray-Gun/bsd-3029-automatic-liquid-electrostatic-spray-gun',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence: 'Legacy automatic liquid detail preserved in approved audit seed data',
  },
];

function matchesCategorySlug(record: LegacyCompatibilityRecord, categorySlug: string) {
  return normalizeLegacySlug(record.legacyCategorySlug).toLowerCase() === categorySlug;
}

function matchesProductSlug(record: LegacyCompatibilityRecord, categorySlug: string, productSlug: string) {
  return (
    matchesCategorySlug(record, categorySlug) &&
    normalizeLegacySlug(record.productSlug || '').toLowerCase() === productSlug
  );
}

export function getLegacyCompatibilityRecords() {
  return productCompatibilityManifest;
}

export function getLegacyCompatibleProductCategory(
  categorySlug: string
): ProductCategory | null {
  const normalizedCategorySlug = normalizeLegacySlug(categorySlug).toLowerCase();
  const manifestRecord = productCompatibilityManifest.find(
    (record) => record.entityType === 'product-category' && matchesCategorySlug(record, normalizedCategorySlug)
  );

  if (!manifestRecord) return null;

  return (
    seedProductCategories.find(
      (category) =>
        normalizeLegacySlug(category.slug).toLowerCase() ===
        normalizeLegacySlug(manifestRecord.canonicalCategorySlug).toLowerCase()
    ) || null
  );
}

export function getLegacyCompatibleProductsByCategory(categorySlug: string): Product[] {
  const normalizedCategorySlug = normalizeLegacySlug(categorySlug).toLowerCase();
  const approvedProductSlugs = new Set(
    productCompatibilityManifest
      .filter(
        (record) =>
          record.entityType === 'product-detail' &&
          matchesCategorySlug(record, normalizedCategorySlug) &&
          record.productSlug
      )
      .map((record) => normalizeLegacySlug(record.productSlug || '').toLowerCase())
  );

  return seedProducts.filter((product) => {
    const productCategorySlug = normalizeLegacySlug(product.categorySlug).toLowerCase();
    const productSlug = normalizeLegacySlug(product.slug).toLowerCase();

    return productCategorySlug === normalizedCategorySlug && approvedProductSlugs.has(productSlug);
  });
}

export function getLegacyCompatibleProduct(
  categorySlug: string,
  productSlug: string
): Product | null {
  const normalizedCategorySlug = normalizeLegacySlug(categorySlug).toLowerCase();
  const normalizedProductSlug = normalizeLegacySlug(productSlug).toLowerCase();
  const approvedRecord = productCompatibilityManifest.find(
    (record) =>
      record.entityType === 'product-detail' &&
      matchesProductSlug(record, normalizedCategorySlug, normalizedProductSlug)
  );

  if (!approvedRecord) return null;

  return (
    seedProducts.find(
      (product) =>
        normalizeLegacySlug(product.categorySlug).toLowerCase() === normalizedCategorySlug &&
        normalizeLegacySlug(product.slug).toLowerCase() === normalizedProductSlug
    ) || null
  );
}
