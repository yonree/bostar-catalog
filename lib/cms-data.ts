import { prisma } from '@/lib/prisma';


import {
  articleCategories as seedArticleCategories,
  articles as seedArticles,
  cases as seedCases,
  downloads as seedDownloads,
  faqs as seedFaqs,
  productCategories as seedProductCategories,
  products as seedProducts,
  solutions as seedSolutions,
  videos as seedVideos,
} from '@/lib/data';
import {
  getLegacyCompatibleProduct,
  getLegacyCompatibleProductCategory,
  getLegacyCompatibleProductsByCategory,
} from '@/lib/legacy-compatibility';

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

export function firstGalleryImage(value: unknown): string {
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

export function sanitizeProductArray(items: string[]) {
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
      relatedFaqs: (product?.faqs || []).map((faq: { id: string; question: string; answer: string; category: string | null }) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'product',
      })),
    }),
  };
}

function mapSeedCategory(category: (typeof seedProductCategories)[number]): CategoryView {
  return {
    id: `seed-category-${category.slug}`,
    slug: normalizeSlugPart(category.slug),
    name: category.name,
    summary: normalizeFaqAnswer(category.summary),
  };
}

function mapSeedProduct(product: (typeof seedProducts)[number]): ProductView {
  const category = seedProductCategories.find((item) => item.slug === product.categorySlug);
  const specs = specsObject(product.specs);
  const applicableCraft =
    specs['适用工艺'] ||
    Object.entries(specs).find(([key]) => key.includes('适用工艺'))?.[1] ||
    '';

  return {
    id: `seed-product-${product.slug}`,
    slug: normalizeSlugPart(product.slug),
    categorySlug: normalizeSlugPart(product.categorySlug),
    categoryName: category?.name || product.categorySlug,
    name: product.name,
    model: product.model,
    summary: normalizeFaqAnswer(product.summary),
    aiSummary: normalizeFaqAnswer(product.aiSummary),
    image: product.image || defaultProductImage,
    imageCandidates: [product.image || defaultProductImage],
    specs,
    sellingPoints: sanitizePlainArray(product.sellingPoints),
    applications: sanitizePlainArray(product.applications),
    description: '',
    structure: '',
    workingPrinciple: '',
    operationSteps: [],
    standardConfig: [],
    optionalParts: [],
    maintenance: '',
    troubleshooting: '',
    functions: [],
    applicableCraft,
    application: '',
    unsuitableScenes: '',
    faqs: buildProductFaqs({
      name: product.name,
      model: product.model,
      category: category ? { name: category.name } : null,
      summary: normalizeFaqAnswer(product.summary),
      applicableCraft,
    }),
  };
}

