import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}

export default async function EnProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = 1;
  const limit = 20;

  const where: Record<string, unknown> = { isPublished: true };
  if (params.category) {
    where.category = { slug: params.category };
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { nameEn: { contains: params.search, mode: 'insensitive' } },
      { model: { contains: params.search, mode: 'insensitive' } },
      { productCode: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      include: { category: { select: { id: true, name: true, nameEn: true, slug: true } } },
      orderBy: params.sort === 'name_asc' ? { name: 'asc' } : { sortOrder: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.category.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-neutral-800 mb-4">Products</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/en/products"
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${!params.category ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/en/products?category=${cat.slug}`}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${params.category === cat.slug ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
          >
            {cat.nameEn || cat.name}
          </Link>
        ))}
      </div>

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
