import { AdminShell } from '@/components/admin/AdminShell';
import { LeadManager } from '@/components/admin/LeadManager';

export default function AdminLeadsPage() {
  return (
    <AdminShell title="线索查看">
      <LeadManager />
    </AdminShell>
  );
}
