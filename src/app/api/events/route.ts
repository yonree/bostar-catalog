import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eventSchema, validateBody } from '@/lib/validation';
import { AppError } from '@/lib/errors';
import { sendFeishuBehaviorCard } from '@/lib/feishu';
import { INTENT_LEVELS } from '@/lib/constants';

// Fast in-memory rate limiting
const eventRateMap = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 60 events/min per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const rate = eventRateMap.get(ip);

    if (rate && rate.count >= 60 && now < rate.resetAt) {
      return new NextResponse(null, { status: 204 });
    }

    if (!rate || now > rate.resetAt) {
      eventRateMap.set(ip, { count: 1, resetAt: now + 60000 });
    } else {
      rate.count++;
    }

    const body = await request.json();
    const data = validateBody(eventSchema, body);

    // Determine intent level
    let intentLevel = 'L1';
    const eventMapping: Record<string, string> = {
      product_view: 'L2',
      search: 'L2',
      video_play: 'L3',
      video_progress: 'L3',
      document_download: 'L4',
      phone_click: 'L4',
      wechat_click: 'L4',
      whatsapp_click: 'L4',
      inquiry_submit: 'L5',
      ai_chat_start: 'L2',
      ai_transfer_human: 'L4',
    };
    intentLevel = eventMapping[data.eventType] || 'L1';

    // Resolve salesperson slug to ID
    let salespersonId: string | null = null;
    if (data.salespersonId) {
      const sp = await prisma.salesperson.findFirst({
        where: { OR: [{ id: data.salespersonId }, { slug: data.salespersonId }], isActive: true },
      });
      if (sp) salespersonId = sp.id;
    }

    const event = await prisma.visitorEvent.create({
      data: {
        visitorId: data.visitorId,
        sessionId: data.sessionId,
        salespersonId,
        eventType: data.eventType,
        pageUrl: data.pageUrl,
        pageTitle: data.pageTitle || null,
        productId: data.productId || null,
        documentId: data.documentId || null,
        videoId: data.videoId || null,
        keyword: data.keyword || null,
        duration: data.duration || null,
        intentLevel,
        userAgent: request.headers.get('user-agent') || null,
        referrer: request.headers.get('referer') || null,
      },
    });

    // Fire Feishu for high-intent events
    if (['L4', 'L5'].includes(intentLevel)) {
      try {
        await sendFeishuBehaviorCard(event);
      } catch {
        // Non-critical
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof AppError) {
      return new NextResponse(JSON.stringify({ success: false, error: { code: error.code, message: error.message } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // Always return success for tracking events to not break UX
    return new NextResponse(null, { status: 204 });
  }
}
