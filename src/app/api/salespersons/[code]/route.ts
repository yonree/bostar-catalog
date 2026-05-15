import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { AppError, NotFoundError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const salesperson = await prisma.salesperson.findFirst({
      where: { OR: [{ slug: code }, { id: code }], isActive: true },
    });

    if (!salesperson) return errorResponse(new NotFoundError('业务员'));

    return successResponse({
      id: salesperson.id,
      name: salesperson.name,
      title: salesperson.title,
      phone: salesperson.phone,
      wechatQr: salesperson.wechatQr,
      whatsapp: salesperson.whatsapp,
      email: salesperson.email,
      region: salesperson.region,
      slug: salesperson.slug,
      exclusiveUrl: salesperson.exclusiveUrl,
    });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
