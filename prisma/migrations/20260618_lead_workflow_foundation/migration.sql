ALTER TABLE "Lead"
  ADD COLUMN IF NOT EXISTS "inquiryNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "locale" TEXT NOT NULL DEFAULT 'zh-CN',
  ADD COLUMN IF NOT EXISTS "whatsapp" TEXT,
  ADD COLUMN IF NOT EXISTS "country" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceType" TEXT,
  ADD COLUMN IF NOT EXISTS "referrer" TEXT,
  ADD COLUMN IF NOT EXISTS "target" TEXT,
  ADD COLUMN IF NOT EXISTS "interestedProductModel" TEXT,
  ADD COLUMN IF NOT EXISTS "interestedSolution" TEXT,
  ADD COLUMN IF NOT EXISTS "workpieceMaterial" TEXT,
  ADD COLUMN IF NOT EXISTS "coatingMaterial" TEXT,
  ADD COLUMN IF NOT EXISTS "capacity" TEXT,
  ADD COLUMN IF NOT EXISTS "privacyConsent" BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS "utmSource" TEXT,
  ADD COLUMN IF NOT EXISTS "utmMedium" TEXT,
  ADD COLUMN IF NOT EXISTS "utmCampaign" TEXT,
  ADD COLUMN IF NOT EXISTS "utmTerm" TEXT,
  ADD COLUMN IF NOT EXISTS "utmContent" TEXT,
  ADD COLUMN IF NOT EXISTS "rawPayload" JSONB,
  ADD COLUMN IF NOT EXISTS "slaStatus" TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS "slaMinutes" INTEGER,
  ADD COLUMN IF NOT EXISTS "businessTimeZone" TEXT,
  ADD COLUMN IF NOT EXISTS "businessWindowStart" TEXT,
  ADD COLUMN IF NOT EXISTS "businessWindowEnd" TEXT,
  ADD COLUMN IF NOT EXISTS "workingDays" TEXT,
  ADD COLUMN IF NOT EXISTS "holidaySnapshot" TEXT,
  ADD COLUMN IF NOT EXISTS "dueAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "firstNotifiedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "assignedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "firstResponseAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "firstContactAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "timedOutAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "backupAssignee" TEXT,
  ADD COLUMN IF NOT EXISTS "escalationTo" TEXT;

UPDATE "Lead"
SET
  "country" = COALESCE("country", "region"),
  "locale" = COALESCE(NULLIF("locale", ''), 'zh-CN'),
  "privacyConsent" = COALESCE("privacyConsent", FALSE),
  "assignedAt" = COALESCE("assignedAt", "createdAt")
WHERE TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS "Lead_inquiryNumber_key" ON "Lead"("inquiryNumber");
CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead"("createdAt");
CREATE INDEX IF NOT EXISTS "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "Lead_locale_createdAt_idx" ON "Lead"("locale", "createdAt");
CREATE INDEX IF NOT EXISTS "Lead_dueAt_idx" ON "Lead"("dueAt");
CREATE INDEX IF NOT EXISTS "Lead_sourcePage_idx" ON "Lead"("sourcePage");

CREATE TABLE IF NOT EXISTS "LeadAttachment" (
  "id" TEXT NOT NULL,
  "leadId" TEXT,
  "uploadToken" TEXT NOT NULL,
  "originalFilename" TEXT NOT NULL,
  "safeFilename" TEXT NOT NULL,
  "storageProvider" TEXT NOT NULL,
  "storagePath" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "storageUrl" TEXT,
  "mimeType" TEXT NOT NULL,
  "extension" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "accessStatus" TEXT NOT NULL DEFAULT 'temporary',
  "scanStatus" TEXT NOT NULL DEFAULT 'pending',
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "attachedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LeadAttachment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "LeadAttachment_uploadToken_key" ON "LeadAttachment"("uploadToken");
CREATE INDEX IF NOT EXISTS "LeadAttachment_leadId_idx" ON "LeadAttachment"("leadId");
CREATE INDEX IF NOT EXISTS "LeadAttachment_expiresAt_idx" ON "LeadAttachment"("expiresAt");
CREATE INDEX IF NOT EXISTS "LeadAttachment_scanStatus_accessStatus_idx" ON "LeadAttachment"("scanStatus", "accessStatus");

CREATE TABLE IF NOT EXISTS "LeadEvent" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "statusFrom" TEXT,
  "statusTo" TEXT,
  "actor" TEXT,
  "detail" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LeadEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "LeadEvent_leadId_createdAt_idx" ON "LeadEvent"("leadId", "createdAt");
CREATE INDEX IF NOT EXISTS "LeadEvent_eventType_createdAt_idx" ON "LeadEvent"("eventType", "createdAt");

CREATE TABLE IF NOT EXISTS "NotificationLog" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "recipient" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "requestId" TEXT,
  "messageId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "attemptCount" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "payloadVersion" TEXT NOT NULL DEFAULT 'v1',
  "payloadPreview" TEXT,
  "firstAttemptAt" TIMESTAMP(3),
  "lastAttemptAt" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "NotificationLog_channel_idempotencyKey_key" ON "NotificationLog"("channel", "idempotencyKey");
CREATE INDEX IF NOT EXISTS "NotificationLog_leadId_createdAt_idx" ON "NotificationLog"("leadId", "createdAt");
CREATE INDEX IF NOT EXISTS "NotificationLog_status_createdAt_idx" ON "NotificationLog"("status", "createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'LeadAttachment_leadId_fkey'
  ) THEN
    ALTER TABLE "LeadAttachment"
      ADD CONSTRAINT "LeadAttachment_leadId_fkey"
      FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'LeadEvent_leadId_fkey'
  ) THEN
    ALTER TABLE "LeadEvent"
      ADD CONSTRAINT "LeadEvent_leadId_fkey"
      FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'NotificationLog_leadId_fkey'
  ) THEN
    ALTER TABLE "NotificationLog"
      ADD CONSTRAINT "NotificationLog_leadId_fkey"
      FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
