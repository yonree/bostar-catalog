import { randomUUID } from 'crypto';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import path from 'path';
import { del, get, put } from '@vercel/blob';
import { attachmentPolicy } from '@/lib/lead/constants';
import { normalizeExtension } from '@/lib/lead/utils';

const localUploadRoot = path.join(process.cwd(), 'artifacts', 'lead-uploads');

export type StoredAttachment = {
  originalFilename: string;
  safeFilename: string;
  storageProvider: string;
  storagePath: string;
  storageKey: string;
  storageUrl?: string;
  mimeType: string;
  extension: string;
  sizeBytes: number;
};

function sanitizeFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function assertAttachmentType(file: File) {
  const extension = normalizeExtension(file.name);
  if (!attachmentPolicy.allowedExtensions.includes(extension as (typeof attachmentPolicy.allowedExtensions)[number])) {
    throw new Error('Only JPG, PNG, WEBP and PDF attachments are allowed.');
  }

  if (!attachmentPolicy.allowedMimeTypes.includes(file.type as (typeof attachmentPolicy.allowedMimeTypes)[number])) {
    throw new Error('The uploaded file type is not allowed.');
  }

  if (file.size > attachmentPolicy.maxFileSizeBytes) {
    throw new Error('Attachment size exceeds the 10MB limit.');
  }

  return extension;
}

async function storeToLocal(file: File, storageKey: string) {
  await mkdir(localUploadRoot, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  const fullPath = path.join(localUploadRoot, storageKey);
  await writeFile(fullPath, bytes);
  return { storagePath: fullPath, storageUrl: undefined };
}

async function storeToBlob(file: File, storageKey: string) {
  const blob = await put(storageKey, file, {
    access: 'private',
    addRandomSuffix: false,
    contentType: file.type,
  });
  return { storagePath: blob.pathname, storageUrl: blob.url };
}

export async function storeLeadAttachment(file: File): Promise<StoredAttachment> {
  const extension = assertAttachmentType(file);
  const safeFilename = sanitizeFilename(file.name || `attachment${extension}`) || `attachment${extension}`;
  const storageKey = `lead-attachments/${randomUUID()}${extension}`;

  const provider =
    process.env.UPLOAD_PROVIDER === 'blob' || process.env.BLOB_READ_WRITE_TOKEN ? 'vercel-blob' : 'local';
  const { storagePath, storageUrl } =
    provider === 'vercel-blob'
      ? await storeToBlob(file, storageKey)
      : await storeToLocal(file, storageKey.replaceAll('/', path.sep));

  return {
    originalFilename: file.name || safeFilename,
    safeFilename,
    storageProvider: provider,
    storagePath,
    storageKey,
    storageUrl,
    mimeType: file.type,
    extension,
    sizeBytes: file.size,
  };
}

export async function deleteStoredLeadAttachment(attachment: {
  storageProvider: string;
  storagePath: string;
  storageKey: string;
  storageUrl?: string | null;
}) {
  if (attachment.storageProvider === 'vercel-blob') {
    await del(attachment.storagePath || attachment.storageUrl || attachment.storageKey);
    return;
  }

  await rm(attachment.storagePath, { force: true });
}

export async function readStoredLeadAttachment(attachment: {
  storageProvider: string;
  storagePath: string;
  storageKey: string;
}) {
  if (attachment.storageProvider === 'vercel-blob') {
    const result = await get(attachment.storagePath || attachment.storageKey, { access: 'private', useCache: false });
    if (!result || result.statusCode !== 200) {
      throw new Error('Attachment not found');
    }

    const chunks: Uint8Array[] = [];
    const reader = result.stream.getReader();
    while (true) {
      const part = await reader.read();
      if (part.done) {
        break;
      }
      chunks.push(part.value);
    }

    return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
  }

  return readFile(attachment.storagePath);
}
