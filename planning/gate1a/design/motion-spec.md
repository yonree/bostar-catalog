# Motion Spec

## 原则

- 动效服务于层级和状态，不服务于装饰
- 过渡时间以 `120ms / 180ms / 260ms` 为主
- 不使用持续闪烁、强缩放和长距离视差

## 允许的动效

- Header sticky 阴影变化
- Mobile nav 展开/收起
- Button hover/focus
- Accordion 展开

## 禁止

- 首页大面积无意义浮动
- 参数表加载时的复杂位移动画
- 影响阅读的连续动效
