import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productSchema, validateBody } from '@/lib/validation';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError, NotFoundError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include') || '';

    const includeRelations: Record<string, boolean | object> = {
      category: true,
      _count: { select: { images: true, videos: true, documents: true } },
    };

    if (include.includes('parameters')) includeRelations.parameters = { orderBy: { sortOrder: 'asc' } };
    if (include.includes('images')) includeRelations.images = { orderBy: { sortOrder: 'asc' }, where: { isPublic: true } };
    if (include.includes('videos')) includeRelations.videos = { orderBy: { sortOrder: 'asc' }, where: { isPublic: true } };
    if (include.includes('documents')) includeRelations.documents = { orderBy: { updatedAt: 'desc' } };
    if (include.includes('faqs')) includeRelations.faqs = { orderBy: { sortOrder: 'asc' }, where: { isPublic: true } };

    // Try to find by ID first, then by slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: includeRelations,
    });

    if (!product) return errorResponse(new NotFoundError('产品'));

    return successResponse(product);
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
    if (!hasPermission(user, 'products:write')) return errorResponse(new AuthorizationError());

    const { id } = await params;
    const body = await request.json();
    const data = validateBody(productSchema.partial(), body);

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return successResponse(product);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'products:delete')) return errorResponse(new AuthorizationError());

    const { id } = await params;

    await prisma.product.update({
      where: { id },
      data: { isPublished: false, completenessLevel: 'D' },
    });

    return successResponse({ archived: true });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
