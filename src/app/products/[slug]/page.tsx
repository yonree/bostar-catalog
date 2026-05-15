export default function ProductDetailPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-sm text-neutral-500 mb-6">
        <a href="/" className="hover:text-brand-600">首页</a>
        <span className="mx-2">/</span>
        <a href="/products" className="hover:text-brand-600">产品中心</a>
        <span className="mx-2">/</span>
        <span className="text-neutral-800">产品详情</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-[4/3] bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-300 text-6xl">
          产品图片
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">BOSTAR-PG100 智能粉末静电喷枪</h1>
          <p className="text-sm text-neutral-400 mb-3">型号: BOSTAR-PG100</p>
          <p className="text-base text-brand-600 font-medium mb-4">高效粉末喷涂解决方案</p>
          <p className="text-sm text-neutral-600 leading-relaxed mb-6">
            适用于粉末静电喷涂工艺的智能喷枪，搭载数字化控制系统，实现精准粉末输出与均匀涂覆。
          </p>
        </div>
      </div>
    </div>
  );
}
