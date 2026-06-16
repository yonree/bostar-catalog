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

export async function GET() {
  const items = await prisma.articleCategory.findMany({
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
  const item = await prisma.articleCategory.create({ data: categoryData(body) });
  return NextResponse.json({ success: true, message: '文章分类已新增。', item });
}
