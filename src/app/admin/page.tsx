import { Card, CardContent } from '@/components/ui/Card';

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">仪表盘</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent>
            <p className="text-sm text-neutral-500">今日访问量</p>
            <p className="text-2xl font-bold text-neutral-800 mt-1">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-neutral-500">本周访问量</p>
            <p className="text-2xl font-bold text-neutral-800 mt-1">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-neutral-500">本月访问量</p>
            <p className="text-2xl font-bold text-neutral-800 mt-1">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-neutral-500">总询盘数</p>
            <p className="text-2xl font-bold text-neutral-800 mt-1">0</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h3 className="text-sm font-medium text-neutral-600 mb-3">快速入口</h3>
            <div className="grid grid-cols-2 gap-2">
              <a href="/admin/products" className="block p-3 bg-brand-50 rounded-lg text-sm text-brand-700 hover:bg-brand-100 transition-colors">产品管理</a>
              <a href="/admin/inquiries" className="block p-3 bg-green-50 rounded-lg text-sm text-green-700 hover:bg-green-100 transition-colors">询盘管理</a>
              <a href="/admin/analytics" className="block p-3 bg-blue-50 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors">数据分析</a>
              <a href="/admin/settings" className="block p-3 bg-neutral-100 rounded-lg text-sm text-neutral-700 hover:bg-neutral-200 transition-colors">系统设置</a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-sm font-medium text-neutral-600 mb-3">系统信息</h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>系统版本: V1.0</p>
              <p>技术栈: Next.js + Prisma + PostgreSQL</p>
              <p>部署状态: 开发环境</p>
              <p className="text-xs text-neutral-400 mt-2">
                连接数据库后，此处将展示实时统计数据。目前数据为占位展示。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
