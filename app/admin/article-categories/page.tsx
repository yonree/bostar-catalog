import { AdminShell } from '@/components/admin/AdminShell';
import { CmsManager } from '@/components/admin/CmsManager';

export default function AdminArticleCategoriesPage() {
  return (
    <AdminShell title="文章分类管理">
      <CmsManager
        title="文章分类"
        endpoint="/api/admin/article-categories"
        columns={[
          { key: 'name', label: '分类名称' },
          { key: 'slug', label: 'Slug' },
          { key: 'sortOrder', label: '排序' },
          { key: 'isPublished', label: '发布' },
        ]}
        fields={[
          { name: 'name', label: '分类名称', required: true },
          { name: 'slug', label: 'URL Slug', required: true },
          { name: 'description', label: '描述', type: 'textarea' },
          { name: 'sortOrder', label: '排序', type: 'number' },
          { name: 'isPublished', label: '发布', type: 'checkbox' },
        ]}
      />
    </AdminShell>
  );
}
