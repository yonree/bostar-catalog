import { prisma } from '@/lib/prisma';

export type ProductView = {
  id: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  name: string;
  model: string;
  summary: string;
  aiSummary: string;
  image: string;
  imageCandidates: string[];
  specs: Record<string, string>;
  sellingPoints: string[];
  applications: string[];
  description: string;
  structure: string;
  workingPrinciple: string;
  operationSteps: string[];
  standardConfig: string[];
  optionalParts: string[];
  maintenance: string;
  troubleshooting: string;
  functions: string[];
  applicableCraft: string;
  application: string;
  unsuitableScenes: string;
  faqs: FaqView[];
};

export type CategoryView = {
  id: string;
  slug: string;
  name: string;
  summary: string;
};

export type ArticleView = {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  aiSummary: string;
  coverImage: string;
  content: string[];
};

export type SolutionView = {
  id: string;
  slug: string;
  title: string;
  industry: string;
  scene: string;
  aiSummary: string;
  coverImage: string;
  painPoints: string[];
  equipment: string[];
  advantages: string[];
  recommendedPlan: string;
  processFlow: string[];
  keyControls: string[];
  content: string;
};

export type DownloadView = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  fileType: string;
  version: string;
  fileUrl: string;
  requireLeadForm: boolean;
};

export type VideoView = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  duration: string;
};

export type FaqView = {
  id?: string;
  question: string;
  answer: string;
  category: string;
};

export type CaseView = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  industry: string;
  coverImage: string;
};

const defaultProductImage = '/images/product-gun-render.png';
const imageFilePattern = /\.(png|jpe?g|webp|gif|svg|avif|bmp|ico)(\?.*)?$/i;

function toAbsoluteOrRelativeImage(value: unknown): string {
  const candidate = toStringValue(value).trim();
  if (!candidate) return '';
  if (/^https?:\/\//i.test(candidate) || candidate.startsWith('/')) {
    return candidate;
  }
  return `/${candidate.replace(/^\/+/, '')}`;
}

function isLikelyImageReference(value: string) {
  if (!value) return false;
  if (/^https?:\/\//i.test(value)) {
    return imageFilePattern.test(value) || value.includes('/uploads/') || value.includes('blob.vercel-storage.com');
  }
  if (!value.startsWith('/')) return false;
  return imageFilePattern.test(value) || value.startsWith('/uploads/');
}

function toStringValue(item: unknown): string {
  if (typeof item === 'string') return item;
  if (typeof item === 'number' || typeof item === 'boolean') return String(item);
  if (item && typeof item === 'object') {
    const obj = item as Record<string, unknown>;
    if (typeof obj.item === 'string') {
      const parts = [obj.item];
      if (typeof obj.quantity === 'string') parts.push(`(${obj.quantity})`);
      if (typeof obj.description === 'string') parts.push(`鈥?${obj.description}`);
      return parts.join(' ');
    }
    const candidate = obj.text || obj.name || obj.label || obj.value || obj.title || obj.industry;
    if (typeof candidate === 'string') return candidate;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string' && obj[key]) return obj[key] as string;
    }
    return '';
  }
  return '';
}

function stringArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value) ? value.map(toStringValue).filter(Boolean) : fallback;
}

function structuredList(value: unknown, genericLabels: string[] = []) {
  const genericSet = new Set(genericLabels.map((item) => item.trim().toLowerCase()));
  const results: string[] = [];

  const push = (candidate: string) => {
    const normalized = normalizePlainText(candidate);
    if (!normalized) return;
    if (genericSet.has(normalized.toLowerCase())) return;
    results.push(normalized);
  };

  const walk = (input: unknown) => {
    if (input == null) return;
    if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
      push(String(input));
      return;
    }

    if (Array.isArray(input)) {
      for (const item of input) walk(item);
      return;
    }

    if (typeof input !== 'object') return;
    const obj = input as Record<string, unknown>;

    if (typeof obj.item === 'string') {
      const parts = [obj.item];
      if (typeof obj.quantity === 'string' && obj.quantity.trim()) parts.push(`(${obj.quantity.trim()})`);
      if (typeof obj.description === 'string' && obj.description.trim()) parts.push(obj.description.trim());
      push(parts.join(' '));
      return;
    }

    for (const key of ['items', 'children', 'list', 'values', 'entries', 'options', 'parts', 'configs', 'details']) {
      if (Array.isArray(obj[key])) {
        walk(obj[key]);
      }
    }

    const preferred =
      toStringValue(obj.value) ||
      toStringValue(obj.val) ||
      toStringValue(obj.content) ||
      toStringValue(obj.detail) ||
      toStringValue(obj.description) ||
      toStringValue(obj.text);

    if (preferred) {
      const prefix = toStringValue(obj.name || obj.title || obj.label);
      if (prefix && !genericSet.has(normalizePlainText(prefix).toLowerCase())) {
        push(`${prefix}：${preferred}`);
      } else {
        push(preferred);
      }
      return;
    }

    const fallbackText =
      toStringValue(obj.name) ||
      toStringValue(obj.title) ||
      toStringValue(obj.label) ||
      toStringValue(obj.industry);

    if (fallbackText) {
      push(fallbackText);
    }
  };

  walk(value);

  return results.filter((item, index, arr) => arr.indexOf(item) === index);
}

