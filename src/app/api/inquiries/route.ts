import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inquirySchema, validateBody } from '@/lib/validation';
import { successResponse, paginatedResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError } from '@/lib/errors';
import { sendFeishuInquiryCard } from '@/lib/feishu';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = validateBody(inquirySchema, body);

    // Get salesperson from cookie if not in body
    const cookieStore = await cookies();
    const salesRef = data.salespersonId || cookieStore.get('bostar_ref')?.value || null;

    // Resolve salesperson if slug provided
    let salespersonId: string | null = null;
    if (salesRef) {
      const sp = await prisma.salesperson.findFirst({
        where: { OR: [{ id: salesRef }, { slug: salesRef }], isActive: true },
      });
      if (sp) salespersonId = sp.id;
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        customerName: data.customerName,
        company: data.company || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        email: data.email || null,
        region: data.region || null,
        productId: data.productId || null,
        requirement: data.requirement,
        sourcePage: data.sourcePage || null,
        salespersonId,
        sourceType: data.sourceType || 'public',
        needQuote: data.needQuote ?? false,
        needSample: data.needSample ?? false,
      },
      include: { product: true, salesperson: true },
    });

    // Fire Feishu notification
    try {
      await sendFeishuInquiryCard(inquiry);
    } catch {
      // Non-critical: don't fail the request
    }

    return successResponse(inquiry);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    console.error('Inquiry POST error:', error);
    return internalErrorResponse();
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'inquiries:read')) return errorResponse(new AuthorizationError());

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || undefined;

    const where: Record<string, unknown> = {};

    // Salespersons only see their own inquiries
    if (user.role === 'salesperson') {
      const sp = await prisma.salesperson.findUnique({ where: { userId: user.id } });
      if (sp) where.salespersonId = sp.id;
    }

    if (status) where.followStatus = status;

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          product: { select: { id: true, name: true, slug: true } },
          salesperson: { select: { id: true, name: true, slug: true } },
          handledBy: { select: { id: true, name: true } },
        },
      }),
      prisma.inquiry.count({ where }),
    ]);

    return paginatedResponse(inquiries, page, limit, total);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
