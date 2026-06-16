import { JsonLd } from '@/components/schema/JsonLd';
import type { VideoView } from '@/lib/cms-data';
import { localizeHref } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';

export async function VideoJsonLd({ video }: { video: VideoView }) {
  const [site, { locale }] = await Promise.all([getSiteSettings(), getRequestContext()]);
  const videoPath = localizeHref(`/videos/${video.slug}`, locale);
  const thumbnailUrl =
    video.coverImage && /^https?:\/\//i.test(video.coverImage)
      ? video.coverImage
      : video.coverImage
        ? `${site.url}${video.coverImage.startsWith('/') ? video.coverImage : `/${video.coverImage}`}`
        : null;

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: video.summary,
        inLanguage: locale,
        contentUrl: `${site.url}${videoPath}`,
        ...(thumbnailUrl ? { thumbnailUrl: [thumbnailUrl] } : {}),
      }}
    />
  );
}
