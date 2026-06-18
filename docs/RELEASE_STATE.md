# Release State

## Current Status

- Status: `BLOCKED_BY_EXTERNAL_DEPENDENCIES`
- Release branch: `release/bostar-uiux-v1`
- Unique Release Candidate SHA: `61e4c20c828992c0564e4c87172042bdb36d58cd`
- Remote repository: `yonree/bostar-catalog`
- Public production URL: `https://www.fjbosd.com`
- Current production deployment ID: `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN`
- Current preview deployment ID: `dpl_AAC16N2PFLQjCXMrv5bpj8xdmLwt`
- Current preview deployment URL: `https://bostar-geo-website-mowiypem0-yonree-s-projects.vercel.app`

## Phase Log

| Step | Status | Notes |
| --- | --- | --- |
| Read release execution instructions and repository control files | VERIFIED | Strict mode and no-degraded-release constraints adopted |
| Identify linked deployment platform | VERIFIED | `.vercel/project.json` points to `yonree-s-projects/bostar-geo-website` |
| Identify runtime and database stack | VERIFIED | Next.js 15 + Prisma + PostgreSQL + Vercel Blob |
| Inspect current production deployment | VERIFIED | `vercel inspect https://www.fjbosd.com` returns `Ready` deployment `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN` |
| Compare `61e4c20..71ab0ce` and unify release candidate | VERIFIED | Only `docs/` changed after `61e4c20`; unique RC remains `61e4c20` |
| Run release quality gate on unique RC | VERIFIED | `typecheck`, `lint`, `build`, and `test` all pass |
| Push release branch to origin | VERIFIED | `origin` now points to `https://github.com/yonree/bostar-catalog`; `release/bostar-uiux-v1` pushed successfully with upstream tracking |
| Confirm remote workflow presence | VERIFIED | `.github/workflows/lead-automation.yml` exists on remote branch `release/bostar-uiux-v1` with `workflow_dispatch` and `schedule: */10 * * * *` |
| Implement strict SLA scheduler path | VERIFIED | `/api/cron/leads` exists and scheduler responsibility moved off Vercel cron into GitHub Actions workflow |
| Create preview deployment from unique RC | VERIFIED | Main project preview deployment `dpl_AAC16N2PFLQjCXMrv5bpj8xdmLwt` reached `Ready` from RC `61e4c20` |
| Preview deployment rehearsal | BLOCKED | Real Chromium automation against the RC preview still lands on Vercel protection pages (`Vercel Security Checkpoint`, then `Login – Vercel`) instead of business pages |
| GitHub Actions manual dispatch and run evidence | BLOCKED | Remote branch exists, but current environment still lacks a usable authenticated path to manually dispatch the workflow or inspect run logs / Run IDs |
| Preview/Staging env verification | BLOCKED | Branch-scoped `preview` env pull still lacks database, admin, SMTP, webhook, SLA, and lead-routing vars required for staging migration and browser E2E |
| Production read-only baseline check | VERIFIED | `/` returns 200; `/en/applications` and `/support/downloads/troubleshooting-checklist` still 404 on current production, confirming redesign is not released |
| Production deployment | BLOCKED | Production SMTP credentials, preview/staging env readiness, GitHub Actions run control, and production DB execution authorization remain external blockers |

## Current Blockers

| Blocker | Type | Detail |
| --- | --- | --- |
| GitHub Actions run control still not reachable from current environment | External dependency | Branch push and remote file fetch now work, but there is still no usable authenticated path in this environment to manually dispatch the workflow or inspect run logs / Run IDs |
| Preview automation access not actually effective | External dependency | Real Chromium automation against the RC preview still lands on Vercel protection pages (`Vercel Security Checkpoint`, then `Login – Vercel`), so the staging browser path cannot start |
| Preview/Staging application env not actually present | External dependency | Branch-scoped `preview` env pull still omits `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, admin auth, SMTP, webhook, SLA, and lead routing vars required for staging migration and E2E |
| Missing production SMTP variables | External dependency | Production env still lacks `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, so strict SMTP delivery verification cannot complete |
| Missing production migration execution authorization | External dependency | Cannot run production `prisma migrate deploy` or record backup ID from current environment without explicit access or approval |

## Environment Matrix

| Variable Group | Local | Preview | Production | Required For Strict Production |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | present | missing in branch-scoped preview pull | present | yes |
| `NEXT_PUBLIC_SITE_URL` | present | can be injected at deploy | present | yes |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` / `ADMIN_SESSION_SECRET` | present | missing in branch-scoped preview pull | present | yes |
| `BLOB_READ_WRITE_TOKEN` | present | present | present | yes |
| `UPLOAD_PROVIDER` | present | missing in branch-scoped preview pull | present | recommended |
| `SMTP_*` | partial local | missing in branch-scoped preview pull | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` missing; others present | yes |
| `WEBHOOK_*` | partial local | missing in branch-scoped preview pull | present by key | yes |
| `LEAD_NOTIFICATION_TO` | present local | missing in branch-scoped preview pull | present by key | yes |
| `DEFAULT_CN_SALES` / `DEFAULT_EXPORT_TEAM` / `DEFAULT_BACKUP_ASSIGNEE` / `DEFAULT_SLA_ESCALATION` | present local | missing in branch-scoped preview pull | present by key | yes |
| `SLA_*` | present local | missing in branch-scoped preview pull | present by key | yes |
| `LEAD_ATTACHMENT_*` and rate-limit vars | present local | missing in branch-scoped preview pull | present by key | yes |

## Deployment Notes

- Initial preview deploy attempt with 10-minute Vercel cron failed on the current Hobby plan because high-frequency `vercel.json` cron is not supported.
- Repository configuration now removes Vercel cron dependence and moves scheduler triggering to GitHub Actions.
- Main project preview deployment for the unique RC is `dpl_AAC16N2PFLQjCXMrv5bpj8xdmLwt` at `https://bostar-geo-website-mowiypem0-yonree-s-projects.vercel.app`.
- Build runtime evidence collected from the RC preview: local `node -v` is `v26.2.0`; Vercel project runtime is configured for Node `24.x`; Vercel build generated Prisma Client from `generator client { provider = "prisma-client-js" }`; Next.js build output reports `Build Completed in /vercel/output [1m]`.
- Remote branch evidence: `.github/workflows/lead-automation.yml` is present on `yonree/bostar-catalog@release/bostar-uiux-v1`, with `workflow_dispatch` and `schedule: */10 * * * *`.
- Real browser evidence: Playwright/Chromium loading `/` on the RC preview ends at `Vercel Security Checkpoint`; loading `/en/applications` ends at `Login – Vercel` after the protection redirect, rather than application HTML.
- Production release remains blocked until GitHub Actions run control, preview/staging runtime env readiness, SMTP credentials, and DB execution authorization are restored.
