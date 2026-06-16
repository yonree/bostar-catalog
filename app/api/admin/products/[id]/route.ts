import { NextResponse } from 'next/server';
import { nullableString, numberValue, parseBoolean, parseJson, parseSpecsJson, validateSlug } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function productData(body: Record<string, unknown>) {
  return {
    categoryId: body.categoryId ? String(body.categoryId) : undefined,
    name: String(body.name || ''),
    slug: String(body.slug || ''),
    model: nullableString(body.model),
    shortDefinition: nullableString(body.shortDefinition),
    summary: nullableString(body.summary),
    description: nullableString(body.description),
    mainImage: nullableString(body.mainImage),
    gallery: parseJson(body.gallery, []),
    applicableCraft: nullableString(body.applicableCraft),
    application: nullableString(body.application),
    functions: parseJson(body.functions, []),
    sellingPoints: parseJson(body.sellingPoints, []),
    specs: parseSpecsJson(body.specs),
    structure: nullableString(body.structure),
    workingPrinciple: nullableString(body.workingPrinciple),
    operationSteps: parseJson(body.operationSteps, []),
    suitableIndustries: parseJson(body.suitableIndustries, []),
    unsuitableScenes: nullableString(body.unsuitableScenes),
    standardConfig: parseJson(body.standardConfig, []),
    optionalParts: parseJson(body.optionalParts, []),
    maintenance: nullableString(body.maintenance),
    troubleshooting: nullableString(body.troubleshooting),
    aiSummary: nullableString(body.aiSummary),
    isFeatured: parseBoolean(body.isFeatured),
    isPublished: parseBoolean(body.isPublished),
    sortOrder: numberValue(body.sortOrder),
    seoTitle: nullableString(body.seoTitle),
    seoDesc: nullableString(body.seoDesc),
    seoKeywords: nullableString(body.seoKeywords),
    canonicalUrl: nullableString(body.canonicalUrl),
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
  const item = await prisma.product.update({ where: { id }, data: productData(body) as any });
  return NextResponse.json({ success: true, message: '产品已更新。', item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true, message: '产品已删除。' });
}
