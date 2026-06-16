import { NextResponse } from 'next/server';
import { nullableString, parseBoolean, parseJson, validateSlug } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function solutionData(body: Record<string, unknown>) {
  return {
    title: String(body.title || ''),
    slug: String(body.slug || ''),
    industry: nullableString(body.industry),
    scene: nullableString(body.scene),
    painPoints: parseJson(body.painPoints, []),
    recommendedPlan: nullableString(body.recommendedPlan),
    processFlow: parseJson(body.processFlow, []),
    keyControls: parseJson(body.keyControls, []),
    equipmentList: parseJson(body.equipmentList, []),
    advantages: parseJson(body.advantages, []),
    content: nullableString(body.content),
    coverImage: nullableString(body.coverImage),
    aiSummary: nullableString(body.aiSummary),
    isPublished: parseBoolean(body.isPublished),
    seoTitle: nullableString(body.seoTitle),
    seoDesc: nullableString(body.seoDesc),
  };
}

export async function GET() {
  const items = await prisma.solution.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const slugCheck = validateSlug(body.slug);
  if (!slugCheck.valid) {
    return NextResponse.json({ success: false, message: slugCheck.message }, { status: 400 });
  }
  body.slug = slugCheck.slug;
  const item = await prisma.solution.create({ data: solutionData(body) });
  return NextResponse.json({ success: true, message: '方案已新增。', item });
}
