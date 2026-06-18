import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { leadEventTypes } from '@/lib/lead/constants';
import { getLeadRepository } from '@/lib/lead/repository';
import { verifyWebhookSignature } from '@/lib/webhook';

export async function POST(request: Request) {
  const bodyText = await request.text();
  const requestUrl = new URL(request.url);
  let body: {
    eventType?: string;
    payload?: {
      leadId?: string;
    };
  } = {};

  try {
    body = JSON.parse(bodyText) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const provider =
    request.headers.get('x-bostar-provider') ||
    (requestUrl.searchParams.get('provider') || 'internal-test');
  const timestamp = request.headers.get('x-bostar-timestamp') || '';
  const signature = request.headers.get('x-bostar-signature') || '';

  if (!verifyWebhookSignature(provider, timestamp, bodyText, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const leadId = body.payload?.leadId || '';
  if (leadId) {
    await getLeadRepository().appendLeadEvent({
      leadId,
      eventType: leadEventTypes.webhookReceived,
      actor: 'test-webhook-receiver',
      detail: {
        provider,
        requestId: request.headers.get('x-bostar-request-id') || randomUUID(),
        eventType: body.eventType || '',
      },
    });
  }

  return NextResponse.json({ ok: true }, { headers: { 'x-request-id': randomUUID() } });
}
