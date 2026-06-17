# Gate 7 Remaining Backlog

## Rolled into Gate 8

1. `sample-download.pdf`
   - Gate 8 status: `BUSINESS_OWNER_DECISION_REQUIRED`
   - Verified behavior:
     - `https://www.bostarcoating.com/sample-download.pdf` returns `404`
     - zh/en `maintenance-guide` detail pages still link to `/sample-download.pdf`
     - no in-repo file or verified replacement asset was found
   - Required owner input: `DOWNLOAD=A`, `DOWNLOAD=B`, or `DOWNLOAD=C`
   - Source of truth: `GATE8_BACKLOG_DECISION_REPORT.md`, `GATE8_BUSINESS_DECISIONS_REQUIRED.md`

2. Extra Vercel aliases
   - Gate 8 status: `BUSINESS_OWNER_DECISION_REQUIRED`
   - Verified behavior:
     - `fjbosd.com` and `www.fjbosd.com` are attached to live deployment `dpl_AJn9W2vkJZ9zWdQHrUAdT7UkHM8h`
     - alias hosts serve BOSTAR homepage content with canonical pointing at `https://www.bostarcoating.com`
   - Required owner input: `DOMAIN=A`, `DOMAIN=B`, or `DOMAIN=C`
   - Source of truth: `GATE8_BACKLOG_DECISION_REPORT.md`, `GATE8_BUSINESS_DECISIONS_REQUIRED.md`

## Known scope gaps retained

3. English body-copy parity
   - Status: `KNOWN_SCOPE_GAP`
   - Reason: approved English shell and metadata are live, but data-backed detail bodies still reuse verified Chinese source content where no approved English copy exists

4. Lighthouse evidence
   - Status: `KNOWN_SCOPE_GAP`
   - Reason: no approved no-install Lighthouse runtime path was available in this workspace; Gate 7 closed with existing fetch/runtime evidence instead