function getSeedProducts(limit?: number) {
  const mapped = seedProducts.map(mapSeedProduct);
  return typeof limit === 'number' ? mapped.slice(0, limit) : mapped;
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

function mapSeedArticle(article: (typeof seedArticles)[number]): ArticleView {
  return {
    id: `seed-article-${article.slug}`,
    slug: normalizeSlugPart(article.slug),
    categorySlug: normalizeSlugPart(article.categorySlug),
    title: article.title,
    excerpt: normalizeFaqAnswer(article.excerpt),
    aiSummary: normalizeFaqAnswer(article.aiSummary) || normalizeFaqAnswer(article.excerpt),
    coverImage: '',
    content: article.content.map((item) => normalizeFaqAnswer(item)).filter(Boolean),
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

function mapSeedSolution(solution: (typeof seedSolutions)[number]): SolutionView {
  return {
    id: `seed-solution-${solution.slug}`,
    slug: normalizeSlugPart(solution.slug),
    title: solution.title,
    industry: solution.industry,
    scene: solution.scene,
    aiSummary: normalizeFaqAnswer(solution.aiSummary),
    coverImage: '',
    painPoints: sanitizePlainArray(solution.painPoints),
    equipment: sanitizePlainArray(solution.equipment),
    advantages: sanitizePlainArray(solution.advantages),
    recommendedPlan: '',
    processFlow: [],
    keyControls: [],
    content: '',
  };
}

function mapSeedDownload(download: (typeof seedDownloads)[number]): DownloadView {
  return {
    id: `seed-download-${download.slug}`,
    slug: normalizeSlugPart(download.slug),
    title: download.title,
    summary: normalizeFaqAnswer(download.summary),
    fileType: download.fileType,
    version: download.version,
    fileUrl: download.slug === 'maintenance-guide' ? '/sample-download.pdf' : '#',
    requireLeadForm: download.requireLeadForm,
  };
}

function mapSeedVideo(video: (typeof seedVideos)[number]): VideoView {
  return {
    id: `seed-video-${video.slug}`,
    slug: normalizeSlugPart(video.slug),
    title: video.title,
    summary: normalizeFaqAnswer(video.summary),
    coverImage: '',
    duration: video.duration,
  };
}

function mapSeedCase(item: (typeof seedCases)[number]): CaseView {
  const matchedSolution = seedSolutions.find(
    (solution) => `${normalizeSlugPart(solution.slug)}-case` === normalizeSlugPart(item.slug)
  );

  return {
    id: `seed-case-${item.slug}`,
    slug: normalizeSlugPart(item.slug),
    title: item.title,
    summary: normalizeFaqAnswer(item.summary),
    industry: matchedSolution?.industry || '',
    coverImage: '',
  };
}

function mapSeedFaq(faq: (typeof seedFaqs)[number]): FaqView {
  return {
    id: `seed-faq-${normalizeSlugPart(faq.category)}-${seedFaqs.indexOf(faq)}`,
    question: normalizeFaqAnswer(faq.question),
    answer: normalizeFaqAnswer(faq.answer),
    category: normalizeFaqAnswer(faq.category),
  };
}

function mergeMissingLegacyCategories(categories: CategoryView[]) {
  const merged = [...categories];
  const approvedLegacyCategories = [
    'Manual-Electrostatic-Liquid-Spray-Gun',
    'Automatic-Electrostatic-Liquid-Spray-Gun',
    'Automatic-Electrostatic-Powder-Rotary-Bell',
    'Automatic-Electrostatic-Rotary-Bell-Atomizer',
    'High-Pressure-Airless-Spraying-Equipment',
    'Testing-Instruments',
  ];

  for (const legacySlug of approvedLegacyCategories) {
    const exists = merged.some(
      (category) => normalizeSlugPart(category.slug).toLowerCase() === normalizeSlugPart(legacySlug).toLowerCase()
    );
    if (exists) continue;

    const fallbackCategory = getLegacyCompatibleProductCategory(legacySlug);
    if (!fallbackCategory) continue;

    merged.push(mapSeedCategory(fallbackCategory));
  }

  return merged;
}

export async function getProductCategories(): Promise<CategoryView[]> {
  try {
    const categories = await prisma.productCategory.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
    return mergeMissingLegacyCategories(categories.map((category: {
      id: string;
      slug: string;
      name: string;
      summary: string | null;
      description: string | null;
    }) => ({
      id: category.id,
      slug: normalizeSlugPart(category.slug),
      name: category.name,
      summary: category.summary || category.description || '',
    })));
  } catch {
    return seedProductCategories.map(mapSeedCategory);
  }
}

export async function getProducts(limit?: number): Promise<ProductView[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      take: limit,
    });
    return products.map(mapProduct);
  } catch {
    return getSeedProducts(limit);
  }
}

export async function getFeaturedProducts(limit = 6): Promise<ProductView[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { updatedAt: 'desc' }],
      take: limit,
    });
    return products.map(mapProduct);
  } catch {
    return getSeedProducts(limit);
  }
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<{ category: CategoryView | null; products: ProductView[] }> {
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
    if (!category) {
      const legacyCategory = getLegacyCompatibleProductCategory(categorySlug);
      if (!legacyCategory) return { category: null, products: [] };

      return {
        category: mapSeedCategory(legacyCategory),
        products: getLegacyCompatibleProductsByCategory(categorySlug).map(mapSeedProduct),
      };
    }
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
    const normalizedCategorySlug = normalizeSlugPart(categorySlug).toLowerCase();
    const category = seedProductCategories.find(
      (item) => normalizeSlugPart(item.slug).toLowerCase() === normalizedCategorySlug
    );

    if (!category) {
      return { category: null, products: [] };
    }

    return {
      category: mapSeedCategory(category),
      products: seedProducts
        .filter(
          (item) => normalizeSlugPart(item.categorySlug).toLowerCase() === normalizedCategorySlug
        )
        .map(mapSeedProduct),
    };
  }
}

