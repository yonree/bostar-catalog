import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getSolutions } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '解决方案',
  description: '博士达面向五金件、铝型材、机箱机柜、家具五金、汽车零部件和自动化喷涂线的解决方案。',
};

export default async function SolutionsPage() {
  const solutions = await getSolutions();
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: '解决方案' }]} />
        <BreadcrumbJsonLd
          items={[
            { name: '首页', path: '/' },
            { name: '解决方案', path: '/solutions' },
          ]}
        />
        <SectionHeader headingLevel="h1" title="解决方案" description="按行业与应用场景分类，提供从选型到量产的可复制喷涂解决方案。" />
        <div className="grid gap-5 md:grid-cols-3">
          {solutions.map((solution) => (
            <Link
              key={solution.id}
              href={`/solutions/${solution.slug}`}
              className="rounded border border-line bg-dark-soft p-6 shadow-card card-hover"
            >
              <p className="text-sm font-bold text-primary">{solution.industry}</p>
              <h2 className="mt-2 text-xl font-black">{solution.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white-soft/50">{solution.aiSummary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
