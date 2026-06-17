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
  {
    legacyCategorySlug: 'Automatic-Electrostatic-Powder-Rotary-Bell',
    canonicalCategorySlug: 'Automatic-Electrostatic-Powder-Rotary-Bell',
    entityType: 'product-category',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath: '/products/Automatic-Electrostatic-Powder-Rotary-Bell',
    enPath: '/en/products/Automatic-Electrostatic-Powder-Rotary-Bell',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'planning/gate1a/url/url-decision-manifest.csv:89 RESTORE_200 for approved legacy powder rotary bell category',
  },
  {
    legacyCategorySlug: 'Automatic-Electrostatic-Powder-Rotary-Bell',
    canonicalCategorySlug: 'Automatic-Electrostatic-Powder-Rotary-Bell',
    entityType: 'product-detail',
    productSlug: 'bostar-f18-automatic-powder-electrostatic-rotary-bell',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath:
      '/products/Automatic-Electrostatic-Powder-Rotary-Bell/bostar-f18-automatic-powder-electrostatic-rotary-bell',
    enPath:
      '/en/products/Automatic-Electrostatic-Powder-Rotary-Bell/bostar-f18-automatic-powder-electrostatic-rotary-bell',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'planning/gate1a/url/url-decision-manifest.csv:90 KEEP_200 for approved legacy powder rotary bell detail',
  },
  {
    legacyCategorySlug: 'Automatic-Electrostatic-Rotary-Bell-Atomizer',
    canonicalCategorySlug: 'Automatic-Electrostatic-Rotary-Bell-Atomizer',
    entityType: 'product-category',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath: '/products/Automatic-Electrostatic-Rotary-Bell-Atomizer',
    enPath: '/en/products/Automatic-Electrostatic-Rotary-Bell-Atomizer',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'planning/gate1a/url/url-decision-manifest.csv:91 RESTORE_200 for approved legacy rotary bell atomizer category',
  },
  {
    legacyCategorySlug: 'Automatic-Electrostatic-Rotary-Bell-Atomizer',
    canonicalCategorySlug: 'Automatic-Electrostatic-Rotary-Bell-Atomizer',
    entityType: 'product-detail',
    productSlug: 'automatic-electrostatic-powder-rotary-bell-bsd-cu300',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath:
      '/products/Automatic-Electrostatic-Rotary-Bell-Atomizer/automatic-electrostatic-powder-rotary-bell-bsd-cu300',
    enPath:
      '/en/products/Automatic-Electrostatic-Rotary-Bell-Atomizer/automatic-electrostatic-powder-rotary-bell-bsd-cu300',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'planning/gate1a/url/url-decision-manifest.csv:92 KEEP_200 for approved legacy rotary bell atomizer detail',
  },
  {
    legacyCategorySlug: 'Automatic-Electrostatic-Rotary-Bell-Atomizer',
    canonicalCategorySlug: 'Automatic-Electrostatic-Rotary-Bell-Atomizer',
    entityType: 'product-detail',
    productSlug: 'bell-cup-automatic-electrostatic-coating-system-bsd-3029',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath:
      '/products/Automatic-Electrostatic-Rotary-Bell-Atomizer/bell-cup-automatic-electrostatic-coating-system-bsd-3029',
    enPath:
      '/en/products/Automatic-Electrostatic-Rotary-Bell-Atomizer/bell-cup-automatic-electrostatic-coating-system-bsd-3029',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'planning/gate1a/url/url-decision-manifest.csv:93 KEEP_200 for approved legacy rotary bell atomizer detail',
  },
  {
    legacyCategorySlug: 'High-Pressure-Airless-Spraying-Equipment',
    canonicalCategorySlug: 'High-Pressure-Airless-Spraying-Equipment',
    entityType: 'product-category',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath: '/products/High-Pressure-Airless-Spraying-Equipment',
    enPath: '/en/products/High-Pressure-Airless-Spraying-Equipment',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'planning/gate1a/url/url-decision-manifest.csv:94 RESTORE_200 for approved legacy high-pressure airless category',
  },
  {
    legacyCategorySlug: 'Testing-Instruments',
    canonicalCategorySlug: 'Testing-Instruments',
    entityType: 'product-category',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath: '/products/Testing-Instruments',
    enPath: '/en/products/Testing-Instruments',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'planning/gate1a/url/url-decision-manifest.csv:98 RESTORE_200 for approved legacy testing instruments category',
  },
  {
    legacyCategorySlug: 'Testing-Instruments',
    canonicalCategorySlug: 'Testing-Instruments',
    entityType: 'product-detail',
    productSlug: 'paint-resistance-tester-zk815',
    source: 'seed-audit',
    verificationStatus: 'approved',
    zhPath: '/products/Testing-Instruments/paint-resistance-tester-zk815',
    enPath: '/en/products/Testing-Instruments/paint-resistance-tester-zk815',
    expectedStatus: '200',
    redirectPolicy: 'KEEP_200',
    dataFallbackPolicy: 'seed-when-db-missing',
    businessEvidence:
      'planning/gate1a/url/url-decision-manifest.csv:99 KEEP_200 for approved legacy testing instruments detail',
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
