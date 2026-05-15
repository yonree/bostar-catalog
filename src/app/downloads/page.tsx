export default function DownloadsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">资料下载</h1>
      <div className="space-y-3">
        {[
          { title: 'BOSTAR-PG100 产品手册', type: 'PDF', size: '2.4 MB' },
          { title: 'AR200 技术参数表', type: 'PDF', size: '1.1 MB' },
          { title: '喷涂设备选型指南', type: 'PDF', size: '3.8 MB' },
        ].map((d) => (
          <div key={d.title} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-800">{d.title}</h3>
              <p className="text-xs text-neutral-400 mt-1">{d.type} &bull; {d.size}</p>
            </div>
            <button className="bg-brand-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-600">
              下载
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
