import { AdminShell } from '@/components/admin/AdminShell';
import { CmsManager } from '@/components/admin/CmsManager';

export default function AdminSolutionsPage() {
  return (
    <AdminShell title="方案管理">
      <CmsManager
        title="方案"
        endpoint="/api/admin/solutions"
        columns={[
          { key: 'title', label: '方案标题' },
          { key: 'industry', label: '行业' },
          { key: 'scene', label: '场景' },
          { key: 'slug', label: 'Slug' },
          { key: 'isPublished', label: '发布' },
        ]}
        fields={[
          { name: 'title', label: '方案标题', required: true },
          { name: 'slug', label: 'URL Slug', required: true },
          { name: 'industry', label: '行业' },
          { name: 'scene', label: '应用场景' },
          { name: 'painPoints', label: '痛点 JSON', type: 'json' },
          { name: 'recommendedPlan', label: '推荐方案', type: 'textarea' },
          { name: 'processFlow', label: '流程 JSON', type: 'json' },
          { name: 'keyControls', label: '关键控制 JSON', type: 'json' },
          { name: 'equipmentList', label: '设备清单 JSON', type: 'json' },
          { name: 'advantages', label: '优势 JSON', type: 'json' },
          { name: 'content', label: '正文内容', type: 'textarea' },
          { name: 'coverImage', label: '封面图路径', type: 'media' },
          { name: 'aiSummary', label: 'AI 摘要', type: 'textarea' },
          { name: 'seoTitle', label: 'SEO 标题' },
          { name: 'seoDesc', label: 'SEO 描述', type: 'textarea' },
          { name: 'isPublished', label: '发布', type: 'checkbox' },
        ]}
      />
    </AdminShell>
  );
}
