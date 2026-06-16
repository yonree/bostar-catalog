# Gate 0C Pre-Git Snapshot

## Status

- Snapshot creation: `PASS`
- Real Git repository found in current or parent directories: `NO`
- Allowed to continue with `git init`: `YES`

## Start-Of-Run Validation

- Working directory: `D:\桌面\液体自动静电喷枪说明书项目文件夹 -1\bostar-geo-website`
- `.git` exists in current directory: `false`
- Parent Git checks:
  - `D:\桌面\液体自动静电喷枪说明书项目文件夹 -1\bostar-geo-website` -> `false`
  - `D:\桌面\液体自动静电喷枪说明书项目文件夹 -1` -> `false`
  - `D:\桌面` -> `false`
- `package.json` SHA-256: `2273E6313892CB811997341AB38A4DFA3A0C3B5DC13E84C3A7F3447C90897498`
- `package-lock.json` SHA-256: `F4DBEE3F87C1BEE14F8DF75E91C4E0B8E9C7204DCE0CC484ED259BF3C5392163`
- Business source inventory:
  - included roots: `app`, `components`, `lib`, `prisma`, `public`
  - file count: `133`
  - aggregate SHA-256: `007A56E3C0944784CF437505BFAA8B773F08A1015FB33E0CAEA046DE3C66C7A7`
- Sensitive/local file presence detected without reading contents:
  - `.env`
  - `.env.example`
  - `.env.production.example`
- No certificate, key, or local database files were detected by filename pattern in the working tree.

## Snapshot Output

- Snapshot stage path: `D:\work\gate0c-snapshots\bostar-snapshot-20260616-102548`
- Snapshot archive path: `D:\work\gate0c-snapshots\bostar-snapshot-20260616-102548.zip`
- Created at: `2026-06-16T10:25:53`
- File count: `208`
- Total size: `94021930` bytes
- Snapshot archive size: `75721893` bytes
- Snapshot SHA-256: `AC520C39C080CCF51DB43F94C781E65A9DD425386BE2424C056F291B9519D70E`

## Included Scope

- `app/**`
- `components/**`
- `lib/**`
- `prisma/**`
- `public/**`
- root configuration files
- `package.json`
- `package-lock.json`
- `audit/**`

## Excluded Items

- `.env`
- `.env.*`
- `node_modules/**`
- `.next/**`
- `.git/**`
- cache and temporary files
- log files
- certificate and key files
- local database files

## Restore Steps

1. Copy the archive `D:\work\gate0c-snapshots\bostar-snapshot-20260616-102548.zip` to a clean workspace.
2. Verify the archive SHA-256 equals `AC520C39C080CCF51DB43F94C781E65A9DD425386BE2424C056F291B9519D70E`.
3. Extract the archive to a new directory.
4. Recreate environment-specific files separately, including `.env`, without copying secrets into source control.
5. Install dependencies from `package-lock.json` only after the extracted tree is verified.
