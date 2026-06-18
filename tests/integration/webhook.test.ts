import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { sendWebhookNotification } from '@/lib/webhook';
import type { LeadNotificationEnvelope } from '@/lib/lead/types';

const payload: LeadNotificationEnvelope = {
  leadId: 'lead_1',
  inquiryNumber: 'BS-1',
  locale: 'zh-CN',
  demandType: '获取报价',
  name: '张三',
  company: '博士达',
  phone: '13800000000',
  email: '',
  wechat: '',
  whatsapp: '',
  country: '中国',
  sourcePage: '/contact',
  sourceType: 'contact',
  interestedProduct: '粉末喷枪',
  interestedProductModel: '',
  interestedSolution: '',
  target: '获取报价',
  workpiece: '钣金件',
  workpieceMaterial: '钢',
  coatingMaterial: '环氧粉末',
  capacity: '100/day',
  message: '需要配置建议',
  attachmentNames: [],
  attachmentCount: 0,
  assignedTo: 'cn-sales',
  backupAssignee: 'backup',
  dueAt: new Date().toISOString(),
};

function withEnv(values: Record<string, string>, callback: () => Promise<void>) {
  const previous = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(values)) {
    previous.set(key, process.env[key]);
    process.env[key] = value;
  }

  return callback().finally(() => {
    for (const [key, value] of previous.entries()) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
}

async function startHttpServer(
  handler: (request: http.IncomingMessage, response: http.ServerResponse) => void
) {
  const server = http.createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('HTTP server address unavailable');
  }
  return { server, port: address.port };
}

test('sendWebhookNotification sends signed payload and handles success', async () => {
  const capture: Record<string, string | undefined> = {};
  const target = await startHttpServer((request, response) => {
    capture.signature = request.headers['x-bostar-signature'] as string;
    capture.idempotency = request.headers['x-bostar-idempotency-key'] as string;
    response.statusCode = 200;
    response.end('ok');
  });

  try {
    await withEnv(
      {
        WEBHOOK_FEISHU_URL: `http://127.0.0.1:${target.port}`,
        WEBHOOK_FEISHU_SECRET: 'secret',
        WEBHOOK_TIMEOUT_MS: '1000',
        WEBHOOK_RETRY_COUNT: '0',
      },
      async () => {
        const result = await sendWebhookNotification({ eventType: 'LEAD_CREATED', payload });
        assert.equal(result.ok, true);
        assert.ok(capture.signature);
        assert.ok(capture.idempotency);
      }
    );
  } finally {
    target.server.close();
  }
});

test('sendWebhookNotification handles non-2xx and timeout', async () => {
  const failTarget = await startHttpServer((_request, response) => {
    response.statusCode = 500;
    response.end('fail');
  });

  try {
    await withEnv(
      {
        WEBHOOK_FEISHU_URL: `http://127.0.0.1:${failTarget.port}`,
        WEBHOOK_TIMEOUT_MS: '300',
        WEBHOOK_RETRY_COUNT: '0',
      },
      async () => {
        const result = await sendWebhookNotification({ eventType: 'LEAD_CREATED', payload });
        assert.equal(result.ok, false);
      }
    );
  } finally {
    failTarget.server.close();
  }

  const slowTarget = await startHttpServer(async (_request, response) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    response.statusCode = 200;
    response.end('ok');
  });

  try {
    await withEnv(
      {
        WEBHOOK_FEISHU_URL: `http://127.0.0.1:${slowTarget.port}`,
        WEBHOOK_TIMEOUT_MS: '100',
        WEBHOOK_RETRY_COUNT: '0',
      },
      async () => {
        const result = await sendWebhookNotification({ eventType: 'LEAD_CREATED', payload });
        assert.equal(result.ok, false);
      }
    );
  } finally {
    slowTarget.server.close();
  }
});