function firstGalleryImage(value: unknown): string {
  return collectProductImages({ gallery: value })[0] || '';
}

function rankImageReference(value: string) {
  if (!value) return 99;
  if (/^https?:\/\//i.test(value)) return 0;
  if (value.includes('blob.vercel-storage.com')) return 0;
  if (value.startsWith('/uploads/')) return 1;
  if (imageFilePattern.test(value)) return 2;
  return 99;
}

function collectProductImages(product: { mainImage?: unknown; gallery?: unknown }) {
  const ranked = new Map<string, number>();
  const add = (candidate: unknown) => {
    const normalized = toAbsoluteOrRelativeImage(candidate);
    if (!normalized || !isLikelyImageReference(normalized)) return;
    const nextRank = rankImageReference(normalized);
    const currentRank = ranked.get(normalized);
    if (currentRank === undefined || nextRank < currentRank) {
      ranked.set(normalized, nextRank);
    }
  };

  add(product?.mainImage);

  if (Array.isArray(product?.gallery)) {
    for (const item of product.gallery) {
      add(item);
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;
        add(obj.url);
        add(obj.src);
        add(obj.image);
        add(obj.path);
      }
    }
  }

  return Array.from(ranked.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([value]) => value);
}

function resolveProductImage(product: { mainImage?: unknown; gallery?: unknown }) {
  return collectProductImages(product)[0] || defaultProductImage;
}

function specsObject(value: unknown) {
  if (typeof value === 'string') {
    const text = value.replace(/\r\n/g, '\n').trim();
    if (!text) return {};

    const tryJson = (() => {
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return null;
      }
    })();

    if (tryJson && typeof tryJson === 'object') {
      return specsObject(tryJson);
    }

    const tableLines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && line.includes('|'));

    if (tableLines.length >= 2) {
      const hasHeaderSeparator = /^(\|?\s*:?-{3,}:?\s*)+\|?$/.test(tableLines[1]);
      const rows = tableLines
        .map((line) => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => normalizePlainText(cell)))
        .filter((cells) => cells.some(Boolean));

      const candidateRows = hasHeaderSeparator ? rows.slice(1) : rows;
      const dataRows = candidateRows.filter(
        (cells) =>
          cells.length >= 2 &&
          !cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, '')))
      );

      const specs = Object.fromEntries(
        dataRows
          .map((cells) => [cells[0], cells.slice(1).join(' | ')])
          .filter(([key, val]) => key && val)
      );

      if (Object.keys(specs).length > 0) return specs;
    }

    const pairs = Object.fromEntries(
      text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const match = line.match(/^(.+?)\s*[:：]\s*(.+)$/);
          if (!match) return ['', ''];
          return [normalizePlainText(match[1]), normalizePlainText(match[2])];
        })
        .filter(([key, val]) => key && val)
    );

    return pairs;
  }
  if (!value || typeof value !== 'object') return {};
  if (Array.isArray(value)) {
    return Object.fromEntries(
      value
        .filter((item) => item && typeof item === 'object')
        .map((item) => {
          const obj = item as Record<string, unknown>;
          const key = normalizePlainText(toStringValue(obj.key || obj.name || obj.label || obj.field));
          const val = normalizePlainText(toStringValue(obj.value || obj.val || obj.content || obj.detail));
          return [key, val];
        })
        .filter(([key]) => key)
    );
  }
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      normalizePlainText(key),
      normalizePlainText(toStringValue(item)),
    ])
  );
}

function splitContent(value: string) {
  return value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSlugPart(value: string) {
  const decoded = (() => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  })();
  return decoded.trim().replace(/\s+/g, '-');
}