export async function getProduct(
  categorySlug: string,
  productSlug: string
): Promise<ProductView | null> {
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
    const categoryMatched = candidates.filter((item: {
      slug: string;
      category: { slug: string | null } | null;
      faqs?: Array<{ id: string; question: string; answer: string; category: string | null }> | null;
    }) => {
      if (!item?.category?.slug) return false;
      return normalizeSlugPart(item.category.slug).toLowerCase() === normalizedCategorySlug.toLowerCase();
    });
    const exactMatch = categoryMatched.find(
      (item: { slug: string }) =>
        normalizeSlugPart(item.slug).toLowerCase() === normalizedProductSlug.toLowerCase()
    );
    if (exactMatch) return mapProduct(exactMatch);
    if (categoryMatched.length === 1) return mapProduct(categoryMatched[0]);

    const legacyProduct = getLegacyCompatibleProduct(categorySlug, productSlug);
    return legacyProduct ? mapSeedProduct(legacyProduct) : null;
  } catch {
    const normalizedCategorySlug = normalizeSlugPart(categorySlug).toLowerCase();
    const normalizedProductSlug = normalizeSlugPart(productSlug).toLowerCase();
    const product = seedProducts.find(
      (item) =>
        normalizeSlugPart(item.categorySlug).toLowerCase() === normalizedCategorySlug &&
        normalizeSlugPart(item.slug).toLowerCase() === normalizedProductSlug
    );

    return product ? mapSeedProduct(product) : null;
  }
}

export async function getArticleCategories(): Promise<Array<{ id: string; slug: string; name: string }>> {
  try {
    const categories = await prisma.articleCategory.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
    return categories.map((category: { id: string; slug: string; name: string }) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
    }));
  } catch {
    return seedArticleCategories.map((category) => ({
      id: `seed-article-category-${category.slug}`,
      slug: normalizeSlugPart(category.slug),
      name: category.name,
    }));
  }
}

export async function getArticles(limit?: number): Promise<ArticleView[]> {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
      take: limit,
    });
    return articles.map(mapArticle);
  } catch {
    const mapped = seedArticles.map(mapSeedArticle);
    return typeof limit === 'number' ? mapped.slice(0, limit) : mapped;
  }
}

export async function getArticlesByCategory(
  categorySlug: string
): Promise<{ category: { id: string; slug: string; name: string } | null; articles: ArticleView[] }> {
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
    const normalizedCategorySlug = normalizeSlugPart(categorySlug).toLowerCase();
    const category = seedArticleCategories.find(
      (item) => normalizeSlugPart(item.slug).toLowerCase() === normalizedCategorySlug
    );

    return {
      category: category
        ? {
            id: `seed-article-category-${category.slug}`,
            slug: normalizeSlugPart(category.slug),
            name: category.name,
          }
        : null,
      articles: seedArticles
        .filter((item) => normalizeSlugPart(item.categorySlug).toLowerCase() === normalizedCategorySlug)
        .map(mapSeedArticle),
    };
  }
}

export async function getArticle(categorySlug: string, slug: string): Promise<ArticleView | null> {
  try {
    const article = await prisma.article.findFirst({
      where: { slug, category: { slug: categorySlug }, isPublished: true },
      include: { category: true },
    });
    return article ? mapArticle(article) : null;
  } catch {
    const normalizedCategorySlug = normalizeSlugPart(categorySlug).toLowerCase();
    const normalizedSlug = normalizeSlugPart(slug).toLowerCase();
    const article = seedArticles.find(
      (item) =>
        normalizeSlugPart(item.categorySlug).toLowerCase() === normalizedCategorySlug &&
        normalizeSlugPart(item.slug).toLowerCase() === normalizedSlug
    );
    return article ? mapSeedArticle(article) : null;
  }
}

