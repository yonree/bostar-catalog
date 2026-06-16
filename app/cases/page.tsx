import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getCases } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '案例中心',
  description: '博士达粉末静电喷涂设备行业应用案例。',
};

export default async function CasesPage() {
  const cases = await getCases();
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: '案例中心' }]} />
        <BreadcrumbJsonLd
          items={[
            { name: '首页', path: '/' },
            { name: '客户案例', path: '/cases' },
          ]}
        />
        <SectionHeader headingLevel="h1" title="案例中心" description="真实工厂现场应用案例，覆盖粉末喷涂、DISK旋碟和自动化涂装产线。" />
        <div className="grid gap-5 md:grid-cols-3">
          {cases.map((item) => (
            <Link
              href={`/cases/${item.slug}`}
              key={item.id}
              className="rounded border border-line bg-dark-soft p-6 shadow-card card-hover"
            >
              {item.industry && <p className="text-sm font-bold text-primary">{item.industry}</p>}
              <h2 className="text-xl font-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white-soft/50">{item.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
