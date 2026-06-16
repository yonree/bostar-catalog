# Robots And AI Crawler Policy

## Robots.txt

- 公开内容允许抓取
- `/admin/` 和后台接口保持禁止
- 不因 AI 抓取而阻断正常搜索抓取

## OAI-SearchBot

- 公开内容默认允许，前提是该内容可被正常公开访问且不含敏感信息
- 以内容真实性和可引用性为前提，不为 bot 单独生成空洞页面

## GPTBot

- 作为独立业务决策项，进入 Gate 1B / 发布前确认
- Gate 1A 仅记录策略位，不做启停变更

## llms.txt

- 可选信息索引文件
- 不作为 SEO / GEO 成功标准
