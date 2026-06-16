import { AdminShell } from '@/components/admin/AdminShell';
import { CmsManager } from '@/components/admin/CmsManager';

export default function AdminVideosPage() {
  return (
    <AdminShell title="视频管理">
      <CmsManager
        title="视频"
        endpoint="/api/admin/videos"
        columns={[
          { key: 'title', label: '视频标题' },
          { key: 'scene', label: '场景' },
          { key: 'slug', label: 'Slug' },
          { key: 'isPublished', label: '发布' },
        ]}
        fields={[
          { name: 'title', label: '视频标题', required: true },
          { name: 'slug', label: 'URL Slug', required: true },
          { name: 'videoUrl', label: '视频 URL', required: true },
          { name: 'coverImage', label: '封面图路径', type: 'media' },
          { name: 'summary', label: '摘要', type: 'textarea' },
          { name: 'transcript', label: '字幕/文稿', type: 'textarea' },
          { name: 'steps', label: '步骤 JSON', type: 'json' },
          { name: 'keyPoints', label: '要点 JSON', type: 'json' },
          { name: 'scene', label: '场景' },
          { name: 'seoTitle', label: 'SEO 标题' },
          { name: 'seoDesc', label: 'SEO 描述', type: 'textarea' },
          { name: 'isPublished', label: '发布', type: 'checkbox' },
        ]}
      />
    </AdminShell>
  );
}
