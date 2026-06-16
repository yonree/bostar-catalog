import { AdminShell } from '@/components/admin/AdminShell';
import { CmsManager } from '@/components/admin/CmsManager';

export default function AdminProductCategoriesPage() {
  return (
    <AdminShell title="产品分类管理">
      <CmsManager
        title="产品分类"
        endpoint="/api/admin/product-categories"
        columns={[
          { key: 'name', label: '分类名称' },
          { key: 'slug', label: 'Slug' },
          { key: 'sortOrder', label: '排序' },
          { key: 'isPublished', label: '发布' },
        ]}
        fields={[
          { name: 'name', label: '分类名称', required: true },
          { name: 'slug', label: 'URL Slug', required: true },
          { name: 'title', label: '页面标题' },
          { name: 'summary', label: '摘要', type: 'textarea' },
          { name: 'description', label: '详细描述', type: 'textarea' },
          { name: 'coverImage', label: '封面图路径', type: 'media' },
          { name: 'sortOrder', label: '排序', type: 'number' },
          { name: 'seoTitle', label: 'SEO 标题' },
          { name: 'seoDesc', label: 'SEO 描述', type: 'textarea' },
          { name: 'isPublished', label: '发布', type: 'checkbox' },
        ]}
      />
    </AdminShell>
  );
}