export async function getSolutions(limit?: number): Promise<SolutionView[]> {
  try {
    const solutions = await prisma.solution.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
    return solutions.map(mapSolution);
  } catch {
    const mapped = seedSolutions.map(mapSeedSolution);
    return typeof limit === 'number' ? mapped.slice(0, limit) : mapped;
  }
}

export async function getSolution(slug: string): Promise<SolutionView | null> {
  try {
    const solution = await prisma.solution.findFirst({ where: { slug, isPublished: true } });
    return solution ? mapSolution(solution) : null;
  } catch {
    const normalizedSlug = normalizeSlugPart(slug).toLowerCase();
    const solution = seedSolutions.find(
      (item) => normalizeSlugPart(item.slug).toLowerCase() === normalizedSlug
    );
    return solution ? mapSeedSolution(solution) : null;
  }
}

export async function getDownloads(): Promise<DownloadView[]> {
  try {
    const downloads = await prisma.download.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
    });
    return downloads.map(
      (item: {
        id: string;
        slug: string;
        title: string;
        summary: string | null;
        fileType: string | null;
        version: string | null;
        fileUrl: string;
        requireLeadForm: boolean;
      }): DownloadView => ({
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
    return seedDownloads.map(mapSeedDownload);
  }
}

export async function getDownload(slug: string): Promise<DownloadView | null> {
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
    const normalizedSlug = normalizeSlugPart(slug).toLowerCase();
    const download = seedDownloads.find(
      (item) => normalizeSlugPart(item.slug).toLowerCase() === normalizedSlug
    );
    return download ? mapSeedDownload(download) : null;
  }
}

export async function getVideos(): Promise<VideoView[]> {
  try {
    const videos = await prisma.video.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
    });
    return videos.map(
      (item: {
        id: string;
        slug: string;
        title: string;
        summary: string | null;
        coverImage: string | null;
      }): VideoView => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.summary || '',
        coverImage: item.coverImage || '',
        duration: '03:00',
      })
    );
  } catch {
    return seedVideos.map(mapSeedVideo);
  }
}

export async function getVideo(slug: string): Promise<VideoView | null> {
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
    const normalizedSlug = normalizeSlugPart(slug).toLowerCase();
    const video = seedVideos.find((item) => normalizeSlugPart(item.slug).toLowerCase() === normalizedSlug);
    return video ? mapSeedVideo(video) : null;
  }
}

export async function getFaqs(limit?: number): Promise<FaqView[]> {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      take: limit,
    });
    return faqs.map(
      (faq: {
        id: string;
        question: string;
        answer: string;
        category: string | null;
      }): FaqView => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category || '',
      })
    );
  } catch {
    const mapped = seedFaqs.map(mapSeedFaq);
    return typeof limit === 'number' ? mapped.slice(0, limit) : mapped;
  }
}

export async function getCases(): Promise<CaseView[]> {
  try {
    const cases = await prisma.case.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
    });
    return cases.map(
      (item: {
        id: string;
        slug: string;
        title: string;
        background: string | null;
        result: string | null;
        content: string | null;
        industry: string | null;
        images: unknown;
      }): CaseView => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.background || item.result || item.content || '',
        industry: item.industry || '',
        coverImage: toStringValue(Array.isArray(item.images) ? item.images[0] : null),
      })
    );
  } catch {
    return seedCases.map(mapSeedCase);
  }
}

export async function getCase(slug: string): Promise<CaseView | null> {
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
    const normalizedSlug = normalizeSlugPart(slug).toLowerCase();
    const item = seedCases.find((entry) => normalizeSlugPart(entry.slug).toLowerCase() === normalizedSlug);
    return item ? mapSeedCase(item) : null;
  }
}

export async function getSearchResults(query: string): Promise<{
  products: ProductView[];
  articles: ArticleView[];
  solutions: SolutionView[];
  faqs: FaqView[];
}> {
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
        (faq: {
          id: string;
          question: string;
          answer: string;
          category: string | null;
        }): FaqView => ({
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
