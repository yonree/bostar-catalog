export default function EnProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-neutral-800 mb-4">Products</h1>
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
    </div>
  );
}
