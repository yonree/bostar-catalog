import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function EnSearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const products = q ? await prisma.product.findMany({
    where: {
      isPublished: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { nameEn: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
        { productCode: { contains: q, mode: 'insensitive' } },
      ],
    },
    include: { category: { select: { name: true, nameEn: true, slug: true } } },
    orderBy: { sortOrder: 'asc' },
    take: 20,
  }) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-neutral-800 mb-2">Search</h1>

      <form className="mb-8">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q || ''}
            placeholder="Search products..."
            className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button type="submit" className="px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
            Search
          </button>
        </div>
      </form>

      {q && (
        <p className="text-sm text-neutral-500 mb-4">{products.length} results for &quot;{q}&quot;</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
