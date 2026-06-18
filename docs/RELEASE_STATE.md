# Release State

## Current Status

- Status: `IN_PROGRESS`
- Release branch: `PENDING`
- Frozen commit: `PENDING`
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
| Build initial env matrix from local / preview / production | IN_PROGRESS | Presence-only matrix started; missing production SMTP/webhook/SLA vars identified |
| Freeze releasable branch and commit | TODO | Pending release branch creation and local atomic commits |
| Preview deployment and migration rehearsal | TODO | Pending after branch freeze and env gate review |
| Production deployment | TODO | Blocked until strict release gates pass |

## Current Blockers

| Blocker | Type | Detail |
| --- | --- | --- |
| Missing git remote | Repo | Prevents pushing a release branch to origin |
| Missing production SMTP variables | External dependency | Production env does not currently expose SMTP runtime configuration required for strict lead notification verification |
| Missing production webhook variables | External dependency | Production env does not currently expose webhook runtime configuration required for strict notification verification |
| Missing production lead/SLA assignment variables | External dependency | Production env does not currently expose the full lead routing and SLA config set required by the release gate |
| Missing preview admin/lead runtime variables | External dependency | Preview env is not yet sufficient for strict staging-style full path verification |

## Environment Matrix

| Variable Group | Local | Preview | Production | Required For Strict Production |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | present | present via Vercel Postgres/Neon vars | present | yes |
| `NEXT_PUBLIC_SITE_URL` | present | missing explicit key | present | yes |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` / `ADMIN_SESSION_SECRET` | present | missing | present | yes |
| `BLOB_READ_WRITE_TOKEN` | present | present | present | yes |
| `UPLOAD_PROVIDER` | present | missing | missing | recommended, but blob fallback exists |
| `SMTP_*` | partial local | missing | missing | yes |
| `WEBHOOK_*` | partial local | missing | missing | yes |
| `LEAD_NOTIFICATION_TO` | missing local | missing | missing | yes |
| `DEFAULT_CN_SALES` / `DEFAULT_EXPORT_TEAM` / `DEFAULT_BACKUP_ASSIGNEE` / `DEFAULT_SLA_ESCALATION` | missing local | missing | missing | yes |
| `SLA_*` | missing local | missing | missing | yes |
| `LEAD_ATTACHMENT_*` and rate-limit vars | missing local | missing | missing | yes |

