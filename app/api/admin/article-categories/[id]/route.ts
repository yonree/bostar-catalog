import { NextResponse } from 'next/server';
import { nullableString, numberValue, parseBoolean, validateSlug } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function categoryData(body: Record<string, unknown>) {
  return {
    name: String(body.name || ''),
    slug: String(body.slug || ''),
    description: nullableString(body.description),
    sortOrder: numberValue(body.sortOrder),
    isPublished: parseBoolean(body.isPublished),
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
  const item = await prisma.articleCategory.update({ where: { id }, data: categoryData(body) });
  return NextResponse.json({ success: true, message: '文章分类已更新。', item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.articleCategory.delete({ where: { id } });
  return NextResponse.json({ success: true, message: '文章分类已删除。' });
}
