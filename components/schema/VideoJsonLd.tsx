import { JsonLd } from '@/components/schema/JsonLd';
import type { VideoView } from '@/lib/cms-data';
import { siteConfig } from '@/lib/site';

export function VideoJsonLd({ video }: { video: VideoView }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: video.summary,
        uploadDate: '2026-01-01',
        thumbnailUrl: [`${siteConfig.url}/images/product-gun-render.png`],
        contentUrl: `${siteConfig.url}/videos/${video.slug}`,
      }}
    />
  );
}
