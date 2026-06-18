import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getDownloads } from '@/lib/cms-data';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '资料下载', en: 'Downloads' },
    description: {
      'zh-CN': '下载产品目录、控制器说明书、系统资料、故障排查清单和维护指南。',
      en: 'Download catalogs, controller manuals, system sheets, troubleshooting checklists, and maintenance guides.',
    },
  });
}

export default async function DownloadsPage() {
  const [downloads, { locale }] = await Promise.all([getDownloads(), getRequestContext()]);

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '资料下载', en: 'Downloads' }) }]} />
        <BreadcrumbJsonLd
          items={[
            { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
            { name: pickLocaleValue(locale, { 'zh-CN': '资料下载', en: 'Downloads' }), path: '/support/downloads' },
          ]}
        />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '资料下载', en: 'Downloads' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '统一提供产品目录、控制器说明书、安装手册、故障排查清单和维护指南。',
            en: 'A single entry point for catalogs, manuals, installation guides, troubleshooting checklists, and maintenance documents.',
          })}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {downloads.map((item) => (
            <LocalizedLink
              key={item.id}
              href={`/support/downloads/${item.slug}`}
              className="rounded border border-line bg-dark-soft p-6 shadow-card card-hover"
            >
              <p className="text-sm font-bold text-primary">
                {item.fileType}{item.version ? ` · ${item.version}` : ''}
              </p>
              <h2 className="mt-2 text-xl font-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white-soft/50">{item.summary}</p>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
