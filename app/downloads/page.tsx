import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getDownloads } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '资料下载',
  description: '下载粉末静电喷枪画册、控制器说明书、DISK 系统资料、故障排查清单和维护指南。',
};

export default async function DownloadsPage() {
  const downloads = await getDownloads();

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: '资料下载' }]} />
        <BreadcrumbJsonLd
          items={[
            { name: '首页', path: '/' },
            { name: '资料下载', path: '/downloads' },
          ]}
        />
        <SectionHeader headingLevel="h1" title="资料下载" description="提供产品画册、控制器说明书、系统安装手册、故障排查清单和维护指南下载。" />
        <div className="grid gap-5 md:grid-cols-3">
          {downloads.map((item) => (
            <Link
              key={item.id}
              href={`/downloads/${item.slug}`}
              className="rounded border border-line bg-dark-soft p-6 shadow-card card-hover"
            >
              <p className="text-sm font-bold text-primary">
                {item.fileType} · {item.version}
              </p>
              <h2 className="mt-2 text-xl font-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white-soft/50">{item.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
