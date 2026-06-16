# Module Boundaries

## Public route modules

- 只依赖 query layer、SEO layer、design system、feature sections
- 不直接依赖 admin 组件或 admin API helper

## Admin modules

- 只依赖 admin query/service helper
- 不直接导入公开模板 section

## Query modules

- 只负责数据读取、发布态过滤、轻量聚合
- 不输出 JSX

## View model modules

- 负责把 Prisma 记录标准化成模板字段
- 处理空值回退、数组整理、图片优先级排序

## SEO modules

- 负责 canonical、robots、OG、alternates、schema
- 页面文件只传入 page type 和 entity payload

## i18n modules

- 负责 locale registry、route pairing、dictionary loading、missing translation detection
- 不改写业务事实，不翻译参数值

## Design system modules

- 提供 token 驱动的 primitives、form state、table style、status color 和 section frame
- 不嵌入业务 copy

## Forbidden dependencies

- `app/(public)` 直接调用 Prisma
- `components/design-system` 引用业务实体字段
- `schema builder` 读取未验证营销字段
- `locale registry` 读取数据库写操作
