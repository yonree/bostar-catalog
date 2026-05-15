'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-bold text-neutral-200 mb-4">500</p>
        <h1 className="text-xl font-semibold text-neutral-800 mb-2">页面加载出错</h1>
        <p className="text-sm text-neutral-500 mb-6">请稍后重试</p>
        <button
          onClick={reset}
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 transition-colors"
        >
          重新加载
        </button>
      </div>
    </div>
  );
}
