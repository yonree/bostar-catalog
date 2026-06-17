import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PRIMARY_SITE_ORIGIN } from '@/lib/site-origin';

const defaultImagePath = '/images/product-gun-render.png';

function sanitizeFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-');
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const rawFilename = decodeURIComponent(path[path.length - 1] || '').trim();
  if (!rawFilename) {
    return NextResponse.redirect(new URL(defaultImagePath, PRIMARY_SITE_ORIGIN), 307);
  }

  const safeName = sanitizeFilename(rawFilename);

  const item = await prisma.mediaAsset.findFirst({
    where: {
      OR: [
        { filename: { equals: rawFilename, mode: 'insensitive' } },
        { filename: { equals: safeName, mode: 'insensitive' } },
        { url: { contains: `/${safeName}`, mode: 'insensitive' } },
        { url: { contains: rawFilename, mode: 'insensitive' } },
      ],
    },
    orderBy: { updatedAt: 'desc' },
  });

  if (item?.url) {
    return NextResponse.redirect(item.url, 307);
  }

  return NextResponse.redirect(new URL(defaultImagePath, PRIMARY_SITE_ORIGIN), 307);
}
