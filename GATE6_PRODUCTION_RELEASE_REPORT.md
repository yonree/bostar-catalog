# Gate 6 Production Release Report

## Snapshot

- Date: 2026-06-17
- Branch: `fix/gate6-legacy-vercel-404`
- Release candidate commit: `1767fc9`
- Release candidate tag: `gate-6-retry-candidate-2026-06-17`
- Final status: `PRODUCTION_RELEASE_PASS`

## Production platform and routing

- Platform: Vercel
- Bound Vercel project: `bostar-geo-website`
- Vercel project id: `prj_Snv902TWIACH7i5hQc3jeRgv20Z0`
- Vercel org id: `team_wiV97iL3q7MEbe71U8rFU9HC`
- Current production deployment id: `dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC`
- Current production deployment url: `https://bostar-geo-website-cfvqhh4wg-yonree-s-projects.vercel.app`
- Current production deployment created at: `2026-06-17 14:16:26 +08:00`
- Current production aliases:
  - `https://bostarcoating.com`
  - `https://www.bostarcoating.com`
  - `https://bostar-geo-website.vercel.app`

## Release baseline

- Candidate release commit for the successful production retry: `1767fc98162aa7a99dfa1d30e185399adefcd609`
- Candidate release commit message: `fix(gate6): restore legacy liquid routes in vercel runtime`
- Local validation on candidate release commit:
  - `npm run typecheck`: pass
  - `npm run lint`: pass with the same 4 pre-existing warnings and no new warnings
  - `npm run build`: pass with the same 4 pre-existing warnings and no new warnings
  - local smoke on `http://127.0.0.1:3011`: pass for `/`, `/en`, `/contact`, `/en/contact`, restored zh/en legacy liquid product detail, `/sitemap.xml`, `/robots.txt`, and `/missing-route-check`
- Release environment:
  - Node: `v26.2.0`
  - npm: `11.13.0`
  - `package-lock.json` SHA256: `F4DBEE3F87C1BEE14F8DF75E91C4E0B8E9C7204DCE0CC484ED259BF3C5392163`

## Production precheck findings

### Verified

- `vercel whoami` succeeds and returns an authenticated account.
- `vercel inspect www.bostarcoating.com` resolves the live production deployment and confirms `target=production`, `status=Ready`.
- `https://www.bostarcoating.com/` returns `200`.
- `vercel env ls production` confirms presence of these production env names:
  - `DATABASE_URL`
  - `DATABASE_URL_UNPOOLED`
  - `NEXT_PUBLIC_SITE_URL`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD_HASH`
  - `ADMIN_SESSION_SECRET`
  - `BLOB_READ_WRITE_TOKEN`
  - `BLOB_STORE_ID`
  - `BLOB_WEBHOOK_PUBLIC_KEY`
- `vercel deploy --help` confirms the existing production deployment path is available via Vercel CLI.
- `vercel rollback --help` confirms the rollback path is available via Vercel CLI.
- Vercel project integration metadata now resolves the production database to a unique Neon integration resource:
  - Provider: `Neon`
  - Resource name: `neon-fuchsia-jacket`
  - Vercel integration store: `store_7n****yCQ`
  - Neon project: `neon-fuchsia-jacket`
  - Neon project id: `odd-****-7926`
  - Neon branch: `main`
  - Neon branch id: `br-p****zgf`
  - Neon compute host: `ep-d****ew2.c-8.us-east-1.aws.neon.tech`
  - Neon pooled host: `ep-d****ooler.c-8.us-east-1.aws.neon.tech`
  - Region: `aws-us-east-1`
- The linked Neon integration resource explicitly exposes these synced database secret names for the current Vercel project: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_HOST`, `PGHOST`, `PGHOST_UNPOOLED`, `NEON_PROJECT_ID`, and related `PG*` variables.
- Production DB scope verification:
  - `DATABASE_URL` and `DATABASE_URL_UNPOOLED` exist in `Production` scope.
  - Integration-generated `POSTGRES_*`, `PG*`, and `NEON_PROJECT_ID` values are shared across `Production` and `Preview`.
  - No database secret in the linked Neon resource is targeted at `Development`.
