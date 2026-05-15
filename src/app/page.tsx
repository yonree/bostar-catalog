import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';

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

export default async function HomePage() {
  const { featuredProducts, categories } = await getHomeData();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              BOSTAR 博士达
            </h1>
            <p className="text-lg md:text-xl text-brand-100 mb-2">
              静电喷涂设备智能电子画册
            </p>
            <p className="text-sm md:text-base text-brand-200 mb-8 max-w-lg">
              专业粉末/液体静电喷涂设备制造商 — 产品资料库 + 电子画册 + AI产品顾问
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products">
                <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50">
                  浏览产品画册
                </Button>
              </Link>
              <Link href="/ai">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  AI产品顾问
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">产品分类</h2>
          <Link href="/products" className="text-sm text-brand-600 hover:text-brand-700">
            查看全部 &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-xl border border-neutral-100 p-4 text-center hover:border-brand-200 hover:shadow-sm transition-all"
            >
              {cat.coverImage ? (
                <img src={cat.coverImage} alt={cat.name} className="w-12 h-12 mx-auto mb-2 object-cover rounded-lg" />
              ) : (
                <div className="w-12 h-12 mx-auto mb-2 bg-brand-50 rounded-lg flex items-center justify-center text-brand-400 text-xl">
                  {cat.name.charAt(0)}
                </div>
              )}
              <h3 className="text-sm font-medium text-neutral-800 group-hover:text-brand-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">{cat._count.products} 个产品</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">重点推荐产品</h2>
            <Link href="/products?featured=true" className="text-sm text-brand-600 hover:text-brand-700">
              查看全部 &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/solutions" className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">系统方案</h3>
            <p className="text-sm text-blue-600">自动化喷涂系统解决方案</p>
          </Link>
          <Link href="/videos" className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-green-800 mb-2">视频中心</h3>
            <p className="text-sm text-green-600">原理动画、安装调试、喷涂效果</p>
          </Link>
          <Link href="/inquiry" className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">在线询盘</h3>
            <p className="text-sm text-orange-600">提交需求，快速获取报价方案</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
