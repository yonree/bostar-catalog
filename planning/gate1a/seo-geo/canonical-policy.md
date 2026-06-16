# Canonical Policy

## 主域策略

- 主域：`https://www.bostarcoating.com`
- 裸域 `https://bostarcoating.com` 统一 301 到主域同路径

## 页面级规则

- 每个可索引公开页使用自引用 canonical
- 语言版本各自 self-canonical
- 搜索、后台、非规范测试页不参与索引 canonical

## 现有异常整改

- 124 条 `HOMEPAGE_CANONICAL`：改为逐页 self-canonical
- 首页裸域 `CROSS_HOST_SAME_PATH`：保留到主域主页 canonical，不把其他页都指到首页

## 禁止项

- 产品分类或详情统一 canonical 到首页
- 英文缺失页面 canonical 回中文首页
