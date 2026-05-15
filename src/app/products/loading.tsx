export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="h-8 w-48 bg-neutral-100 rounded-lg animate-pulse mb-6" />
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-20 bg-neutral-100 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
            <div className="aspect-[4/3] bg-neutral-100 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-neutral-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
