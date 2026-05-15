import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inquiryUpdateSchema, validateBody } from '@/lib/validation';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError, NotFoundError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());

    const { id } = await params;
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        product: true,
        salesperson: true,
        handledBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!inquiry) return errorResponse(new NotFoundError('询盘'));

    return successResponse(inquiry);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'inquiries:write')) return errorResponse(new AuthorizationError());

    const { id } = await params;
    const body = await request.json();
    const data = validateBody(inquiryUpdateSchema, body);

    const updateData: Record<string, unknown> = {};
    if (data.followStatus) updateData.followStatus = data.followStatus;
    if (data.intentLevel) updateData.intentLevel = data.intentLevel;
    if (data.remark !== undefined) updateData.remark = data.remark;
    if (data.handledById !== undefined) updateData.handledById = data.handledById;
    if (data.nextFollowTime) updateData.nextFollowTime = new Date(data.nextFollowTime);

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: updateData,
      include: {
        product: { select: { id: true, name: true } },
        salesperson: { select: { id: true, name: true } },
      },
    });

    return successResponse(inquiry);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
