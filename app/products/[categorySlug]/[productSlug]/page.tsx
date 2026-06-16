import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LeadForm } from '@/components/lead/LeadForm';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { FAQJsonLd } from '@/components/schema/FAQJsonLd';
import { HowToJsonLd } from '@/components/schema/HowToJsonLd';
import { ProductJsonLd } from '@/components/schema/ProductJsonLd';
import { FaqSection } from '@/components/ui/FaqSection';
import { Markdown } from '@/components/ui/Markdown';
import { ProductImage } from '@/components/ui/ProductImage';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TechFaqSection } from '@/components/ui/TechFaqSection';
import { TranslationNotice } from '@/components/ui/TranslationNotice';
import type { ProductView } from '@/lib/cms-data';
import { getProduct } from '@/lib/cms-data';
import { isEnglishLocale, localizeHref } from '@/lib/i18n';
import { createResolvedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

const panelClass = 'rounded-[24px] border border-line bg-white p-6 shadow-card';
const chipClass = 'rounded-full border border-line bg-white px-3 py-2 text-sm text-steel';

function toPlainText(value: string) {
  return value
    .replace(/\[cite_start\]/gi, '')
    .replace(/\[cite:\s*[\d,\s]+\]/gi, '')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/(^|[^\*])\*([^\*].*?[^\*])\*(?!\*)/g, '$1$2')
    .replace(/(^|[^_])_([^_].*?[^_])_(?!_)/g, '$1$2')
    .replace(/\s*\n+\s*/g, ' ')
    .trim();
}

