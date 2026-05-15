import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parameterSchema, validateBody } from '@/lib/validation';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError, NotFoundError } from '@/lib/errors';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; paramId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'products:write')) return errorResponse(new AuthorizationError());

    const { paramId } = await params;
    const body = await request.json();
    const data = validateBody(parameterSchema.partial(), body);

    const param = await prisma.productParameter.update({ where: { id: paramId }, data });
    return successResponse(param);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; paramId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'products:write')) return errorResponse(new AuthorizationError());

    const { paramId } = await params;
    await prisma.productParameter.delete({ where: { id: paramId } });
    return successResponse({ deleted: true });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
