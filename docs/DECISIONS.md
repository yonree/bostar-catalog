# Decisions

## 2026-06-18

### Structured lead workflow uses incremental schema expansion

- Decision: extend existing `Lead` and add `LeadAttachment`, `LeadEvent`, `NotificationLog` without removing legacy fields.
- Why: preserves rollback space and keeps old read paths compatible during migration.
- Rejected:
  - replacing `Lead` outright
  - storing all new metadata only in `remark`

### Attachments default to private storage

- Decision: public lead attachments now go to local private storage or Vercel Blob private access, never `public/`.
- Why: requirement explicitly forbids direct public exposure of inquiry attachments.
- Compatibility impact: admin-side secure download route added.

### SMTP implementation stays dependency-light

- Decision: implement SMTP transport with Node `net`/`tls` instead of adding `nodemailer`.
- Why: repository rule says avoid new runtime dependencies unless necessary and document the reason.
- Tradeoff: less provider convenience, but enough for basic SMTP, STARTTLS and retry support.

### SLA logic is configuration-driven

- Decision: derive due time from timezone, workdays, business window and holiday env vars.
- Why: the requirement forbids hard-coding 30-minute business-hour logic in page templates.

### Prisma client generation fallback

- Decision: use `prisma generate --no-engine` for local type regeneration when the Windows query engine DLL is locked.
- Why: current environment had an `EPERM` rename failure on the engine binary, but type generation was still needed for implementation and tests.
- Follow-up: production or DB-connected local flows should still run normal `prisma generate` when the file lock is removed.
