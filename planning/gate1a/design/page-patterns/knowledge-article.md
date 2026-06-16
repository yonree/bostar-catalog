# 知识文章页样板

- 页面目标：直接回答核心问题，并把知识内容与产品/服务连接。
- 目标用户：工程师、维护人员、采购前期研究者。
- 信息优先级：问题定义 > 结论摘要 > 正文步骤/说明 > FAQ/关联产品 > 联系。
- 区块顺序：标题区 -> 摘要 -> 正文 -> FAQ -> 关联产品 -> 联系 CTA。
- 桌面布局：正文单栏阅读，侧边可选目录或关联块。
- 移动布局：纯单列，目录变为页内锚点折叠。
- 数据字段：title、excerpt、content、author/reviewer role、publishedAt、updatedAt、source。
- 组件清单：ArticleHero、TOC、RichText、FaqSection、RelatedProducts、CTASection。
- CTA：`咨询技术问题`。
- SEO 要素：文章 title/description/H1/canonical。
- Schema：Article、BreadcrumbList、FAQPage。
- 无障碍要求：标题层级稳定、链接文本明确。
- 加载和错误状态：无来源字段时标记 `UNVERIFIED`，不输出高可信 schema 字段。
- 空数据状态：正文为空不发布。
- 验收检查点：文章首屏可直接看出“问题是什么、答案是什么、下一步做什么”。
