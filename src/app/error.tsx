'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>网站出错了</h2>
      <p style={{ color: 'red' }}>{error.message}</p>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
      <button onClick={reset}>重新加载</button>
    </div>
  );
}
