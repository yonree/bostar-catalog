import { createHmac, randomUUID } from 'crypto';
import { setTimeout as sleep } from 'timers/promises';
import type { LeadNotificationEnvelope, NotificationDispatchItem } from '@/lib/lead/types';

type WebhookTarget = {
  provider: string;
  url: string;
  secret?: string;
};

type SendWebhookNotificationInput = {
  eventType: string;
  payload: LeadNotificationEnvelope;
};

function getWebhookTargets(): WebhookTarget[] {
  return [
    {
      provider: 'feishu',
      url: process.env.WEBHOOK_FEISHU_URL || '',
      secret: process.env.WEBHOOK_FEISHU_SECRET || '',
    },
    {
      provider: 'wechat',
      url: process.env.WEBHOOK_WECHAT_URL || '',
      secret: process.env.WEBHOOK_WECHAT_SECRET || '',
    },
  ].filter((item) => item.url);
}

function createSignature(secret: string, timestamp: string, body: string) {
  if (!secret) {
    return '';
  }

  return createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
}

function getWebhookSecretByProvider(provider: string) {
  if (provider === 'feishu') {
    return process.env.WEBHOOK_FEISHU_SECRET || '';
  }

  if (provider === 'wechat') {
    return process.env.WEBHOOK_WECHAT_SECRET || '';
  }

  return '';
}

async function postWebhook(
  target: WebhookTarget,
  eventType: string,
  payload: LeadNotificationEnvelope,
  idempotencyKey: string
) {
  const timestamp = String(Date.now());
  const requestId = randomUUID();
  const body = JSON.stringify({
    eventType,
    payloadVersion: 'v1',
    timestamp,
    requestId,
    payload,
  });
  const timeoutMs = Number(process.env.WEBHOOK_TIMEOUT_MS || 5000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(target.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bostar-Event': eventType,
        'X-Bostar-Provider': target.provider,
        'X-Bostar-Request-Id': requestId,
        'X-Bostar-Idempotency-Key': idempotencyKey,
        'X-Bostar-Timestamp': timestamp,
        ...(target.secret
          ? {
              'X-Bostar-Signature': createSignature(target.secret, timestamp, body),
            }
          : {}),
      },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}`);
    }

    return {
      ok: true as const,
      requestId,
      messageId: response.headers.get('x-request-id') || requestId,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function verifyWebhookSignature(provider: string, timestamp: string, body: string, signature: string) {
  const secret = getWebhookSecretByProvider(provider);
  if (!secret) {
    return true;
  }

  if (!timestamp || !signature) {
    return false;
  }

  return createSignature(secret, timestamp, body) === signature;
}

async function dispatchToTarget(
  target: WebhookTarget,
  eventType: string,
  payload: LeadNotificationEnvelope
): Promise<NotificationDispatchItem> {
  const retries = Number(process.env.WEBHOOK_RETRY_COUNT || 2);
  const idempotencyKey = createHmac('sha256', 'bostar-webhook').update(`${eventType}:${target.url}:${payload.leadId}`).digest('hex');

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      const result = await postWebhook(target, eventType, payload, idempotencyKey);
      return {
        channel: 'webhook' as const,
        provider: target.provider,
        recipient: target.url,
        idempotencyKey,
        ok: true,
        requestId: result.requestId,
        messageId: result.messageId,
        attempts: attempt,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.name === 'AbortError'
            ? 'Webhook request timed out'
            : error.message
          : 'Unknown webhook error';

      if (attempt > retries) {
        return {
          channel: 'webhook' as const,
          provider: target.provider,
          recipient: target.url,
          idempotencyKey,
          ok: false,
          error: message,
          attempts: attempt,
        };
      }

      await sleep(250 * 2 ** (attempt - 1));
    }
  }

  return {
    channel: 'webhook' as const,
    provider: target.provider,
    recipient: target.url,
    idempotencyKey,
    ok: false,
    error: 'Webhook dispatch failed',
    attempts: retries + 1,
  };
}

export async function sendWebhookNotification(
  input: SendWebhookNotificationInput
): Promise<{ ok: boolean; items: NotificationDispatchItem[] }> {
  const targets = getWebhookTargets();

  if (!targets.length) {
    return {
      ok: true,
      items: [
        {
          channel: 'webhook',
          provider: 'webhook',
          recipient: '',
          idempotencyKey: createHmac('sha256', 'bostar-webhook').update(`skip:${input.payload.leadId}`).digest('hex'),
          ok: false,
          skipped: true,
          error: 'Webhook target is not configured',
          attempts: 0,
        },
      ],
    };
  }

  const items = await Promise.all(targets.map((target) => dispatchToTarget(target, input.eventType, input.payload)));
  return {
    ok: items.every((item) => item.ok || item.skipped),
    items,
  };
}
