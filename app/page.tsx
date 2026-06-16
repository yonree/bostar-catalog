import Image from 'next/image';
import { ArticleCard } from '@/components/article/ArticleCard';
import { DownloadCard } from '@/components/download/DownloadCard';
import { LeadForm } from '@/components/lead/LeadForm';
import { ProductCard } from '@/components/product/ProductCard';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { FAQJsonLd } from '@/components/schema/FAQJsonLd';
import { TechnologyAdvantageCard } from '@/components/technology/TechnologyAdvantageCard';
import { CoatingLayerVisualization } from '@/components/technology/CoatingLayerVisualization';
import { Badge } from '@/components/ui/Badge';
import { CTAButton } from '@/components/ui/CTAButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TranslationNotice } from '@/components/ui/TranslationNotice';
import {
  getArticles,
  getDownloads,
  getFaqs,
  getFeaturedProducts,
  getProductCategories,
  getSolutions,
} from '@/lib/cms-data';
import { getRequestContext } from '@/lib/request-context';
import { isEnglishLocale, localizeHref } from '@/lib/i18n';
import { getSiteSettings } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

const homePageCopy = {
  trustLabels: {
    'zh-CN': ['30 年技术积累', '粉末 / 液体 / 自动化协同', '设备选型与工艺支持'],
    en: ['30 years of process experience', 'Powder, liquid, and automation coverage', 'Selection and process support'],
  },
  capabilityMetrics: {
    'zh-CN': [
      { label: '静电级联稳定性', value: '100', unit: 'kV', note: '微秒级反馈响应' },
      { label: '文丘里供粉增益', value: '+24', unit: '%', note: '降低波动并稳定输粉' },
      { label: '雾化气调节精度', value: '0.01', unit: 'MPa', note: '关键工艺控制点' },
    ],
    en: [
      { label: 'Cascade stability', value: '100', unit: 'kV', note: 'Microsecond feedback response' },
      { label: 'Venturi feed gain', value: '+24', unit: '%', note: 'Lower fluctuation and steadier delivery' },
      { label: 'Atomizing air resolution', value: '0.01', unit: 'MPa', note: 'Control point for critical processes' },
    ],
  },
  techAdvantages: {
    'zh-CN': [
      {
        title: '静电参数精确控制',
        description:
          '电压、电流独立调节并支持实时反馈，面向复杂工件自动补偿静电衰减，提升边角与凹槽区域的上粉均匀性。',
      },
      {
        title: '气路动态平衡',
        description:
          '供粉气、雾化气与清枪气独立调节，数字步进阀精确控制气量，减少吐粉、堆粉与喷涂波动。',
      },
      {
        title: '工艺配方管理',
        description:
          '支持多组工艺配方存储与一键调用，覆盖不同工件材质、粉末类型与膜厚目标，帮助产线快速复现参数。',
      },
      {
        title: '多工艺适配',
        description:
          '覆盖五金、铝型材、机械设备、汽车零部件与家具五金场景，从单站手动到自动化产线灵活组合。',
      },
    ],
    en: [
      {
        title: 'Electrostatic parameter control',
        description:
          'Tune voltage and current independently with live feedback, then compensate for electrostatic decay on complex parts to improve edge and recess coverage.',
      },
      {
        title: 'Dynamic air-path balance',
        description:
          'Separate powder, atomizing, and purge air regulation with digital stepping control to reduce spitting, overbuild, and spray fluctuation.',
      },
      {
        title: 'Recipe-based process management',
        description:
          'Store and recall multiple process recipes for different materials, powder types, and film-thickness targets so production can repeat validated settings faster.',
      },
      {
        title: 'Multi-process adaptability',
        description:
          'Support hardware, aluminum profile, machinery, automotive component, and furniture-metal lines from single manual stations to automated coating cells.',
      },
    ],
  },
  trustPoints: {
    'zh-CN': [
      '现代化工业表面处理实验与检测能力',
      '从研发验证到量产转移的一体化制造交付',
      '适配汽车工业、3C 电子与重工机械等高标准场景',
    ],
    en: [
      'Modern lab and validation capability for industrial surface treatment',
      'Integrated delivery from R&D verification to production transfer',
      'Experience across automotive, electronics, heavy machinery, and other high-standard lines',
    ],
  },
  hero: {
    'zh-CN': {
      title: '以绝对精度，定义每一道涂层。',
      description:
        '专注高性能工业涂装系统研发与制造，从精密雾化控制到高压静电级联，为制造企业提供稳定可复制的表面处理能力。',
      primaryCta: '浏览核心产品',
      secondaryCta: '联系工程团队',
      imageAlt: 'BOSTAR 工业涂装设备主视觉',
      badge: 'Precision Engineering Platform',
    },
    en: {
      title: 'Engineer every coating layer with controlled precision.',
      description:
        'BOSTAR builds industrial coating equipment and process support systems for teams that need stable electrostatic performance, repeatable atomization, and faster commissioning.',
      primaryCta: 'View core products',
      secondaryCta: 'Talk to engineering',
      imageAlt: 'BOSTAR industrial coating equipment hero image',
      badge: 'Precision Engineering Platform',
    },
  },
  sections: {
    'zh-CN': {
      home: '首页',
      productsTitle: '核心设备与关键技术矩阵',
      productsDescription:
        '用更易比较的设备卡片和指标结构替代传统堆叠式产品页，让采购与工程团队更快完成产品筛选、技术判断与方案比较。',
      categoryLabel: '分类',
      innovationTitle: '让静电喷涂从经验调试走向参数化控制',
      innovationDescription:
        '围绕电压、电流、气压、供粉、雾化与配方管理，构建更稳定、更可复用的工业涂装工艺。',
      trustTitle: '制造能力与交付经验，从研发验证延伸到量产现场',
      trustDescription:
        '通过真实设备图像、实验能力与关键工艺要点，帮助客户快速理解博士达的工程交付深度。',
      trustImageAlt: 'BOSTAR 制造与实验能力展示',
      solutionsTitle: '按应用场景组织方案，而不是按设备目录堆叠信息',
      solutionsDescription:
        '面向五金件、铝型材、机械设备、家具五金与汽车零部件，展示从工件特性到产线结构的可执行涂装方案。',
      knowledgeTitle: '把工艺问题沉淀成可检索、可引用、可复用的知识资产',
      knowledgeDescription:
        '围绕选型、调试、故障排查与维护，持续积累面向客户和工程团队都可使用的工业知识内容。',
      whyTitle: '为什么要把技术资料做成知识中心',
      whyPoints: [
        '帮助客户自助完成初步选型、工艺判断与参数理解。',
        '减少重复答疑，把常见故障与调试逻辑沉淀为标准答案。',
        '为搜索引擎和 AI 检索提供可引用、可结构化的工业内容资产。',
      ],
      knowledgeCta: '浏览全部文章',
      resourcesTitle: '把目录、参数表与技术手册组织成可决策的下载中心',
      resourcesDescription:
        '让采购、工艺和设备团队在同一入口获取产品目录、参数页、案例和维护资料，缩短评估周期。',
      resourcesCta: '查看全部资料',
      contactTitle: '提交工件与喷涂需求，获取更准确的工程建议',
      contactDescription:
        '填写工件材质、尺寸、产量与现有产线信息，博士达团队会基于现有信息回传设备方向和工艺建议。',
    },
    en: {
      home: 'Home',
      productsTitle: 'Core equipment and process technology',
      productsDescription:
        'Replace catalog-style product stacks with comparable equipment cards and decision-ready metrics so sourcing and engineering teams can filter options faster.',
      categoryLabel: 'Category',
      innovationTitle: 'Move electrostatic spraying from trial-and-error to parameter control',
      innovationDescription:
        'Coordinate voltage, current, airflow, powder delivery, atomization, and recipes into a coating process that is easier to stabilize and repeat.',
      trustTitle: 'Manufacturing depth and delivery discipline from lab validation to line launch',
      trustDescription:
        'Use real equipment imagery, validation capability, and process notes to show how BOSTAR supports industrial coating programs beyond the quotation stage.',
      trustImageAlt: 'BOSTAR manufacturing and validation capability',
      solutionsTitle: 'Organize solutions by application, not by isolated equipment lists',
      solutionsDescription:
        'Show executable coating approaches for hardware, aluminum profile, machinery, furniture metalwork, and automotive components based on part traits and line structure.',
      knowledgeTitle: 'Turn process questions into searchable and reusable knowledge assets',
      knowledgeDescription:
        'Accumulate technical content around selection, tuning, troubleshooting, and maintenance so customers and internal engineers can reuse the same guidance.',
      whyTitle: 'Why structure technical material as a knowledge center',
      whyPoints: [
        'Help buyers and engineers complete first-pass selection and process judgment without waiting for a call.',
        'Reduce repetitive support cycles by turning common failures and tuning logic into reusable answers.',
        'Create industrial content that search engines and AI retrieval systems can cite with clearer structure.',
      ],
      knowledgeCta: 'Browse all articles',
      resourcesTitle: 'Package catalogs, parameter sheets, and manuals into a decision-ready resource hub',
      resourcesDescription:
        'Give sourcing, process, and equipment teams one place to review product material, cases, and maintenance documents before a project handoff.',
      resourcesCta: 'View all resources',
      contactTitle: 'Submit part details and coating targets for an engineering response',
      contactDescription:
        'Share part material, dimensions, output, and current line constraints. BOSTAR can respond with an initial equipment direction and process recommendations.',
    },
  },
} as const;

