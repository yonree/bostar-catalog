import Link from 'next/link';

export default function EnProductDetailPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Link href="/en" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/en/products" className="hover:text-brand-600">Products</Link>
        <span>/</span>
        <span className="text-neutral-800">Product Details</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="aspect-[4/3] bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-300 text-6xl">B</div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">Smart Powder Electrostatic Gun</h1>
          <p className="text-sm text-neutral-400 mb-3">Model: BOSTAR-PG100</p>
          <p className="text-neutral-600 mb-4">High-efficiency powder coating solution</p>
          <div className="flex gap-2 flex-wrap">
            <Link href="/en/inquiry" className="inline-flex items-center px-5 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">
              Request Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
