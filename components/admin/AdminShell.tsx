import Link from 'next/link';
import { LogoutButton } from '@/components/admin/LogoutButton';

const adminNav = [
  ['/admin', '概览'],
  ['/admin/products', '产品'],
  ['/admin/product-categories', '产品分类'],
  ['/admin/articles', '文章'],
  ['/admin/article-categories', '文章分类'],
  ['/admin/solutions', '方案'],
  ['/admin/cases', '案例'],
  ['/admin/downloads', '资料'],
  ['/admin/videos', '视频'],
  ['/admin/faqs', 'FAQ'],
  ['/admin/leads', '线索'],
  ['/admin/media', '媒体'],
  ['/admin/settings', '设置'],
] as const;

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section admin-surface">
      <div className="container grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="rounded border border-line bg-dark-soft p-4">
          <p className="mb-4 font-black">CMS 管理</p>
          <nav className="grid gap-2 text-sm">
            {adminNav.map(([href, label]) => (
              <Link key={href} href={href} className="rounded px-3 py-2 text-white-soft hover:bg-white/5">
                {label}
              </Link>
            ))}
          </nav>
          <LogoutButton />
        </aside>
        <div>
          <h1 className="mb-6 text-3xl font-black">{title}</h1>
          {children}
        </div>
      </div>
    </section>
  );
}
