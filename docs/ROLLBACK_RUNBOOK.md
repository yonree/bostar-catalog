# Rollback Runbook

## Application Rollback

1. Identify the last stable production deployment and its commit hash.
2. In Vercel, promote or redeploy the last stable commit instead of rebuilding from an unknown worktree.
3. Confirm public aliases repoint to the recovered deployment.
4. Run read-only smoke for `/`, `/en/`, `/support`, `/products`, `/sitemap.xml`, and `/robots.txt`.

## Database Rollback Principles

1. Do not run `prisma migrate reset`.
2. Do not drop newly added lead workflow columns as the first rollback action.
3. If application rollback is enough, keep the expanded schema in place and revert only the app code.
4. If database rollback is mandatory, restore from a verified backup snapshot rather than issuing destructive ad hoc SQL.

## Trigger Conditions

- App boot failure after deployment
- Production lead creation failure
- Admin lead view failure
- Attachment authorization failure
- SMTP or webhook failures that break the strict release gate
- Scheduler workflow failure causing SLA timeout notifications to stop
- Large-scale `500` errors or redirect loops

## Recovery Data To Record

- Previous stable deployment ID
- Previous stable commit hash
- Backup identifier for the production database
- Last successful `Lead Automation Scheduler` run ID and failure log
- Exact rollback command or Vercel promotion action
- Post-rollback smoke evidence
