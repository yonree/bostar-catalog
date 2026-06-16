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

export async function GET() {
  const items = await prisma.mediaAsset.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const item = await prisma.mediaAsset.create({ data: mediaData(body) });
  return NextResponse.json({ success: true, message: '媒体资源已新增。', item });
}
