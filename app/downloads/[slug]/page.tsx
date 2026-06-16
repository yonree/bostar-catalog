import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { LeadForm } from '@/components/lead/LeadForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TranslationNotice } from '@/components/ui/TranslationNotice';
import { getDownload, getProducts } from '@/lib/cms-data';
import { isEnglishLocale, localizeHref } from '@/lib/i18n';
import { createResolvedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const download = await getDownload(slug);
  const isEnglish = isEnglishLocale(locale);
  const downloadLabel = download?.title || 'BOSTAR';

  return createResolvedPageMetadata({
    title:
      download?.title && isEnglish
        ? `${download.title} Download`
        : download?.title || (isEnglish ? 'Download' : '资料下载'),
    description:
      (isEnglish
        ? `${downloadLabel} download detail, source-language resource summary, and access method.`
        : download?.summary) ||
      (isEnglish ? 'Technical download detail and acquisition method.' : '下载资料详情。'),
  });
}

export default async function DownloadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const [download, products] = await Promise.all([getDownload(slug), getProducts(4)]);
  if (!download) notFound();

  const isEnglish = isEnglishLocale(locale);
  const downloadsLabel = isEnglish ? 'Downloads' : '资料下载';

  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <Breadcrumb items={[{ label: downloadsLabel, href: '/downloads' }, { label: download.title }]} />
          <BreadcrumbJsonLd
            items={[
              { name: isEnglish ? 'Home' : '首页', path: '/' },
              { name: downloadsLabel, path: '/downloads' },
              { name: download.title, path: `/downloads/${download.slug}` },
            ]}
          />
          <h1 className="max-w-3xl text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">
            {download.title}
          </h1>
          {isEnglish ? <TranslationNotice className="mt-6 max-w-3xl" /> : null}
          <p className="mt-6 max-w-3xl text-lg leading-8 text-steel">{download.summary}</p>
          <dl className="mt-8 grid gap-4 rounded-[24px] border border-line bg-white p-6 shadow-card md:grid-cols-2">
            <div>
              <dt className="font-semibold uppercase tracking-[0.14em] text-steel">
                {isEnglish ? 'Resource Type' : '资料类型'}
              </dt>
              <dd className="mt-2 text-ink">{download.fileType}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.14em] text-steel">{isEnglish ? 'Version' : '版本'}</dt>
              <dd className="mt-2 text-ink">{download.version}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.14em] text-steel">
                {isEnglish ? 'Access Method' : '获取方式'}
              </dt>
              <dd className="mt-2 text-ink">
                {download.requireLeadForm
                  ? isEnglish
                    ? 'Available after form submission'
                    : '提交表单后获取'
                  : isEnglish
                    ? 'Direct download available'
                    : '可直接下载'}
              </dd>
            </div>
          </dl>

          <div className="mt-12">
            <SectionHeader title={isEnglish ? 'Applicable Products' : '适用产品'} />
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
              <SectionHeader title={isEnglish ? 'Submit Information to Access This File' : '填写信息获取资料'} />
              <LeadForm
                locale={locale}
                sourcePage={localizeHref(`/downloads/${download.slug}`, locale)}
              />
            </>
          ) : (
            <a
              href={download.fileUrl}
              className="inline-flex rounded-full bg-primary px-6 py-3 text-center font-semibold tracking-[0.08em] text-white transition-colors hover:bg-primary-dark"
            >
              {isEnglish ? 'Download File' : '下载资料'}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
