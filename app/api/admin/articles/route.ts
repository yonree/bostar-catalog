import { NextResponse } from 'next/server';
import { getFirstArticleCategoryId, nullableString, parseBoolean, validateSlug } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function articleData(body: Record<string, unknown>, categoryId?: string) {
  const isPublished = parseBoolean(body.isPublished);
  return {
    categoryId,
    title: String(body.title || ''),
    slug: String(body.slug || ''),
    excerpt: nullableString(body.excerpt),
    coverImage: nullableString(body.coverImage),
    content: String(body.content || ''),
    conclusion: nullableString(body.conclusion),
    articleType: String(body.articleType || 'knowledge'),
    author: nullableString(body.author),
    reviewer: nullableString(body.reviewer),
    aiSummary: nullableString(body.aiSummary),
    isPublished,
    publishedAt: isPublished ? new Date() : null,
    seoTitle: nullableString(body.seoTitle),
    seoDesc: nullableString(body.seoDesc),
    seoKeywords: nullableString(body.seoKeywords),
  };
}

export async function GET() {
  const [items, categories] = await Promise.all([
    prisma.article.findMany({
      include: { category: true },
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
    }),
    prisma.articleCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);
  return NextResponse.json({ items, categories });
}

export async function POST(request: Request) {
  const body = await request.json();
  const slugCheck = validateSlug(body.slug);
  if (!slugCheck.valid) {
    return NextResponse.json({ success: false, message: slugCheck.message }, { status: 400 });
  }
  body.slug = slugCheck.slug;
  const categoryId = String(body.categoryId || (await getFirstArticleCategoryId()));
  const item = await prisma.article.create({ data: articleData(body, categoryId) as any });
  return NextResponse.json({ success: true, message: '文章已新增。', item });
}
