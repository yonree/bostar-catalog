import { NextResponse } from 'next/server';
import { adminAuth, isValidAdminSessionToken } from '@/lib/auth';
import { getLeadRepository } from '@/lib/lead/repository';
import { readStoredLeadAttachment } from '@/lib/lead/storage';

function getAdminToken(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${adminAuth.cookieName}=`))
    ?.split('=')[1];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  if (!isValidAdminSessionToken(getAdminToken(request))) {
    return NextResponse.json({ success: false, message: '未登录或登录已失效。' }, { status: 401 });
  }

  const { id, attachmentId } = await params;
  const attachment = await getLeadRepository().getAttachmentForAdmin(attachmentId, id);
  if (!attachment) {
    return NextResponse.json({ success: false, message: '附件不存在。' }, { status: 404 });
  }

  const file = await readStoredLeadAttachment(attachment);
  return new NextResponse(file, {
    headers: {
      'Content-Type': attachment.mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(attachment.originalFilename)}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
