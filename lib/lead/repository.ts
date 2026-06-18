import type { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { compactText, parseJsonObject, safeJsonStringify } from '@/lib/lead/utils';

export type LeadRepositoryClient = PrismaClient;

export type PersistLeadInput = {
  leadData: Prisma.LeadCreateInput;
  attachmentTokens: string[];
  createdEvents: Prisma.LeadEventCreateManyInput[];
};

export function getLeadRepository(db: LeadRepositoryClient = prisma) {
  return {
    async createAttachmentDraft(input: Prisma.LeadAttachmentCreateInput) {
      return db.leadAttachment.create({ data: input });
    },

    async getAttachmentDrafts(tokens: string[]) {
      if (!tokens.length) {
        return [];
      }

      return db.leadAttachment.findMany({
        where: {
          uploadToken: { in: tokens },
          leadId: null,
          deletedAt: null,
        },
        orderBy: { uploadedAt: 'asc' },
      });
    },

    async deleteAttachmentDrafts(tokens: string[]) {
      if (!tokens.length) {
        return;
      }

      await db.leadAttachment.deleteMany({
        where: {
          uploadToken: { in: tokens },
          leadId: null,
        },
      });
    },

    async persistLeadGraph(input: PersistLeadInput) {
      return db.$transaction(async (tx: Prisma.TransactionClient) => {
        const lead = await tx.lead.create({
          data: input.leadData,
          include: {
            attachments: true,
            events: true,
            notificationLogs: true,
          },
        });

        if (input.attachmentTokens.length) {
          await tx.leadAttachment.updateMany({
            where: { uploadToken: { in: input.attachmentTokens } },
            data: {
              leadId: lead.id,
              accessStatus: 'attached',
              attachedAt: new Date(),
            },
          });
        }

        if (input.createdEvents.length) {
          await tx.leadEvent.createMany({ data: input.createdEvents.map((event) => ({ ...event, leadId: lead.id })) });
        }

        return tx.lead.findUniqueOrThrow({
          where: { id: lead.id },
          include: {
            attachments: true,
            events: { orderBy: { createdAt: 'asc' } },
            notificationLogs: { orderBy: { createdAt: 'asc' } },
          },
        });
      });
    },

    async createNotificationLog(input: Prisma.NotificationLogUncheckedCreateInput) {
      return db.notificationLog.upsert({
        where: {
          channel_idempotencyKey: {
            channel: input.channel,
            idempotencyKey: input.idempotencyKey,
          },
        },
        create: input,
        update: {
          requestId: input.requestId,
          messageId: input.messageId,
          status: input.status,
          attemptCount: input.attemptCount,
          lastError: input.lastError,
          payloadVersion: input.payloadVersion,
          payloadPreview: input.payloadPreview,
          firstAttemptAt: input.firstAttemptAt,
          lastAttemptAt: input.lastAttemptAt,
          sentAt: input.sentAt,
        },
      });
    },

    async updateNotificationLog(
      channel: string,
      idempotencyKey: string,
      data: Prisma.NotificationLogUncheckedUpdateInput
    ) {
      return db.notificationLog.update({
        where: {
          channel_idempotencyKey: {
            channel,
            idempotencyKey,
          },
        },
        data,
      });
    },

    async appendLeadEvent(input: Prisma.LeadEventUncheckedCreateInput) {
      return db.leadEvent.create({ data: input });
    },

    async markLeadResponse(input: {
      id: string;
      status: string;
      assignedTo?: string;
      remark?: string;
      actor?: string;
    }) {
      const current = await db.lead.findUniqueOrThrow({ where: { id: input.id } });
      const nextStatus = input.status;
      const now = new Date();
      const shouldMarkFirstResponse = !current.firstResponseAt && nextStatus !== current.status;
      const shouldMarkFirstContact =
        !current.firstContactAt &&
        ['CONTACTED', 'QUALIFIED', 'TEST_REQUESTED', 'QUOTED', 'WON', 'LOST', 'CLOSED'].includes(nextStatus);

      const updated = await db.lead.update({
        where: { id: input.id },
        data: {
          status: nextStatus,
          assignedTo: input.assignedTo || undefined,
          remark:
            input.remark === undefined
              ? undefined
              : compactText(input.remark, 4000),
          firstResponseAt: shouldMarkFirstResponse ? now : undefined,
          firstContactAt: shouldMarkFirstContact ? now : undefined,
          timedOutAt:
            current.dueAt && !current.firstResponseAt && now.getTime() > current.dueAt.getTime() ? now : undefined,
          slaStatus:
            current.dueAt && !current.firstResponseAt && now.getTime() > current.dueAt.getTime() ? 'timed_out' : undefined,
        },
      });

      await db.leadEvent.create({
        data: {
          leadId: current.id,
          eventType: 'LEAD_STATUS_CHANGED',
          statusFrom: current.status,
          statusTo: nextStatus,
          actor: input.actor || 'admin',
          detail: {
            assignedTo: input.assignedTo || current.assignedTo || '',
            remark: input.remark ? compactText(input.remark, 240) : '',
          },
        },
      });

      if (shouldMarkFirstResponse) {
        await db.leadEvent.create({
          data: {
            leadId: current.id,
            eventType: 'LEAD_FIRST_RESPONSE',
            actor: input.actor || 'admin',
            detail: { at: now.toISOString() },
          },
        });
      }

      return updated;
    },

    async listLeads() {
      const leads = await db.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 200,
        include: {
          attachments: true,
          events: { orderBy: { createdAt: 'desc' }, take: 5 },
          notificationLogs: { orderBy: { createdAt: 'desc' }, take: 10 },
        },
      });

      return leads.map((lead) => ({
        ...lead,
        legacyMeta: parseJsonObject(lead.remark),
      }));
    },

    async listOpenTimedOutLeads(now: Date, limit = 50) {
      return db.lead.findMany({
        where: {
          dueAt: { lte: now },
          firstResponseAt: null,
          slaStatus: { in: ['open', 'pending'] },
        },
        orderBy: { dueAt: 'asc' },
        take: limit,
        include: {
          attachments: true,
          events: { orderBy: { createdAt: 'asc' } },
          notificationLogs: { orderBy: { createdAt: 'asc' } },
        },
      });
    },

    async markLeadTimedOut(input: { id: string; actor?: string; now?: Date }) {
      const current = await db.lead.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          attachments: true,
          events: { orderBy: { createdAt: 'asc' } },
          notificationLogs: { orderBy: { createdAt: 'asc' } },
        },
      });

      if (current.firstResponseAt || current.slaStatus === 'timed_out') {
        return current;
      }

      const timedOutAt = input.now || new Date();

      await db.lead.update({
        where: { id: current.id },
        data: {
          slaStatus: 'timed_out',
          timedOutAt,
        },
      });

      await db.leadEvent.create({
        data: {
          leadId: current.id,
          eventType: 'LEAD_SLA_TIMED_OUT',
          actor: input.actor || 'system-cron',
          detail: {
            dueAt: current.dueAt?.toISOString() || '',
            timedOutAt: timedOutAt.toISOString(),
          },
        },
      });

      return db.lead.findUniqueOrThrow({
        where: { id: current.id },
        include: {
          attachments: true,
          events: { orderBy: { createdAt: 'asc' } },
          notificationLogs: { orderBy: { createdAt: 'asc' } },
        },
      });
    },

    async getAttachmentForAdmin(id: string, leadId: string) {
      return db.leadAttachment.findFirst({
        where: { id, leadId, deletedAt: null },
      });
    },

    async cleanupOrphanDrafts(expiresBefore: Date) {
      return db.leadAttachment.findMany({
        where: {
          leadId: null,
          deletedAt: null,
          expiresAt: { lte: expiresBefore },
        },
      });
    },

    async markAttachmentDeleted(id: string) {
      return db.leadAttachment.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          accessStatus: 'deleted',
        },
      });
    },

    async createLegacyLeadFallback(input: Prisma.LeadUncheckedCreateInput) {
      return db.lead.create({ data: input });
    },

    describeNotificationPayload(payload: unknown) {
      return compactText(safeJsonStringify(payload), 240);
    },
  };
}
