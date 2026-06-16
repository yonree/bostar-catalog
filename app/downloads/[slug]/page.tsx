import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { LeadForm } from '@/components/lead/LeadForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getDownload, getProducts } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const download = await getDownload(slug);
  return { title: download?.title || '资料下载', description: download?.summary || '' };
}

export default async function DownloadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [download, products] = await Promise.all([getDownload(slug), getProducts(4)]);
  if (!download) notFound();

  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <Breadcrumb items={[{ label: '资料下载', href: '/downloads' }, { label: download.title }]} />
          <BreadcrumbJsonLd
            items={[
              { name: '首页', path: '/' },
              { name: '资料下载', path: '/downloads' },
              { name: download.title, path: `/downloads/${download.slug}` },
            ]}
          />
          <h1 className="max-w-3xl text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">
            {download.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-steel">{download.summary}</p>
          <dl className="mt-8 grid gap-4 rounded-[24px] border border-line bg-white p-6 shadow-card md:grid-cols-2">
            <div>
              <dt className="font-semibold uppercase tracking-[0.14em] text-steel">资料类型</dt>
              <dd className="mt-2 text-ink">{download.fileType}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.14em] text-steel">版本</dt>
              <dd className="mt-2 text-ink">{download.version}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.14em] text-steel">获取方式</dt>
              <dd className="mt-2 text-ink">{download.requireLeadForm ? '提交表单后获取' : '可直接下载'}</dd>
            </div>
          </dl>

          <div className="mt-12">
            <SectionHeader title="适用产品" />
            <ul className="grid gap-3 md:grid-cols-2">
              {products.map((product) => (
                <li key={product.id} className="rounded-[20px] border border-line bg-white p-4 text-steel shadow-card">
                  {product.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          {download.requireLeadForm ? (
            <>
              <SectionHeader title="填写信息获取资料" />
              <LeadForm sourcePage={`/downloads/${download.slug}`} />
            </>
          ) : (
            <a
              href={download.fileUrl}
              className="inline-flex rounded-full bg-primary px-6 py-3 text-center font-semibold tracking-[0.08em] text-white transition-colors hover:bg-primary-dark"
            >
              下载资料
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
