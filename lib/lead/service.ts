import type { Prisma } from '@prisma/client';
import { attachmentPolicy, leadEventTypes, legacyLeadStatusMap } from '@/lib/lead/constants';
import { dispatchLeadCreatedNotifications } from '@/lib/lead/notification-service';
import { getLeadRepository } from '@/lib/lead/repository';
import { buildLeadSlaSnapshot, getLeadSlaConfig } from '@/lib/lead/sla';
import type { LeadCreateResult, LeadSubmissionInput } from '@/lib/lead/types';
import { asArrayOfStrings, optionalString, parseJsonObject, safeJsonStringify, toInquiryNumber } from '@/lib/lead/utils';

function buildLeadMessage(input: LeadSubmissionInput) {
  return [
    input.message ? `补充说明：${input.message}` : '',
    input.coatingMaterial ? `粉末/涂料：${input.coatingMaterial}` : '',
    input.capacity ? `产能/线速：${input.capacity}` : '',
    input.target ? `目标需求：${input.target}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildLegacyRemarkPayload(input: LeadSubmissionInput, inquiryNumber: string, dueAt: Date) {
  return {
    inquiryNumber,
    locale: input.locale,
    sourcePage: input.sourcePage || '',
    sourceType: input.sourceType || '',
    interestedProduct: input.interestedProduct || '',
    interestedProductModel: input.interestedProductModel || '',
    interestedSolution: input.interestedSolution || '',
    target: input.target,
    coatingMaterial: input.coatingMaterial || '',
    capacity: input.capacity || '',
    dueAt: dueAt.toISOString(),
    utm: {
      source: input.utmSource || '',
      medium: input.utmMedium || '',
      campaign: input.utmCampaign || '',
      term: input.utmTerm || '',
      content: input.utmContent || '',
    },
  };
}

function normalizeStatus(status: string | undefined) {
  if (!status) {
    return 'NEW';
  }

  const upper = status.toUpperCase();
  return legacyLeadStatusMap[status] || upper;
}

export async function createLeadSubmission(input: LeadSubmissionInput): Promise<LeadCreateResult> {
  return createLeadSubmissionWithDependencies(input, {
    repository: getLeadRepository(),
    notify: dispatchLeadCreatedNotifications,
    now: () => new Date(),
  });
}

type LeadServiceDependencies = {
  repository: ReturnType<typeof getLeadRepository>;
  notify: typeof dispatchLeadCreatedNotifications;
  now: () => Date;
};

export async function createLeadSubmissionWithDependencies(
  input: LeadSubmissionInput,
  deps: LeadServiceDependencies
): Promise<LeadCreateResult> {
  const { repository } = deps;
  const submittedAt = deps.now();
  const inquiryNumber = toInquiryNumber(submittedAt);
  const slaConfig = getLeadSlaConfig();
  const slaSnapshot = buildLeadSlaSnapshot(submittedAt, slaConfig);
  const attachmentTokens = asArrayOfStrings(input.attachmentTokens).slice(0, attachmentPolicy.maxFiles);
  const attachmentDrafts = await repository.getAttachmentDrafts(attachmentTokens);

  if (attachmentDrafts.length !== attachmentTokens.length) {
    throw new Error('One or more attachments are missing, expired or already attached.');
  }

  const leadData: Prisma.LeadCreateInput = {
    inquiryNumber,
    locale: input.locale,
    name: input.name,
    company: input.company || null,
    phone: input.phone || null,
    email: input.email || null,
    wechat: input.wechat || null,
    whatsapp: input.whatsapp || null,
    region: input.country || null,
    country: input.country || null,
    sourcePage: input.sourcePage || null,
    sourceType: input.sourceType || null,
    referrer: input.referrer || null,
    demandType: input.demandType || null,
    target: input.target || null,
    interestedProduct: input.interestedProduct || null,
    interestedProductModel: input.interestedProductModel || null,
    interestedSolution: input.interestedSolution || null,
    workpiece: input.workpiece || null,
    workpieceMaterial: input.workpieceMaterial || null,
    coatingMaterial: input.coatingMaterial || null,
    capacity: input.capacity || null,
    currentIssue: input.currentIssue || input.target || null,
    message: buildLeadMessage(input) || null,
    privacyConsent: input.privacyConsent,
    utmSource: input.utmSource || null,
    utmMedium: input.utmMedium || null,
    utmCampaign: input.utmCampaign || null,
    utmTerm: input.utmTerm || null,
    utmContent: input.utmContent || null,
    rawPayload: JSON.parse(safeJsonStringify(input.rawPayload || {})) as Prisma.InputJsonValue,
    attachmentUrl: attachmentDrafts[0]?.storageUrl || attachmentDrafts[0]?.storagePath || null,
    status: 'ASSIGNED',
    slaStatus: 'open',
    slaMinutes: slaSnapshot.config.slaMinutes,
    businessTimeZone: slaSnapshot.config.timeZone,
    businessWindowStart: `${String(Math.floor(slaSnapshot.config.startMinutes / 60)).padStart(2, '0')}:${String(
      slaSnapshot.config.startMinutes % 60
    ).padStart(2, '0')}`,
    businessWindowEnd: `${String(Math.floor(slaSnapshot.config.endMinutes / 60)).padStart(2, '0')}:${String(
      slaSnapshot.config.endMinutes % 60
    ).padStart(2, '0')}`,
    workingDays: slaSnapshot.config.workdays.join(','),
    holidaySnapshot: slaSnapshot.config.holidays.join(','),
    dueAt: slaSnapshot.dueAt,
    assignedAt: submittedAt,
    assignedTo: input.locale === 'en' ? process.env.DEFAULT_EXPORT_TEAM || 'export-team' : slaConfig.primaryAssignee,
    backupAssignee: slaConfig.backupAssignee,
    escalationTo: slaConfig.escalationAssignee,
    remark: safeJsonStringify(buildLegacyRemarkPayload(input, inquiryNumber, slaSnapshot.dueAt)),
  };

  const createdEvents: Prisma.LeadEventCreateManyInput[] = [
    {
      leadId: '',
      eventType: leadEventTypes.created,
      actor: 'public-form',
      detail: {
        sourcePage: input.sourcePage || '',
        sourceType: input.sourceType || '',
      },
    },
    {
      leadId: '',
      eventType: leadEventTypes.assigned,
      actor: 'system',
      statusTo: 'ASSIGNED',
      detail: {
        assignedTo: leadData.assignedTo,
        backupAssignee: leadData.backupAssignee,
        dueAt: slaSnapshot.dueAt.toISOString(),
      },
    },
    ...attachmentDrafts.map((draft) => ({
      leadId: '',
      eventType: leadEventTypes.attachmentAttached,
      actor: 'system',
      detail: {
        attachmentId: draft.id,
        filename: draft.originalFilename,
      },
    })),
  ];

  const lead = await repository.persistLeadGraph({
    leadData,
    attachmentTokens,
    createdEvents,
  });

  const notificationSummary = await deps.notify(lead);

  if (notificationSummary.ok) {
    await repository.appendLeadEvent({
      leadId: lead.id,
      eventType: leadEventTypes.notified,
      actor: 'system',
      detail: {
        channels: notificationSummary.items.map((item) => ({
          channel: item.channel,
          ok: item.ok,
          skipped: item.skipped || false,
        })),
      },
    });
  } else {
    await repository.appendLeadEvent({
      leadId: lead.id,
      eventType: leadEventTypes.notificationFailed,
      actor: 'system',
      detail: {
        channels: notificationSummary.items.map((item) => ({
          channel: item.channel,
          error: item.error || '',
          skipped: item.skipped || false,
        })),
      },
    });
  }

  return {
    lead: {
      ...lead,
      notificationLogs: lead.notificationLogs,
      attachments: lead.attachments,
      events: lead.events,
    },
    notificationSummary,
  };
}

export async function updateLeadStatus(input: {
  id: string;
  status: string;
  assignedTo?: string;
  remark?: string;
  actor?: string;
}) {
  return getLeadRepository().markLeadResponse({
    id: input.id,
    status: normalizeStatus(input.status),
    assignedTo: optionalString(input.assignedTo),
    remark: input.remark,
    actor: input.actor,
  });
}

export function extractLegacyLeadMeta(remark: string | null | undefined) {
  return parseJsonObject(remark);
}
