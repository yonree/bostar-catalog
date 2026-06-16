import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { LeadForm } from '@/components/lead/LeadForm';
import { Markdown } from '@/components/ui/Markdown';
import { getCase } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getCase(slug);
  if (!item) notFound();

  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Breadcrumb items={[{ label: '案例中心', href: '/cases' }, { label: item.title }]} />
          <BreadcrumbJsonLd
            items={[
              { name: '首页', path: '/' },
              { name: '客户案例', path: '/cases' },
              { name: item.title, path: `/cases/${item.slug}` },
            ]}
          />
          {item.industry ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {item.industry}
            </p>
          ) : null}
          <h1 className="max-w-3xl text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">
            {item.title}
          </h1>
          <div className="mt-6 rounded-[22px] border border-primary/20 bg-primary-light/35 p-6">
            <Markdown className="text-lg leading-8 text-ink">{item.summary}</Markdown>
          </div>
          {item.coverImage ? (
            <div className="relative mt-8 aspect-video overflow-hidden rounded-[24px] border border-line bg-bg-soft shadow-card">
              <Image src={item.coverImage} alt={item.title} fill className="object-cover" unoptimized />
            </div>
          ) : null}
        </div>
        <div>
          <div className="rounded-[24px] border border-line bg-white p-6 shadow-card">
            <LeadForm sourcePage={`/cases/${item.slug}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
