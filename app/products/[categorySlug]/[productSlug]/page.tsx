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
import type { ProductView } from '@/lib/cms-data';
import { getProduct } from '@/lib/cms-data';

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

function buildDetailRows(product: ProductView) {
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

  put('适用工艺', product.applicableCraft);
  put('应用边界', toPlainText(product.application || ''));

  return Array.from(rows.entries());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  const product = await getProduct(categorySlug, productSlug);

  return {
    title: product?.name || '产品详情',
    description: toPlainText(product?.summary || ''),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}) {
  const { categorySlug, productSlug } = await params;
  const product = await getProduct(categorySlug, productSlug);
  if (!product) notFound();

  const faqs = product.faqs;
  const detailRows = buildDetailRows(product);
  const hasDetailRows = detailRows.length > 0;

  return (
    <>
      <ProductJsonLd product={product} />
      <FAQJsonLd faqs={faqs} />
      {product.operationSteps.length > 0 && (
        <HowToJsonLd name={`${product.name}操作步骤`} steps={product.operationSteps} />
      )}
      <BreadcrumbJsonLd
        items={[
          { name: '首页', path: '/' },
          { name: '产品中心', path: '/products' },
          { name: product.name, path: `/products/${product.categorySlug}/${product.slug}` },
        ]}
      />

      <section className="section">
        <div className="container">
          <Breadcrumb
            items={[
              { label: '产品中心', href: '/products' },
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
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{product.model}</p>
              ) : null}
              <h1 className="mt-3 max-w-2xl text-[42px] font-black leading-[1.02] text-ink md:text-[56px]">
                {product.name}
              </h1>
              {product.summary ? (
                <Markdown className="mt-6 max-w-2xl text-base leading-8 text-steel">{product.summary}</Markdown>
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

      {product.sellingPoints.length > 0 && (
        <section className="section section-alt border-y border-line">
          <div className="container">
            <SectionHeader title="产品卖点" />
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
      )}

      {product.description && (
        <section className="section">
          <div className="container">
            <SectionHeader title="产品详情" />
            <div className={panelClass}>
              <Markdown className="leading-8 text-steel">{product.description}</Markdown>
            </div>
          </div>
        </section>
      )}

      <section className="section section-alt border-y border-line">
        <div className={`container grid gap-10 ${hasDetailRows ? 'lg:grid-cols-[1fr_0.9fr]' : ''}`}>
          {hasDetailRows ? (
            <div>
              <SectionHeader title="技术参数与应用边界" />
              <div className={`${panelClass} overflow-hidden p-0`}>
                <table className="w-full text-left text-sm">
                  <tbody>
                    {detailRows.map(([key, value]) => (
                      <tr key={key} className="border-b border-line last:border-0">
                        <th className="w-[300px] bg-bg-soft px-6 py-4 font-semibold text-ink">{key}</th>
                        <td className="px-6 py-4 text-steel">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          <div>
            <SectionHeader
              title="获取报价 / 选型咨询"
              description="提交工件、产量和现场问题，便于判断喷枪、控制器和供粉系统配置。"
            />
            <LeadForm sourcePage={`/products/${product.categorySlug}/${product.slug}`} interestedProduct={product.name} />
          </div>
        </div>
      </section>

      {product.unsuitableScenes ? (
        <section className="section">
          <div className="container">
            <SectionHeader title="不适用场景" />
            <div className="rounded-[24px] border border-red-500/20 bg-white p-6 shadow-card">
              <Markdown className="leading-8 text-steel">{product.unsuitableScenes}</Markdown>
            </div>
          </div>
        </section>
      ) : null}

      {product.functions.length > 0 ? (
        <section className="section section-alt border-y border-line">
          <div className="container">
            <SectionHeader title="产品功能" />
            <div className="grid gap-3 md:grid-cols-2">
              {product.functions.map((fn) => (
                <div key={fn} className={`${panelClass} text-sm text-steel`}>
                  {fn}
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
                <SectionHeader title="结构说明" />
                <div className={panelClass}>
                  <Markdown className="leading-8 text-steel">{product.structure}</Markdown>
                </div>
              </div>
            ) : null}
            {product.workingPrinciple ? (
              <div>
                <SectionHeader title="工作原理" />
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
            <SectionHeader title="操作步骤" />
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
                <SectionHeader title="标准配置" />
                <ul className="space-y-2">
                  {product.standardConfig.map((item) => (
                    <li key={item} className={`${panelClass} flex items-center gap-2 p-4 text-sm text-steel`}>
                      <span className="text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {product.optionalParts.length > 0 ? (
              <div>
                <SectionHeader title="选配件" />
                <ul className="space-y-2">
                  {product.optionalParts.map((item) => (
                    <li key={item} className={`${panelClass} flex items-center gap-2 p-4 text-sm text-steel`}>
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
                <SectionHeader title="维护保养" />
                <div className={panelClass}>
                  <Markdown className="leading-8 text-steel">{product.maintenance}</Markdown>
                </div>
              </div>
            ) : null}
            {product.troubleshooting ? (
              <div>
                <SectionHeader title="故障处理" />
                <div className={panelClass}>
                  <Markdown className="leading-8 text-steel">{product.troubleshooting}</Markdown>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <FaqSection title="常见问题" faqs={faqs} description={`关于${product.name}的常见疑问与解答。`} />
      <TechFaqSection />
    </>
  );
}
