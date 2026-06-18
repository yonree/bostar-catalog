# Lead Workflow Migration Runbook

## Scope

- Extend `Lead` with structured inquiry, UTM, SLA and assignment fields
- Add `LeadAttachment`
- Add `LeadEvent`
- Add `NotificationLog`

## Pre-checks

1. Confirm application build is green:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
2. Confirm migration SQL exists:
   - `prisma/migrations/20260618_lead_workflow_foundation/migration.sql`
3. Back up the target database.

## Dry Run

1. Validate schema:
   - `npm run prisma:validate`
2. Inspect generated diff from empty:
   - `npm run prisma:diff:empty`
3. In a staging or temporary PostgreSQL database, run:
   - `npx prisma migrate deploy`
4. Verify tables and columns:
   - `Lead.inquiryNumber`
   - `Lead.locale`
   - `Lead.dueAt`
   - `LeadAttachment`
   - `LeadEvent`
   - `NotificationLog`

## Backfill

1. Copy `Lead.region` into `Lead.country` when `country` is null.
2. Default `Lead.locale` to `zh-CN` when missing.
3. Default `Lead.assignedAt` to `Lead.createdAt` for legacy rows.
4. Preserve legacy `remark` JSON for compatibility reads.

## Rollback

1. Stop traffic to write paths if production rollback is required.
2. Revert application code to the pre-migration release.
3. Do not drop the new columns immediately.
4. If DB rollback is mandatory, restore from backup rather than selectively dropping live columns.

## Production Preconditions

- SMTP and webhook env vars are present or intentionally disabled with mock-safe settings
- `DEFAULT_CN_SALES`, `DEFAULT_BACKUP_ASSIGNEE`, `DEFAULT_SLA_ESCALATION` are configured
- Attachment storage provider is configured
- Staging migration and lead submission smoke have passed
