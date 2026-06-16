# ??? API ??

## ??/????

- ??: `components/lead/LeadForm.tsx`
- ????: `/api/leads`
- ??: company, demandType, email, interestedProduct, message, name, phone, region, sourcePage, website
- ????: `name` ???`phone/email` ?????`message` ?? 2000 ?????? `website`?
- ????: HTML `required` + `type=email` + `maxLength`?
- ?????: `lib/validators.ts -> validateLead`?
- ????: 200 JSON `success: true`?
- ????: 400 ?????????????????
- ??????: ??????????
- ????: Prisma `Lead` ??
- ????: ??? SMTP/??/?????????????

## API Route ??

| Path | Methods | Purpose | DB tables | Auth | PII | Server validation | Rate limit | External service | Safe test | Source | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| /api/admin/article-categories/[id] | DELETE, PUT | admin-cms | articleCategory | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/article-categories/[id]/route.ts` | inferred from route source only |
| /api/admin/article-categories | GET, POST | admin-cms | articleCategory | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/article-categories/route.ts` | inferred from route source only |
| /api/admin/articles/[id] | DELETE, PUT | admin-cms | article | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/articles/[id]/route.ts` | inferred from route source only |
| /api/admin/articles | GET, POST | admin-cms | article, articleCategory | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/articles/route.ts` | inferred from route source only |
| /api/admin/cases/[id] | DELETE, PUT | admin-cms | case | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/cases/[id]/route.ts` | inferred from route source only |
| /api/admin/cases | GET, POST | admin-cms | case | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/cases/route.ts` | inferred from route source only |
| /api/admin/downloads/[id] | DELETE, PUT | admin-cms | download | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/downloads/[id]/route.ts` | inferred from route source only |
| /api/admin/downloads | GET, POST | admin-cms | download | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/downloads/route.ts` | inferred from route source only |
| /api/admin/faqs/[id] | DELETE, PUT | admin-cms | fAQ | MIDDLEWARE_GUARDED | YES | NO | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/faqs/[id]/route.ts` | inferred from route source only |
| /api/admin/faqs | GET, POST | admin-cms | fAQ | MIDDLEWARE_GUARDED | YES | NO | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/faqs/route.ts` | inferred from route source only |
| /api/admin/leads/[id] | PUT | lead management | lead | MIDDLEWARE_GUARDED | YES | NO | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/leads/[id]/route.ts` | inferred from route source only |
| /api/admin/leads | GET | lead management | lead | MIDDLEWARE_GUARDED | YES | NO | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/leads/route.ts` | inferred from route source only |
| /api/admin/login | POST | admin login | NONE_DIRECT | YES | YES | NO | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/login/route.ts` | inferred from route source only |
| /api/admin/logout | POST | admin logout | NONE_DIRECT | YES | NO | NO | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/logout/route.ts` | inferred from route source only |
| /api/admin/media/[id] | DELETE, PUT | media library management | mediaAsset | MIDDLEWARE_GUARDED | YES | NO | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/media/[id]/route.ts` | inferred from route source only |
| /api/admin/media | GET, POST | media library management | mediaAsset | MIDDLEWARE_GUARDED | YES | NO | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/media/route.ts` | inferred from route source only |
| /api/admin/product-categories/[id] | DELETE, PUT | admin-cms | productCategory | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/product-categories/[id]/route.ts` | inferred from route source only |
| /api/admin/product-categories | GET, POST | admin-cms | productCategory | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/product-categories/route.ts` | inferred from route source only |
| /api/admin/products/[id] | DELETE, PUT | admin-cms | product | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/products/[id]/route.ts` | inferred from route source only |
| /api/admin/products | GET, POST | admin-cms | product, productCategory | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/products/route.ts` | inferred from route source only |
| /api/admin/settings/[id] | PUT | site settings management | brandSetting | MIDDLEWARE_GUARDED | YES | NO | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/settings/[id]/route.ts` | inferred from route source only |
| /api/admin/settings | GET, POST | site settings management | brandSetting | MIDDLEWARE_GUARDED | YES | NO | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/settings/route.ts` | inferred from route source only |
| /api/admin/solutions/[id] | DELETE, PUT | admin-cms | solution | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/solutions/[id]/route.ts` | inferred from route source only |
| /api/admin/solutions | GET, POST | admin-cms | solution | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/solutions/route.ts` | inferred from route source only |
| /api/admin/videos/[id] | DELETE, PUT | admin-cms | video | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/videos/[id]/route.ts` | inferred from route source only |
| /api/admin/videos | GET, POST | admin-cms | video | MIDDLEWARE_GUARDED | YES | YES | NO_EVIDENCE | NONE_DIRECT | CONDITIONAL | `app/api/admin/videos/route.ts` | inferred from route source only |
| /api/leads | POST | public lead submission | lead | NO | YES | YES | NO_EVIDENCE | NONE_DIRECT | NO | `app/api/leads/route.ts` | inferred from route source only |
| /api/search | GET | public site search | NONE_DIRECT | NO | NO | NO | NO_EVIDENCE | NONE_DIRECT | YES | `app/api/search/route.ts` | inferred from route source only |
| /api/upload | POST | authenticated media upload | mediaAsset | YES | YES | NO | NO_EVIDENCE | Vercel Blob | CONDITIONAL | `app/api/upload/route.ts` | inferred from route source only |
