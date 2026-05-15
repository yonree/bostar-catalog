import { prisma } from '@/lib/prisma';
import { ProductGrid } from '@/components/product/ProductGrid';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const category = sp.category as string | undefined;
  const search = sp.search as string | undefined;
  const sort = sp.sort as string | undefined;

  const where: Prisma.ProductWhereInput = { isPublished: true };

  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } },
      { productCode: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = {};
  switch (sort) {
    case 'latest': orderBy.createdAt = 'desc'; break;
    case 'name_asc': orderBy.name = 'asc'; break;
    case 'name_desc': orderBy.name = 'desc'; break;
    default: orderBy.sortOrder = 'asc';
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: { category: true, _count: { select: { images: true } } },
    }),
    prisma.category.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">产品中心</h1>
        {search && (
          <p className="text-sm text-neutral-500 mt-1">
            搜索 &ldquo;{search}&rdquo; 的结果，共 {products.length} 个产品
          </p>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/products"
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            !category ? 'bg-brand-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          全部
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              category === cat.slug ? 'bg-brand-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Search Bar */}
      <form action="/products" method="get" className="mb-6 max-w-md">
        <div className="relative">
          <input
            type="text"
            name="search"
            defaultValue={search || ''}
            placeholder="搜索产品名称、型号..."
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </form>

      <ProductGrid products={products} />
    </div>
  );
}
