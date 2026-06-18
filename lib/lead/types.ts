import type { Lead, LeadAttachment, LeadEvent, NotificationLog } from '@prisma/client';

export type LeadLocale = 'zh-CN' | 'en';

export type LeadSubmissionInput = {
  locale: LeadLocale;
  name: string;
  company: string;
  phone?: string;
  email?: string;
  wechat?: string;
  whatsapp?: string;
  country: string;
  workpiece?: string;
  workpieceMaterial?: string;
  coatingMaterial?: string;
  target: string;
  capacity?: string;
  demandType?: string;
  currentIssue?: string;
  message?: string;
  privacyConsent: boolean;
  sourcePage?: string;
  sourceType?: string;
  referrer?: string;
  interestedProduct?: string;
  interestedProductModel?: string;
  interestedSolution?: string;
  productId?: string;
  attachmentTokens?: string[];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  rawPayload?: Record<string, unknown>;
};

export type AttachmentUploadDraft = {
  id: string;
  uploadToken: string;
  originalFilename: string;
  safeFilename: string;
  storageProvider: string;
  storagePath: string;
  storageKey: string;
  storageUrl?: string | null;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  accessStatus: string;
  scanStatus: string;
  expiresAt?: Date | null;
};

export type LeadDetailRecord = Lead & {
  attachments: LeadAttachment[];
  events: LeadEvent[];
  notificationLogs: NotificationLog[];
};

export type LeadCreateResult = {
  lead: LeadDetailRecord;
  notificationSummary: NotificationDispatchSummary;
};

export type LeadNotificationEnvelope = {
  leadId: string;
  inquiryNumber: string;
  locale: LeadLocale;
  demandType: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  wechat: string;
  whatsapp: string;
  country: string;
  sourcePage: string;
  sourceType: string;
  interestedProduct: string;
  interestedProductModel: string;
  interestedSolution: string;
  target: string;
  workpiece: string;
  workpieceMaterial: string;
  coatingMaterial: string;
  capacity: string;
  message: string;
  attachmentNames: string[];
  attachmentCount: number;
  assignedTo: string;
  backupAssignee: string;
  dueAt: string;
};

export type NotificationDispatchItem = {
  channel: 'smtp' | 'webhook';
  provider: string;
  recipient: string;
  idempotencyKey: string;
  ok: boolean;
  skipped?: boolean;
  requestId?: string;
  messageId?: string;
  error?: string;
  attempts: number;
};

export type NotificationDispatchSummary = {
  ok: boolean;
  items: NotificationDispatchItem[];
};
