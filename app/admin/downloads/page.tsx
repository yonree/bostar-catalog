import { AdminShell } from '@/components/admin/AdminShell';
import { CmsManager } from '@/components/admin/CmsManager';

export default function AdminDownloadsPage() {
  return (
    <AdminShell title="资料下载管理">
      <CmsManager
        title="资料"
        endpoint="/api/admin/downloads"
        columns={[
          { key: 'title', label: '资料名称' },
          { key: 'fileType', label: '类型' },
          { key: 'version', label: '版本' },
          { key: 'requireLeadForm', label: '需表单' },
          { key: 'isPublished', label: '发布' },
        ]}
        fields={[
          { name: 'title', label: '资料名称', required: true },
          { name: 'slug', label: 'URL Slug', required: true },
          { name: 'fileUrl', label: '文件 URL', required: true },
          { name: 'fileType', label: '文件类型' },
          { name: 'fileSize', label: '文件大小' },
          { name: 'version', label: '版本号' },
          { name: 'summary', label: '摘要', type: 'textarea' },
          { name: 'catalogPreview', label: '目录预览', type: 'textarea' },
          { name: 'seoTitle', label: 'SEO 标题' },
          { name: 'seoDesc', label: 'SEO 描述', type: 'textarea' },
          { name: 'requireLeadForm', label: '下载前填写表单', type: 'checkbox' },
          { name: 'isPublished', label: '发布', type: 'checkbox' },
        ]}
      />
    </AdminShell>
  );
}
