import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
        include: { category: true },
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <a href="/products" className="text-sm text-brand-600 hover:text-brand-700">&larr; 返回产品中心</a>
        <h1 className="text-2xl font-bold text-neutral-800 mt-2">{category.name}</h1>
        {category.description && (
          <p className="text-sm text-neutral-500 mt-1">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {category.products.length === 0 && (
        <div className="text-center py-12 text-neutral-400">
          <p className="text-lg">该分类暂无产品</p>
          <p className="text-sm mt-1">产品正在上架中，请稍后再来</p>
        </div>
      )}
    </div>
  );
}
