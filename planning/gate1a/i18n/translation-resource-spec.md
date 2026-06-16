# Translation Resource Spec

## 资源分层

1. UI 字典
2. 导航与通用 CTA
3. 页面模板固定文案
4. 内容实体字段翻译
5. 术语表

## 建议结构

- `messages/zh-CN/common.json`
- `messages/en/common.json`
- `messages/{locale}/{feature}.json`
- 内容实体翻译不写死在组件内部

## 原则

- 型号、品牌名、单位、数值参数不得自动改写
- 未核验字段保持 `TRANSLATION_NOT_STARTED` 或 `REQUIRES_BUSINESS_VERIFICATION`
- 组件层只消费 key，不硬编码跨语言文本
