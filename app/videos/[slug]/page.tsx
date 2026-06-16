import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { VideoJsonLd } from '@/components/schema/VideoJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getVideo } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);
  return {
    title: video?.title || '视频详情',
    description: video?.summary || '',
  };
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = await getVideo(slug);

  if (!video) notFound();

  return (
    <>
      <VideoJsonLd video={video} />
      <BreadcrumbJsonLd
        items={[
          { name: '首页', path: '/' },
          { name: '视频中心', path: '/videos' },
          { name: video.title, path: `/videos/${video.slug}` },
        ]}
      />
      <section className="section">
        <div className="container max-w-4xl">
          <Breadcrumb items={[{ label: '视频中心', href: '/videos' }, { label: video.title }]} />
          <h1 className="text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">{video.title}</h1>
          {video.coverImage ? (
            <div className="relative mt-8 aspect-video overflow-hidden rounded-[24px] border border-line bg-bg-soft shadow-card">
              <Image
                src={video.coverImage}
                alt={video.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/70 text-3xl text-white">
                  &#9654;
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex aspect-video items-center justify-center rounded-[24px] border border-line bg-bg-soft text-steel shadow-card">
              视频暂未上传
            </div>
          )}
          <div className="mt-12 rounded-[24px] border border-line bg-white p-7 shadow-card md:p-8">
            <SectionHeader title="视频摘要" description={video.summary} />
          </div>
        </div>
      </section>
    </>
  );
}