function buildDetailRows(product: ProductView, isEnglish: boolean) {
  const rows = new Map<string, string>();
  const put = (label: string, value?: string | null) => {
    const key = label.trim();
    const val = (value || '').trim();
    if (!key || !val || rows.has(key)) return;
    rows.set(key, val);
  };

  for (const [key, value] of Object.entries(product.specs)) {
    put(key, value);
  }

  put(isEnglish ? 'Applicable Craft' : '适用工艺', product.applicableCraft);
  put(isEnglish ? 'Application Scope' : '应用边界', toPlainText(product.application || ''));

  return Array.from(rows.entries());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}): Promise<Metadata> {
  const [{ categorySlug, productSlug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const product = await getProduct(categorySlug, productSlug);
  const isEnglish = isEnglishLocale(locale);
  const productLabel = product?.model || product?.name || 'BOSTAR';

  return createResolvedPageMetadata({
    title:
      product?.name && isEnglish
        ? `${product.name} Product Details`
        : product?.name || (isEnglish ? 'Product Detail' : '产品详情'),
    description:
      (isEnglish
        ? `${productLabel} product detail, source-language specifications, and quotation inquiry entry point.`
        : toPlainText(product?.summary || '')) ||
      (isEnglish
        ? 'Industrial coating product detail, specification overview, and inquiry entry point.'
        : '工业喷涂产品详情、参数总览与询盘入口。'),
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}) {
  const [{ categorySlug, productSlug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const product = await getProduct(categorySlug, productSlug);
  if (!product) notFound();

  const isEnglish = isEnglishLocale(locale);
  const faqs = product.faqs;
  const detailRows = buildDetailRows(product, isEnglish);
  const hasDetailRows = detailRows.length > 0;
  const sourcePage = localizeHref(`/products/${product.categorySlug}/${product.slug}`, locale);

  const copy = isEnglish
    ? {
        home: 'Home',
        products: 'Products',
        highlights: 'Product Highlights',
        details: 'Product Details',
        specs: 'Technical Parameters and Application Scope',
        inquiryTitle: 'Get a Quote / Selection Support',
        inquiryDescription:
          'Share the workpiece, output target, and current issue so the team can review the right spray gun, controller, and powder-feed configuration.',
        unsuitableScenes: 'Unsuitable Scenarios',
        functions: 'Product Functions',
        structure: 'Structure Overview',
        principle: 'Working Principle',
        operationSteps: 'Operating Steps',
        standardConfig: 'Standard Configuration',
        optionalParts: 'Optional Parts',
        maintenance: 'Maintenance',
        troubleshooting: 'Troubleshooting',
        faqTitle: 'Common Questions',
        faqDescription: `Questions and answers related to ${product.name}.`,
      }
    : {
        home: '首页',
        products: '产品中心',
        highlights: '产品卖点',
        details: '产品详情',
        specs: '技术参数与应用边界',
        inquiryTitle: '获取报价 / 选型咨询',
        inquiryDescription: '提交工件、产量和现场问题，便于判断喷枪、控制器和供粉系统配置。',
        unsuitableScenes: '不适用场景',
        functions: '产品功能',
        structure: '结构说明',
        principle: '工作原理',
        operationSteps: '操作步骤',
        standardConfig: '标准配置',
        optionalParts: '选配件',
        maintenance: '维护保养',
        troubleshooting: '故障处理',
        faqTitle: '常见问题',
        faqDescription: `关于 ${product.name} 的常见疑问与解答。`,
      };

  return (
    <>
      <ProductJsonLd product={product} />
      <FAQJsonLd faqs={faqs} />
      {product.operationSteps.length > 0 ? (
        <HowToJsonLd
          name={`${product.name}${isEnglish ? ' Operating Steps' : '操作步骤'}`}
          steps={product.operationSteps}
        />
      ) : null}
      <BreadcrumbJsonLd
        items={[
          { name: copy.home, path: '/' },
          { name: copy.products, path: '/products' },
          { name: product.name, path: `/products/${product.categorySlug}/${product.slug}` },
        ]}
      />

      <section className="section">
        <div className="container">
          <Breadcrumb
            items={[
              { label: copy.products, href: '/products' },
              { label: product.categoryName || product.categorySlug, href: `/products/${product.categorySlug}` },
              { label: product.name },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div className={`${panelClass} p-8`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-bg-soft">
                <ProductImage
                  alt={product.name}
                  candidates={product.imageCandidates}
                  className="object-contain p-8"
                />
              </div>
            </div>
            <div className="pt-2 lg:pt-10">
              {product.model ? (
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  {product.model}
                </p>
              ) : null}
              <h1 className="mt-3 max-w-2xl text-[42px] font-black leading-[1.02] text-ink md:text-[56px]">
                {product.name}
              </h1>
              {isEnglish ? <TranslationNotice className="mt-6 max-w-3xl" /> : null}
              {product.summary ? (
                <Markdown className="mt-6 max-w-2xl text-base leading-8 text-steel">
                  {product.summary}
                </Markdown>
              ) : null}
              {product.aiSummary ? (
                <div className="mt-7 rounded-[22px] border border-primary/20 bg-primary-light/40 p-6">
                  <Markdown className="leading-8 text-ink">{product.aiSummary}</Markdown>
                </div>
              ) : null}
              {product.applications.length > 0 ? (
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {product.applications.map((item) => (
                    <span key={item} className={chipClass}>
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {product.sellingPoints.length > 0 ? (
        <section className="section section-alt border-y border-line">
          <div className="container">
            <SectionHeader title={copy.highlights} />
            <div className="grid gap-4 md:grid-cols-2">
              {product.sellingPoints.map((point) => (
                <div key={point} className={`${panelClass} flex items-start gap-3`}>
                  <span className="mt-0.5 text-primary">•</span>
                  <span className="text-steel">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.description ? (
        <section className="section">
          <div className="container">
            <SectionHeader title={copy.details} />
            <div className={panelClass}>
              <Markdown className="leading-8 text-steel">{product.description}</Markdown>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section-alt border-y border-line">
        <div className={`container grid gap-10 ${hasDetailRows ? 'lg:grid-cols-[1fr_0.9fr]' : ''}`}>
          {hasDetailRows ? (
            <div>
              <SectionHeader title={copy.specs} />
              <div className={`${panelClass} overflow-hidden p-0`}>
                <table className="w-full text-left text-sm">
                  <tbody>
                    {detailRows.map(([key, value]) => (
                      <tr key={key} className="border-b border-line last:border-0">
                        <th className="w-[300px] bg-bg-soft px-6 py-4 font-semibold text-ink">
                          {key}
                        </th>
                        <td className="px-6 py-4 text-steel">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          <div>
            <SectionHeader title={copy.inquiryTitle} description={copy.inquiryDescription} />
            <LeadForm locale={locale} sourcePage={sourcePage} interestedProduct={product.name} />
          </div>
        </div>
      </section>

      {product.unsuitableScenes ? (
        <section className="section">
          <div className="container">
            <SectionHeader title={copy.unsuitableScenes} />
            <div className="rounded-[24px] border border-red-500/20 bg-white p-6 shadow-card">
              <Markdown className="leading-8 text-steel">{product.unsuitableScenes}</Markdown>
            </div>
          </div>
        </section>
      ) : null}

      {product.functions.length > 0 ? (
        <section className="section section-alt border-y border-line">
          <div className="container">
            <SectionHeader title={copy.functions} />
            <div className="grid gap-3 md:grid-cols-2">
              {product.functions.map((item) => (
                <div key={item} className={`${panelClass} text-sm text-steel`}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.structure || product.workingPrinciple ? (
        <section className="section">
          <div className="container grid gap-10 lg:grid-cols-2">
            {product.structure ? (
              <div>
                <SectionHeader title={copy.structure} />
                <div className={panelClass}>
                  <Markdown className="leading-8 text-steel">{product.structure}</Markdown>
                </div>
              </div>
            ) : null}
            {product.workingPrinciple ? (
              <div>
                <SectionHeader title={copy.principle} />
                <div className={panelClass}>
                  <Markdown className="leading-8 text-steel">{product.workingPrinciple}</Markdown>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {product.operationSteps.length > 0 ? (
        <section className="section section-alt border-y border-line">
          <div className="container">
            <SectionHeader title={copy.operationSteps} />
            <div className="space-y-4">
              {product.operationSteps.map((step, index) => (
                <div key={step} className={`${panelClass} flex items-start gap-4`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-steel">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.standardConfig.length > 0 || product.optionalParts.length > 0 ? (
        <section className="section">
          <div className="container grid gap-10 lg:grid-cols-2">
            {product.standardConfig.length > 0 ? (
              <div>
                <SectionHeader title={copy.standardConfig} />
                <ul className="space-y-2">
                  {product.standardConfig.map((item) => (
                    <li
                      key={item}
                      className={`${panelClass} flex items-center gap-2 p-4 text-sm text-steel`}
                    >
                      <span className="text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {product.optionalParts.length > 0 ? (
              <div>
                <SectionHeader title={copy.optionalParts} />
                <ul className="space-y-2">
                  {product.optionalParts.map((item) => (
                    <li
                      key={item}
                      className={`${panelClass} flex items-center gap-2 p-4 text-sm text-steel`}
                    >
                      <span className="text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {product.maintenance || product.troubleshooting ? (
        <section className="section section-alt border-y border-line">
          <div className="container grid gap-10 lg:grid-cols-2">
            {product.maintenance ? (
              <div>
                <SectionHeader title={copy.maintenance} />
                <div className={panelClass}>
                  <Markdown className="leading-8 text-steel">{product.maintenance}</Markdown>
                </div>
              </div>
            ) : null}
            {product.troubleshooting ? (
              <div>
                <SectionHeader title={copy.troubleshooting} />
                <div className={panelClass}>
                  <Markdown className="leading-8 text-steel">{product.troubleshooting}</Markdown>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <FaqSection title={copy.faqTitle} faqs={faqs} description={copy.faqDescription} />
      {isEnglish ? null : <TechFaqSection />}
    </>
  );
}
