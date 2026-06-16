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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const slugCheck = validateSlug(body.slug);
  if (!slugCheck.valid) {
    return NextResponse.json({ success: false, message: slugCheck.message }, { status: 400 });
  }
  body.slug = slugCheck.slug;
  const item = await prisma.solution.update({ where: { id }, data: solutionData(body) });
  return NextResponse.json({ success: true, message: '方案已更新。', item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.solution.delete({ where: { id } });
  return NextResponse.json({ success: true, message: '方案已删除。' });
}
