# Accessibility Spec

## 最低要求

- 正文和关键控件满足 WCAG AA 对比度
- 焦点态必须可见
- 表单字段必须有 label 和错误提示关联
- 图片区分装饰图与信息图，分别使用空 alt 或准确 alt
- 动效遵守 `prefers-reduced-motion`

## 重点页面

- 产品详情：参数表和下载区块可键盘访问
- 联系表单：错误提示可被辅助技术识别
- 移动导航：展开/收起状态可通过 aria 表达
