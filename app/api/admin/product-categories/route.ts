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

export async function GET() {
  const items = await prisma.productCategory.findMany({
    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
  });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const slugCheck = validateSlug(body.slug);
  if (!slugCheck.valid) {
    return NextResponse.json({ success: false, message: slugCheck.message }, { status: 400 });
  }
  body.slug = slugCheck.slug;
  const item = await prisma.productCategory.create({ data: categoryData(body) });
  return NextResponse.json({ success: true, message: '产品分类已新增。', item });
}
