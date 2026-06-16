import { NextResponse } from 'next/server';
import { nullableString, parseBoolean, validateSlug } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function articleData(body: Record<string, unknown>) {
  const isPublished = parseBoolean(body.isPublished);
  return {
    categoryId: body.categoryId ? String(body.categoryId) : undefined,
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const slugCheck = validateSlug(body.slug);
  if (!slugCheck.valid) {
    return NextResponse.json({ success: false, message: slugCheck.message }, { status: 400 });
  }
  body.slug = slugCheck.slug;
  const item = await prisma.article.update({ where: { id }, data: articleData(body) as any });
  return NextResponse.json({ success: true, message: '文章已更新。', item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ success: true, message: '文章已删除。' });
}
