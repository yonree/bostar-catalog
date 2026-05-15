export default function EnSearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-neutral-800 mb-2">Search</h1>
      <form className="mb-8">
        <div className="flex gap-2">
          <input
            name="q"
            placeholder="Search products..."
            className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button type="submit" className="px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
            Search
          </button>
        </div>
      </form>
      <p className="text-sm text-neutral-500">Enter a keyword to search for products.</p>
    </div>
  );
}