const techIcons = [
  (
    <svg key="control" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  (
    <svg key="air" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12h6l2-6 4 12 2-6h6" />
    </svg>
  ),
  (
    <svg key="recipe" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 7h10M7 12h10M7 17h6" />
    </svg>
  ),
  (
    <svg key="adapt" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
];

export default async function HomePage() {
  const [
    faqs,
    productCategories,
    products,
    solutions,
    articles,
    downloads,
    siteSettings,
    { locale },
  ] = await Promise.all([
    getFaqs(6),
    getProductCategories(),
    getFeaturedProducts(6),
    getSolutions(6),
    getArticles(3),
    getDownloads(),
    getSiteSettings(),
    getRequestContext(),
  ]);

  const isEnglish = isEnglishLocale(locale);
  const trustLabels = isEnglish ? homePageCopy.trustLabels.en : homePageCopy.trustLabels['zh-CN'];
  const capabilityMetrics = isEnglish ? homePageCopy.capabilityMetrics.en : homePageCopy.capabilityMetrics['zh-CN'];
  const techAdvantages = isEnglish ? homePageCopy.techAdvantages.en : homePageCopy.techAdvantages['zh-CN'];
  const trustPoints = isEnglish ? homePageCopy.trustPoints.en : homePageCopy.trustPoints['zh-CN'];
  const hero = isEnglish ? homePageCopy.hero.en : homePageCopy.hero['zh-CN'];
  const sectionCopy = isEnglish ? homePageCopy.sections.en : homePageCopy.sections['zh-CN'];

  return (
    <>
      {!isEnglish && <FAQJsonLd faqs={faqs} />}
      <BreadcrumbJsonLd items={[{ name: sectionCopy.home, path: '/' }]} />

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
              {hero.title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-steel">{hero.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CTAButton href="/products" variant="primary" size="lg">
                {hero.primaryCta}
              </CTAButton>
              <CTAButton href="/contact" variant="secondary" size="lg">
                {hero.secondaryCta}
              </CTAButton>
            </div>
            {isEnglish && <TranslationNotice className="mt-8 max-w-2xl" />}
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
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,82,204,0.08),transparent_42%)]"
                aria-hidden="true"
              />
              <Image
                src={siteSettings.homepageHeroImageUrl}
                alt={hero.imageAlt}
                fill
                priority
                className="object-contain p-8 lg:p-10"
                sizes="(max-width: 1024px) 100vw, 54vw"
              />
              <div className="pointer-events-none absolute bottom-7 left-7 rounded-full border border-line bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-steel backdrop-blur">
                {hero.badge}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt border-y border-line">
        <div className="container">
          <SectionHeader
            eyebrow="Products & Technology"
            title={sectionCopy.productsTitle}
            description={sectionCopy.productsDescription}
          />

          <div className="grid gap-4 md:grid-cols-4">
            {productCategories.map((category) => (
              <LocalizedLink
                key={category.slug}
                href={`/products/${category.slug}`}
                className="card-hover rounded-[24px] border border-line bg-white p-6 shadow-card"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {sectionCopy.categoryLabel}
                </p>
                <h3 className="mt-5 text-2xl font-black text-ink">{category.name}</h3>
                <p className="mt-4 text-sm leading-7 text-steel">{category.summary}</p>
              </LocalizedLink>
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
            title={sectionCopy.innovationTitle}
            description={sectionCopy.innovationDescription}
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {techAdvantages.map((adv, index) => (
              <TechnologyAdvantageCard
                key={adv.title}
                icon={techIcons[index]}
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
              title={sectionCopy.trustTitle}
              description={sectionCopy.trustDescription}
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
                alt={sectionCopy.trustImageAlt}
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
            title={sectionCopy.solutionsTitle}
            description={sectionCopy.solutionsDescription}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {solutions.map((solution) => (
              <LocalizedLink
                key={solution.id}
                href={`/solutions/${solution.slug}`}
                className="card-hover rounded-[28px] border border-line bg-white p-7 shadow-card"
              >
                <Badge variant="default">{solution.industry}</Badge>
                <h3 className="mt-5 text-2xl font-black text-ink">{solution.title}</h3>
                <p className="mt-4 text-sm leading-7 text-steel">{solution.aiSummary}</p>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt border-y border-line">
        <div className="container grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeader
              eyebrow="Knowledge Center"
              title={sectionCopy.knowledgeTitle}
              description={sectionCopy.knowledgeDescription}
            />
            <div className="grid gap-5">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
          <div className="rounded-[30px] border border-line bg-white p-8 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why It Matters</p>
            <h3 className="mt-4 text-3xl font-black text-ink">{sectionCopy.whyTitle}</h3>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-steel">
              {sectionCopy.whyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="mt-8">
              <CTAButton href="/knowledge" variant="secondary" size="md">
                {sectionCopy.knowledgeCta}
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
                title={sectionCopy.resourcesTitle}
                description={sectionCopy.resourcesDescription}
              />
              <CTAButton href="/downloads" variant="primary" size="md">
                {sectionCopy.resourcesCta}
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
              title={sectionCopy.contactTitle}
              description={sectionCopy.contactDescription}
            />
            <LeadForm locale={locale} sourcePage={localizeHref('/', locale)} />
          </div>
        </div>
      </section>
    </>
  );
}
