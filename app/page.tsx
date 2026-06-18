import Image from 'next/image';
import { ArticleCard } from '@/components/article/ArticleCard';
import { LeadForm } from '@/components/lead/LeadForm';
import { ProductCard } from '@/components/product/ProductCard';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { Badge } from '@/components/ui/Badge';
import { CTAButton } from '@/components/ui/CTAButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  getArticles,
  getCases,
  getFeaturedProducts,
  getProductCategories,
  getSolutions,
} from '@/lib/cms-data';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';
import { isEnglishLocale, localizeHref } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

const trustFacts = {
  'zh-CN': ['始于 1995', '粉末与液体静电喷涂', '自动化配套支持', '工作时间内 30 分钟响应'],
  en: ['Since 1995', 'Powder and liquid electrostatic coating', 'Automation-ready support', '30-minute response during business hours'],
} as const;

const problemCards = {
  'zh-CN': [
    { title: '绝缘粉末膜厚不均', href: '/solutions/insulation-powder-coating' },
    { title: '复杂工件死角上粉困难', href: '/solutions/complex-parts-coating' },
    { title: '粉末或涂料消耗过高', href: '/solutions/reduce-coating-consumption' },
    { title: '旧产线自动化升级', href: '/solutions/coating-line-automation-upgrade' },
  ],
  en: [
    { title: 'Insulation powder thickness inconsistency', href: '/solutions/insulation-powder-coating' },
    { title: 'Poor edge and recess coverage', href: '/solutions/complex-parts-coating' },
    { title: 'High powder or paint consumption', href: '/solutions/reduce-coating-consumption' },
    { title: 'Automation upgrade for existing lines', href: '/solutions/coating-line-automation-upgrade' },
  ],
} as const;

export default async function HomePage() {
  const [categories, products, solutions, cases, articles, site, { locale }] = await Promise.all([
    getProductCategories(),
    getFeaturedProducts(4),
    getSolutions(3),
    getCases(),
    getArticles(3),
    getSiteSettings(),
    getRequestContext(),
  ]);

  const isEnglish = isEnglishLocale(locale);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: isEnglish ? 'Home' : '首页', path: '/' }]} />

      <section className="section border-b border-line bg-white">
        <div className="container grid items-center gap-14 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2.5">
              {trustFacts[locale].map((label) => (
                <Badge key={label} variant="outline">
                  {label}
                </Badge>
              ))}
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {site.homepageHeroEyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl text-[42px] font-black leading-[1.02] text-ink md:text-[60px]">
              {site.homepageHeroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-steel">{site.homepageHeroDescription}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CTAButton href="/contact" variant="primary" size="lg">
                {isEnglish ? 'Request a Quotation' : '获取设备配置建议'}
              </CTAButton>
              <CTAButton href="/support/sample-coating-test" variant="secondary" size="lg">
                {isEnglish ? 'Request a Sample Coating Test' : '预约工件喷涂测试'}
              </CTAButton>
            </div>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-[36px] border border-line bg-[linear-gradient(180deg,#FFFFFF,#F4F6F8)] shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,59,33,0.08),transparent_40%)]" />
            <Image
              src={site.homepageHeroImageUrl}
              alt={site.homepageHeroTitle}
              fill
              priority
              className="object-contain p-8 lg:p-10"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="section section-alt border-b border-line">
        <div className="container">
          <SectionHeader
            eyebrow="Products"
            title={isEnglish ? 'Core product matrix for selection and comparison' : '围绕选型与比较建立核心产品矩阵'}
            description={isEnglish ? 'Keep the homepage focused on the four highest-priority equipment families and move model-level decisions into detail pages.' : '首页只聚焦粉末、液体、旋杯/DISK 和自动化四大核心产品族，具体型号放到分类页与详情页中完成判断。'}
          />
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            {categories.slice(0, 4).map((category) => (
              <LocalizedLink key={category.slug} href={`/products/${category.slug}`} className="rounded-[24px] border border-line bg-white p-5 shadow-card">
                <h3 className="text-lg font-black text-ink">{category.name}</h3>
                <p className="mt-3 text-sm leading-7 text-steel">{category.summary}</p>
              </LocalizedLink>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section border-b border-line">
        <div className="container">
          <SectionHeader
            eyebrow="Solutions"
            title={isEnglish ? 'Find solutions by coating problem' : '按喷涂问题进入解决方案'}
            description={isEnglish ? 'Organize the path by problem and process judgment instead of generic equipment promotion.' : '不再让用户先看抽象口号，而是先进入具体问题、场景和工艺约束。'}
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {problemCards[locale].map((item) => (
              <LocalizedLink key={item.href} href={item.href} className="rounded-[24px] border border-line bg-white p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {isEnglish ? 'Problem-led entry' : '问题型入口'}
                </p>
                <h3 className="mt-3 text-xl font-black text-ink">{item.title}</h3>
              </LocalizedLink>
            ))}
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {solutions.map((solution) => (
              <LocalizedLink key={solution.id} href={`/solutions/${solution.slug}`} className="rounded-[24px] border border-line bg-dark-soft p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{solution.industry}</p>
                <h3 className="mt-3 text-xl font-black">{solution.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white-soft/70">{solution.aiSummary}</p>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt border-b border-line">
        <div className="container">
          <SectionHeader
            eyebrow="Evidence"
            title={isEnglish ? 'Application evidence, industry experience, and knowledge' : '用案例、证据和知识建立工程可信度'}
            description={isEnglish ? 'Every major claim should connect to a part, a process condition, or a project result.' : '重要卖点必须落到工件、参数、应用边界和结果上，而不是停留在宽泛口号。'}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {cases.slice(0, 3).map((item) => (
              <LocalizedLink key={item.id} href={`/cases/${item.slug}`} className="rounded-[24px] border border-line bg-white p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{item.industry || (isEnglish ? 'Case Study' : '案例')}</p>
                <h3 className="mt-3 text-xl font-black text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-steel">{item.summary}</p>
              </LocalizedLink>
            ))}
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeader
              eyebrow="Inquiry"
              title={isEnglish ? 'Submit project details for a faster engineering response' : '提交项目条件，进入询盘与寄样测试流程'}
              description={isEnglish ? 'Share parts, materials, output, and current issues. The response workflow records source page, language, and follow-up responsibility.' : '表单会自动带入来源页面和语言，并把联系人、目标需求、附件和后续响应责任记录到询盘流程里。'}
            />
            <div className="rounded-[24px] border border-line bg-white p-6 shadow-card">
              <p className="text-sm leading-7 text-steel">
                {isEnglish
                  ? 'Use this entry for quotation requests, selection support, sample coating tests, and after-sales coordination.'
                  : '该入口覆盖设备配置建议、报价、寄样测试、资料索取和售后支持。'}
              </p>
            </div>
          </div>
          <LeadForm
            locale={locale}
            sourcePage={localizeHref('/', locale)}
            sourceType="homepage"
          />
        </div>
      </section>
    </>
  );
}
