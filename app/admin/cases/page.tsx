import { AdminShell } from '@/components/admin/AdminShell';
import { CmsManager } from '@/components/admin/CmsManager';

export default function AdminCasesPage() {
  return (
    <AdminShell title="案例管理">
      <CmsManager
        title="案例"
        endpoint="/api/admin/cases"
        columns={[
          { key: 'title', label: '案例标题' },
          { key: 'industry', label: '行业' },
          { key: 'region', label: '地区' },
          { key: 'slug', label: 'Slug' },
          { key: 'isPublished', label: '发布' },
        ]}
        fields={[
          { name: 'title', label: '案例标题', required: true },
          { name: 'slug', label: 'URL Slug', required: true },
          { name: 'industry', label: '行业' },
          { name: 'region', label: '地区' },
          { name: 'customerName', label: '客户名称' },
          { name: 'isAnonymous', label: '匿名展示', type: 'checkbox' },
          { name: 'background', label: '项目背景', type: 'textarea' },
          { name: 'problems', label: '问题痛点', type: 'textarea' },
          { name: 'workpiece', label: '工件' },
          { name: 'craft', label: '工艺' },
          { name: 'equipmentConfig', label: '设备配置', type: 'textarea' },
          { name: 'process', label: '实施过程', type: 'textarea' },
          { name: 'result', label: '结果', type: 'textarea' },
          { name: 'images', label: '图片 JSON', type: 'json' },
          { name: 'videoUrl', label: '视频 URL' },
          { name: 'content', label: '正文内容', type: 'textarea' },
          { name: 'seoTitle', label: 'SEO 标题' },
          { name: 'seoDesc', label: 'SEO 描述', type: 'textarea' },
          { name: 'isPublished', label: '发布', type: 'checkbox' },
        ]}
      />
    </AdminShell>
  );
}
