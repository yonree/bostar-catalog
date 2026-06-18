import net from 'net';
import tls from 'tls';
import { setTimeout as sleep } from 'timers/promises';
import type { LeadNotificationEnvelope, NotificationDispatchItem } from '@/lib/lead/types';
import { escapeHtml } from '@/lib/lead/utils';

type MailTemplateKind = 'lead-internal' | 'lead-confirmation' | 'sla-reminder' | 'failure-alert';

type SendMailNotificationInput = {
  kind: MailTemplateKind;
  payload: LeadNotificationEnvelope;
  to: string;
  idempotencyKey: string;
};

type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
  replyTo?: string;
  timeoutMs: number;
  devRedirectTo?: string;
  mockMode: boolean;
};

type MailTemplate = {
  subject: string;
  text: string;
  html: string;
};

type SocketReader = {
  nextLine: () => Promise<string>;
  dispose: () => void;
};

function getMailConfig(): MailConfig {
  return {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '',
    replyTo: process.env.SMTP_REPLY_TO || '',
    timeoutMs: Number(process.env.SMTP_TIMEOUT_MS || 10_000),
    devRedirectTo: process.env.SMTP_DEV_REDIRECT_TO || '',
    mockMode: process.env.SMTP_MOCK_MODE === 'true' || process.env.NODE_ENV === 'test',
  };
}

function encodeHeader(value: string) {
  return `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`;
}

function dotStuff(value: string) {
  return value
    .replace(/\r?\n/g, '\r\n')
    .replace(/^\./gm, '..');
}

function makeSocketReader(socket: net.Socket | tls.TLSSocket): SocketReader {
  let buffer = '';
  const queue: string[] = [];
  const resolvers: ((line: string) => void)[] = [];
  const onData = (chunk: string | Buffer) => {
    buffer += chunk.toString();
    while (true) {
      const index = buffer.indexOf('\r\n');
      if (index < 0) {
        break;
      }
      const line = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      const resolver = resolvers.shift();
      if (resolver) {
        resolver(line);
      } else {
        queue.push(line);
      }
    }
  };

  socket.on('data', onData);

  return {
    async nextLine() {
      if (queue.length) {
        return queue.shift() as string;
      }

      return new Promise<string>((resolve, reject) => {
        const onError = (error: Error) => {
          cleanup();
          reject(error);
        };
        const onClose = () => {
          cleanup();
          reject(new Error('SMTP connection closed unexpectedly'));
        };
        const cleanup = () => {
          socket.off('error', onError);
          socket.off('close', onClose);
        };

        resolvers.push((line) => {
          cleanup();
          resolve(line);
        });
        socket.once('error', onError);
        socket.once('close', onClose);
      });
    },
    dispose() {
      socket.off('data', onData);
    },
  };
}

async function readResponse(reader: SocketReader) {
  const first = await reader.nextLine();
  const code = Number(first.slice(0, 3));
  const lines = [first];

  while (lines[lines.length - 1]?.[3] === '-') {
    lines.push(await reader.nextLine());
  }

  if (!Number.isFinite(code)) {
    throw new Error(`Unexpected SMTP response: ${first}`);
  }

  return { code, message: lines.join('\n') };
}

async function sendCommand(
  socket: net.Socket | tls.TLSSocket,
  reader: SocketReader,
  command: string,
  expectedCodes: number[]
) {
  socket.write(`${command}\r\n`);
  const response = await readResponse(reader);
  if (!expectedCodes.includes(response.code)) {
    throw new Error(`SMTP ${command.split(' ')[0]} failed: ${response.message}`);
  }
  return response;
}

async function startTls(
  socket: net.Socket,
  host: string,
  timeoutMs: number
): Promise<tls.TLSSocket> {
  return new Promise((resolve, reject) => {
    const secureSocket = tls.connect(
      {
        socket,
        servername: host,
      },
      () => resolve(secureSocket)
    );

    secureSocket.setTimeout(timeoutMs, () => {
      secureSocket.destroy(new Error('SMTP TLS handshake timed out'));
    });
    secureSocket.once('error', reject);
  });
}

