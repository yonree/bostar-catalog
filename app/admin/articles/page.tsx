import { AdminShell } from '@/components/admin/AdminShell';
import { CmsManager } from '@/components/admin/CmsManager';

export default function AdminArticlesPage() {
  return (
    <AdminShell title="文章管理">
      <CmsManager
        title="文章"
        endpoint="/api/admin/articles"
        columns={[
          { key: 'title', label: '标题' },
          { key: 'category', label: '分类' },
          { key: 'slug', label: 'Slug' },
          { key: 'isPublished', label: '发布' },
        ]}
        fields={[
          { name: 'categoryId', label: '文章分类', type: 'select', required: true },
          { name: 'title', label: '标题', required: true },
          { name: 'slug', label: 'URL Slug', required: true },
          { name: 'excerpt', label: '摘要', type: 'textarea' },
          { name: 'coverImage', label: '封面图路径', type: 'media' },
          { name: 'content', label: '正文内容', type: 'textarea', required: true },
          { name: 'conclusion', label: '结论', type: 'textarea' },
          { name: 'articleType', label: '文章类型' },
          { name: 'author', label: '作者' },
          { name: 'reviewer', label: '审核人' },
          { name: 'aiSummary', label: 'AI 摘要', type: 'textarea' },
          { name: 'seoTitle', label: 'SEO 标题' },
          { name: 'seoDesc', label: 'SEO 描述', type: 'textarea' },
          { name: 'seoKeywords', label: 'SEO 关键词' },
          { name: 'isPublished', label: '发布', type: 'checkbox' },
        ]}
      />
    </AdminShell>
  );
}
