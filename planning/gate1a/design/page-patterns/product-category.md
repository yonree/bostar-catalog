# 产品分类页样板

- 页面目标：帮助用户在同一产品家族内比较型号并进入详情。
- 目标用户：采购、工艺工程师。
- 信息优先级：分类定义 > 产品卡片 > 应用场景 > 下载/询盘。
- 区块顺序：分类摘要 -> 产品列表 -> 适用场景 -> 资料下载 -> 联系 CTA。
- 桌面布局：左筛选/说明，右产品卡列表或双列表格。
- 移动布局：摘要在上，产品卡单列，参数摘要折叠。
- 数据字段：分类名、summary、description、product cards、downloads。
- 组件清单：Breadcrumb、CategoryIntro、ProductCardGrid、DownloadBlock、CTABar。
- CTA：`查看产品详情`、`提交询盘`。
- SEO 要素：分类 title/H1/description、自引用 canonical。
- Schema：BreadcrumbList、CollectionPage。
- 无障碍要求：卡片标题和 CTA 顺序稳定，筛选可键盘操作。
- 加载和错误状态：产品为空时保留分类说明和联系入口。
- 空数据状态：显示“该分类内容待补充，请联系工程师”。
- 验收检查点：不依赖主导航也能到达任一型号详情。