async function connectSmtp(config: MailConfig) {
  const socket = await new Promise<net.Socket | tls.TLSSocket>((resolve, reject) => {
    const client = config.secure
      ? tls.connect({ host: config.host, port: config.port, servername: config.host }, () => resolve(client))
      : net.connect({ host: config.host, port: config.port }, () => resolve(client));
    client.setTimeout(config.timeoutMs, () => client.destroy(new Error('SMTP connection timed out')));
    client.once('error', reject);
  });

  const reader = makeSocketReader(socket);
  const greeting = await readResponse(reader);
  if (greeting.code !== 220) {
    throw new Error(`SMTP greeting failed: ${greeting.message}`);
  }

  let currentSocket = socket;
  let currentReader = reader;
  const ehlo = await sendCommand(currentSocket, currentReader, `EHLO ${process.env.SMTP_CLIENT_NAME || 'bostar.local'}`, [250]);

  if (!config.secure && ehlo.message.includes('STARTTLS')) {
    await sendCommand(currentSocket, currentReader, 'STARTTLS', [220]);
    const upgraded = await startTls(currentSocket as net.Socket, config.host, config.timeoutMs);
    currentReader.dispose();
    currentSocket = upgraded;
    currentReader = makeSocketReader(upgraded);
    await sendCommand(currentSocket, currentReader, `EHLO ${process.env.SMTP_CLIENT_NAME || 'bostar.local'}`, [250]);
  }

  if (config.user && config.pass) {
    const authPayload = Buffer.from(`\u0000${config.user}\u0000${config.pass}`).toString('base64');
    const authResult = await sendCommand(currentSocket, currentReader, `AUTH PLAIN ${authPayload}`, [235, 503]);
    if (authResult.code === 503) {
      // already authenticated by the provider
    }
  }

  return {
    socket: currentSocket,
    reader: currentReader,
    async close() {
      try {
        await sendCommand(currentSocket, currentReader, 'QUIT', [221]);
      } finally {
        currentReader.dispose();
        currentSocket.destroy();
      }
    },
  };
}

function buildTemplate(kind: MailTemplateKind, payload: LeadNotificationEnvelope): MailTemplate {
  const subjectPrefix = payload.locale === 'en' ? '[BOSTAR]' : '[博士达]';
  const title =
    kind === 'lead-confirmation'
      ? payload.locale === 'en'
        ? 'Inquiry received'
        : '已收到您的询盘'
      : kind === 'sla-reminder'
        ? payload.locale === 'en'
          ? 'SLA reminder'
          : 'SLA 提醒'
        : kind === 'failure-alert'
          ? payload.locale === 'en'
            ? 'Notification failure alert'
            : '通知失败告警'
          : payload.locale === 'en'
            ? 'New lead notification'
            : '新询盘通知';

  if (kind === 'lead-confirmation') {
    const text =
      payload.locale === 'en'
        ? `We have received your inquiry ${payload.inquiryNumber}. Our team will respond during business hours.\n\nTarget: ${payload.target}\nProduct: ${payload.interestedProduct || '-'}\n`
        : `我们已收到您的询盘 ${payload.inquiryNumber}，工作时间内会尽快联系您。\n\n需求：${payload.target}\n产品：${payload.interestedProduct || '-'}\n`;
    const html =
      payload.locale === 'en'
        ? `<p>We have received your inquiry <strong>${escapeHtml(payload.inquiryNumber)}</strong>.</p><p>Our team will respond during business hours.</p><p><strong>Target:</strong> ${escapeHtml(payload.target || '-')}</p>`
        : `<p>我们已收到您的询盘 <strong>${escapeHtml(payload.inquiryNumber)}</strong>。</p><p>工作时间内会尽快联系您。</p><p><strong>目标需求：</strong>${escapeHtml(payload.target || '-')}</p>`;

    return {
      subject: `${subjectPrefix} ${title} ${payload.inquiryNumber}`,
      text,
      html,
    };
  }

  const baseRows = [
    ['Inquiry No.', payload.inquiryNumber],
    ['Locale', payload.locale],
    ['Company', payload.company],
    ['Contact', payload.name],
    ['Phone', payload.phone],
    ['Email', payload.email],
    ['WeChat', payload.wechat],
    ['WhatsApp', payload.whatsapp],
    ['Country', payload.country],
    ['Source Page', payload.sourcePage],
    ['Source Type', payload.sourceType],
    ['Demand Type', payload.demandType],
    ['Product', payload.interestedProduct],
    ['Model', payload.interestedProductModel],
    ['Solution', payload.interestedSolution],
    ['Target', payload.target],
    ['Workpiece', payload.workpiece],
    ['Material', payload.workpieceMaterial],
    ['Coating', payload.coatingMaterial],
    ['Capacity', payload.capacity],
    ['Assigned To', payload.assignedTo],
    ['Backup Assignee', payload.backupAssignee],
    ['Due At', payload.dueAt],
    ['Attachments', payload.attachmentNames.join(', ') || String(payload.attachmentCount)],
    ['Message', payload.message],
  ];

  return {
    subject: `${subjectPrefix} ${title} ${payload.inquiryNumber}`,
    text: baseRows.map(([label, value]) => `${label}: ${value || '-'}`).join('\n'),
    html: `<table border="1" cellpadding="8" cellspacing="0">${baseRows
      .map(
        ([label, value]) =>
          `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value || '-')}</td></tr>`
      )
      .join('')}</table>`,
  };
}

