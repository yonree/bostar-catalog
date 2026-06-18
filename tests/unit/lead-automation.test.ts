import test from 'node:test';
import assert from 'node:assert/strict';
import type { LeadDetailRecord, NotificationDispatchSummary } from '@/lib/lead/types';
import { runLeadAutomationWithDependencies } from '@/lib/lead/automation';
import { leadEventTypes } from '@/lib/lead/constants';

function makeLead(id: string): LeadDetailRecord {
  return {
    id,
    inquiryNumber: `BS-${id}`,
    locale: 'zh-CN',
    name: 'Alice',
    company: 'Acme',
    phone: '13800138000',
    email: 'sales@example.com',
    wechat: null,
    whatsapp: null,
    region: 'China',
    country: 'China',
    sourcePage: '/products/demo',
    sourceType: 'product',
    referrer: null,
    demandType: '报价',
    target: '需要报价',
    interestedProduct: 'Demo',
    interestedProductModel: 'D-1',
    interestedSolution: null,
    workpiece: 'Panel',
    workpieceMaterial: 'Steel',
    coatingMaterial: 'Powder',
    capacity: '100/day',
    currentIssue: 'Need fast response',
    message: 'message',
    privacyConsent: true,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmTerm: null,
    utmContent: null,
    rawPayload: {},
    attachmentUrl: null,
    productId: null,
    downloadId: null,
    status: 'ASSIGNED',
    slaStatus: 'open',
    slaMinutes: 30,
    businessTimeZone: 'Asia/Shanghai',
    businessWindowStart: '08:30',
    businessWindowEnd: '18:00',
    workingDays: '1,2,3,4,5,6',
    holidaySnapshot: '',
    dueAt: new Date('2026-06-18T02:30:00.000Z'),
    firstNotifiedAt: null,
    assignedAt: new Date('2026-06-18T02:00:00.000Z'),
    firstResponseAt: null,
    firstContactAt: null,
    timedOutAt: null,
    assignedTo: 'cn-sales',
    backupAssignee: 'sales-backup',
    escalationTo: 'sales-manager',
    remark: '{}',
    createdAt: new Date('2026-06-18T02:00:00.000Z'),
    updatedAt: new Date('2026-06-18T02:00:00.000Z'),
    attachments: [],
    events: [],
    notificationLogs: [],
  };
}

test('runLeadAutomationWithDependencies marks overdue leads, records notifications and clears expired drafts', async () => {
  const appendedEvents: Array<{ eventType: string; leadId: string }> = [];
  const deletedAttachmentIds: string[] = [];
  const deletedStorageKeys: string[] = [];
  const timedOutLead = makeLead('lead_1');
  const notificationSummary: NotificationDispatchSummary = {
    ok: true,
    items: [
      {
        channel: 'smtp',
        provider: 'smtp-mock',
        recipient: 'sales@example.com',
        idempotencyKey: 'smtp-1',
        ok: true,
        attempts: 1,
      },
    ],
  };

  const summary = await runLeadAutomationWithDependencies({
    now: () => new Date('2026-06-18T03:00:00.000Z'),
    notifyTimedOutLead: async () => notificationSummary,
    deleteAttachment: async (attachment) => {
      deletedStorageKeys.push(attachment.storageKey);
    },
    repository: {
      listOpenTimedOutLeads: async () => [timedOutLead],
      markLeadTimedOut: async () => ({
        ...timedOutLead,
        slaStatus: 'timed_out',
        timedOutAt: new Date('2026-06-18T03:00:00.000Z'),
      }),
      appendLeadEvent: async (event: Record<string, unknown>) => {
        appendedEvents.push({
          eventType: String(event.eventType),
          leadId: String(event.leadId),
        });
        return event;
      },
      cleanupOrphanDrafts: async () => [
        {
          id: 'att_1',
          leadId: null,
          uploadToken: 'tok_1',
          originalFilename: 'panel.pdf',
          safeFilename: 'panel.pdf',
          storageProvider: 'local',
          storagePath: 'C:/tmp/panel.pdf',
          storageKey: 'lead-attachments/panel.pdf',
          storageUrl: null,
          mimeType: 'application/pdf',
          extension: '.pdf',
          sizeBytes: 128,
          accessStatus: 'temporary',
          scanStatus: 'accepted_without_scan',
          uploadedAt: new Date(),
          attachedAt: null,
          expiresAt: new Date('2026-06-18T02:00:00.000Z'),
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      markAttachmentDeleted: async (id: string) => {
        deletedAttachmentIds.push(id);
        return null;
      },
    } as never,
  });

  assert.deepEqual(summary.timedOutLeadIds, ['lead_1']);
  assert.deepEqual(summary.remindedLeadIds, ['lead_1']);
  assert.deepEqual(summary.reminderFailures, []);
  assert.deepEqual(summary.deletedDraftAttachmentIds, ['att_1']);
  assert.deepEqual(deletedAttachmentIds, ['att_1']);
  assert.deepEqual(deletedStorageKeys, ['lead-attachments/panel.pdf']);
  assert.ok(
    appendedEvents.some((event) => event.eventType === leadEventTypes.notified && event.leadId === 'lead_1')
  );
});
