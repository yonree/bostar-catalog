import Link from 'next/link';

export default function EnHomePage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-brand-600 to-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">BOSTAR</h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
            Intelligent Electrostatic Spraying Equipment Catalog — Product Selection, Technical Support, One-Stop Solution
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/en/products" className="inline-flex items-center px-6 py-3 bg-white text-brand-700 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
              Browse Products
            </Link>
            <Link href="/en/ai" className="inline-flex items-center px-6 py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
              AI Advisor
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">Product Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: 'Powder Coating Equipment', slug: 'powder-equipment' },
            { name: 'Liquid Coating Equipment', slug: 'liquid-equipment' },
            { name: 'Automatic Coating Systems', slug: 'automatic-system' },
            { name: 'Spray Accessories', slug: 'accessories' },
            { name: 'Pretreatment Equipment', slug: 'pretreatment' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/en/categories/${cat.slug}`}
              className="flex items-center justify-center px-4 py-6 bg-white rounded-xl border border-neutral-100 hover:border-brand-200 hover:shadow-sm transition-all text-sm font-medium text-neutral-700"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Smart Powder Electrostatic Gun', model: 'BOSTAR-PG100' },
            { name: 'Automatic Reciprocating Coater', model: 'BOSTAR-AR200' },
            { name: 'Quick Color Change Powder Center', model: 'BOSTAR-QC300' },
            { name: 'Liquid Electrostatic Spray Gun', model: 'BOSTAR-LG400' },
          ].map((p) => (
            <div key={p.model} className="bg-white rounded-xl border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center text-neutral-300 text-4xl">B</div>
              <div className="p-3">
                <p className="text-xs text-neutral-400">{p.model}</p>
                <h3 className="text-sm font-medium text-neutral-800 mt-0.5">{p.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
