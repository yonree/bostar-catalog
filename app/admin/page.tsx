import { AdminShell } from '@/components/admin/AdminShell';
import { prisma } from '@/lib/prisma';

export default async function AdminPage() {
  let products = 0,
    articles = 0,
    solutions = 0,
    faqs = 0,
    downloads = 0,
    cases = 0,
    videos = 0,
    leads = 0,
    media = 0;
  try {
    [products, articles, solutions, faqs, downloads, cases, videos, leads, media] =
      await Promise.all([
        prisma.product.count(),
        prisma.article.count(),
        prisma.solution.count(),
        prisma.fAQ.count(),
        prisma.download.count(),
        prisma.case.count(),
        prisma.video.count(),
        prisma.lead.count(),
        prisma.mediaAsset.count(),
      ]);
  } catch {
    // Dashboard shows zero counts when database is unavailable.
  }

  const stats = [
    ['产品', products],
    ['文章', articles],
    ['方案', solutions],
    ['FAQ', faqs],
    ['资料', downloads],
    ['案例', cases],
    ['视频', videos],
    ['线索', leads],
    ['媒体', media],
  ];

  return (
    <AdminShell title="管理概览">
      <div className="grid gap-4 md:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded border border-line bg-dark-soft p-5">
            <p className="text-sm text-white-soft/40">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
