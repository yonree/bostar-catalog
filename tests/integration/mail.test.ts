import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { sendMailNotification } from '@/lib/mail';
import type { LeadNotificationEnvelope } from '@/lib/lead/types';

const payload: LeadNotificationEnvelope = {
  leadId: 'lead_1',
  inquiryNumber: 'BS-1',
  locale: 'en',
  demandType: 'Request a Quotation',
  name: 'Alice',
  company: 'Acme',
  phone: '',
  email: 'alice@example.com',
  wechat: '',
  whatsapp: '',
  country: 'Vietnam',
  sourcePage: '/en/contact',
  sourceType: 'contact',
  interestedProduct: 'Manual Gun',
  interestedProductModel: 'PG-1',
  interestedSolution: '',
  target: 'Quote',
  workpiece: 'Panel',
  workpieceMaterial: 'Steel',
  coatingMaterial: 'Epoxy powder',
  capacity: '100/day',
  message: 'Need support',
  attachmentNames: [],
  attachmentCount: 0,
  assignedTo: 'sales',
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

async function startSmtpServer(handler: (line: string, socket: net.Socket) => void) {
  const server = net.createServer((socket) => {
    socket.setEncoding('utf8');
    socket.write('220 localhost ESMTP\r\n');
    let buffer = '';
    socket.on('data', (chunk) => {
      buffer += chunk;
      while (buffer.includes('\r\n')) {
        const index = buffer.indexOf('\r\n');
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 2);
        handler(line, socket);
      }
    });
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('SMTP server address unavailable');
  }
  return { server, port: address.port };
}

test('sendMailNotification supports mock mode', async () => {
  await withEnv(
    {
      SMTP_MOCK_MODE: 'true',
      SMTP_HOST: 'mock',
      SMTP_FROM: 'BOSTAR <test@example.com>',
    },
    async () => {
      const result = await sendMailNotification({
        kind: 'lead-internal',
        payload,
        to: 'sales@example.com',
        idempotencyKey: 'mock-1',
      });
      assert.equal(result.ok, true);
      assert.equal(result.provider, 'smtp-mock');
    }
  );
});

test('sendMailNotification handles SMTP success and failure', async () => {
  const successServer = await startSmtpServer((line, socket) => {
    if (line.startsWith('EHLO')) socket.write('250-localhost\r\n250 OK\r\n');
    else if (line.startsWith('MAIL FROM')) socket.write('250 OK\r\n');
    else if (line.startsWith('RCPT TO')) socket.write('250 OK\r\n');
    else if (line === 'DATA') socket.write('354 End data with <CR><LF>.<CR><LF>\r\n');
    else if (line === '.') socket.write('250 queued as 123\r\n');
    else if (line === 'QUIT') socket.write('221 Bye\r\n');
  });

  try {
    await withEnv(
      {
        SMTP_HOST: '127.0.0.1',
        SMTP_PORT: String(successServer.port),
        SMTP_FROM: 'BOSTAR <test@example.com>',
        SMTP_MOCK_MODE: 'false',
        SMTP_TIMEOUT_MS: '1000',
      },
      async () => {
        const result = await sendMailNotification({
          kind: 'lead-internal',
          payload,
          to: 'sales@example.com',
          idempotencyKey: 'smtp-1',
        });
        assert.equal(result.ok, true);
      }
    );
  } finally {
    successServer.server.close();
  }

  const failServer = await startSmtpServer((line, socket) => {
    if (line.startsWith('EHLO')) socket.write('250-localhost\r\n250 OK\r\n');
    else if (line.startsWith('MAIL FROM')) socket.write('250 OK\r\n');
    else if (line.startsWith('RCPT TO')) socket.write('550 Rejected\r\n');
    else if (line === 'QUIT') socket.write('221 Bye\r\n');
  });

  try {
    await withEnv(
      {
        SMTP_HOST: '127.0.0.1',
        SMTP_PORT: String(failServer.port),
        SMTP_FROM: 'BOSTAR <test@example.com>',
        SMTP_MOCK_MODE: 'false',
        SMTP_TIMEOUT_MS: '1000',
      },
      async () => {
        const result = await sendMailNotification({
          kind: 'lead-internal',
          payload,
          to: 'sales@example.com',
          idempotencyKey: 'smtp-2',
        });
        assert.equal(result.ok, false);
      }
    );
  } finally {
    failServer.server.close();
  }
});
