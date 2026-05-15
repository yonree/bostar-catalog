'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface AnalyticsData {
  todayVisits: number;
  weekVisits: number;
  monthVisits: number;
  totalInquiries: number;
  highIntentCount: number;
  topProducts: { product: { id: string; name: string; slug: string; mainImage: string | null }; views: number }[];
  topKeywords: { keyword: string | null; count: number }[];
  downloadCount: number;
  videoPlayCount: number;
  dailyTrend: { date: string; views: number; inquiries: number }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics/overview?period=${period}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }, [period]);

  if (loading || !data) {
    return <div className="text-center py-12 text-sm text-neutral-400">Loading...</div>;
  }

  const maxDailyViews = Math.max(...data.dailyTrend.map((d) => d.views), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-800">数据分析</h2>
        <div className="flex gap-1 bg-neutral-100 rounded-lg p-0.5">
          {[{ key: '7d', label: '7天' }, { key: '30d', label: '30天' }, { key: '90d', label: '90天' }].map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${period === p.key ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card><CardContent>
          <p className="text-sm text-neutral-500">今日访问</p>
          <p className="text-2xl font-bold mt-1">{data.todayVisits}</p>
        </CardContent></Card>
        <Card><CardContent>
          <p className="text-sm text-neutral-500">本周访问</p>
          <p className="text-2xl font-bold mt-1">{data.weekVisits}</p>
        </CardContent></Card>
        <Card><CardContent>
          <p className="text-sm text-neutral-500">总询盘</p>
          <p className="text-2xl font-bold mt-1">{data.totalInquiries}</p>
          {data.highIntentCount > 0 && (
            <Badge variant="success" className="mt-1">{data.highIntentCount} 高意向</Badge>
          )}
        </CardContent></Card>
        <Card><CardContent>
          <p className="text-sm text-neutral-500">下载/播放</p>
          <p className="text-2xl font-bold mt-1">{data.downloadCount + data.videoPlayCount}</p>
          <p className="text-xs text-neutral-400 mt-1">{data.downloadCount} 下载 · {data.videoPlayCount} 播放</p>
        </CardContent></Card>
      </div>

      {/* Daily Trend Chart */}
      <Card className="mb-8">
        <CardContent>
          <h3 className="text-sm font-medium text-neutral-600 mb-4">访问趋势</h3>
          <div className="h-48 flex items-end gap-1">
            {data.dailyTrend.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <div className="w-full flex flex-col items-center gap-0.5">
                  {d.inquiries > 0 && (
                    <div
                      className="w-full max-w-[20px] bg-brand-600 rounded-t"
                      style={{ height: `${Math.max((d.inquiries / maxDailyViews) * 120, 2)}px`, opacity: 0.6 }}
                      title={`${d.inquiries} inquiries`}
                    />
                  )}
                  <div
                    className="w-full max-w-[20px] bg-brand-400 rounded-t"
                    style={{ height: `${Math.max((d.views / maxDailyViews) * 120, 2)}px` }}
                    title={`${d.views} views`}
                  />
                </div>
                {data.dailyTrend.length <= 10 && (
                  <span className="text-[9px] text-neutral-400 whitespace-nowrap">{d.date.slice(5)}</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brand-400 rounded-sm" /> 访问</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brand-600 rounded-sm opacity-60" /> 询盘</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardContent>
            <h3 className="text-sm font-medium text-neutral-600 mb-4">热门产品 TOP10</h3>
            {data.topProducts.length === 0 ? (
              <div className="text-sm text-neutral-400 text-center py-8">暂无数据</div>
            ) : (
              <div className="space-y-2">
                {data.topProducts.map((item, i) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-neutral-400 w-5">{i + 1}</span>
                    <div className="w-8 h-8 bg-neutral-100 rounded flex-shrink-0 overflow-hidden">
                      {item.product.mainImage && <img src={item.product.mainImage} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-sm text-neutral-700 flex-1 truncate">{item.product.name}</span>
                    <span className="text-xs text-neutral-400">{item.views} views</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Keywords */}
        <Card>
          <CardContent>
            <h3 className="text-sm font-medium text-neutral-600 mb-4">热门搜索词</h3>
            {data.topKeywords.length === 0 ? (
              <div className="text-sm text-neutral-400 text-center py-8">暂无数据</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.topKeywords.map((item) => (
                  <span key={item.keyword} className="inline-flex items-center px-3 py-1.5 bg-neutral-50 rounded-full text-sm text-neutral-600">
                    {item.keyword || '(empty)'}
                    <span className="ml-1.5 text-xs text-neutral-400">{item.count}</span>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
