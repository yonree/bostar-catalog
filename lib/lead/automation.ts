import { leadEventTypes } from '@/lib/lead/constants';
import { dispatchLeadTimeoutNotifications } from '@/lib/lead/notification-service';
import { getLeadRepository } from '@/lib/lead/repository';
import { deleteStoredLeadAttachment } from '@/lib/lead/storage';

type LeadAutomationDependencies = {
  deleteAttachment: typeof deleteStoredLeadAttachment;
  now: () => Date;
  notifyTimedOutLead: typeof dispatchLeadTimeoutNotifications;
  repository: ReturnType<typeof getLeadRepository>;
};

export type LeadAutomationSummary = {
  deletedDraftAttachmentIds: string[];
  reminderFailures: string[];
  remindedLeadIds: string[];
  timedOutLeadIds: string[];
};

export async function runLeadAutomation() {
  return runLeadAutomationWithDependencies({
    deleteAttachment: deleteStoredLeadAttachment,
    now: () => new Date(),
    notifyTimedOutLead: dispatchLeadTimeoutNotifications,
    repository: getLeadRepository(),
  });
}

export async function runLeadAutomationWithDependencies(
  deps: LeadAutomationDependencies
): Promise<LeadAutomationSummary> {
  const now = deps.now();
  const timedOutLeadIds: string[] = [];
  const remindedLeadIds: string[] = [];
  const reminderFailures: string[] = [];
  const deletedDraftAttachmentIds: string[] = [];

  const overdueLeads = await deps.repository.listOpenTimedOutLeads(now);
  for (const lead of overdueLeads) {
    const timedOutLead = await deps.repository.markLeadTimedOut({
      id: lead.id,
      actor: 'system-cron',
      now,
    });
    timedOutLeadIds.push(timedOutLead.id);

    const notificationSummary = await deps.notifyTimedOutLead(timedOutLead);
    if (notificationSummary.ok) {
      remindedLeadIds.push(timedOutLead.id);
      await deps.repository.appendLeadEvent({
        leadId: timedOutLead.id,
        eventType: leadEventTypes.notified,
        actor: 'system-cron',
        detail: {
          channels: notificationSummary.items.map((item) => ({
            channel: item.channel,
            ok: item.ok,
            skipped: item.skipped || false,
          })),
          reason: 'sla-timeout',
        },
      });
    } else {
      reminderFailures.push(timedOutLead.id);
      await deps.repository.appendLeadEvent({
        leadId: timedOutLead.id,
        eventType: leadEventTypes.notificationFailed,
        actor: 'system-cron',
        detail: {
          channels: notificationSummary.items.map((item) => ({
            channel: item.channel,
            error: item.error || '',
            skipped: item.skipped || false,
          })),
          reason: 'sla-timeout',
        },
      });
    }
  }

  const orphanDrafts = await deps.repository.cleanupOrphanDrafts(now);
  for (const draft of orphanDrafts) {
    await deps.deleteAttachment(draft);
    await deps.repository.markAttachmentDeleted(draft.id);
    deletedDraftAttachmentIds.push(draft.id);
  }

  return {
    deletedDraftAttachmentIds,
    reminderFailures,
    remindedLeadIds,
    timedOutLeadIds,
  };
}
