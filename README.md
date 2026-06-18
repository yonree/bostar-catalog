# BOSTAR GEO Website

博士达官网重设计工程，基于 `Next.js App Router + TypeScript + Prisma + PostgreSQL`。

## 启动

```bash
npm install
cp .env.example .env
npm run prisma:generate:no-engine
npm run dev
```

默认地址：

```text
http://localhost:3000
```

## 关键脚本

```bash
npm run typecheck
npm run lint
npm run build
npm run test:unit
npm run test:integration
npm run test:e2e
npm run prisma:validate
npm run prisma:diff:empty
```

## Lead / Inquiry Workflow

- `/api/leads`
  - richer 询盘字段校验
  - UTM / referrer / source metadata
  - SLA 截止时间计算
  - `LeadEvent` / `NotificationLog`
- `/api/lead-attachments`
  - 私有存储
  - MIME / 扩展名 / 大小限制
  - 上传草稿 token
- `/api/admin/leads/[id]/attachments/[attachmentId]`
  - 后台鉴权下载附件

## Prisma

新增迁移位于：

```text
prisma/migrations/20260618_lead_workflow_foundation/
```

执行前先看：

```text
docs/MIGRATION_RUNBOOK.md
```

## 文档

- [docs/EXECUTION_PLAN.md](/D:/桌面/液体自动静电喷枪说明书项目文件夹%20-1/bostar-geo-website/docs/EXECUTION_PLAN.md)
- [docs/TASK_STATE.md](/D:/桌面/液体自动静电喷枪说明书项目文件夹%20-1/bostar-geo-website/docs/TASK_STATE.md)
- [docs/DECISIONS.md](/D:/桌面/液体自动静电喷枪说明书项目文件夹%20-1/bostar-geo-website/docs/DECISIONS.md)
- [docs/MIGRATION_RUNBOOK.md](/D:/桌面/液体自动静电喷枪说明书项目文件夹%20-1/bostar-geo-website/docs/MIGRATION_RUNBOOK.md)

## 说明

- Windows 本地如果 Prisma query engine DLL 被占用，可先执行 `npm run prisma:generate:no-engine` 完成类型生成。
- 真实 SMTP / Webhook / 生产数据库迁移不在本仓库内自动执行，需要按 runbook 在 staging 或 production 手动启用。
