export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="h-4 w-64 bg-neutral-100 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="aspect-[4/3] bg-neutral-100 rounded-xl animate-pulse" />
        <div className="space-y-3">
          <div className="h-8 w-3/4 bg-neutral-100 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-neutral-100 rounded animate-pulse" />
          <div className="h-16 w-full bg-neutral-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