- Neon restore-readiness verification:
  - Production-bound Neon project reports `history_retention_seconds=21600`, which matches a 6-hour restore window.
  - The production branch is the default root branch `main`, which is eligible for point-in-time restore.
  - The linked project metadata confirms only one branch is active for production, avoiding branch ambiguity.
  - Restore path can be executed without overwriting production blindly by using Neon preview / restore workflows that create a backup branch of the current state before finalize.
- Blob binding verification:
  - Production blob store: `bostar-geo-website-blob`
  - Store id: `store_bf****7AX`
  - Region: `iad1`
  - Access: `public`
  - Blob count: `24`
  - Size: `9.9MB`
  - Bound project: `bostar-geo-website`
  - `BLOB_MUTATION_EXPECTED=NO` for this release candidate: the production release process does not call blob write/delete operations.
- Blob recovery verification:
  - Offline mirror directory: `D:\work\gate6-backups\bostar-blob-20260617-094448`
  - Offline mirror ZIP: `D:\work\gate6-backups\bostar-blob-20260617-094448.zip`
  - ZIP SHA-256 sidecar: `D:\work\gate6-backups\bostar-blob-20260617-094448.zip.sha256.txt`
  - Recovery status: `VERIFIED_OFFLINE_MIRROR`
  - Verified object count: `24`
  - ZIP extract verification: `24/24` blobs restored, `0` missing, `0` hash mismatches
- SMTP / Webhook / Upload provider verification:
  - `SMTP_*`: not referenced by runtime code paths; lead submission API does not depend on SMTP and does not 500 when SMTP is absent.
  - `WEBHOOK_*`: not referenced by runtime code paths; lead submission does not send webhook notifications and does not depend on them to persist a lead.
  - `UPLOAD_PROVIDER`: not referenced by runtime code paths; upload API is hard-wired to Vercel Blob and does not fall back to local filesystem storage.
  - Upload overwrite safety: `app/api/upload/route.ts` uses timestamped `uploads/<Date.now()>-<sanitizedName>` pathnames and does not pass `allowOverwrite`, so routine admin uploads append new blobs instead of overwriting existing ones.

## Release execution

- Fix deployment branch: `fix/gate6-legacy-vercel-404`
- Fix deployment build id: `dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC`
- Fix deployment url: `https://bostar-geo-website-cfvqhh4wg-yonree-s-projects.vercel.app`
- Initial production substate: `STAGED`
- Promotion command path: `POST /v10/projects/prj_Snv902TWIACH7i5hQc3jeRgv20Z0/promote/dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC?teamId=team_wiV97iL3q7MEbe71U8rFU9HC`
- Promotion result: `PROMOTED`

## Post-release smoke

- Validation channel:
  - deployment resolution: `vercel inspect www.bostarcoating.com`
  - independent public fetches for route reachability and rendered body content
  - local shell HTTP was demoted to advisory-only because the agent host started receiving `403 Vercel Security Checkpoint`
- Publicly verified:
  - `https://www.bostarcoating.com/`: reachable, home hero rendered
  - `https://www.bostarcoating.com/en`: reachable, English home rendered
  - `https://www.bostarcoating.com/about`: reachable
  - `https://www.bostarcoating.com/contact`: reachable
  - `https://www.bostarcoating.com/en/contact`: reachable
  - `https://www.bostarcoating.com/solutions/automatic-coating-line`: reachable
  - `https://www.bostarcoating.com/knowledge/process-knowledge/adjust-spray-voltage`: reachable
  - `https://www.bostarcoating.com/downloads`: reachable
  - `https://www.bostarcoating.com/products/Manual-Electrostatic-Liquid-Spray-Gun`: reachable
  - `https://www.bostarcoating.com/en/products/Manual-Electrostatic-Liquid-Spray-Gun`: reachable
  - `https://www.bostarcoating.com/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun`: reachable
  - `https://www.bostarcoating.com/en/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun`: reachable
  - `https://www.bostarcoating.com/products/Automatic-Electrostatic-Liquid-Spray-Gun`: reachable
  - `https://www.bostarcoating.com/en/products/Automatic-Electrostatic-Liquid-Spray-Gun`: reachable
  - `https://www.bostarcoating.com/products/Automatic-Electrostatic-Liquid-Spray-Gun/bsd-3029-automatic-liquid-electrostatic-spray-gun`: reachable
