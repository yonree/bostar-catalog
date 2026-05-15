import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function VideosPage() {
  const videos = await prisma.productVideo.findMany({
    where: { isPublic: true },
    include: { product: true },
    orderBy: { sortOrder: 'asc' },
  });

  const types = [...new Set(videos.map((v) => v.videoType))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-800 mb-2">视频中心</h1>
      <p className="text-sm text-neutral-500 mb-8">产品原理动画、安装调试、喷涂效果、故障排查视频</p>

      {videos.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1.5 text-sm rounded-full bg-brand-500 text-white">全部</span>
            {types.map((type) => (
              <span key={type} className="px-3 py-1.5 text-sm rounded-full bg-neutral-100 text-neutral-600">
                {type.replace(/_/g, ' ')}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-neutral-200 flex items-center justify-center relative">
                  {video.coverImage ? (
                    <img src={video.coverImage} alt={video.title} className="w-full h-full object-cover" />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-brand-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-neutral-800 line-clamp-2">{video.title}</h3>
                  {video.product && (
                    <p className="text-xs text-neutral-400 mt-1">{video.product.name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-neutral-400">
          <p className="text-lg">视频内容正在准备中</p>
          <p className="text-sm mt-1">敬请期待</p>
        </div>
      )}
    </div>
  );
}
