export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">产品中心</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: '智能粉末静电喷枪', model: 'BOSTAR-PG100' },
          { name: '自动往复喷涂机', model: 'BOSTAR-AR200' },
          { name: '快速换色供粉中心', model: 'BOSTAR-QC300' },
          { name: '液体静电喷枪', model: 'BOSTAR-LG400' },
        ].map((p) => (
          <div key={p.model} className="border rounded-lg p-4">
            <div className="w-full h-40 mb-3 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-300 text-sm">
              产品图片
            </div>
            <h3 className="text-sm font-medium text-neutral-800">{p.name}</h3>
            <p className="text-xs text-neutral-400 mt-1">{p.model}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
