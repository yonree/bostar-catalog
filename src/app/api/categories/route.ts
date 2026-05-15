import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { categorySchema, validateBody } from '@/lib/validation';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError, NotFoundError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'zh';
    const includeHidden = searchParams.get('includeHidden') === 'true';

    const where: Record<string, unknown> = {};
    if (!includeHidden) where.isVisible = true;

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: { where: { isVisible: includeHidden ? undefined : true }, orderBy: { sortOrder: 'asc' } },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const data = categories.map((c) => ({
      id: c.id,
      name: lang === 'en' && c.nameEn ? c.nameEn : c.name,
      nameEn: c.nameEn,
      slug: c.slug,
      description: lang === 'en' && c.descriptionEn ? c.descriptionEn : c.description,
      descriptionEn: c.descriptionEn,
      coverImage: c.coverImage,
      parentId: c.parentId,
      sortOrder: c.sortOrder,
      isVisible: c.isVisible,
      productCount: c._count.products,
      children: c.children.map((ch) => ({
        id: ch.id,
        name: lang === 'en' && ch.nameEn ? ch.nameEn : ch.name,
        slug: ch.slug,
        productCount: 0,
      })),
    }));

    return successResponse(data);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'categories:write')) return errorResponse(new AuthorizationError());

    const body = await request.json();
    const data = validateBody(categorySchema, body);

    const category = await prisma.category.create({
      data: {
        name: data.name,
        nameEn: data.nameEn || null,
        slug: data.slug,
        description: data.description || null,
        descriptionEn: data.descriptionEn || null,
        coverImage: data.coverImage || null,
        parentId: data.parentId || null,
        sortOrder: data.sortOrder || 0,
        isVisible: data.isVisible ?? true,
      },
    });

    return successResponse(category, undefined);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
