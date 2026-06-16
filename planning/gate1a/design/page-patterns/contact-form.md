# 联系表单页样板

- 页面目标：承接询盘、选型、售后和资料需求。
- 目标用户：采购、工程师、维护人员。
- 信息优先级：联系信息 > 表单字段 > 提交预期 > 备用联系渠道。
- 区块顺序：联系摘要 -> 表单 -> 服务承诺/响应说明 -> 备用联系方式。
- 桌面布局：左联系信息，右表单。
- 移动布局：联系信息在上，表单单列。
- 数据字段：name、company、phone、email、region、demandType、interestedProduct、message、sourcePage。
- 组件清单：ContactInfoCard、LeadForm、FieldHelp、StatusAlert。
- CTA：`提交询盘`。
- SEO 要素：联系页 title/description/canonical。
- Schema：LocalBusiness、BreadcrumbList。
- 无障碍要求：label、错误信息、成功/失败状态全部可感知。
- 加载和错误状态：提交中按钮禁用并保留进度反馈。
- 空数据状态：无地图不阻断表单。
- 验收检查点：字段验证、成功态、失败态和 honeypot 策略都有明确定义。
