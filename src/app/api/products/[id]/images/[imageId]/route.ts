import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { imageSchema, validateBody } from '@/lib/validation';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError } from '@/lib/errors';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'images:write') && !hasPermission(user, 'products:write'))
      return errorResponse(new AuthorizationError());

    const { imageId } = await params;
    const body = await request.json();
    const data = validateBody(imageSchema.partial(), body);

    const image = await prisma.productImage.update({ where: { id: imageId }, data });
    return successResponse(image);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'images:write') && !hasPermission(user, 'products:write'))
      return errorResponse(new AuthorizationError());

    const { imageId } = await params;
    await prisma.productImage.delete({ where: { id: imageId } });
    return successResponse({ deleted: true });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
