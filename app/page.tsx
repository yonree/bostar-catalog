import Image from 'next/image';
import Link from 'next/link';
import { ArticleCard } from '@/components/article/ArticleCard';
import { DownloadCard } from '@/components/download/DownloadCard';
import { LeadForm } from '@/components/lead/LeadForm';
import { ProductCard } from '@/components/product/ProductCard';
import { TechnologyAdvantageCard } from '@/components/technology/TechnologyAdvantageCard';
import { CoatingLayerVisualization } from '@/components/technology/CoatingLayerVisualization';
import { Badge } from '@/components/ui/Badge';
import { CTAButton } from '@/components/ui/CTAButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { FAQJsonLd } from '@/components/schema/FAQJsonLd';
import {
  getArticles,
  getDownloads,
  getFaqs,
  getFeaturedProducts,
  getProductCategories,
  getSolutions,
} from '@/lib/cms-data';
import { getSiteSettings } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

const trustLabels = ['30 年技术积累', '粉末 / 液体 / 自动化协同', '设备选型 + 工艺支持'];

const capabilityMetrics = [
  { label: '静电级联稳定性', value: '100', unit: 'kV', note: '微米级反馈响应' },
  { label: '文丘里供粉增幅', value: '+24', unit: '%', note: '省粉与稳定输送' },
  { label: '雾化气调节精度', value: '0.01', unit: 'MPa', note: '关键工艺控制点' },
];

const techAdvantages = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: '静电参数精准控制',
    description:
      '电压、电流独立调节与实时反馈，面向复杂工件自动补偿静电衰减，提升边角与凹槽区域的上粉均匀性。',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 12h6l2-6 4 12 2-6h6" />
      </svg>
    ),
    title: '气路动态平衡',
    description:
      '粉量气、雾化气与清枪气三路独立调节，数字步进阀精确控制气量，减少吐粉、堆粉与喷涂波动。',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 7h10M7 12h10M7 17h6" />
      </svg>
    ),
    title: '工艺配方管理',
    description:
      '支持多组工艺配方存储与一键调用，覆盖不同工件材质、粉末类型与膜厚要求，帮助产线快速复现参数。',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: '多工艺适配',
    description:
      '覆盖五金、铝型材、机箱机柜、汽车零部件与家具五金场景，从单站手动到自动化产线灵活组合。',
  },
];

const trustPoints = [
  '现代化工业表面处理实验基地与检测中心',
  '从研发、验证到量产的一体化制造迁移能力',
  '适配汽车工业、3C 电子与重工机械等高标准场景',
];

