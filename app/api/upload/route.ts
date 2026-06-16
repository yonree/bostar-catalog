import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { adminAuth, isValidAdminSessionToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function sanitizeFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${adminAuth.cookieName}=`))
    ?.split('=')[1];

  if (!isValidAdminSessionToken(token)) {
    return NextResponse.json({ success: false, message: '未登录或登录已失效。' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { success: false, message: '未配置 BLOB_READ_WRITE_TOKEN，当前环境还不能上传图片。' },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const title = String(formData.get('title') || '');
  const alt = String(formData.get('alt') || '');
  const description = String(formData.get('description') || '');

  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ success: false, message: '请选择图片文件。' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ success: false, message: '只允许上传图片文件。' }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { success: false, message: '图片大小不能超过 10MB。' },
      { status: 400 }
    );
  }

  const safeName = sanitizeFilename(file.name || 'image');
  const blob = await put(`uploads/${Date.now()}-${safeName}`, file, {
    access: 'public',
    addRandomSuffix: false,
  });

  const item = await prisma.mediaAsset.create({
    data: {
      filename: file.name || safeName,
      url: blob.url,
      mimeType: file.type || null,
      size: file.size,
      alt: alt || null,
      title: title || null,
      description: description || null,
    },
  });

  return NextResponse.json({ success: true, message: '图片已上传到媒体库。', item });
}
