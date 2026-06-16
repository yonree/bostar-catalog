import { prisma } from '@/lib/prisma';

export function parseBoolean(value: unknown) {
  return value === true || value === 'true' || value === 'on';
}

export function parseJson(value: unknown, fallback: unknown = {}) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    if (Array.isArray(fallback)) {
      const items = value
        .split(/\n|；|;|，/)
        .map((s) => s.trim())
        .filter((s) => s && !s.startsWith('//') && !s.startsWith('#'));
      return items.length > 0 ? items : fallback;
    }
    return fallback;
  }
}

function parseSpecsLines(value: string) {
  const lines = value
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//') && !line.startsWith('#'));

  if (lines.length === 0) return {};

  const tableLines = lines.filter((line) => line.includes('|'));
  if (tableLines.length >= 2) {
    const hasHeaderSeparator = /^(\|?\s*:?-{3,}:?\s*)+\|?$/.test(tableLines[1]);
    const rows = tableLines
      .map((line) => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim()))
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

  const specs = Object.fromEntries(
    lines
      .map((line) => {
        const match = line.match(/^(.+?)\s*[:：]\s*(.+)$/);
        if (!match) return ['', ''];
        return [match[1].trim(), match[2].trim()];
      })
      .filter(([key, val]) => key && val)
  );

  return specs;
}

export function parseSpecsJson(value: unknown) {
  if (value === undefined || value === null || value === '') return {};
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return parseSpecsLines(value);
  }
}

export function nullableString(value: unknown) {
  if (value === undefined || value === null || value === '') return null;
  return String(value);
}

export function numberValue(value: unknown, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function validateSlug(value: unknown) {
  const slug = String(value || '').trim().toLowerCase();
  if (!slug) return { valid: false, slug: '', message: 'Slug 不能为空。' };
  if (slug.includes('://')) {
    return { valid: false, slug: '', message: '检测到 URL 协议 (://)，Slug 不能是网址，请检查是否粘贴了图片地址。' };
  }
  if (slug.includes('/')) {
    return { valid: false, slug: '', message: 'Slug 包含非法字符 /，请检查是否粘贴了网址路径。' };
  }
  if (/[^a-z0-9\-_\.]/.test(slug)) {
    return { valid: false, slug: '', message: 'Slug 只能包含小写字母、数字、连字符 (-)、下划线 (_) 和点 (.)。' };
  }
  return { valid: true, slug, message: '' };
}

export async function getFirstProductCategoryId() {
  const category = await prisma.productCategory.findFirst({ orderBy: { sortOrder: 'asc' } });
  if (!category) throw new Error('请先创建产品分类。');
  return category.id;
}

export async function getFirstArticleCategoryId() {
  const category = await prisma.articleCategory.findFirst({ orderBy: { sortOrder: 'asc' } });
  if (!category) throw new Error('请先创建文章分类。');
  return category.id;
}
