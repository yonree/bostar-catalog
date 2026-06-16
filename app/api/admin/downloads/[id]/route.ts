import { NextResponse } from 'next/server';
import { nullableString, parseBoolean, validateSlug } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function downloadData(body: Record<string, unknown>) {
  return {
    title: String(body.title || ''),
    slug: String(body.slug || ''),
    fileUrl: String(body.fileUrl || ''),
    fileType: nullableString(body.fileType),
    fileSize: nullableString(body.fileSize),
    version: nullableString(body.version),
    summary: nullableString(body.summary),
    catalogPreview: nullableString(body.catalogPreview),
    requireLeadForm: parseBoolean(body.requireLeadForm),
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
  const item = await prisma.download.update({ where: { id }, data: downloadData(body) });
  return NextResponse.json({ success: true, message: '资料已更新。', item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.download.delete({ where: { id } });
  return NextResponse.json({ success: true, message: '资料已删除。' });
}
