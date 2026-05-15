import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SolutionsPage() {
  const solutions = await prisma.product.findMany({
    where: { productType: 'system', isPublished: true },
    include: { category: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-800 mb-2">系统方案</h1>
      <p className="text-sm text-neutral-500 mb-8">自动化喷涂系统解决方案</p>

      {solutions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((sol) => (
            <Link
              key={sol.id}
              href={`/products/${sol.slug}`}
              className="bg-white rounded-xl border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {sol.mainImage && (
                <div className="aspect-[16/9] bg-neutral-100 overflow-hidden">
                  <img src={sol.mainImage} alt={sol.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">{sol.name}</h3>
                {sol.tagline && <p className="text-sm text-brand-600 mb-3">{sol.tagline}</p>}
                {sol.description && <p className="text-sm text-neutral-500 line-clamp-3">{sol.description}</p>}
                {(sol.sellingPoints as string[])?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(sol.sellingPoints as string[]).slice(0, 4).map((point, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {point}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 text-sm text-brand-600 font-medium">查看详情 &rarr;</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-neutral-400">
          <p className="text-lg">系统方案正在建设中</p>
          <p className="text-sm mt-1">请通过其他方式联系咨询</p>
        </div>
      )}
    </div>
  );
}