function buildMimeMessage(config: MailConfig, to: string, template: MailTemplate) {
  const boundary = `bostar-${Date.now().toString(36)}`;
  const lines = [
    `From: ${config.from}`,
    `To: ${to}`,
    `Subject: ${encodeHeader(template.subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    'Content-Transfer-Encoding: 8bit',
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now()}.${Math.random().toString(36).slice(2)}@bostar.local>`,
    config.replyTo ? `Reply-To: ${config.replyTo}` : '',
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="utf-8"',
    'Content-Transfer-Encoding: 8bit',
    '',
    template.text,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="utf-8"',
    'Content-Transfer-Encoding: 8bit',
    '',
    template.html,
    '',
    `--${boundary}--`,
    '',
  ]
    .filter(Boolean)
    .join('\r\n');

  return dotStuff(lines);
}

async function sendSmtpMail(config: MailConfig, to: string, template: MailTemplate) {
  const client = await connectSmtp(config);
  try {
    await sendCommand(client.socket, client.reader, `MAIL FROM:<${extractEmailAddress(config.from)}>`, [250]);
    await sendCommand(client.socket, client.reader, `RCPT TO:<${extractEmailAddress(to)}>`, [250, 251]);
    await sendCommand(client.socket, client.reader, 'DATA', [354]);
    client.socket.write(`${buildMimeMessage(config, to, template)}\r\n.\r\n`);
    const response = await readResponse(client.reader);
    if (![250, 251].includes(response.code)) {
      throw new Error(`SMTP DATA failed: ${response.message}`);
    }
    return response.message;
  } finally {
    await client.close();
  }
}

function extractEmailAddress(value: string) {
  const match = value.match(/<([^>]+)>/);
  return match?.[1] || value.trim();
}

async function sendWithRetry(config: MailConfig, to: string, template: MailTemplate) {
  const retries = Number(process.env.SMTP_RETRY_COUNT || 2);
  let lastError = '';

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      const response = await sendSmtpMail(config, to, template);
      return { ok: true as const, attempts: attempt, response };
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown SMTP error';
      if (attempt <= retries) {
        await sleep(200 * attempt);
      }
    }
  }

  return { ok: false as const, attempts: retries + 1, error: lastError };
}

export async function sendMailNotification(input: SendMailNotificationInput): Promise<NotificationDispatchItem> {
  const config = getMailConfig();
  const recipient = config.devRedirectTo || input.to;

  if (!recipient) {
    return {
      channel: 'smtp',
      provider: 'smtp',
      recipient: '',
      idempotencyKey: input.idempotencyKey,
      ok: false,
      skipped: true,
      error: 'Mail recipient is not configured',
      attempts: 0,
    };
  }

  if (!config.host || !config.from) {
    return {
      channel: 'smtp',
      provider: 'smtp',
      recipient,
      idempotencyKey: input.idempotencyKey,
      ok: false,
      skipped: true,
      error: 'SMTP is not configured',
      attempts: 0,
    };
  }

  if (config.mockMode) {
    return {
      channel: 'smtp',
      provider: 'smtp-mock',
      recipient,
      idempotencyKey: input.idempotencyKey,
      ok: true,
      skipped: false,
      messageId: `mock-${Date.now()}`,
      attempts: 1,
    };
  }

  const template = buildTemplate(input.kind, input.payload);
  const result = await sendWithRetry(config, recipient, template);

  if (!result.ok) {
    return {
      channel: 'smtp',
      provider: 'smtp',
      recipient,
      idempotencyKey: input.idempotencyKey,
      ok: false,
      error: result.error,
      attempts: result.attempts,
    };
  }

  return {
    channel: 'smtp',
    provider: 'smtp',
    recipient,
    idempotencyKey: input.idempotencyKey,
    ok: true,
    messageId: result.response,
    attempts: result.attempts,
  };
}

export async function sendLeadNotification(input: Omit<SendMailNotificationInput, 'kind'>) {
  return sendMailNotification({ ...input, kind: 'lead-internal' });
}

export async function sendLeadConfirmation(input: Omit<SendMailNotificationInput, 'kind'>) {
  return sendMailNotification({ ...input, kind: 'lead-confirmation' });
}

export async function sendSlaReminder(input: Omit<SendMailNotificationInput, 'kind'>) {
  return sendMailNotification({ ...input, kind: 'sla-reminder' });
}

export async function sendFailureAlert(input: Omit<SendMailNotificationInput, 'kind'>) {
  return sendMailNotification({ ...input, kind: 'failure-alert' });
}
