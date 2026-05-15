export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold mb-4">BOSTAR 博士达</h1>
          <p className="text-lg mb-6">静电喷涂设备智能电子画册</p>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-white text-brand-600 rounded-lg">浏览产品画册</button>
            <button className="px-6 py-2 border border-white rounded-lg">AI产品顾问</button>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">产品分类</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 border rounded-lg text-center">粉末静电喷涂设备</div>
            <div className="p-4 border rounded-lg text-center">液体静电喷涂设备</div>
            <div className="p-4 border rounded-lg text-center">自动喷涂系统</div>
            <div className="p-4 border rounded-lg text-center">喷涂配件</div>
            <div className="p-4 border rounded-lg text-center">前处理设备</div>
          </div>
        </div>
      </section>
    </div>
  );
}
