# Release State

## Current Status

- Status: `BLOCKED_BY_EXTERNAL_DEPENDENCIES`
- Release branch: `release/bostar-uiux-v1`
- Unique Release Candidate SHA: `61e4c20c828992c0564e4c87172042bdb36d58cd`
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
| Compare `61e4c20..380f807` and unify release candidate | VERIFIED | Only `docs/RELEASE_*` changed after `61e4c20`; runtime RC remains `61e4c20` |
| Run release quality gate on unique RC | VERIFIED | `typecheck`, `lint`, `build`, and `test` all pass |
| Implement strict SLA scheduler path | VERIFIED | `/api/cron/leads` exists and scheduler responsibility moved off Vercel cron into GitHub Actions workflow |
| Create preview deployment from unique RC | VERIFIED | Main project preview deployment `dpl_AAC16N2PFLQjCXMrv5bpj8xdmLwt` reached `Ready` from RC `61e4c20` |
| Preview deployment rehearsal | BLOCKED | Chromium automation against the RC preview still lands on `Vercel Security Checkpoint` / `代码 21` instead of business pages, and branch-scoped preview env pull still lacks database, admin, SMTP, webhook, SLA, and lead-routing vars required for staging migration and browser E2E |
| GitHub Actions and remote release branch validation | BLOCKED | `git remote -v` is still empty in the current clone, and current GitHub connector scope does not expose the website repository |
| Production read-only baseline check | VERIFIED | `/` returns 200; `/en/applications` and `/support/downloads/troubleshooting-checklist` still 404 on current production, confirming redesign is not released |
| Production deployment | BLOCKED | Production SMTP credentials, preview/staging env readiness, GitHub remote reachability, and production DB execution authorization remain external blockers |

## Current Blockers

| Blocker | Type | Detail |
| --- | --- | --- |
| GitHub website repository unreachable from current environment | External dependency | `git remote -v` is still empty in the current clone, and the authenticated GitHub connector does not expose the website repository, so push / remote branch verification / workflow dispatch / run log inspection cannot continue |
| Preview automation access not actually effective | External dependency | Real Chromium automation against the RC preview still lands on `Vercel Security Checkpoint` / `代码 21`, so the staging browser path cannot start |
| Preview/Staging application env not actually present | External dependency | Branch-scoped `preview` env pull still omits `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, admin auth, SMTP, webhook, SLA, and lead routing vars required for staging migration and E2E |
| Missing production SMTP variables | External dependency | Production env still lacks `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, so strict SMTP delivery verification cannot complete |
| Missing production migration execution authorization | External dependency | Cannot run production `prisma migrate deploy` or record backup ID from current environment without explicit access/approval |

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
- Build runtime evidence collected from the RC preview: local `node -v` is `v26.2.0`; Vercel build generated Prisma Client from `generator client { provider = "prisma-client-js" }`; Next.js build output reports `Build Completed in /vercel/output [1m]`.
- Real browser evidence: Playwright/Chromium loading `/` and `/en/applications` on the RC preview ends at `Vercel Security Checkpoint`, including the message `无法验证您的浏览器` and `代码 21`, rather than application HTML.
- Production release remains blocked until GitHub remote reachability, preview/staging runtime env readiness, SMTP credentials, and DB execution authorization are restored.
