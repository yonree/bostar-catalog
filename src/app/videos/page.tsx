export default function VideosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">视频中心</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: '粉末静电喷涂原理动画', duration: '3:42' },
          { title: '自动往复喷涂机安装调试', duration: '5:18' },
          { title: '快速换色供粉中心操作演示', duration: '4:05' },
        ].map((v) => (
          <div key={v.title} className="border rounded-lg overflow-hidden">
            <div className="aspect-video bg-neutral-100 flex items-center justify-center text-neutral-300 text-sm">
              视频封面
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-neutral-800">{v.title}</h3>
              <p className="text-xs text-neutral-400 mt-1">{v.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
