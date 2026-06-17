# PROJECT_STATE

## Snapshot

- Date: 2026-06-17
- Working branch: `codex/gate8-maintenance-handoff`
- Stable production baseline branch: `fix/gate6-legacy-vercel-404`
- Stable production baseline tag: `post-release-stable-2026-06-17`
- Stable production baseline commit: `9b37b31`
- Maintenance tooling commit: `bde0346`
- Current local preview: `http://127.0.0.1:3011`
- Current gate: `MAINTENANCE_HANDOFF_PASS_WITH_BUSINESS_DECISIONS_REQUIRED`
- Production domain: `https://www.bostarcoating.com`
- Live production deployment: `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`

## Completed in Gate 8

- Recovered from the Gate 7 stable baseline on a clean worktree and verified that production still resolves to `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
- Audited `sample-download.pdf` end to end with read-only evidence:
  - no in-repo file under the workspace or `public/**`
  - live zh/en `maintenance-guide` pages still link to `/sample-download.pdf`
  - the asset URL returns production `404`
  - no verified replacement asset was found
- Audited `fjbosd.com` and `www.fjbosd.com` with read-only Vercel, DNS, and HTTP checks:
  - both aliases are attached to the live production deployment
  - `fjbosd.com` redirects to `https://www.fjbosd.com/`
  - alias-host HTML serves site content but canonicalizes to `https://www.bostarcoating.com`
- Hardened `scripts/gate7-production-audit.mjs`:
  - added explicit request timeout handling
  - added bounded retries
  - removed stale default deployment-id attribution
  - added non-zero exit signaling for blocking audit failures
- Created Gate 8 maintenance handoff artifacts:
  - `GATE8_BACKLOG_DECISION_REPORT.md`
  - `GATE8_MAINTENANCE_RUNBOOK.md`
  - `GATE8_MONITORING_CHECKLIST.md`
  - `GATE8_BUSINESS_DECISIONS_REQUIRED.md`

## Active blockers

- No hard blocker remains inside repository-controlled work
- Remaining owner decisions:
  - `DOWNLOAD=A/B/C`
  - `DOMAIN=A/B/C`

## Latest verification

- Gate 8 tooling verification:
  - `node scripts/gate7-production-audit.mjs` with explicit live deployment id and bounded request policy:
    - `PASS_301`: `58`
    - `PASS_200`: `65`
    - `EXPECTED_NOINDEX`: `1`
    - `BUSINESS_REVIEW_REQUIRED`: `1`
    - `BLOCKING_FAILURES`: `0`
  - `npm run typecheck`: pass
  - `npm run lint`: pass with the same 4 pre-existing warnings and no new warnings
  - `npm run build`: pass with the same 4 pre-existing warnings and no new warnings
- Gate 8 production fact verification:
  - `vercel inspect https://www.bostarcoating.com`: live deployment remains `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
  - `vercel domains ls`: `fjbosd.com` remains present under the same Vercel team
  - public fetch:
    - `https://www.bostarcoating.com/sample-download.pdf` -> `404`
    - `https://www.bostarcoating.com/downloads/maintenance-guide` -> `200`
    - `https://www.bostarcoating.com/en/downloads/maintenance-guide` -> `200`
    - `https://fjbosd.com` -> `308` -> `https://www.fjbosd.com/`
    - `https://www.fjbosd.com/` -> `200`

## Next task

- Gate 8 autonomous maintenance closure is complete.
- Next operator action is to record:
  - `DOWNLOAD=A/B/C`
  - `DOMAIN=A/B/C`
