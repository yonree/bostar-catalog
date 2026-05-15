export default function EnDownloadsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-neutral-800 mb-2">Downloads</h1>
      <p className="text-sm text-neutral-500 mb-8">Product catalogs, datasheets, and technical documents</p>

      <div className="bg-white rounded-xl border border-neutral-100 divide-y divide-neutral-100">
        {['BOSTAR Product Catalog 2025 (PDF)', 'Powder Spray Gun Datasheet', 'DISK System Technical Specs', 'Installation & Service Manual'].map((title) => (
          <div key={title} className="px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-800">{title}</h3>
              <p className="text-xs text-neutral-400 mt-0.5">PDF Document</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors">
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
