import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EnCategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
        include: { category: { select: { name: true, nameEn: true, slug: true } } },
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Link href="/en" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-neutral-800">{category.nameEn || category.name}</span>
      </div>

      <h1 className="text-xl font-semibold text-neutral-800 mb-2">{category.nameEn || category.name}</h1>
      {category.descriptionEn && (
        <p className="text-sm text-neutral-500 mb-6">{category.descriptionEn}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {category.products.map((product) => (
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
