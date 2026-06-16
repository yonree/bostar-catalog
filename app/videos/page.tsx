import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getVideos } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '视频中心',
  description: '粉末静电喷枪操作、控制器参数设置和喷枪维护视频内容。',
};

export default async function VideosPage() {
  const videos = await getVideos();
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: '视频中心' }]} />
        <BreadcrumbJsonLd
          items={[
            { name: '首页', path: '/' },
            { name: '视频中心', path: '/videos' },
          ]}
        />
        <SectionHeader headingLevel="h1" title="视频中心" description="喷枪操作教程、控制器参数设置、维护保养与故障排查视频内容。" />
        <div className="grid gap-5 md:grid-cols-3">
          {videos.map((video) => (
            <Link
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
