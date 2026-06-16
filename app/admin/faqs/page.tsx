import { AdminShell } from '@/components/admin/AdminShell';
import { CmsManager } from '@/components/admin/CmsManager';

export default function AdminFaqsPage() {
  return (
    <AdminShell title="FAQ 管理">
      <CmsManager
        title="FAQ"
        endpoint="/api/admin/faqs"
        columns={[
          { key: 'question', label: '问题' },
          { key: 'category', label: '分类' },
          { key: 'sortOrder', label: '排序' },
          { key: 'isPublished', label: '发布' },
        ]}
        fields={[
          { name: 'question', label: '问题', required: true },
          { name: 'answer', label: '答案', type: 'textarea', required: true },
          { name: 'category', label: '分类' },
          { name: 'sortOrder', label: '排序', type: 'number' },
          { name: 'isPublished', label: '发布', type: 'checkbox' },
        ]}
      />
    </AdminShell>
  );
}
