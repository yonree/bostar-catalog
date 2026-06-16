# Data Migration Preconditions

## 前置条件

1. 提供只读数据库副本、脱敏 SQL 导出、只读账号或表级统计导出之一。
2. 先完成实体映射表：产品、分类、文章、方案、下载、视频、案例。
3. 先完成 URL 决策 Manifest 审核。
4. 先完成中英文 route pairing 规则。

## Expand 阶段

- 只新增字段、表或外部映射表
- 不删除旧字段
- 不重命名旧字段
- 不在 Gate 1A 触发任何 migration

## Contract 阶段前提

- 新字段已经回填
- 模板已切换到新字段
- 验证状态不再是 `UNVERIFIED`
- 回滚脚本已演练

## 回滚策略

- Expand 字段默认允许空值
- 任何消费方切换都可回退到旧字段映射
- Redirect 和语言映射先留在 manifest，再逐步落入数据层
