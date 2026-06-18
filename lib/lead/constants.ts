export const leadStatuses = [
  'NEW',
  'NOTIFIED',
  'ASSIGNED',
  'CONTACTED',
  'QUALIFIED',
  'TEST_REQUESTED',
  'QUOTED',
  'WON',
  'LOST',
  'CLOSED',
  'INVALID',
  'SPAM',
  'DUPLICATE',
  'PENDING_ATTACHMENT',
] as const;

export const leadResponseStatuses = new Set([
  'CONTACTED',
  'QUALIFIED',
  'TEST_REQUESTED',
  'QUOTED',
  'WON',
  'LOST',
  'CLOSED',
]);

export const leadEventTypes = {
  created: 'LEAD_CREATED',
  assigned: 'LEAD_ASSIGNED',
  notified: 'LEAD_NOTIFIED',
  notificationFailed: 'LEAD_NOTIFICATION_FAILED',
  statusChanged: 'LEAD_STATUS_CHANGED',
  firstResponse: 'LEAD_FIRST_RESPONSE',
  slaTimedOut: 'LEAD_SLA_TIMED_OUT',
  webhookReceived: 'LEAD_WEBHOOK_RECEIVED',
  attachmentUploaded: 'LEAD_ATTACHMENT_UPLOADED',
  attachmentAttached: 'LEAD_ATTACHMENT_ATTACHED',
  attachmentDeleted: 'LEAD_ATTACHMENT_DELETED',
} as const;

export const notificationChannels = ['smtp', 'webhook'] as const;

export const attachmentPolicy = {
  maxFiles: 1,
  maxFileSizeBytes: 10 * 1024 * 1024,
  maxTotalSizeBytes: 10 * 1024 * 1024,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
} as const;

export const legacyLeadStatusMap: Record<string, string> = {
  new: 'NEW',
  assigned: 'ASSIGNED',
  contacted: 'CONTACTED',
  quoted: 'QUOTED',
  won: 'WON',
  lost: 'LOST',
  invalid: 'INVALID',
};
