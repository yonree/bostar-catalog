import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { getSearchResults } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '站内搜索',
  description: '搜索产品、文章、解决方案和 FAQ。',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQuery } = await searchParams;
  const q = (rawQuery || '').trim();
  const { products, articles, solutions, faqs } = await getSearchResults(q);
  return (
    <section className="section">
      <div className="container">
        <h1 className="text-4xl font-black">站内搜索</h1>
        <form className="mt-6 flex max-w-2xl gap-3">
          <input
            name="q"
            defaultValue={q}
            className="min-w-0 flex-1 rounded border border-line px-4 py-3"
            placeholder="搜索静电喷枪、上粉率、控制器..."
          />
          <button className="rounded bg-primary px-5 py-3 font-bold text-white transition-colors">搜索</button>
        </form>
        <div className="mt-10 grid gap-8">
          <ResultGroup
            title="产品"
            items={products.map((item) => ({
              href: `/products/${item.categorySlug}/${item.slug}`,
              title: item.name,
              desc: item.summary,
            }))}
          />
          <ResultGroup
            title="文章"
            items={articles.map((item) => ({
              href: `/knowledge/${item.categorySlug}/${item.slug}`,
              title: item.title,
              desc: item.excerpt,
            }))}
          />
          <ResultGroup
            title="方案"
            items={solutions.map((item) => ({
              href: `/solutions/${item.slug}`,
              title: item.title,
              desc: item.aiSummary,
            }))}
          />
          <ResultGroup
            title="FAQ"
            items={faqs.map((item) => ({ href: '/faq', title: item.question, desc: item.answer }))}
          />
        </div>
      </div>
        <BreadcrumbJsonLd items={[{ name: '首页', path: '/' }, { name: '搜索', path: '/search' }]} />
    </section>
  );
}

function ResultGroup({
  title,
  items,
}: {
  title: string;
  items: { href: string; title: string; desc: string }[];
}) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-black">{title}</h2>
      <div className="grid gap-3">
        {items.map((item) => (
          <Link
            key={`${title}-${item.title}`}
            href={item.href}
            className="rounded border border-line bg-dark-soft p-5 card-hover"
          >
            <h3 className="font-black">{item.title}</h3>
            <p className="mt-2 text-sm text-white-soft/50">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
