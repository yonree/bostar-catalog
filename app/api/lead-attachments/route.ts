import { NextResponse } from 'next/server';
import { leadEventTypes } from '@/lib/lead/constants';
import { getLeadRepository } from '@/lib/lead/repository';
import { assertSameOriginRequest, consumeRateLimit, getClientIp } from '@/lib/lead/security';
import { storeLeadAttachment } from '@/lib/lead/storage';
import { makeUploadToken } from '@/lib/lead/utils';

export async function POST(request: Request) {
  if (!assertSameOriginRequest(request)) {
    return NextResponse.json({ success: false, message: '非法请求来源。' }, { status: 403 });
  }

  const rateLimit = consumeRateLimit(`lead-upload:${getClientIp(request)}`, {
    limit: Number(process.env.LEAD_UPLOAD_RATE_LIMIT || 6),
    windowMs: Number(process.env.LEAD_UPLOAD_RATE_WINDOW_MS || 60_000),
  });
  if (!rateLimit.ok) {
    return NextResponse.json({ success: false, message: '上传过于频繁，请稍后再试。' }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ success: false, message: '请选择附件文件。' }, { status: 400 });
  }

  try {
    const stored = await storeLeadAttachment(file);
    const repository = getLeadRepository();
    const uploadToken = makeUploadToken();
    const draft = await repository.createAttachmentDraft({
      uploadToken,
      originalFilename: stored.originalFilename,
      safeFilename: stored.safeFilename,
      storageProvider: stored.storageProvider,
      storagePath: stored.storagePath,
      storageKey: stored.storageKey,
      storageUrl: stored.storageUrl || null,
      mimeType: stored.mimeType,
      extension: stored.extension,
      sizeBytes: stored.sizeBytes,
      accessStatus: 'temporary',
      scanStatus: process.env.LEAD_ATTACHMENT_SCAN_REQUIRED === 'true' ? 'pending' : 'accepted_without_scan',
      expiresAt: new Date(Date.now() + Number(process.env.LEAD_ATTACHMENT_TTL_HOURS || 24) * 60 * 60 * 1000),
    });

    return NextResponse.json({
      success: true,
      attachmentToken: draft.uploadToken,
      filename: draft.originalFilename,
      mimeType: draft.mimeType,
      size: draft.sizeBytes,
      scanStatus: draft.scanStatus,
      eventType: leadEventTypes.attachmentUploaded,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '附件上传失败，请稍后再试。',
      },
      { status: 400 }
    );
  }
}
