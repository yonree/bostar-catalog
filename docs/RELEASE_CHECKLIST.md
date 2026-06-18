# Release Checklist

## Repository Freeze

- [x] Current branch identified
- [x] Current production deployment identified
- [x] Dirty worktree confirmed
- [x] Git remote presence checked
- [ ] Release branch created
- [ ] Atomic commits created
- [ ] Frozen release commit hash recorded
- [ ] Worktree clean after freeze

## Environment Gates

- [x] Local environment keys inventoried by name only
- [x] Preview environment keys inventoried by name only
- [x] Production environment keys inventoried by name only
- [ ] Preview admin runtime complete
- [ ] Preview lead submission runtime complete
- [ ] Production SMTP runtime complete
- [ ] Production webhook runtime complete
- [ ] Production lead routing and SLA runtime complete

## Prisma and Database

- [x] Prisma version inspected
- [x] Datasource provider confirmed as PostgreSQL
- [x] Generator mode inspected
- [ ] Preview migration rehearsal completed
- [ ] Production backup identifier recorded
- [ ] Production `prisma migrate deploy` executed
- [ ] Post-migration CRUD verified in production-like runtime

## Deployments

- [x] Current production deployment inspected
- [ ] New preview deployment created from frozen commit
- [ ] Preview deployment ID recorded
- [ ] New production deployment created from frozen commit
- [ ] Production deployment ID recorded

## Verification

- [x] Local `typecheck`
- [x] Local `lint`
- [x] Local `build`
- [x] Local `test`
- [ ] Real-browser preview Chinese lead path
- [ ] Real-browser preview English lead path
- [ ] Preview attachment private access path
- [ ] Preview admin lead review path
- [ ] Preview SMTP delivery verification
- [ ] Preview webhook delivery verification
- [ ] Preview SLA reminder/scheduling verification
- [ ] Production read-only smoke
- [ ] Production Chinese inquiry smoke
- [ ] Production English inquiry smoke
- [ ] Production attachment verification
- [ ] Production admin verification
- [ ] Production SEO/canonical/hreflang verification
- [ ] Production cookie verification

