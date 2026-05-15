import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-bold text-neutral-200 mb-4">404</p>
        <h1 className="text-xl font-semibold text-neutral-800 mb-2">页面未找到</h1>
        <p className="text-sm text-neutral-500 mb-6">您访问的页面不存在或已被移除</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
