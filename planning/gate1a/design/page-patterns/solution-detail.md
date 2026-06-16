# 解决方案详情页样板

- 页面目标：把痛点、推荐方案和设备组合讲清楚。
- 目标用户：项目负责人、工艺工程师、采购。
- 信息优先级：场景痛点 > 推荐方案 > 设备组合 > 工艺流程 > 联系 CTA。
- 区块顺序：Hero -> 痛点 -> 推荐方案 -> 设备清单 -> 流程/关键控制 -> 联系。
- 桌面布局：文本为主，设备清单与流程图分区展示。
- 移动布局：按痛点、方案、设备纵向展开。
- 数据字段：title、painPoints、recommendedPlan、equipmentList、processFlow、keyControls。
- 组件清单：SolutionHero、PainPointList、EquipmentMatrix、ProcessFlow, CTASection。
- CTA：`联系工程师`。
- SEO 要素：方案级 title/description/canonical。
- Schema：Article、BreadcrumbList。
- 无障碍要求：流程图须有文本等价描述。
- 加载和错误状态：设备清单为空时保留方案说明和询盘入口。
- 空数据状态：未核验性能指标不展示为结论。
- 验收检查点：用户能在 3 次主要交互内到关联设备或联系表单。
