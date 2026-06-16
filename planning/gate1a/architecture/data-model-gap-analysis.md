# Data Model Gap Analysis

## 当前状态

- `DATABASE_CONTENT_STATUS=UNVERIFIED`
- 内容模型已经覆盖产品、方案、文章、FAQ、下载、视频、案例、品牌设置和线索。
- 缺少统一的来源、审核、语言、实体配对和历史 URL 字段。

## 核心缺口

1. 无 `source / source_file / source_page`
2. 无 `verified_by / last_reviewed_at / verification_status`
3. 无 `locale / translation_of`
4. 无 `canonical_entity_id`
5. 无 `legacy_url / redirect_target`
6. 现有 `seoTitle / seoDesc / canonicalUrl` 不能表达语言配对和实体级 canonical 关系

## 风险

- Gate 3 内容迁移时无法判断内容是否来自旧站、文件、人工补录或业务确认。
- 多语言上线后无法稳定维护实体之间的对应关系。
- Redirect 决策只能留在外部文档，无法回填到内容或实体层。
