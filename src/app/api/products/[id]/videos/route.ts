import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { videoSchema, validateBody } from '@/lib/validation';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const videos = await prisma.productVideo.findMany({
      where: { productId: id },
      orderBy: { sortOrder: 'asc' },
    });
    return successResponse(videos);
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
    if (!hasPermission(user, 'videos:write') && !hasPermission(user, 'products:write'))
      return errorResponse(new AuthorizationError());

    const { id } = await params;
    const body = await request.json();
    const data = validateBody(videoSchema, body);

    const video = await prisma.productVideo.create({
      data: { ...data, productId: id },
    });

    return successResponse(video);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
