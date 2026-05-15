import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductParameters } from '@/components/product/ProductParameters';
import { ProductDetailClient } from './ProductDetailClient';

export const dynamic = 'force-dynamic';

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      parameters: { orderBy: { sortOrder: 'asc' } },
      images: { where: { isPublic: true }, orderBy: { sortOrder: 'asc' } },
      videos: { where: { isPublic: true }, orderBy: { sortOrder: 'asc' } },
      documents: { orderBy: { updatedAt: 'desc' } },
      faqs: { where: { isPublic: true }, orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!product) return null;

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isPublished: true,
    },
    take: 4,
    orderBy: { sortOrder: 'asc' },
  });

  return { product, relatedProducts };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data) notFound();

  const { product, relatedProducts } = data;

  // Get salesperson info from cookie (server-side, we check the header)
  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-neutral-500">
        <a href="/" className="hover:text-brand-600">首页</a>
        <span className="mx-2">/</span>
        <a href="/products" className="hover:text-brand-600">产品中心</a>
        <span className="mx-2">/</span>
        <a href={`/products?category=${product.category?.slug}`} className="hover:text-brand-600">
          {product.category?.name}
        </a>
        <span className="mx-2">/</span>
        <span className="text-neutral-800">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24">
        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ProductGallery images={product.images} mainImage={product.mainImage} productName={product.name} />

          <div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-2">{product.name}</h1>
            {product.model && (
              <p className="text-sm text-neutral-400 mb-1">型号: {product.model}</p>
            )}
            {product.tagline && (
              <p className="text-base text-brand-600 font-medium mb-4">{product.tagline}</p>
            )}
            {product.description && (
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">{product.description}</p>
            )}
          </div>
        </div>

        {/* Parameters */}
        {product.parameters.length > 0 && (
          <div className="mb-8">
            <ProductParameters parameters={product.parameters} />
          </div>
        )}

        {/* Selling Points */}
        {(product.sellingPoints as string[])?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">核心卖点</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(product.sellingPoints as string[]).map((point, i) => (
                <div key={i} className="flex items-start gap-2 bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                  <span className="text-blue-500 mt-0.5">{i + 1}.</span>
                  {point}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {product.videos.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">产品视频</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.videos.map((video) => (
                <div key={video.id} className="bg-neutral-100 rounded-xl overflow-hidden">
                  <div className="aspect-video bg-neutral-200 flex items-center justify-center">
                    {video.coverImage ? (
                      <img src={video.coverImage} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-neutral-800">{video.title}</p>
                    {video.duration && (
                      <p className="text-xs text-neutral-400 mt-1">
                        {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {product.documents.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">资料下载</h3>
            <div className="space-y-2">
              {product.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between bg-neutral-50 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{doc.title}</p>
                    <p className="text-xs text-neutral-400">
                      {doc.fileType?.toUpperCase()} {doc.fileSize && `(${(doc.fileSize / 1024).toFixed(1)} KB)`}
                    </p>
                  </div>
                  {doc.isDownloadable && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                    >
                      下载
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {product.faqs.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">常见问题</h3>
            <div className="space-y-2">
              {product.faqs.map((faq) => (
                <details key={faq.id} className="bg-neutral-50 rounded-lg group">
                  <summary className="px-4 py-3 text-sm font-medium text-neutral-800 cursor-pointer hover:text-brand-600">
                    {faq.question}
                  </summary>
                  <div className="px-4 pb-3 text-sm text-neutral-600 leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">相关产品</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.map((p) => (
                <a key={p.id} href={`/products/${p.slug}`} className="bg-white rounded-lg border border-neutral-100 p-3 hover:border-brand-200 transition-colors">
                  {p.mainImage && (
                    <img src={p.mainImage} alt={p.name} className="w-full aspect-square object-cover rounded-md mb-2" />
                  )}
                  <p className="text-sm font-medium text-neutral-800 line-clamp-2">{p.name}</p>
                  {p.model && <p className="text-xs text-neutral-400 mt-0.5">{p.model}</p>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Client-side CTA */}
      <ProductDetailClient productId={product.id} productName={product.name} />
    </div>
  );
}
