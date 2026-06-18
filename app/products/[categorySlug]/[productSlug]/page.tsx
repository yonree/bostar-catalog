import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LeadForm } from '@/components/lead/LeadForm';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { FAQJsonLd } from '@/components/schema/FAQJsonLd';
import { ProductJsonLd } from '@/components/schema/ProductJsonLd';
import { FaqSection } from '@/components/ui/FaqSection';
import { Markdown } from '@/components/ui/Markdown';
import { ProductImage } from '@/components/ui/ProductImage';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getArticles, getDownloads, getProduct, getSolutions } from '@/lib/cms-data';
import { createResolvedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { isEnglishLocale, localizeHref } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

const panelClass = 'rounded-[24px] border border-line bg-white p-6 shadow-card';

function keyParameterRows(specs: Record<string, string>) {
  return Object.entries(specs).slice(0, 8);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}): Promise<Metadata> {
  const [{ categorySlug, productSlug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const product = await getProduct(categorySlug, productSlug);
  const isEnglish = isEnglishLocale(locale);

  return createResolvedPageMetadata({
    title:
      product?.model && product?.name
        ? `${product.model} ${product.name}`
        : product?.name || (isEnglish ? 'Product Detail' : '产品详情'),
    description:
      product?.summary ||
      (isEnglish
        ? 'Product detail, application fit, technical parameters, and inquiry entry point.'
        : '产品详情、适用边界、技术参数与询盘入口。'),
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}) {
  const [{ categorySlug, productSlug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const [product, articles, solutions, downloads] = await Promise.all([
    getProduct(categorySlug, productSlug),
    getArticles(3),
    getSolutions(3),
    getDownloads(),
  ]);

  if (!product) notFound();

  const isEnglish = isEnglishLocale(locale);
  const rows = keyParameterRows(product.specs);

  return (
    <>
      <ProductJsonLd product={product} />
      {!isEnglish && <FAQJsonLd faqs={product.faqs} />}
      <BreadcrumbJsonLd
        items={[
          { name: isEnglish ? 'Home' : '首页', path: '/' },
          { name: isEnglish ? 'Products' : '产品中心', path: '/products' },
          { name: product.categoryName || product.categorySlug, path: `/products/${product.categorySlug}` },
          { name: product.name, path: `/products/${product.categorySlug}/${product.slug}` },
        ]}
      />

      <section className="section">
        <div className="container">
          <Breadcrumb
            items={[
              { label: isEnglish ? 'Products' : '产品中心', href: '/products' },
              { label: product.categoryName || product.categorySlug, href: `/products/${product.categorySlug}` },
              { label: product.name },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-[1fr_0.92fr]">
            <div className={`${panelClass} p-8`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-bg-soft">
                <ProductImage alt={product.name} candidates={product.imageCandidates} className="object-contain p-8" />
              </div>
            </div>
            <div className="pt-2 lg:pt-8">
              {product.model ? (
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{product.model}</p>
              ) : null}
              <h1 className="mt-3 text-[42px] font-black leading-[1.04] text-ink md:text-[56px]">{product.name}</h1>
              <p className="mt-6 text-lg leading-8 text-steel">{product.summary || product.aiSummary}</p>
              {product.applications.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {product.applications.slice(0, 4).map((item) => (
                    <span key={item} className="rounded-full border border-line bg-white px-3 py-2 text-sm text-steel">
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {rows.slice(0, 4).map(([label, value]) => (
                  <div key={label} className="rounded-[20px] border border-line bg-bg-soft p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <LocalizedLink href="/contact" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
                  {isEnglish ? 'Request a Quotation' : '获取该型号报价'}
                </LocalizedLink>
                <LocalizedLink href="/support/sample-coating-test" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink">
                  {isEnglish ? 'Request a Sample Test' : '预约工件测试'}
                </LocalizedLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt border-y border-line">
        <div className="container grid gap-10 lg:grid-cols-[1fr_0.94fr]">
          <div>
            <SectionHeader
              title={isEnglish ? 'Technical Parameters and Application Fit' : '技术参数与适用边界'}
              description={isEnglish ? 'Publish only visible and verifiable parameters. Boundary conditions stay explicit instead of being hidden in sales language.' : '参数、场景和边界条件明确展示，避免把判断逻辑隐藏在营销措辞里。'}
            />
            <div className={`${panelClass} overflow-hidden p-0`}>
              <table className="w-full text-left text-sm">
                <tbody>
                  {rows.map(([key, value]) => (
                    <tr key={key} className="border-b border-line last:border-0">
                      <th className="w-[260px] bg-bg-soft px-6 py-4 font-semibold text-ink">{key}</th>
                      <td className="px-6 py-4 text-steel">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(product.application || product.unsuitableScenes) && (
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                <div className={panelClass}>
                  <h2 className="text-xl font-black text-ink">{isEnglish ? 'Recommended Use' : '推荐使用'}</h2>
                  <Markdown className="mt-4 leading-8 text-steel">{product.application || product.applicableCraft}</Markdown>
                </div>
                <div className={panelClass}>
                  <h2 className="text-xl font-black text-ink">{isEnglish ? 'Needs Extra Evaluation' : '需要额外评估'}</h2>
                  <Markdown className="mt-4 leading-8 text-steel">{product.unsuitableScenes || (isEnglish ? 'Review special coating materials, hazardous environments, and automation constraints before release.' : '特殊涂料、危险环境和自动化接口要求需在正式配置前单独评估。')}</Markdown>
                </div>
              </div>
            )}

            {product.sellingPoints.length > 0 && (
              <div className="mt-8">
                <SectionHeader title={isEnglish ? 'Core Advantages' : '核心优势'} />
                <div className="grid gap-4 md:grid-cols-2">
                  {product.sellingPoints.map((point) => (
                    <div key={point} className={panelClass}>
                      <p className="text-sm leading-7 text-steel">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <SectionHeader
              title={isEnglish ? 'Consult This Model' : '咨询该型号'}
              description={isEnglish ? 'Submit part, material, target, and current issue for quotation or sample-test evaluation.' : '提交工件、材料、目标需求与当前问题，进入报价或寄样测试评估流程。'}
            />
            <LeadForm
              locale={locale}
              sourcePage={localizeHref(`/products/${product.categorySlug}/${product.slug}`, locale)}
              sourceType="product"
              interestedProduct={product.model || product.name}
              defaultDemandType={isEnglish ? 'Request a Quotation' : '获取报价'}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-3">
          <div>
            <SectionHeader title={isEnglish ? 'Documents' : '下载资料'} />
            <div className="grid gap-3">
              {downloads.slice(0, 3).map((item) => (
                <LocalizedLink key={item.id} href={`/downloads/${item.slug}`} className={panelClass}>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{item.fileType} · {item.version}</p>
                  <h3 className="mt-2 text-lg font-black text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-steel">{item.summary}</p>
                </LocalizedLink>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader title={isEnglish ? 'Related Solutions' : '相关解决方案'} />
            <div className="grid gap-3">
              {solutions.map((item) => (
                <LocalizedLink key={item.id} href={`/solutions/${item.slug}`} className={panelClass}>
                  <h3 className="text-lg font-black text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-steel">{item.aiSummary}</p>
                </LocalizedLink>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader title={isEnglish ? 'Related Knowledge' : '相关知识'} />
            <div className="grid gap-3">
              {articles.map((item) => (
                <LocalizedLink key={item.id} href={`/knowledge/${item.categorySlug}/${item.slug}`} className={panelClass}>
                  <h3 className="text-lg font-black text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-steel">{item.excerpt || item.aiSummary}</p>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        faqs={product.faqs}
        title={isEnglish ? 'Frequently Asked Questions' : '常见问题'}
        description={isEnglish ? 'Reusable answers for engineers, buyers, and operators.' : '面向采购、工程和操作人员的常见问题回答。'}
      />
    </>
  );
}
