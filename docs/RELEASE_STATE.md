# Release State

## Current Status

- Status: `BLOCKED_BY_EXTERNAL_DEPENDENCIES`
- Release branch: `release/bostar-uiux-v1`
- Frozen commit: `59bc418`
- Public production URL: `https://www.fjbosd.com`
- Current production deployment ID: `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN`

## Phase Log

| Step | Status | Notes |
| --- | --- | --- |
| Read release execution instructions and repository control files | VERIFIED | Strict mode and no-degraded-release constraints adopted |
| Identify linked deployment platform | VERIFIED | `.vercel/project.json` points to `yonree-s-projects/bostar-geo-website` |
| Identify runtime and database stack | VERIFIED | Next.js 15 + Prisma + PostgreSQL + Vercel Blob |
| Inspect current production deployment | VERIFIED | `vercel inspect https://www.fjbosd.com` returns `Ready` deployment `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN` |
| Inspect Git remotes | VERIFIED | No git remote configured in local repository |
| Build initial env matrix from local / preview / production | VERIFIED | Production vars narrowed to SMTP-only gap; preview runtime gap persists |
| Freeze releasable branch and commit | VERIFIED | Release branch `release/bostar-uiux-v1`; frozen commits `77941b9`, `6129cae`, `59bc418` |
| Implement strict SLA scheduler path | VERIFIED | Added `/api/cron/leads` automation path and repository-level scheduler workflow |
| Preview deployment rehearsal | BLOCKED | Preview runtime envs still incomplete; no successful preview deployment created |
| Production deployment | BLOCKED | Production SMTP secrets, scheduler secrets, DB migration execution, and git push path remain external blockers |

## Current Blockers

| Blocker | Type | Detail |
| --- | --- | --- |
| Missing git remote | Repo | Prevents pushing a release branch to origin |
| Missing production SMTP variables | External dependency | Production env still lacks `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, so strict邮件通知联调无法完成 |
| Missing scheduler secrets | External dependency | GitHub Actions scheduler requires repository secrets `CRON_TARGET_URL` and `CRON_SECRET` before SLA automation can run outside localhost |
| Missing preview database/admin runtime | External dependency | Preview env still lacks verifiable `DATABASE_URL` / `DATABASE_URL_UNPOOLED` and admin runtime for rehearsal |
| Missing production migration execution authorization | External dependency | Cannot run production `prisma migrate deploy` or record backup ID from current environment without explicit access/approval |
| Missing git remote | Repo | Local release branch exists but cannot be pushed from this clone because no remote is configured |

## Environment Matrix

| Variable Group | Local | Preview | Production | Required For Strict Production |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | present | not verifiable / missing in pull | present | yes |
| `NEXT_PUBLIC_SITE_URL` | present | can be injected at deploy | present | yes |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` / `ADMIN_SESSION_SECRET` | present | not verifiable / missing in pull | present | yes |
| `BLOB_READ_WRITE_TOKEN` | present | present | present | yes |
| `UPLOAD_PROVIDER` | present | not verifiable / missing in pull | present or blob fallback | recommended |
| `SMTP_*` | partial local | mockable but not configured | only `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` missing | yes |
| `WEBHOOK_*` | partial local | not verifiable / missing in pull | present by key | yes |
| `LEAD_NOTIFICATION_TO` | present local | not verifiable / missing in pull | present by key | yes |
| `DEFAULT_CN_SALES` / `DEFAULT_EXPORT_TEAM` / `DEFAULT_BACKUP_ASSIGNEE` / `DEFAULT_SLA_ESCALATION` | present local | not verifiable / missing in pull | present by key | yes |
| `SLA_*` | present local | not verifiable / missing in pull | present by key | yes |
| `LEAD_ATTACHMENT_*` and rate-limit vars | present local | not verifiable / missing in pull | present by key | yes |

## Deployment Notes

- Attempted preview deploy with 10-minute Vercel cron failed on current Hobby plan because high-frequency `vercel.json` cron is not supported.
- Repository configuration now removes Vercel cron dependence and moves scheduler triggering to GitHub Actions.
- Production release remains blocked until external secrets, migration execution, and push/deploy permissions are satisfied.
