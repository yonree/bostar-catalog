import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';
const MAX_SIZE = (Number(process.env.MAX_UPLOAD_SIZE_MB) || 10) * 1024 * 1024;

const ALLOWED_IMAGES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
const ALLOWED_VIDEOS = ['video/mp4', 'video/webm'];
const ALLOWED_DOCS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export async function uploadFile(
  file: File,
  subDir: string = 'general'
): Promise<UploadResult> {
  if (file.size > MAX_SIZE) {
    throw new Error(`文件大小超过限制 (${process.env.MAX_UPLOAD_SIZE_MB || 10}MB)`);
  }

  const ext = path.extname(file.name).toLowerCase();
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const uploadPath = path.join(UPLOAD_DIR, subDir);
  const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), uploadPath, uniqueName);

  await mkdir(path.dirname(fullPath), { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  const publicUrl = `/${uploadPath.replace(/\\/g, '/')}/${uniqueName}`;

  return {
    url: publicUrl,
    filename: uniqueName,
    size: file.size,
    mimeType: file.type,
  };
}

export function getAllowedMimeTypes(type: 'image' | 'video' | 'document'): string[] {
  switch (type) {
    case 'image': return ALLOWED_IMAGES;
    case 'video': return ALLOWED_VIDEOS;
    case 'document': return ALLOWED_DOCS;
  }
}

export function validateFileType(file: File, type: 'image' | 'video' | 'document'): boolean {
  const allowed = getAllowedMimeTypes(type);
  return allowed.includes(file.type);
}
