import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { faqSchema, validateBody } from '@/lib/validation';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faqs = await prisma.productFAQ.findMany({
      where: { productId: id, isPublic: true },
      orderBy: { sortOrder: 'asc' },
    });
    return successResponse(faqs);
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
    if (!hasPermission(user, 'faqs:write') && !hasPermission(user, 'products:write'))
      return errorResponse(new AuthorizationError());

    const { id } = await params;
    const body = await request.json();
    const data = validateBody(faqSchema, body);

    const faq = await prisma.productFAQ.create({
      data: { ...data, productId: id },
    });

    return successResponse(faq);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
