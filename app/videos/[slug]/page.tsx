import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { VideoJsonLd } from '@/components/schema/VideoJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TranslationNotice } from '@/components/ui/TranslationNotice';
import { getVideo } from '@/lib/cms-data';
import { isEnglishLocale } from '@/lib/i18n';
import { createResolvedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const video = await getVideo(slug);
  const isEnglish = isEnglishLocale(locale);
  const videoLabel = video?.title || 'BOSTAR';

  return createResolvedPageMetadata({
    title:
      video?.title && isEnglish
        ? `${video.title} Video`
        : video?.title || (isEnglish ? 'Video Detail' : '视频详情'),
    description:
      (isEnglish
        ? `${videoLabel} video summary, source-language technical context, and related viewing reference.`
        : video?.summary) ||
      (isEnglish ? 'Video summary and related technical context.' : '视频摘要。'),
  });
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const video = await getVideo(slug);

  if (!video) notFound();

  const isEnglish = isEnglishLocale(locale);
  const videosLabel = isEnglish ? 'Video Center' : '视频中心';

  return (
    <>
      <VideoJsonLd video={video} />
      <BreadcrumbJsonLd
        items={[
          { name: isEnglish ? 'Home' : '首页', path: '/' },
          { name: videosLabel, path: '/videos' },
          { name: video.title, path: `/videos/${video.slug}` },
        ]}
      />
      <section className="section">
        <div className="container max-w-4xl">
          <Breadcrumb items={[{ label: videosLabel, href: '/videos' }, { label: video.title }]} />
          <h1 className="text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">{video.title}</h1>
          {isEnglish ? <TranslationNotice className="mt-6 max-w-3xl" /> : null}
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
              {isEnglish ? 'Video is not uploaded yet' : '视频暂未上传'}
            </div>
          )}
          <div className="mt-12 rounded-[24px] border border-line bg-white p-7 shadow-card md:p-8">
            <SectionHeader
              title={isEnglish ? 'Video Summary' : '视频摘要'}
              description={video.summary}
            />
          </div>
        </div>
      </section>
    </>
  );
}
