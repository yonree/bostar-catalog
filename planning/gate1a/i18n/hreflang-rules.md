# Hreflang Rules

## 输出规则

- 每个已配对核心页面输出：
  - `hreflang="zh-CN"`
  - `hreflang="en"`
  - `hreflang="x-default"`
- `x-default` 初始指向中文首页或对应中文默认页。

## 适用条件

- 只有当 route pairing matrix 中存在合法的中英文配对时才输出双向 hreflang。
- `TRANSLATION_NOT_STARTED` 的页面先不输出英文目标，只记录缺口。

## 校验规则

- 双向存在
- URL 为 200 或待上线前已验证
- canonical 与 hreflang 目标一致
- 不允许全部英文缺失页都回英文首页
