# Data Model Expansion Proposal

## Expand 目标字段

### 建议进入数据库

- `verification_status`
- `verified_by`
- `last_reviewed_at`
- `locale`
- `translation_of`
- `canonical_entity_id`
- `legacy_url`
- `redirect_target`

### 建议进入内容文件或导入清单

- `source`
- `source_file`
- `source_page`

说明：这些字段更适合作为导入/审计来源信息保存，再按需要投影到数据库。

### 仅保留在审计层

- 抓取 hash
- 爬虫发现来源
- 旧站 HTTP 状态
- 临时备注和人工判断过程

## 默认值策略

- `verification_status`: `UNVERIFIED`
- `locale`: `zh-CN` for existing Chinese records
- `translation_of`: `NULL`
- `canonical_entity_id`: self or `NULL` until entity mapping is confirmed
- `legacy_url`: nullable list or join table strategy in later phase
- `redirect_target`: `NULL` until URL decision is approved

## 索引建议

- `(locale, slug)` unique per entity type
- `translation_of` index
- `canonical_entity_id` index
- `verification_status` index for audit workflows

## 回填方式

1. 先建立外部清单与实体主键映射
2. 只回填已确认字段
3. 允许空值，但必须有 `verification_status`
4. 完成验证后才允许 contract 旧逻辑
