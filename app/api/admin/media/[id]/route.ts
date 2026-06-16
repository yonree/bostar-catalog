import { NextResponse } from 'next/server';
import { nullableString, numberValue } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function mediaData(body: Record<string, unknown>) {
  return {
    filename: String(body.filename || ''),
    url: String(body.url || ''),
    mimeType: nullableString(body.mimeType),
    size: numberValue(body.size),
    alt: nullableString(body.alt),
    title: nullableString(body.title),
    description: nullableString(body.description),
  };
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const item = await prisma.mediaAsset.update({ where: { id }, data: mediaData(body) });
  return NextResponse.json({ success: true, message: '媒体资源已更新。', item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.mediaAsset.delete({ where: { id } });
  return NextResponse.json({ success: true, message: '媒体资源已删除。' });
}