- Pre-existing Gate 5 / precheck evidence still covers:
  - local `robots.txt` / `sitemap.xml` verification
  - admin access control behavior
  - API read-only smoke

## Promotion and recovery notes

- `vercel promote dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC --yes`: failed with `Deployment belongs to a different team`
- `POST /v10/projects/prj_Snv902TWIACH7i5hQc3jeRgv20Z0/promote/dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC?teamId=team_wiV97iL3q7MEbe71U8rFU9HC`: succeeded
- `POST /v1/projects/prj_Snv902TWIACH7i5hQc3jeRgv20Z0/rollback/dpl_7GyQnXHosWMRooQauqjrXXV5r6KB?teamId=team_wiV97iL3q7MEbe71U8rFU9HC`: rejected on Hobby because it was no longer the immediate previous production deployment
- `POST /v1/projects/prj_Snv902TWIACH7i5hQc3jeRgv20Z0/rollback/dpl_Ff9h5z2tUAvbNSFvmrNUZCzn12CF?teamId=team_wiV97iL3q7MEbe71U8rFU9HC`: succeeded during recovery drill
- `POST /v10/projects/prj_Snv902TWIACH7i5hQc3jeRgv20Z0/promote/dpl_7GyQnXHosWMRooQauqjrXXV5r6KB?teamId=team_wiV97iL3q7MEbe71U8rFU9HC`: succeeded to restore the prior public baseline before the final successful retry

## Release decision

- Decision: production deployment retry passed and remains live.
- Reason: the promoted fix deployment `dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC` publicly restores the previously failing legacy liquid category/detail contract without introducing a public reachability regression on the audited core routes.

## Verified deployment and rollback command paths

- Prospective production deploy command path: `vercel deploy --prod --yes`
- Verified promote API path for the current workspace: `POST /v10/projects/{projectId}/promote/{deploymentId}?teamId=...`
- CLI rollback remains unreliable in this workspace; API-based promote/rollback is the verified control path

## Production safety record

- Production deployment executed: `yes`
- Production rollback executed: `yes`, during intermediate recovery drills before the final successful retry
- DNS modified: `no`
- Production database written: `no`
- Production media written: `no`
- Real leads submitted: `no`

## Gate 6 status matrix

| Check item | Status | Evidence | Blocking |
| --- | --- | --- | --- |
| Vercel -> Neon binding | VERIFIED | linked Neon integration resource `neon-fuchsia-jacket`, project `odd-****-7926`, branch `main`, host `ep-d****ew2.c-8.us-east-1.aws.neon.tech` | no |
| Neon backup / PITR | VERIFIED | `history_retention_seconds=21600`, root branch `main`, restore preview + backup-branch workflow available | no |
| Blob recovery readiness | VERIFIED_OFFLINE_MIRROR | offline mirror directory + ZIP + SHA-256 sidecar + `24/24` hash verification | no |
| SMTP | INTENTIONAL | runtime code has no SMTP path; absence does not cause lead API 500 | no |
| Webhook | INTENTIONAL | runtime code has no webhook path; absence does not block lead persistence | no |
| Upload Provider | INTENTIONAL | variable unused; upload API is fixed to Vercel Blob and does not fall back to local filesystem | no |
| Legacy Liquid category acceptance | VERIFIED | public production fetches confirm the previously failing manual and automatic liquid zh/en category/detail family is reachable on `dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC` | no |