const unsuitableSceneLeakMarkers = [
  '未经授权的擅自改装',
  '安全保护失效状态',
  '不兼容材料与非匹配操作',
  '紧急处理方法',
  '焊接或打磨',
  '灭火器的准确位置',
  '防爆安全条例',
  '半封闭车间通风优良',
  '易燃易爆气体浓度超标且无强力通风排气系统',
  '吸烟、焊接或打磨',
];

function sanitizeProductText(value: string | null | undefined) {
  const content = value?.trim() || '';
  if (!content) return '';
  return unsuitableSceneLeakMarkers.some((marker) => content.includes(marker)) ? '' : content;
}

function sanitizeProductArray(items: string[]) {
  return items.map((item) => sanitizeProductText(item)).filter(Boolean);
}

const unsuitableSceneSafetyMarkers = [
  '严禁',
  '静电火花',
  '粉尘燃爆',
  '心脏起搏器',
  '危险区域',
  '易燃易爆',
  '防爆',
  '明火',
  '吸烟',
];

function sanitizeUnsuitableScenes(value: string | null | undefined) {
  const content = sanitizeProductText(value);
  if (!content) return '';
  const hitCount = unsuitableSceneSafetyMarkers.filter((marker) => content.includes(marker)).length;
  return hitCount >= 2 ? '' : content;
}