export default async function HomePage() {
  const [faqs, productCategories, products, solutions, articles, downloads, siteSettings] =
    await Promise.all([
      getFaqs(6),
      getProductCategories(),
      getFeaturedProducts(6),
      getSolutions(6),
      getArticles(3),
      getDownloads(),
      getSiteSettings(),
    ]);

  return (
    <>
      <FAQJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: '首页', path: '/' },
        ]}
      />

      <section className="overflow-hidden bg-white">
        <div className="container grid min-h-[calc(100vh-72px)] items-start gap-14 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-[120px]">
          <div className="order-2 animate-fade-up">
            <div className="mb-6 flex flex-wrap gap-2.5">
              {trustLabels.map((label) => (
                <Badge key={label} variant="outline">
                  {label}
                </Badge>
              ))}
            </div>
            <h1 className="max-w-3xl text-[42px] font-black leading-[1.02] text-ink md:text-[56px]">
              以绝对精准，定义每一道涂层。
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-steel">
              专注高性能工业涂装系统的研发与制造。从微米级全自动雾化控制到硬核高压静电级联，为全球智造提供高可靠性的表面处理闭环。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CTAButton href="/products" variant="primary" size="lg">
                浏览精密产品线
              </CTAButton>
              <CTAButton href="/contact" variant="secondary" size="lg">
                联系工程专家
              </CTAButton>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {capabilityMetrics.map((metric) => (
                <div key={metric.label} className="rounded-[22px] border border-line bg-bg-soft p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel">{metric.label}</p>
                  <p className="mt-3 font-technical text-3xl">
                    <code>{metric.value}</code>
                    <span className="ml-1 text-sm text-primary/80">{metric.unit}</span>
                  </p>
                  <p className="mt-2 text-sm text-steel">{metric.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 animate-float-in">
            <div className="relative min-h-[520px] overflow-hidden rounded-[36px] border border-line bg-[linear-gradient(180deg,#FFFFFF,#F8F9FA)] shadow-[0_30px_70px_rgba(15,23,42,0.08)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,82,204,0.08),transparent_42%)]" aria-hidden="true" />
              <Image
                src={siteSettings.homepageHeroImageUrl}
                alt="Bostar 高精度工业涂装设备渲染图"
                fill
                priority
                className="object-contain p-8 lg:p-10"
                sizes="(max-width: 1024px) 100vw, 54vw"
              />
              <div className="pointer-events-none absolute bottom-7 left-7 rounded-full border border-line bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-steel backdrop-blur">
                Precision Engineering Platform
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt border-y border-line">
        <div className="container">
          <SectionHeader
            eyebrow="Products & Technology"
            title="精密设备与核心技术矩阵"
            description="以轻量化卡片和参数化指标替代传统堆砌式设备页，让采购决策者与工程师能更快完成产品筛选、技术判断与方案比较。"
          />

          <div className="grid gap-4 md:grid-cols-4">
            {productCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/products/${category.slug}`}
                className="card-hover rounded-[24px] border border-line bg-white p-6 shadow-card"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Category</p>
                <h3 className="mt-5 text-2xl font-black text-ink">{category.name}</h3>
                <p className="mt-4 text-sm leading-7 text-steel">{category.summary}</p>
              </Link>
            ))}
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <SectionHeader
            eyebrow="Innovation"
            title="让静电喷涂从经验调试走向参数化控制"
            description="围绕电压、电流、气压、粉量、雾化、配方与产线节拍，构建更稳定、更可复制的工业涂装工艺。"
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {techAdvantages.map((adv) => (
              <TechnologyAdvantageCard
                key={adv.title}
                icon={adv.icon}
                title={adv.title}
                description={adv.description}
              />
            ))}
          </div>
        </div>
      </section>

      <CoatingLayerVisualization />

      <section className="section section-alt border-y border-line">
        <div className="container grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Trust & Authority"
              title="制造实力与大客户背书，从研发基地延伸到量产现场"
              description="用更具信任感的实景图像、制造节点与关键指标替代泛化的企业介绍，让访问者快速理解博士达的工业交付能力。"
            />
            <div className="space-y-4">
              {trustPoints.map((point) => (
                <div key={point} className="rounded-[20px] border border-line bg-white px-5 py-4 text-sm text-steel shadow-card">
                  {point}
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-[34px] border border-line bg-white shadow-card">
            <div className="relative aspect-[5/4]">
              <Image
                src={siteSettings.homepageHeroImageUrl}
                alt="Bostar 制造与实验能力展示"
                fill
                className="object-contain p-10"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <SectionHeader
            eyebrow="Solutions"
            title="按应用场景组织方案，而不是按设备目录堆叠信息"
            description="针对五金件、铝型材、机箱机柜、家具五金和汽车零部件行业，展示从工件属性到产线结构的可执行方案。"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {solutions.map((solution) => (
              <Link
                key={solution.id}
                href={`/solutions/${solution.slug}`}
                className="card-hover rounded-[28px] border border-line bg-white p-7 shadow-card"
              >
                <Badge variant="default">{solution.industry}</Badge>
                <h3 className="mt-5 text-2xl font-black text-ink">{solution.title}</h3>
                <p className="mt-4 text-sm leading-7 text-steel">{solution.aiSummary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt border-y border-line">
        <div className="container grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeader
              eyebrow="Knowledge Center"
              title="把工艺问题沉淀成可检索、可引用、可复用的知识资产"
              description="围绕静电喷涂选型、工艺调试、故障排查与设备维护持续沉淀内容，帮助客户减少试错与售后沟通成本。"
            />
            <div className="grid gap-5">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
          <div className="rounded-[30px] border border-line bg-white p-8 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why It Matters</p>
            <h3 className="mt-4 text-3xl font-black text-ink">为什么要把技术资料做成知识中心</h3>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-steel">
              <li>帮助客户自主完成设备初筛、工艺判断与参数理解。</li>
              <li>减少重复问答，把常见故障与调试逻辑沉淀成标准答案。</li>
              <li>为搜索引擎与 AI 检索提供可引用、可结构化的工业内容资产。</li>
            </ul>
            <div className="mt-8">
              <CTAButton href="/knowledge" variant="secondary" size="md">
                浏览全部文章
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {downloads.length > 0 && (
        <section className="section bg-white">
          <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeader
                eyebrow="Resources"
                title="把目录、参数表与技术手册组织成可决策的下载中心"
                description="让采购、工艺和设备团队在同一入口获得产品目录、参数页、案例和维护资料，加快评估周期。"
              />
              <CTAButton href="/downloads" variant="primary" size="md">
                查看全部资料
              </CTAButton>
            </div>
            <div className="grid gap-4">
              {downloads.slice(0, 4).map((dl) => (
                <DownloadCard key={dl.id} download={dl} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section-alt border-t border-line">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-[34px] border border-line bg-white p-8 shadow-[0_24px_56px_rgba(15,23,42,0.06)] md:p-12">
            <SectionHeader
              align="center"
              eyebrow="Contact"
              title="提交工件与喷涂需求，获取更准确的工程方案"
              description="填写工件材质、尺寸、产量与现有产线信息，博士达将在 24 小时内回复设备选型与工艺建议。"
            />
            <LeadForm sourcePage="/" />
          </div>
        </div>
      </section>
    </>
  );
}
