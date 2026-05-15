import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parameterSchema, validateBody } from '@/lib/validation';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError, NotFoundError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const params_data = await prisma.productParameter.findMany({
      where: { productId: id },
      orderBy: [{ groupName: 'asc' }, { sortOrder: 'asc' }],
    });
    return successResponse(params_data);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'products:write')) return errorResponse(new AuthorizationError());

    const { id } = await params;
    const body = await request.json();
    const data = validateBody(parameterSchema, body);

    const param = await prisma.productParameter.create({
      data: { ...data, productId: id },
    });

    return successResponse(param);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
