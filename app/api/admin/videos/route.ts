import { NextResponse } from 'next/server';
import { nullableString, parseBoolean, parseJson, validateSlug } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function videoData(body: Record<string, unknown>) {
  return {
    title: String(body.title || ''),
    slug: String(body.slug || ''),
    videoUrl: String(body.videoUrl || ''),
    coverImage: nullableString(body.coverImage),
    summary: nullableString(body.summary),
    transcript: nullableString(body.transcript),
    steps: parseJson(body.steps, []),
    keyPoints: parseJson(body.keyPoints, []),
    scene: nullableString(body.scene),
    isPublished: parseBoolean(body.isPublished),
    seoTitle: nullableString(body.seoTitle),
    seoDesc: nullableString(body.seoDesc),
  };
}

export async function GET() {
  const items = await prisma.video.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const slugCheck = validateSlug(body.slug);
  if (!slugCheck.valid) {
    return NextResponse.json({ success: false, message: slugCheck.message }, { status: 400 });
  }
  body.slug = slugCheck.slug;
  const item = await prisma.video.create({ data: videoData(body) });
  return NextResponse.json({ success: true, message: '视频已新增。', item });
}
