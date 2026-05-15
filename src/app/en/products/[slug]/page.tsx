import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EnProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      parameters: { orderBy: { sortOrder: 'asc' } },
      images: { orderBy: { sortOrder: 'asc' } },
      videos: { orderBy: { sortOrder: 'asc' } },
      documents: true,
      faqs: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Link href="/en" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/en/products" className="hover:text-brand-600">Products</Link>
        <span>/</span>
        <Link href={`/en/categories/${product.category.slug}`} className="hover:text-brand-600">{product.category.nameEn || product.category.name}</Link>
        <span>/</span>
        <span className="text-neutral-800">{product.nameEn || product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gallery */}
        <div>
          {product.mainImage ? (
            <img src={product.mainImage} alt={product.nameEn || product.name} className="w-full rounded-xl" />
          ) : (
            <div className="aspect-[4/3] bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-300 text-6xl">B</div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">{product.nameEn || product.name}</h1>
          <p className="text-sm text-neutral-400 mb-3">Model: {product.model || product.productCode}</p>
          {product.taglineEn && (
            <p className="text-neutral-600 mb-4">{product.taglineEn}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            <Link href={`/en/inquiry?product=${product.slug}`} className="inline-flex items-center px-5 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">
              Request Quote
            </Link>
            <Link href="/en/contact" className="inline-flex items-center px-5 py-2.5 border border-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Parameters */}
      {product.parameters.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Technical Parameters</h2>
          <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
            <table className="w-full">
              <tbody>
                {product.parameters.map((p) => (
                  <tr key={p.id} className="border-b border-neutral-50 last:border-0">
                    <td className="px-4 py-3 text-sm text-neutral-500 w-1/3">{p.paramNameEn || p.paramName}</td>
                    <td className="px-4 py-3 text-sm text-neutral-800">{p.paramValue} {p.unit || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Description */}
      {product.descriptionEn && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Description</h2>
          <div className="prose prose-sm max-w-none text-neutral-600" dangerouslySetInnerHTML={{ __html: product.descriptionEn }} />
        </section>
      )}
    </div>
  );
}
