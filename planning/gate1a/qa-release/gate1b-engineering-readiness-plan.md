# Gate 1B Engineering Readiness Plan

## 14.1 ESLint

- 目标：让 `npm run lint` 变成非交互、可重复执行的检查。
- 建议：采用与 Next.js 15、TypeScript 兼容的 ESLint flat config 或等价非交互配置。
- 依赖策略：优先复用现有 `eslint` 与 `eslint-config-next`，只有在规则实现做不到时才提新增 devDependency。
- 初始规则范围：
  - TypeScript / React 基础错误
  - import / unused
  - Next app router 推荐规则
  - 禁止明显无用代码与未处理错误
- 老代码分级：
  - `error`: 会导致构建/行为问题
  - `warn`: 样式和轻度可维护性问题
- 禁止一次性自动修大量业务代码。

## 14.2 Smoke 脚本分类

| Script | Classification | Reason |
|---|---|---|
| `scripts/smoke-admin-local.mjs` | `DATABASE_WRITE` + `LEAD_SUBMISSION` | 编辑产品、修改下载设置、创建 lead |
| `scripts/smoke-cover-render.mjs` | `FILE_UPLOAD` + `DATABASE_WRITE` + `EXTERNAL_SIDE_EFFECT` | 上传媒体、写数据库、触及外部存储 |
| `scripts/smoke-media-picker-ui.mjs` | `DATABASE_WRITE` | 修改内容记录字段 |
| `scripts/smoke-regression.mjs` | `LEAD_SUBMISSION` | 包含 `/api/leads` POST |

### Gate 1B 方案

- 增加 dry-run 模式
- 引入 mock 服务或测试 DB
- 上传走专用测试桶
- 邮件/通知走拦截器
- 每次测试后清理测试数据
- 测试脚本必须可重复执行

## 14.3 数据库验证

Gate 1B 至少接受以下之一：

- 只读数据库副本
- 脱敏 SQL 导出
- 只读账号
- 表级统计导出

没有数据库验证前：

- 不修改数据模型
- 不迁移内容
- 不把 `UNVERIFIED` 内容当成事实
