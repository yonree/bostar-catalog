import { NextResponse } from 'next/server';
import { nullableString, numberValue, parseBoolean, validateSlug } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function categoryData(body: Record<string, unknown>) {
  return {
    name: String(body.name || ''),
    slug: String(body.slug || ''),
    title: nullableString(body.title),
    summary: nullableString(body.summary),
    description: nullableString(body.description),
    coverImage: nullableString(body.coverImage),
    sortOrder: numberValue(body.sortOrder),
    isPublished: parseBoolean(body.isPublished),
    seoTitle: nullableString(body.seoTitle),
    seoDesc: nullableString(body.seoDesc),
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
  const item = await prisma.productCategory.update({ where: { id }, data: categoryData(body) });
  return NextResponse.json({ success: true, message: '产品分类已更新。', item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.productCategory.delete({ where: { id } });
  return NextResponse.json({ success: true, message: '产品分类已删除。' });
}
