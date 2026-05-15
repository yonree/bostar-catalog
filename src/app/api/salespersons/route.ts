import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { salespersonSchema, validateBody } from '@/lib/validation';
import { successResponse, paginatedResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'salespersons:read')) return errorResponse(new AuthorizationError());

    const salespersons = await prisma.salesperson.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { inquiries: true, events: true } },
        user: { select: { email: true, status: true } },
      },
    });

    return successResponse(salespersons);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'salespersons:write')) return errorResponse(new AuthorizationError());

    const body = await request.json();
    const data = validateBody(salespersonSchema, body);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const salesperson = await prisma.salesperson.create({
      data: {
        name: data.name,
        department: data.department || 'domestic',
        title: data.title || null,
        phone: data.phone || null,
        wechatQr: data.wechatQr || null,
        whatsapp: data.whatsapp || null,
        email: data.email || null,
        region: data.region || null,
        productLines: data.productLines || [],
        slug: data.slug,
        exclusiveUrl: `${baseUrl}?sales=${data.slug}`,
        isActive: data.isActive ?? true,
        roleLevel: data.roleLevel || 'sales',
      },
    });

    return successResponse(salesperson);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
