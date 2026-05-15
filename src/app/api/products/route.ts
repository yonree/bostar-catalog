import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productSchema, productQuerySchema, validateBody, validateQuery } from '@/lib/validation';
import { successResponse, paginatedResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError } from '@/lib/errors';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = validateQuery(productQuerySchema, searchParams);
    const { page, limit, category, search, status, lang, sort, featured, productType, export: isExport } = query;

    const where: Prisma.ProductWhereInput = {};

    if (status) {
      where.isPublished = status === 'published';
    } else {
      where.isPublished = true;
    }

    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { productCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured) where.isFeatured = true;
    if (isExport) where.isExportVisible = true;
    if (productType) where.productType = productType;

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (sort) {
      case 'latest': orderBy.createdAt = 'desc'; break;
      case 'name_asc': orderBy.name = 'asc'; break;
      case 'name_desc': orderBy.name = 'desc'; break;
      default: orderBy.sortOrder = 'asc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { id: true, name: true, nameEn: true, slug: true } },
          _count: { select: { images: true, videos: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return paginatedResponse(products, page, limit, total);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    console.error('Products GET error:', error);
    return internalErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'products:write')) return errorResponse(new AuthorizationError());

    const body = await request.json();
    const data = validateBody(productSchema, body);

    const product = await prisma.product.create({
      data: {
        productCode: data.productCode,
        model: data.model || null,
        name: data.name,
        nameEn: data.nameEn || null,
        categoryId: data.categoryId,
        productType: data.productType || 'single',
        tagline: data.tagline || null,
        taglineEn: data.taglineEn || null,
        description: data.description || null,
        descriptionEn: data.descriptionEn || null,
        sellingPoints: data.sellingPoints || [],
        sellingPointsEn: data.sellingPointsEn || [],
        applications: data.applications || [],
        applicationsEn: data.applicationsEn || [],
        mainImage: data.mainImage || null,
        isFeatured: data.isFeatured ?? false,
        isExportVisible: data.isExportVisible ?? true,
        isPublished: data.isPublished ?? false,
        completenessLevel: data.completenessLevel || 'C',
        slug: data.slug,
        sortOrder: data.sortOrder || 0,
      },
    });

    return successResponse(product);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    console.error('Products POST error:', error);
    return internalErrorResponse();
  }
}
