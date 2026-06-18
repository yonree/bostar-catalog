import Image from 'next/image';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getVideos } from '@/lib/cms-data';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '视频中心', en: 'Video Center' },
    description: {
      'zh-CN': '喷枪操作、控制器参数设置、维护保养与故障排查的视频内容。',
      en: 'Video entries for spray-gun operation, controller setup, and maintenance topics.',
    },
  });
}

export default async function VideosPage() {
  const [videos, { locale }] = await Promise.all([getVideos(), getRequestContext()]);

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '视频中心', en: 'Video Center' }) }]} />
        <BreadcrumbJsonLd
          items={[
            { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
            { name: pickLocaleValue(locale, { 'zh-CN': '视频中心', en: 'Video Center' }), path: '/videos' },
          ]}
        />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '视频中心', en: 'Video Center' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '围绕喷枪操作、控制器参数设置、维护保养和故障排查整理视频内容。',
            en: 'Video guidance for spray-gun operation, controller parameters, maintenance, and troubleshooting.',
          })}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {videos.map((video) => (
            <LocalizedLink
              key={video.id}
              href={`/videos/${video.slug}`}
              className="overflow-hidden rounded border border-line bg-dark-soft shadow-panel card-hover"
            >
              {video.coverImage ? (
                <div className="relative aspect-video overflow-hidden bg-industrial">
                  <Image src={video.coverImage} alt={video.title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-dark/60 text-2xl text-white">&#9654;</span>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-dark text-sm text-white/70">
                  {video.duration}
                </div>
              )}
              <div className="p-5">
                <h2 className="text-lg font-black">{video.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white-soft/50">{video.summary}</p>
              </div>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
