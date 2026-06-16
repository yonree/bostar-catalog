# Multi-agent Implementation Plan

## 当前执行方式

- 本轮 Gate 1A 实际执行：`Orchestrator 单 Agent`
- 子智能体启动情况：`未启动`
- 原因：本轮以规划文档整合为主，现有审计证据已足够支持单线程落盘，避免并行文档冲突

## Gate 2 建议分工

- URL Agent：维护 redirect manifest、历史 URL 回归
- IA Agent：维护导航、面包屑、页面归属和用户路径
- UI/UX Agent：维护 tokens、page patterns 和组件规范
- Frontend Architecture Agent：维护 route/query/seo/i18n 分层与模板实现
- SEO/GEO Agent：维护 metadata factory、schema、sitemap、canonical 规则
- I18N Agent：维护 locale registry、route pairing、词汇表和 hreflang 规则
- QA/Release Agent：维护 lint、smoke、build、preview、rollback 和 staging 验收

## 协作规则

- 每个 agent 只修改自己拥有的文件清单。
- 任何跨目录改动先经 Orchestrator 拆分后再执行。
- 审计与业务源码分离提交。
- 任何 `UNVERIFIED` 结论不得在实现阶段默认为事实。
