import { NextResponse } from 'next/server';
import { nullableString, parseBoolean, parseJson, validateSlug } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function caseData(body: Record<string, unknown>) {
  return {
    title: String(body.title || ''),
    slug: String(body.slug || ''),
    industry: nullableString(body.industry),
    region: nullableString(body.region),
    customerName: nullableString(body.customerName),
    isAnonymous: parseBoolean(body.isAnonymous),
    background: nullableString(body.background),
    problems: nullableString(body.problems),
    workpiece: nullableString(body.workpiece),
    craft: nullableString(body.craft),
    equipmentConfig: nullableString(body.equipmentConfig),
    process: nullableString(body.process),
    result: nullableString(body.result),
    images: parseJson(body.images, []),
    videoUrl: nullableString(body.videoUrl),
    content: nullableString(body.content),
    isPublished: parseBoolean(body.isPublished),
    seoTitle: nullableString(body.seoTitle),
    seoDesc: nullableString(body.seoDesc),
  };
}

export async function GET() {
  const items = await prisma.case.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const slugCheck = validateSlug(body.slug);
  if (!slugCheck.valid) {
    return NextResponse.json({ success: false, message: slugCheck.message }, { status: 400 });
  }
  body.slug = slugCheck.slug;
  const item = await prisma.case.create({ data: caseData(body) });
  return NextResponse.json({ success: true, message: '案例已新增。', item });
}