function stripCitationArtifacts(value: string) {
  return value
    .replace(/\[cite_start\]/gi, '')
    .replace(/\[cite:\s*[\d,\s]+\]/gi, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripMarkdownArtifacts(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/(^|[^\*])\*([^\*].*?[^\*])\*(?!\*)/g, '$1$2')
    .replace(/(^|[^_])_([^_].*?[^_])_(?!_)/g, '$1$2');
}

function normalizeFaqAnswer(value: string | null | undefined) {
  return stripCitationArtifacts(sanitizeProductText(value));
}

function normalizePlainText(value: string | null | undefined) {
  return stripMarkdownArtifacts(normalizeFaqAnswer(value)).replace(/\s*\n+\s*/g, ' ').trim();
}

function sanitizePlainArray(items: string[]) {
  return items.map((item) => normalizePlainText(item)).filter(Boolean);
}

function normalizeTroubleshootingAnswer(value: string | null | undefined) {
  const cleaned = normalizeFaqAnswer(value);
  if (!cleaned) return '';

  try {
    const parsed = JSON.parse(cleaned) as unknown;
    if (Array.isArray(parsed)) {
      const rows = parsed
        .map((item, index) => {
          if (!item || typeof item !== 'object') return '';
          const row = item as Record<string, unknown>;
          const fault = stripCitationArtifacts(toStringValue(row.fault || row.problem || row.title));
          const reason = stripCitationArtifacts(toStringValue(row.reason || row.cause));
          const solution = stripCitationArtifacts(toStringValue(row.solution || row.fix || row.action));
          if (!fault && !reason && !solution) return '';

          const parts = [`${index + 1}. 故障：${fault || '待排查'}`];
          if (reason) parts.push(`原因：${reason}`);
          if (solution) parts.push(`处理：${solution}`);
          return parts.join('；');
        })
        .filter(Boolean);

      if (rows.length > 0) {
        return rows.join('\n\n');
      }
    }
  } catch {}

  return cleaned;
}

function makeFaq(question: string, answer: string, category = 'product'): FaqView | null {
  const cleanQuestion = question.trim();
  const cleanAnswer = answer.trim();
  if (!cleanQuestion || !cleanAnswer) return null;
  return { question: cleanQuestion, answer: cleanAnswer, category };
}

function buildProductFaqs(product: {
  name?: string | null;
  model?: string | null;
  category?: { name?: string | null } | null;
  summary?: string;
  applicableCraft?: string;
  application?: string;
  operationSteps?: string[];
  maintenance?: string;
  troubleshooting?: string;
  unsuitableScenes?: string;
  relatedFaqs?: FaqView[];
}) {
  const linkedFaqs = (product.relatedFaqs || [])
    .map((faq) => ({
      ...faq,
      answer: normalizeFaqAnswer(faq.answer),
    }))
    .filter((faq) => faq.question && faq.answer);
  if (linkedFaqs.length > 0) return linkedFaqs.slice(0, 6);

  const productLabel = product.name || product.model || '当前产品';
  const categoryName = product.category?.name || '该设备';
  const applicationAnswer =
    normalizeFaqAnswer(product.application) ||
    normalizeFaqAnswer(product.applicableCraft) ||
    normalizeFaqAnswer(product.summary) ||
    `${productLabel}适用于${categoryName}相关的标准喷涂工艺，请结合工件材质、产线节拍和膜厚要求选型。`;
  const operationStepsAnswer =
    product.operationSteps && product.operationSteps.length > 0
      ? `建议按以下顺序执行：${product.operationSteps
          .map((step) => stripCitationArtifacts(step))
          .filter(Boolean)
          .slice(0, 3)
          .join('；')}。正式投产前，再复核供料、接地和工艺参数。`
      : '';
  const maintenanceAnswer = normalizeFaqAnswer(product.maintenance);
  const troubleshootingAnswer = normalizeTroubleshootingAnswer(product.troubleshooting);
  const unsuitableScenesAnswer = normalizeFaqAnswer(product.unsuitableScenes);

  const generated = [
    makeFaq(`${productLabel}适合什么工艺或产线场景？`, applicationAnswer),
    operationStepsAnswer ? makeFaq(`${productLabel}如何快速完成开机与调试？`, operationStepsAnswer) : null,
    maintenanceAnswer ? makeFaq(`${productLabel}日常维护重点是什么？`, maintenanceAnswer) : null,
    troubleshootingAnswer ? makeFaq(`${productLabel}出现异常时应先检查什么？`, troubleshootingAnswer) : null,
    unsuitableScenesAnswer ? makeFaq(`${productLabel}不适合用于哪些场景？`, unsuitableScenesAnswer) : null,
  ].filter(Boolean) as FaqView[];

  return generated.slice(0, 4);
}

function mapProduct(
  product: Awaited<ReturnType<typeof prisma.product.findFirst>> & {
    category?: { slug: string; name: string } | null;
    faqs?: Array<{ id: string; question: string; answer: string; category: string | null }> | null;
  }
): ProductView {
  const shortDefinition = normalizeFaqAnswer(product?.shortDefinition);
  const summary = normalizeFaqAnswer(product?.summary);
  const aiSummary = normalizeFaqAnswer(product?.aiSummary);

  return {
    id: product?.id || '',
    slug: product?.slug || '',
    categorySlug: product?.category?.slug ? normalizeSlugPart(product.category.slug) : '',
    categoryName: product?.category?.name || '',
    name: sanitizeProductText(product?.name) || '',
    model: product?.model || '',
    summary: summary || shortDefinition,
    aiSummary: aiSummary || summary || shortDefinition,
    image: resolveProductImage(product || {}),
    imageCandidates: [...collectProductImages(product || {}), defaultProductImage].filter(
      (value, index, arr) => value && arr.indexOf(value) === index
    ),
    specs: specsObject(product?.specs),
    sellingPoints: sanitizePlainArray(stringArray(product?.sellingPoints, [
      '参数可记录',
      '维护路径清晰',
      '适合工业现场',
    ])),
    applications: sanitizePlainArray(
      stringArray(product?.suitableIndustries, ['五金件', '铝型材', '机械机箱'])
    ),
    description: normalizeFaqAnswer(product?.description),
    structure: normalizeFaqAnswer(product?.structure),
    workingPrinciple: normalizeFaqAnswer(product?.workingPrinciple),
    operationSteps: sanitizePlainArray(stringArray(product?.operationSteps)),
    standardConfig: sanitizePlainArray(structuredList(product?.standardConfig, ['标准配置'])),
    optionalParts: sanitizePlainArray(structuredList(product?.optionalParts, ['选配件', '选配件 JSON'])),
    maintenance: normalizeFaqAnswer(product?.maintenance),
    troubleshooting: normalizeTroubleshootingAnswer(product?.troubleshooting),
    functions: sanitizePlainArray(stringArray(product?.functions)),
    applicableCraft: normalizePlainText(product?.applicableCraft),
    application: normalizeFaqAnswer(product?.application),
    unsuitableScenes: sanitizeUnsuitableScenes(product?.unsuitableScenes),
    faqs: buildProductFaqs({
      name: sanitizeProductText(product?.name) || '',
      model: product?.model || '',
      category: product?.category || null,
      summary: summary || shortDefinition,
      applicableCraft: normalizePlainText(product?.applicableCraft),
      application: normalizeFaqAnswer(product?.application),
      operationSteps: sanitizePlainArray(stringArray(product?.operationSteps)),
      maintenance: normalizeFaqAnswer(product?.maintenance),
      troubleshooting: normalizeTroubleshootingAnswer(product?.troubleshooting),
      unsuitableScenes: sanitizeUnsuitableScenes(product?.unsuitableScenes),
      relatedFaqs: (product?.faqs || []).map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'product',
      })),
    }),
  };
}

