import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
      take: 8,
    }),
    prisma.category.findMany({
      where: { parentId: null, isVisible: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    }),
  ]);
  return { featuredProducts, categories };
}

export default async function EnHomePage() {
  const { featuredProducts, categories } = await getHomeData();

  return (
    <div>
      {/* Hero */}
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

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">Product Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/en/categories/${cat.slug}`}
              className="flex items-center justify-center px-4 py-6 bg-white rounded-xl border border-neutral-100 hover:border-brand-200 hover:shadow-sm transition-all text-sm font-medium text-neutral-700"
            >
              {cat.nameEn || cat.name}
              {cat._count && (
                <span className="ml-1 text-xs text-neutral-400">({cat._count.products})</span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/en/products/${product.slug}`}
              className="bg-white rounded-xl border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
                {product.mainImage ? (
                  <img src={product.mainImage} alt={product.nameEn || product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300 text-4xl">B</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-neutral-400">{product.model || product.productCode}</p>
                <h3 className="text-sm font-medium text-neutral-800 mt-0.5">{product.nameEn || product.name}</h3>
                {product.taglineEn && (
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{product.taglineEn}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/en/solutions" className="bg-white rounded-xl border border-neutral-100 p-6 hover:shadow-md transition-shadow text-center">
            <span className="text-3xl block mb-2">{'\u{1F527}'}</span>
            <p className="text-sm font-medium text-neutral-700">Solutions</p>
          </Link>
          <Link href="/en/videos" className="bg-white rounded-xl border border-neutral-100 p-6 hover:shadow-md transition-shadow text-center">
            <span className="text-3xl block mb-2">{'\u{1F3AC}'}</span>
            <p className="text-sm font-medium text-neutral-700">Video Cases</p>
          </Link>
          <Link href="/en/ai" className="bg-white rounded-xl border border-neutral-100 p-6 hover:shadow-md transition-shadow text-center">
            <span className="text-3xl block mb-2">{'\u{1F916}'}</span>
            <p className="text-sm font-medium text-neutral-700">AI Advisor</p>
          </Link>
          <Link href="/en/inquiry" className="bg-white rounded-xl border border-neutral-100 p-6 hover:shadow-md transition-shadow text-center">
            <span className="text-3xl block mb-2">{'\u{1F4E9}'}</span>
            <p className="text-sm font-medium text-neutral-700">Request Quote</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
