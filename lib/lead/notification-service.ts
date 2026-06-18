import { createHash } from 'crypto';
import type { LeadDetailRecord, LeadNotificationEnvelope, NotificationDispatchItem, NotificationDispatchSummary } from '@/lib/lead/types';
import { getLeadRepository } from '@/lib/lead/repository';
import { sendMailNotification } from '@/lib/mail';
import { sendWebhookNotification } from '@/lib/webhook';

function toIdempotencyKey(leadId: string, channel: string, recipient: string, eventType: string) {
  return createHash('sha256').update(`${leadId}:${channel}:${recipient}:${eventType}`).digest('hex');
}

function pickRecipients(lead: LeadDetailRecord) {
  const internalEmail = process.env.LEAD_NOTIFICATION_TO || process.env.SMTP_INTERNAL_TO || '';
  const confirmationRecipient =
    lead.locale === 'en' ? lead.email || process.env.SMTP_DEV_REDIRECT_TO || '' : lead.email || '';
  const webhookRecipient = process.env.WEBHOOK_FEISHU_URL || process.env.WEBHOOK_WECHAT_URL || '';

  return {
    internalEmail,
    confirmationRecipient,
    webhookRecipient,
  };
}

export function toLeadNotificationEnvelope(lead: LeadDetailRecord): LeadNotificationEnvelope {
  return {
    leadId: lead.id,
    inquiryNumber: lead.inquiryNumber || '',
    locale: lead.locale === 'en' ? 'en' : 'zh-CN',
    demandType: lead.demandType || '',
    name: lead.name,
    company: lead.company || '',
    phone: lead.phone || '',
    email: lead.email || '',
    wechat: lead.wechat || '',
    whatsapp: lead.whatsapp || '',
    country: lead.country || lead.region || '',
    sourcePage: lead.sourcePage || '',
    sourceType: lead.sourceType || '',
    interestedProduct: lead.interestedProduct || '',
    interestedProductModel: lead.interestedProductModel || '',
    interestedSolution: lead.interestedSolution || '',
    target: lead.target || '',
    workpiece: lead.workpiece || '',
    workpieceMaterial: lead.workpieceMaterial || '',
    coatingMaterial: lead.coatingMaterial || '',
    capacity: lead.capacity || '',
    message: lead.message || '',
    attachmentNames: lead.attachments.map((item) => item.originalFilename),
    attachmentCount: lead.attachments.length,
    assignedTo: lead.assignedTo || '',
    backupAssignee: lead.backupAssignee || '',
    dueAt: lead.dueAt?.toISOString() || '',
  };
}

export async function dispatchLeadCreatedNotifications(lead: LeadDetailRecord): Promise<NotificationDispatchSummary> {
  const repository = getLeadRepository();
  const recipients = pickRecipients(lead);
  const payload = toLeadNotificationEnvelope(lead);
  const results: NotificationDispatchItem[] = [];

  if (recipients.internalEmail) {
    const idempotencyKey = toIdempotencyKey(lead.id, 'smtp', recipients.internalEmail, 'LEAD_CREATED');
    const mailResult = await sendMailNotification({
      kind: 'lead-internal',
      payload,
      to: recipients.internalEmail,
      idempotencyKey,
    });
    results.push(mailResult);
  } else {
    results.push({
      channel: 'smtp',
      provider: 'smtp',
      recipient: '',
      idempotencyKey: toIdempotencyKey(lead.id, 'smtp', 'none', 'LEAD_CREATED'),
      ok: false,
      skipped: true,
      error: 'SMTP internal recipient is not configured',
      attempts: 0,
    });
  }

  if (recipients.confirmationRecipient) {
    const confirmationKey = toIdempotencyKey(lead.id, 'smtp', recipients.confirmationRecipient, 'LEAD_CONFIRMATION');
    const confirmation = await sendMailNotification({
      kind: 'lead-confirmation',
      payload,
      to: recipients.confirmationRecipient,
      idempotencyKey: confirmationKey,
    });
    results.push(confirmation);
  }

  const webhook = await sendWebhookNotification({
    eventType: 'LEAD_CREATED',
    payload,
  });
  results.push(...webhook.items);

  for (const item of results) {
    const base = {
      leadId: lead.id,
      eventType: item.channel === 'webhook' ? 'LEAD_CREATED' : 'LEAD_CREATED',
      channel: item.channel,
      provider: item.provider,
      recipient: item.recipient,
      idempotencyKey: item.idempotencyKey,
      requestId: item.requestId || null,
      messageId: item.messageId || null,
      status: item.skipped ? 'skipped' : item.ok ? 'sent' : 'failed',
      attemptCount: item.attempts,
      lastError: item.error || null,
      payloadVersion: 'v1',
      payloadPreview: repository.describeNotificationPayload(payload),
      firstAttemptAt: new Date(),
      lastAttemptAt: new Date(),
      sentAt: item.ok ? new Date() : null,
    };

    await repository.createNotificationLog(base);
  }

  return {
    ok: results.every((item) => item.ok || item.skipped),
    items: results,
  };
}

export async function dispatchLeadTimeoutNotifications(lead: LeadDetailRecord): Promise<NotificationDispatchSummary> {
  const repository = getLeadRepository();
  const recipients = pickRecipients(lead);
  const payload = toLeadNotificationEnvelope(lead);
  const results: NotificationDispatchItem[] = [];

  if (recipients.internalEmail) {
    const idempotencyKey = toIdempotencyKey(lead.id, 'smtp', recipients.internalEmail, 'LEAD_SLA_TIMED_OUT');
    const mailResult = await sendMailNotification({
      kind: 'sla-reminder',
      payload,
      to: recipients.internalEmail,
      idempotencyKey,
    });
    results.push(mailResult);
  } else {
    results.push({
      channel: 'smtp',
      provider: 'smtp',
      recipient: '',
      idempotencyKey: toIdempotencyKey(lead.id, 'smtp', 'none', 'LEAD_SLA_TIMED_OUT'),
      ok: false,
      skipped: true,
      error: 'SMTP internal recipient is not configured',
      attempts: 0,
    });
  }

  const webhook = await sendWebhookNotification({
    eventType: 'LEAD_SLA_TIMED_OUT',
    payload,
  });
  results.push(...webhook.items);

  for (const item of results) {
    await repository.createNotificationLog({
      leadId: lead.id,
      eventType: 'LEAD_SLA_TIMED_OUT',
      channel: item.channel,
      provider: item.provider,
      recipient: item.recipient,
      idempotencyKey: item.idempotencyKey,
      requestId: item.requestId || null,
      messageId: item.messageId || null,
      status: item.skipped ? 'skipped' : item.ok ? 'sent' : 'failed',
      attemptCount: item.attempts,
      lastError: item.error || null,
      payloadVersion: 'v1',
      payloadPreview: repository.describeNotificationPayload(payload),
      firstAttemptAt: new Date(),
      lastAttemptAt: new Date(),
      sentAt: item.ok ? new Date() : null,
    });
  }

  return {
    ok: results.every((item) => item.ok || item.skipped),
    items: results,
  };
}
