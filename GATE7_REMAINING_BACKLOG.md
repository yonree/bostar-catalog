# Gate 7 Remaining Backlog

## Non-blocking

1. `sample-download.pdf`
   - Status: `BUSINESS_REVIEW_REQUIRED`
   - Current behavior: `https://www.bostarcoating.com/sample-download.pdf` returns `404`
   - Reason: approved planning asset marks it as an orphaned public file with no verified repository source or replacement target
   - Required input: either provide the real file, approve a verified replacement URL, or approve permanent removal

2. Extra Vercel aliases
   - Status: `OWNER_REVIEW_RECOMMENDED`
   - Current aliases observed on the live deployment: `fjbosd.com`, `www.fjbosd.com`
   - Reason: the declared primary domain for this rollout is `www.bostarcoating.com`; extra aliases expand the public surface and may create duplicate-content or ownership questions

3. English body-copy parity
   - Status: `KNOWN_SCOPE_GAP`
   - Reason: approved English shell and metadata are live, but data-backed detail bodies still reuse verified Chinese source content where no approved English copy exists

4. Lighthouse evidence
   - Status: `KNOWN_SCOPE_GAP`
   - Reason: no approved no-install Lighthouse runtime path was available in this workspace; Gate 7 closed with existing fetch/runtime evidence instead
