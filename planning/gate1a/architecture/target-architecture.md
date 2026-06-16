# 目标技术架构

## 目标

- 保留 Next.js App Router。
- 将公开站、后台 CMS、SEO/i18n 规则和查询逻辑拆成清晰边界。
- 在不动数据模型的前提下，为 Gate 2 模板重构和 Gate 3 内容迁移提供稳定接口。

## 目标分层

### Route Layer

- `app/(public)/**`：公开站路由
- `app/(admin)/**`：后台页面路由
- `app/api/**`：API 路由保持独立

### Query Layer

- `lib/data-access/**`
- 负责 Prisma 读操作、内容过滤、发布态判断

### View Model Layer

- `lib/view-models/**`
- 将数据库结构转换为模板所需字段，不在页面里做大量 ad hoc 转换

### SEO / Routing Layer

- `lib/seo/**`
- `lib/routing/**`
- 负责 metadata factory、schema builder、locale registry、redirect manifest、sitemap builder

### UI / Template Layer

- `components/design-system/**`
- `features/{product,solution,knowledge,...}/**`
- 页面模板只组装 sections，不直接访问 Prisma

## 后台与公开站隔离

- 当前后台与公开站共仓保留，但使用逻辑隔离：路由组、查询边界、组件目录边界、禁止交叉依赖。
- 后台鉴权和上传逻辑保留在 admin boundary，不让公开模板直接引用。

## i18n 架构目标

- 中文根路径
- 英文 `/en/`
- Locale Registry 驱动 route pairing、hreflang、metadata alternates 和缺失翻译检查

## 数据真实性约束

- `DATABASE_CONTENT_STATUS=UNVERIFIED` 保持不变。
- 任何模板或 schema 只消费已存在字段；需要新增的审核/来源字段通过 expand-and-contract 方案规划，不在 Gate 1A 修改 schema。
