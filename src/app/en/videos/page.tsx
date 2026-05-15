export default function EnVideosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-neutral-800 mb-2">Video Library</h1>
      <p className="text-sm text-neutral-500 mb-8">Product demonstrations, installation guides, and customer case studies</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Spray Effect Demo', 'Installation Guide', 'Factory Tour', 'Maintenance Tips', 'Customer Case Study', 'Product Overview'].map((title) => (
          <div key={title} className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
            <div className="aspect-video bg-neutral-100 flex items-center justify-center">
              <span className="text-4xl">{'▶'}</span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-neutral-800">{title}</h3>
              <p className="text-xs text-neutral-400 mt-1">BOSTAR Official</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
