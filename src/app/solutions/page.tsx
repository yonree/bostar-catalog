export default function SolutionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">系统方案</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">自动化喷涂系统</h3>
          <p className="text-sm text-neutral-600">适用于大规模生产线的全自动喷涂方案</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">定制化喷涂方案</h3>
          <p className="text-sm text-neutral-600">根据您的产品和生产需求定制专属喷涂系统</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">生产线改造方案</h3>
          <p className="text-sm text-neutral-600">为现有生产线提供喷涂环节升级改造服务</p>
        </div>
      </div>
    </div>
  );
}
