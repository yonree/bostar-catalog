# 产品详情页样板

- 页面目标：承载产品定义、参数、应用、下载和询盘。
- 目标用户：采购、工程师、维护人员。
- 信息优先级：产品定义 > 型号/参数 > 应用场景 > 资料下载 > FAQ > 询盘。
- 区块顺序：Hero -> 参数表 -> 应用与优势 -> 工作原理/操作 -> 下载 -> FAQ -> Lead form。
- 桌面布局：首屏左右两栏，右侧固定产品图和 CTA，参数表全宽。
- 移动布局：首屏纵向，参数分组卡片化。
- 数据字段：name、model、summary、specs、functions、applications、downloads、faq。
- 组件清单：ProductHero、SpecTable、DefinitionList、DownloadList、FaqSection、LeadForm。
- CTA：`获取报价`、`下载资料`。
- SEO 要素：产品级 title/description/H1/canonical。
- Schema：Product、BreadcrumbList、FAQPage、HowTo。
- 无障碍要求：参数表可读，下载列表和表单标签完整。
- 加载和错误状态：无下载时不显示空列表；缺 FAQ 时不输出 FAQ schema。
- 空数据状态：参数未核验时显示 `REQUIRES_BUSINESS_VERIFICATION` 策略位，不伪造内容。
- 验收检查点：核心参数、下载和询盘入口在 1 屏内可见至少 2 项。
