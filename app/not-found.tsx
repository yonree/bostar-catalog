import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container text-center">
        <h1 className="text-4xl font-black">页面未找到</h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded bg-primary px-5 py-3 font-bold text-white transition-colors"
        >
          返回首页
        </Link>
      </div>
    </section>
  );
}
