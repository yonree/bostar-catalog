# Locale Registry Spec

## 目标

- 中文保持根路径
- 英文统一使用 `/en/`
- 未来语言通过 registry 扩展，不要求改核心组件代码

## Registry 字段

- `locale_code`
- `html_lang`
- `label`
- `path_prefix`
- `is_default`
- `is_indexable`
- `fallback_locale`
- `x_default_candidate`

## 初始配置

| locale | html lang | prefix | default | indexable |
|---|---|---|---|---|
| `zh-CN` | `zh-CN` | `/` | yes | yes |
| `en` | `en` | `/en` | no | yes |

## 规则

- `zh-CN` 使用根路径，不附加 `/zh-CN`。
- `en` 所有核心可索引页都使用同构路径，例如 `/products/foo` -> `/en/products/foo`。
- `x-default` 初始指向中文首页，后续如英文成为全球默认再调整。
- 语言切换必须根据 route pairing matrix 做同页切换。