function mapArticle(
  article: Awaited<ReturnType<typeof prisma.article.findFirst>> & {
    category?: { slug: string } | null;
  }
): ArticleView {
  return {
    id: article?.id || '',
    slug: article?.slug || '',
    categorySlug: article?.category?.slug || '',
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    aiSummary: article?.aiSummary || article?.excerpt || '',
    coverImage: article?.coverImage || '',
    content: splitContent(article?.content || ''),
  };
}

function mapSolution(
  solution: Awaited<ReturnType<typeof prisma.solution.findFirst>>
): SolutionView {
  return {
    id: solution?.id || '',
    slug: solution?.slug || '',
    title: solution?.title || '',
    industry: solution?.industry || '工业涂装',
    scene: solution?.scene || '粉末喷涂',
    aiSummary: solution?.aiSummary || solution?.content || '',
    coverImage: solution?.coverImage || '',
    painPoints: stringArray(solution?.painPoints, ['上粉率不稳定', '边角覆盖不足']),
    equipment: stringArray(solution?.equipmentList, ['粉末静电喷枪', '喷涂控制器', '供粉系统']),
    advantages: stringArray(solution?.advantages, ['参数可记录', '适合扩展自动化']),
    recommendedPlan: solution?.recommendedPlan || '',
    processFlow: stringArray(solution?.processFlow),
    keyControls: stringArray(solution?.keyControls),
    content: solution?.content || '',
  };
}

export async function getProductCategories() {
  try {
    const categories = await prisma.productCategory.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
    return categories.map((category) => ({
      id: category.id,
      slug: normalizeSlugPart(category.slug),
      name: category.name,
      summary: category.summary || category.description || '',
    }));
  } catch {
    return [];
  }
}

export async function getProducts(limit?: number) {
  try {
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      take: limit,
    });
    return products.map(mapProduct);
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(limit = 6) {
  try {
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { updatedAt: 'desc' }],
      take: limit,
    });
    return products.map(mapProduct);
  } catch {
    return [];
  }
}

export async function getProductsByCategory(categorySlug: string) {
  try {
    const normalizedCategorySlug = categorySlug.replace(/\s+/g, '-');
    const category = await prisma.productCategory.findFirst({
      where: {
        OR: [
          { slug: { equals: categorySlug, mode: 'insensitive' } },
          ...(normalizedCategorySlug !== categorySlug
            ? [{ slug: { equals: normalizedCategorySlug, mode: 'insensitive' } } as const]
            : []),
        ],
      },
    });
    if (!category) return { category: null, products: [] };
    const products = await prisma.product.findMany({
      where: { isPublished: true, category: { slug: category.slug } },
      include: { category: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });
    return {
      category: {
        id: category.id,
        slug: normalizeSlugPart(category.slug),
        name: category.name,
        summary: category.summary || category.description || '',
      },
      products: products.map(mapProduct),
    };
  } catch {
    return { category: null, products: [] };
  }
}

export async function getProduct(categorySlug: string, productSlug: string) {
  try {
    const normalizedCategorySlug = normalizeSlugPart(categorySlug);
    const normalizedProductSlug = normalizeSlugPart(productSlug);
    const candidates = await prisma.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { slug: { equals: normalizedProductSlug, mode: 'insensitive' } },
          { slug: { startsWith: `${normalizedProductSlug}-`, mode: 'insensitive' } },
        ],
      },
      include: { category: true, faqs: { where: { isPublished: true }, orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }] } },
      orderBy: { slug: 'asc' },
    });
    const categoryMatched = candidates.filter((item) => {
      if (!item?.category?.slug) return false;
      return normalizeSlugPart(item.category.slug).toLowerCase() === normalizedCategorySlug.toLowerCase();
    });
    const exactMatch = categoryMatched.find(
      (item) => normalizeSlugPart(item.slug).toLowerCase() === normalizedProductSlug.toLowerCase()
    );
    if (exactMatch) return mapProduct(exactMatch);
    if (categoryMatched.length === 1) return mapProduct(categoryMatched[0]);
    return null;
  } catch {
    return null;
  }
}

export async function getArticleCategories() {
  try {
    const categories = await prisma.articleCategory.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
    return categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
    }));
  } catch {
    return [];
  }
}

export async function getArticles(limit?: number) {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
      take: limit,
    });
    return articles.map(mapArticle);
  } catch {
    return [];
  }
}

