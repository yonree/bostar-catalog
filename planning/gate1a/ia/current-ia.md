# 当前 IA

## 证据来源

- `audit/03-route-inventory.csv`
- `audit/04-production-url-inventory.csv`
- `lib/site.ts`
- `components/layout/SiteHeader.tsx`
- `components/layout/SiteFooter.tsx`

## 当前公开结构

1. 首页 `/`
2. 产品中心 `/products`
   - 分类 `/products/[categorySlug]`
   - 详情 `/products/[categorySlug]/[productSlug]`
3. 解决方案 `/solutions`
   - 详情 `/solutions/[slug]`
4. 知识中心 `/knowledge`
   - 分类 `/knowledge/[categorySlug]`
   - 文章 `/knowledge/[categorySlug]/[slug]`
5. 下载 `/downloads`
   - 详情 `/downloads/[slug]`
6. 视频 `/videos`
   - 详情 `/videos/[slug]`
7. FAQ `/faq`
8. 服务 `/service`
9. 案例 `/cases`
10. 新闻 `/news`
11. 关于 `/about`
12. 联系 `/contact`
13. 搜索 `/search`

## 当前导航特征

- 顶部主导航实际只有 5 项：解决方案、产品中心、知识、关于、联系。
- Footer 同时承担补充导航和产品分类入口，说明 IA 没有完整承载关键页面。
- 产品、下载、知识和部分行业/案例内容大量依赖站内链接与非主导航访问。
- 生产站存在 52 条非 Sitemap 公开 URL，说明当前 IA 与可抓取面并不一致。

## 当前 IA 问题

- 公开内容类型已经达到产品、方案、知识、下载、视频、FAQ、案例多个体系，但导航层级过浅，用户只能先进入少数总入口再二次发现内容。
- `/cases` 更像“行业/应用证明”，但当前归类为独立栏目，和解决方案、行业访问路径没有清晰衔接。
- `/service`、`/faq`、`/videos`、`/downloads` 都属于“知识与服务”体系，但现在分散为并列顶层。
- 6 条历史产品分类 URL 在生产站 404，但其子产品详情页仍然存活，说明内容树断裂而不是内容不存在。
- 当前 IA 没有为未来 `/en/` 结构预留稳定的页面配对规则。
