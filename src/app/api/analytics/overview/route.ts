import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { AppError, AuthenticationError, AuthorizationError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'analytics:read')) return errorResponse(new AuthorizationError());

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;

    const since = new Date();
    since.setDate(since.getDate() - days);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalEvents, totalInquiries, todayEvents, weeklyEvents, monthlyEvents] = await Promise.all([
      prisma.visitorEvent.count({ where: { createdAt: { gte: since } } }),
      prisma.inquiry.count({ where: { createdAt: { gte: since } } }),
      prisma.visitorEvent.count({ where: { createdAt: { gte: today } } }),
      prisma.visitorEvent.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.visitorEvent.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    ]);

    const highIntentCount = await prisma.visitorEvent.count({
      where: { createdAt: { gte: since }, intentLevel: { in: ['L4', 'L5'] } },
    });

    // Top products
    const topProducts = await prisma.visitorEvent.groupBy({
      by: ['productId'],
      where: { productId: { not: null }, createdAt: { gte: since } },
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 10,
    });

    const productDetails = await Promise.all(
      topProducts.filter(p => p.productId).map(async (p) => {
        const prod = await prisma.product.findUnique({
          where: { id: p.productId! },
          select: { id: true, name: true, slug: true, mainImage: true },
        });
        return { product: prod, views: p._count.productId };
      })
    );

    // Top keywords
    const topKeywords = await prisma.visitorEvent.groupBy({
      by: ['keyword'],
      where: { keyword: { not: null }, eventType: 'search', createdAt: { gte: since } },
      _count: { keyword: true },
      orderBy: { _count: { keyword: 'desc' } },
      take: 10,
    });

    // Download count
    const downloadCount = await prisma.visitorEvent.count({
      where: { eventType: 'document_download', createdAt: { gte: since } },
    });

    // Video play count
    const videoPlayCount = await prisma.visitorEvent.count({
      where: { eventType: { in: ['video_play', 'video_progress'] }, createdAt: { gte: since } },
    });

    // Daily trend
    const dailyTrend: { date: string; views: number; inquiries: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const [views, inquiries] = await Promise.all([
        prisma.visitorEvent.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
        prisma.inquiry.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
      ]);

      dailyTrend.push({
        date: dayStart.toISOString().split('T')[0],
        views,
        inquiries,
      });
    }

    return successResponse({
      todayVisits: todayEvents,
      weekVisits: weeklyEvents,
      monthVisits: monthlyEvents,
      totalInquiries,
      highIntentCount,
      topProducts: productDetails.filter((p) => p.product),
      topKeywords: topKeywords.map((k) => ({ keyword: k.keyword, count: k._count.keyword })),
      downloadCount,
      videoPlayCount,
      dailyTrend,
    });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
