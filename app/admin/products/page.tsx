import { AdminShell } from '@/components/admin/AdminShell';
import { CmsManager } from '@/components/admin/CmsManager';

export default function AdminProductsPage() {
  return (
    <AdminShell title="产品管理">
      <CmsManager
        title="产品"
        endpoint="/api/admin/products"
        columns={[
          { key: 'name', label: '产品名称' },
          { key: 'model', label: '型号' },
          { key: 'category', label: '分类' },
          { key: 'slug', label: 'Slug' },
          { key: 'isPublished', label: '发布' },
        ]}
        fields={[
          { name: 'categoryId', label: '产品分类', type: 'select', required: true },
          { name: 'name', label: '产品名称', required: true },
          { name: 'slug', label: 'URL Slug', required: true },
          { name: 'model', label: '型号' },
          { name: 'shortDefinition', label: '一句话定义' },
          { name: 'summary', label: '摘要', type: 'textarea' },
          { name: 'description', label: '详细描述', type: 'textarea' },
          { name: 'mainImage', label: '主图路径', type: 'media' },
          { name: 'gallery', label: '图集 JSON', type: 'json' },
          { name: 'applicableCraft', label: '适用工艺' },
          { name: 'application', label: '应用场景', type: 'textarea' },
          { name: 'functions', label: '功能 JSON', type: 'json' },
          { name: 'sellingPoints', label: '卖点 JSON', type: 'json' },
          { name: 'specs', label: '参数 JSON', type: 'json' },
          { name: 'structure', label: '结构说明', type: 'textarea' },
          { name: 'workingPrinciple', label: '工作原理', type: 'textarea' },
          { name: 'operationSteps', label: '操作步骤 JSON', type: 'json' },
          { name: 'suitableIndustries', label: '适用行业 JSON', type: 'json' },
          { name: 'unsuitableScenes', label: '不适用场景', type: 'textarea' },
          { name: 'standardConfig', label: '标准配置 JSON', type: 'json' },
          { name: 'optionalParts', label: '选配件 JSON', type: 'json' },
          { name: 'maintenance', label: '维护保养', type: 'textarea' },
          { name: 'troubleshooting', label: '故障处理', type: 'textarea' },
          { name: 'aiSummary', label: 'AI 摘要', type: 'textarea' },
          { name: 'sortOrder', label: '排序', type: 'number' },
          { name: 'seoTitle', label: 'SEO 标题' },
          { name: 'seoDesc', label: 'SEO 描述', type: 'textarea' },
          { name: 'seoKeywords', label: 'SEO 关键词' },
          { name: 'canonicalUrl', label: 'Canonical URL' },
          { name: 'isFeatured', label: '首页推荐', type: 'checkbox' },
          { name: 'isPublished', label: '发布', type: 'checkbox' },
        ]}
      />
    </AdminShell>
  );
}
