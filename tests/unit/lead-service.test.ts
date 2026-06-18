import test from 'node:test';
import assert from 'node:assert/strict';
import type { LeadDetailRecord, NotificationDispatchSummary } from '@/lib/lead/types';
import { createLeadSubmissionWithDependencies } from '@/lib/lead/service';
import { leadEventTypes } from '@/lib/lead/constants';

test('createLeadSubmissionWithDependencies maps metadata, events and notifications', async () => {
  const captured: Record<string, unknown> = {};
  const lead: LeadDetailRecord = {
    id: 'lead_1',
    inquiryNumber: 'BS-20260618083000-123',
    locale: 'en',
    name: 'Alice',
    company: 'Acme',
    phone: null,
    email: 'alice@example.com',
    wechat: null,
    whatsapp: null,
    region: 'Vietnam',
    country: 'Vietnam',
    sourcePage: '/en/products',
    sourceType: 'product',
    referrer: 'https://google.com',
    demandType: 'Request a Quotation',
    target: 'Request a quotation',
    interestedProduct: 'Manual Gun',
    interestedProductModel: 'PG-1',
    interestedSolution: 'Powder line',
    workpiece: 'Panel',
    workpieceMaterial: 'Steel',
    coatingMaterial: 'Epoxy powder',
    capacity: '1200/day',
    currentIssue: 'Need faster color change',
    message: '补充说明：Need faster color change\n粉末/涂料：Epoxy powder\n产能/线速：1200/day\n目标需求：Request a quotation',
    privacyConsent: true,
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'powder',
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
    workingDays: '1,2,3,4,5',
    holidaySnapshot: '',
    dueAt: new Date('2026-06-18T02:30:00.000Z'),
    firstNotifiedAt: null,
    assignedAt: new Date('2026-06-18T02:00:00.000Z'),
    firstResponseAt: null,
    firstContactAt: null,
    timedOutAt: null,
    assignedTo: 'export-team',
    backupAssignee: 'backup',
    escalationTo: 'manager',
    remark: '{}',
    createdAt: new Date('2026-06-18T02:00:00.000Z'),
    updatedAt: new Date('2026-06-18T02:00:00.000Z'),
    attachments: [
      {
        id: 'att_1',
        leadId: 'lead_1',
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
        accessStatus: 'attached',
        scanStatus: 'accepted_without_scan',
        uploadedAt: new Date('2026-06-18T02:00:00.000Z'),
        attachedAt: new Date('2026-06-18T02:00:00.000Z'),
        expiresAt: null,
        deletedAt: null,
        createdAt: new Date('2026-06-18T02:00:00.000Z'),
        updatedAt: new Date('2026-06-18T02:00:00.000Z'),
      },
    ],
    events: [],
    notificationLogs: [],
  };

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

  const result = await createLeadSubmissionWithDependencies(
    {
      locale: 'en',
      name: 'Alice',
      company: 'Acme',
      email: 'alice@example.com',
      country: 'Vietnam',
      workpiece: 'Panel',
      workpieceMaterial: 'Steel',
      coatingMaterial: 'Epoxy powder',
      target: 'Request a quotation',
      capacity: '1200/day',
      demandType: 'Request a Quotation',
      message: 'Need faster color change',
      privacyConsent: true,
      sourcePage: '/en/products',
      sourceType: 'product',
      interestedProduct: 'Manual Gun',
      interestedProductModel: 'PG-1',
      interestedSolution: 'Powder line',
      attachmentTokens: ['tok_1'],
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'powder',
    },
    {
      now: () => new Date('2026-06-18T02:00:00.000Z'),
      repository: {
        getAttachmentDrafts: async () => [
          {
            id: 'att_1',
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
            expiresAt: null,
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        persistLeadGraph: async (input: Record<string, unknown>) => {
          captured.persist = input;
          return lead;
        },
        appendLeadEvent: async (event: Record<string, unknown>) => {
          captured.appendedEvent = event;
          return event;
        },
      } as never,
      notify: async () => notificationSummary,
    }
  );

  assert.equal(result.lead.id, 'lead_1');
  assert.equal(result.notificationSummary.ok, true);
  assert.deepEqual((captured.persist as { attachmentTokens: string[] }).attachmentTokens, ['tok_1']);
  const createdEvents = (captured.persist as { createdEvents: Array<{ eventType: string }> }).createdEvents;
  assert.ok(createdEvents.some((event) => event.eventType === leadEventTypes.created));
  assert.ok(createdEvents.some((event) => event.eventType === leadEventTypes.assigned));
  assert.ok(createdEvents.some((event) => event.eventType === leadEventTypes.attachmentAttached));
});
