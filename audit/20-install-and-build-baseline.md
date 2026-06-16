# Gate 0C Install And Build Baseline

## Status

- Clean clone install baseline: `PASS`
- Clean clone build baseline: `PASS_WITH_CONFIGURATION_GAP`
- Raw command log copied into current repository: [gate0c-command-log.csv](<D:/桌面/液体自动静电喷枪说明书项目文件夹 -1/bostar-geo-website/audit/reports/gate0c-command-log.csv>)

## Environment Facts

- Clean clone path: `D:\work\bostar-gate0c`
- Node.js: `v26.2.0`
- npm: `11.13.0`
- npm cache: `C:\Users\40352\AppData\Local\npm-cache`
- Directory write test in clean clone: `PASS`

## npm ci Diagnosis

1. `npm ci` was attempted twice through a PowerShell wrapper and both attempts were recorded as failed in the first pass of the logger.
2. `npm ci --ignore-scripts` succeeded.
3. A direct `cmd.exe /c npm ci` rerun in the same clean clone succeeded and completed `postinstall -> prisma generate`.
4. Conclusion:
   - The original Gate 0B Prisma `EPERM unlink` failure did **not** reproduce in the clean short-path clone.
   - The clean environment is reproducible.
   - The failing PowerShell-wrapped attempts should be treated as diagnostic artifacts, not as the final installation outcome.

## Prisma EPERM Outcome

- Status: `RESOLVED_IN_CLEAN_CLONE`
- Final effective result: normal `npm ci` completed successfully in the clean clone.
- Diagnostic narrowing:
  - short ASCII path avoided the original long-path polluted workspace conditions
  - `npm ci --ignore-scripts` success proved package extraction itself was viable
  - direct `npm ci` success proved Prisma client generation can complete in the clean clone

## Effective Command Results

| Command | Classification | Notes |
|---|---|---|
| `npm ci` | `PASS` | direct `cmd` rerun succeeded |
| `npx next --version` | `PASS` | `Next.js v15.5.18` |
| `npx tsc --version` | `PASS` | `Version 5.9.3` |
| `npx prisma --version` | `PASS` | Prisma CLI and client available |
| `npm run lint` | `MISSING_CONFIGURATION` | `next lint` entered interactive ESLint setup instead of running a committed lint config |
| `npx tsc --noEmit` | `PASS` | completed with exit code `0` |
| smoke scripts | `BLOCKED` | existing scripts perform admin write, upload, or lead submission flows, which are outside Gate 0C no-write limits |
| `npm run build` | `PASS` | production build completed |
| `npm run start -- --port 3013` | `PASS` | local production preview started |
| HTTP checks on preview | `PASS` | `/`, `/products`, `/contact`, `/robots.txt`, `/sitemap.xml` all returned `200` |

## Important Evidence Paths

- Clean clone command log: `D:\work\bostar-gate0c\audit\reports\gate0c-command-log.csv`
- Direct successful install stdout: `D:\work\bostar-gate0c\audit\reports\22-npm-ci-direct-stdout.txt`
- Direct successful install stderr: `D:\work\bostar-gate0c\audit\reports\22-npm-ci-direct-stderr.txt`
- Build stdout: `D:\work\bostar-gate0c\audit\reports\33-npm-run-build-stdout.txt`
- Preview HTTP checks: `D:\work\bostar-gate0c\audit\reports\35-preview-http-checks.txt`

## Hash Checks

- Original working copy `package.json` SHA-256 remained `2273E6313892CB811997341AB38A4DFA3A0C3B5DC13E84C3A7F3447C90897498`
- Original working copy `package-lock.json` SHA-256 remained `F4DBEE3F87C1BEE14F8DF75E91C4E0B8E9C7204DCE0CC484ED259BF3C5392163`
- Gate 0C pass/fail uses the original working copy hash invariants above.

## Remaining Gate 0C Blockers

- `npm run lint` is not a reliable lint check yet because the repository lacks a committed ESLint configuration for `next lint`.
- Smoke scripts remain intentionally blocked under Gate 0C because they would write admin data, uploads, or leads.
