import Link from 'next/link';

export default function Home() {
  return (
    <div>
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
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-white text-brand-700 hover:bg-brand-50 font-medium px-6 py-3 text-sm transition-colors"
              >
                浏览产品画册
              </Link>
              <Link
                href="/ai"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 text-white hover:bg-white/10 font-medium px-6 py-3 text-sm transition-colors"
              >
                AI产品顾问
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">产品分类</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: '粉末静电喷涂设备', slug: 'powder-equipment' },
            { name: '液体静电喷涂设备', slug: 'liquid-equipment' },
            { name: '自动喷涂系统', slug: 'automatic-system' },
            { name: '喷涂配件', slug: 'accessories' },
            { name: '前处理设备', slug: 'pretreatment' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-xl border border-neutral-100 p-4 text-center hover:border-brand-200 hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-brand-50 rounded-lg flex items-center justify-center text-brand-400 text-xl">
                {cat.name.charAt(0)}
              </div>
              <h3 className="text-sm font-medium text-neutral-800 group-hover:text-brand-600 transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">重点推荐产品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: '智能粉末静电喷枪', model: 'BOSTAR-PG100' },
              { name: '自动往复喷涂机', model: 'BOSTAR-AR200' },
              { name: '快速换色供粉中心', model: 'BOSTAR-QC300' },
              { name: '液体静电喷枪', model: 'BOSTAR-LG400' },
            ].map((p) => (
              <Link
                key={p.model}
                href="/products"
                className="group bg-white rounded-xl border border-neutral-100 p-4 hover:border-brand-200 hover:shadow-md transition-all"
              >
                <div className="w-full h-40 mb-3 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-300 text-sm">
                  产品图片
                </div>
                <h3 className="text-sm font-medium text-neutral-800 group-hover:text-brand-600 transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">{p.model}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      <footer className="bg-neutral-50 border-t border-neutral-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-neutral-400">
          <p>BOSTAR 博士达 — 静电喷涂设备智能电子画册</p>
        </div>
      </footer>
    </div>
  );
}
