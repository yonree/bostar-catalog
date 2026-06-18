# Release Plan

## Mode

- `RELEASE_MODE=strict`
- `ALLOW_DEGRADED_PROD_RELEASE=false`

## Target

- Project: `bostar-geo-website`
- Platform: `Vercel`
- Production domain: `https://www.fjbosd.com`
- Current linked Vercel project: `yonree-s-projects/bostar-geo-website`
- Current live deployment: `dpl_789JmQSfhJTTCqWo9Qmz2udPYVaN`

## Phases

| Phase | Scope | Status | Acceptance |
| --- | --- | --- | --- |
| A | Identify git, deployment platform, CI/CD, runtime, database, storage, SMTP, webhook, SLA shape | DONE | Linked platform and runtime facts recorded |
| B | Audit working tree, classify changes, create release branch, freeze releasable commit | DONE | Release branch `release/bostar-uiux-v1` and frozen commits recorded |
| C | Build environment matrix for local / preview / production without exposing secret values | IN_PROGRESS | Required vars marked present or missing per environment |
| D | Verify Prisma runtime mode, migration path, and CRUD behavior against production-like execution | IN_PROGRESS | Client mode, migration order, and CRUD checks recorded |
| E | Rehearse migration and preview deployment with controlled verification | BLOCKED | Preview deploy currently blocked by missing preview DB/runtime envs and external scheduler secrets |
| F | Run staging-style E2E, SEO, cookie, upload, notification, and admin verification | TODO | Release gates either pass or are blocked by external dependencies |
| G | Execute production release only if all strict gates pass | TODO | Production deployment ID, commit hash, and verification evidence recorded |

## Non-negotiable Gates

1. No production deployment from a dirty worktree without a concrete commit hash.
2. No claim of release completion unless database, attachment, admin, SMTP, and webhook main paths are verified.
3. Localhost smoke does not count as production acceptance.
4. Missing production secrets may block production, but not earlier release preparation work.

## Current Release Facts

- Current branch: `release/bostar-uiux-v1`
- Frozen commits:
  - `77941b9` `feat(leads): harden workflow automation and delivery`
  - `6129cae` `feat(site): ship ia refresh and support routes`
  - `59bc418` `docs(release): add control plane and runbooks`
- Git remote: none configured
- Linked deployment project exists via `.vercel/project.json`
- Production environment now still lacks strict SMTP connection variables only: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- Preview environment currently lacks verifiable database/admin runtime and cannot complete release rehearsal
- High-frequency lead SLA scheduling is implemented in code and exposed at `/api/cron/leads`
- Vercel project plan rejected 10-minute `vercel.json` cron, so scheduler responsibility is moved to GitHub Actions with repository secrets `CRON_TARGET_URL` and `CRON_SECRET`
