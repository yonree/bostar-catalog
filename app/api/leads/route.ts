import { NextResponse } from 'next/server';
import { createLeadSubmission } from '@/lib/lead/service';
import { assertSameOriginRequest, consumeRateLimit, getClientIp } from '@/lib/lead/security';
import { parseLeadSubmission } from '@/lib/validators';

export async function POST(request: Request) {
  if (!assertSameOriginRequest(request)) {
    return NextResponse.json({ success: false, message: '非法请求来源。' }, { status: 403 });
  }

  const rateLimit = consumeRateLimit(`lead:${getClientIp(request)}`, {
    limit: Number(process.env.LEAD_FORM_RATE_LIMIT || 8),
    windowMs: Number(process.env.LEAD_FORM_RATE_WINDOW_MS || 60_000),
  });
  if (!rateLimit.ok) {
    return NextResponse.json(
      { success: false, message: '提交过于频繁，请稍后再试。' },
      {
        status: 429,
        headers: rateLimit.retryAfterMs ? { 'Retry-After': String(Math.ceil(rateLimit.retryAfterMs / 1000)) } : undefined,
      }
    );
  }

  const body = (await request.json()) as Record<string, unknown>;
  const validation = parseLeadSubmission(body);
  if (!validation.ok) {
    return NextResponse.json({ success: false, message: validation.message }, { status: 400 });
  }

  try {
    const result = await createLeadSubmission({
      ...validation.data,
      referrer: validation.data.referrer || request.headers.get('referer') || undefined,
    });

    const locale = result.lead.locale === 'en' ? 'en' : 'zh-CN';
    return NextResponse.json({
      success: true,
      message:
        locale === 'en'
          ? 'Inquiry submitted. Our sales or application team will respond during business hours.'
          : '需求已提交，我们将在工作时间内尽快响应。',
      inquiryNumber: result.lead.inquiryNumber,
      redirectUrl: locale === 'en' ? '/en/thank-you' : '/thank-you',
      notificationStatus: result.notificationSummary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lead creation failed';
    return NextResponse.json(
      {
        success: false,
        message: /attachment/i.test(message) ? '附件已失效或上传未完成，请重新上传后再试。' : '提交失败，请稍后重试。',
        error: process.env.NODE_ENV === 'development' ? message : undefined,
      },
      { status: 500 }
    );
  }
}
