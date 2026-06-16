import { AdminShell } from '@/components/admin/AdminShell';
import { MediaLibraryManager } from '@/components/admin/MediaLibraryManager';

export default function AdminMediaPage() {
  return (
    <AdminShell title="媒体库">
      <MediaLibraryManager />
    </AdminShell>
  );
}
