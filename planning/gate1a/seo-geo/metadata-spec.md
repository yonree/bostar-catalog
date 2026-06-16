# Metadata Spec

## Factory 输入

- page type
- locale
- entity id / slug
- title source
- description source
- canonical target
- indexability
- alternates

## Factory 输出

- `title`
- `description`
- `alternates.canonical`
- `alternates.languages`
- `robots`
- `openGraph`
- `twitter` if later required

## 页面级规则

- 首页：品牌名 + 核心业务
- 分类页：分类名 + 品牌
- 详情页：实体名 + 品牌
- 文章页：问题/主题 + 品牌
- 搜索结果页：默认 noindex
- 后台页：noindex

## 兜底规则

- 不允许回退到首页 canonical
- 不允许 description 为空字符串
- 不允许直接用 slug 充当最终 Title/H1