export async function getArticlesByCategory(categorySlug: string) {
  try {
    const category = await prisma.articleCategory.findUnique({ where: { slug: categorySlug } });
    const articles = await prisma.article.findMany({
      where: { isPublished: true, category: { slug: categorySlug } },
      include: { category: true },
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
    });
    return {
      category: category ? { id: category.id, slug: category.slug, name: category.name } : null,
      articles: articles.map(mapArticle),
    };
  } catch {
    return { category: null, articles: [] };
  }
}

export async function getArticle(categorySlug: string, slug: string) {
  try {
    const article = await prisma.article.findFirst({
      where: { slug, category: { slug: categorySlug }, isPublished: true },
      include: { category: true },
    });
    return article ? mapArticle(article) : null;
  } catch {
    return null;
  }
}

export async function getSolutions(limit?: number) {
  try {
    const solutions = await prisma.solution.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
    return solutions.map(mapSolution);
  } catch {
    return [];
  }
}

export async function getSolution(slug: string) {
  try {
    const solution = await prisma.solution.findFirst({ where: { slug, isPublished: true } });
    return solution ? mapSolution(solution) : null;
  } catch {
    return null;
  }
}

export async function getDownloads() {
  try {
    const downloads = await prisma.download.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
    });
    return downloads.map(
      (item): DownloadView => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.summary || '',
        fileType: item.fileType || 'PDF',
        version: item.version || '',
        fileUrl: item.fileUrl,
        requireLeadForm: item.requireLeadForm,
      })
    );
  } catch {
    return [];
  }
}

export async function getDownload(slug: string) {
  try {
    const item = await prisma.download.findFirst({ where: { slug, isPublished: true } });
    return item
      ? {
          id: item.id,
          slug: item.slug,
          title: item.title,
          summary: item.summary || '',
          fileType: item.fileType || 'PDF',
          version: item.version || '',
          fileUrl: item.fileUrl,
          requireLeadForm: item.requireLeadForm,
        }
      : null;
  } catch {
    return null;
  }
}

export async function getVideos() {
  try {
    const videos = await prisma.video.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
    });
    return videos.map(
      (item): VideoView => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.summary || '',
        coverImage: item.coverImage || '',
        duration: '03:00',
      })
    );
  } catch {
    return [];
  }
}

export async function getVideo(slug: string) {
  try {
    const item = await prisma.video.findFirst({ where: { slug, isPublished: true } });
    return item
      ? {
          id: item.id,
          slug: item.slug,
          title: item.title,
          summary: item.summary || '',
          coverImage: item.coverImage || '',
          duration: '03:00',
        }
      : null;
  } catch {
    return null;
  }
}

export async function getFaqs(limit?: number) {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      take: limit,
    });
    return faqs.map(
      (faq): FaqView => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category || '',
      })
    );
  } catch {
    return [];
  }
}

export async function getCases() {
  try {
    const cases = await prisma.case.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
    });
    return cases.map(
      (item): CaseView => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.background || item.result || item.content || '',
        industry: item.industry || '',
        coverImage: toStringValue(Array.isArray(item.images) ? item.images[0] : null),
      })
    );
  } catch {
    return [];
  }
}

export async function getCase(slug: string) {
  try {
    const item = await prisma.case.findFirst({ where: { slug, isPublished: true } });
    return item
      ? {
          id: item.id,
          slug: item.slug,
          title: item.title,
          summary: item.background || item.result || item.content || '',
          industry: item.industry || '',
          coverImage: toStringValue(Array.isArray(item.images) ? item.images[0] : null),
        }
      : null;
  } catch {
    return null;
  }
}

export async function getSearchResults(query: string) {
  if (!query) {
    return { products: [], articles: [], solutions: [], faqs: [] };
  }
  try {
    const [products, articles, solutions, faqs] = await Promise.all([
      prisma.product.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { category: true },
        take: 20,
      }),
      prisma.article.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { category: true },
        take: 20,
      }),
      prisma.solution.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { aiSummary: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 20,
      }),
      prisma.fAQ.findMany({
        where: {
          isPublished: true,
          OR: [
            { question: { contains: query, mode: 'insensitive' } },
            { answer: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 20,
      }),
    ]);
    return {
      products: products.map(mapProduct),
      articles: articles.map(mapArticle),
      solutions: solutions.map(mapSolution),
      faqs: faqs.map(
        (faq): FaqView => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category || '',
        })
      ),
    };
  } catch {
    return { products: [], articles: [], solutions: [], faqs: [] };
  }
}





