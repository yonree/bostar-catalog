import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { LeadForm } from '@/components/lead/LeadForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { isEnglishLocale, localizeHref, pickLocaleValue } from '@/lib/i18n';
import { createResolvedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

const zhCopy = {
  titlePrefix: '\u65b0\u95fb\u5360\u4f4d\uff1a',
  newsLabel: '\u65b0\u95fb',
  pageTitle: '\u65b0\u95fb\u8be6\u60c5\u5360\u4f4d',
  summary:
    '\u8be5\u8def\u7531\u4e3a\u5df2\u6279\u51c6\u7684\u65b0\u95fb\u5185\u5bb9\u9884\u7559\u3002\u5f53\u524d\u672c\u5730\u4ed3\u5e93\u672a\u63d0\u4f9b\u8fd9\u4e2a slug \u7684\u53ef\u9a8c\u8bc1\u6587\u7ae0\u6b63\u6587\uff0c\u56e0\u6b64\u9875\u9762\u4fdd\u6301\u4e3a\u4e0d\u7d22\u5f15\u7684\u5360\u4f4d\u9875\u3002',
  statusTitle: '\u5f53\u524d\u72b6\u6001',
  statusDescription:
    '\u5360\u4f4d\u9875\u4fdd\u7559\u8def\u7531\uff0c\u4f46\u4e0d\u53d1\u5e03\u672a\u7ecf\u9a8c\u8bc1\u7684\u65b0\u95fb\u5185\u5bb9\u3002',
  statusLines: [
    '\u5f53\u524d\u672c\u5730\u6570\u636e\u96c6\u4e2d\u6ca1\u6709\u8fd9\u4e2a\u65b0\u95fb\u8def\u7531\u7684\u53ef\u9a8c\u8bc1\u6587\u7ae0\u6765\u6e90\u3002',
    '\u8def\u7531\u3001\u8bed\u8a00\u5916\u58f3\u3001canonical \u548c hreflang \u884c\u4e3a\u4ecd\u5df2\u4fdd\u7559\uff0c\u4fbf\u4e8e\u540e\u7eed\u63a5\u5165\u5df2\u6279\u51c6\u5185\u5bb9\u3002',
    '\u5982\u679c\u8fd9\u4e2a slug \u5b9e\u9645\u5e94\u5f53\u5bf9\u5e94\u4ea7\u54c1\u3001\u6848\u4f8b\u6216\u652f\u6301\u6587\u7ae0\uff0c\u8bf7\u901a\u8fc7\u8868\u5355\u53cd\u9988\u3002',
  ],
  ctaTitle: '\u786e\u8ba4\u8fd9\u4e2a\u65b0\u95fb\u8def\u7531',
  ctaDescription:
    '\u8bf7\u63d0\u4ea4\u8fd9\u4e2a slug \u5bf9\u5e94\u7684\u6587\u7ae0\u4e3b\u9898\u3001\u53d1\u5e03\u72b6\u6001\u6216\u6b63\u786e\u53bb\u5411\u3002',
  routeSlugLabel: '\u8def\u7531 Slug',
  homeLabel: '\u9996\u9875',
  placeholderLabel: '\u65b0\u95fb\u5360\u4f4d',
  metadataDescription:
    '\u9884\u7559\u65b0\u95fb\u8be6\u60c5\u8def\u7531\uff0c\u5f53\u524d\u672c\u5730\u6570\u636e\u6e90\u4e2d\u5c1a\u672a\u53d1\u5e03\u53ef\u9a8c\u8bc1\u7684\u65b0\u95fb\u5185\u5bb9\u3002',
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const isEnglish = isEnglishLocale(locale);

  return createResolvedPageMetadata({
    title: isEnglish ? `${slug} News Placeholder` : `${zhCopy.titlePrefix}${slug}`,
    description: isEnglish
      ? 'Reserved news detail route. Verified source article content is not published in the current local data source.'
      : zhCopy.metadataDescription,
    robots: {
      index: false,
      follow: false,
    },
  });
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const isEnglish = isEnglishLocale(locale);
  const newsLabel = pickLocaleValue(locale, { 'zh-CN': zhCopy.newsLabel, en: 'News' });
  const title = isEnglish ? 'News Detail Placeholder' : zhCopy.pageTitle;
  const summary = isEnglish
    ? 'This route is retained for approved news content. The current local repository does not provide a verified article body for this slug, so the page stays as a non-indexed placeholder.'
    : zhCopy.summary;
  const statusTitle = isEnglish ? 'Current Status' : zhCopy.statusTitle;
  const statusDescription = isEnglish
    ? 'This placeholder remains available without publishing unverified content.'
    : zhCopy.statusDescription;
  const statusLines = isEnglish
    ? [
        'No verified news article source is available in the current local dataset.',
        'Route, locale shell, canonical, and hreflang behavior remain available for later content activation.',
        'Use the inquiry form if this slug should map to a released product, case, or support article instead.',
      ]
    : zhCopy.statusLines;
  const ctaTitle = isEnglish ? 'Clarify This News Route' : zhCopy.ctaTitle;
  const ctaDescription = isEnglish
    ? 'Share the expected article topic, publish status, or the correct destination for this slug.'
    : zhCopy.ctaDescription;

  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Breadcrumb items={[{ label: newsLabel, href: '/news' }, { label: slug }]} />
          <BreadcrumbJsonLd
            items={[
              { name: pickLocaleValue(locale, { 'zh-CN': zhCopy.homeLabel, en: 'Home' }), path: '/' },
              { name: newsLabel, path: '/news' },
              { name: slug, path: `/news/${slug}` },
            ]}
          />
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {isEnglish ? 'News Placeholder' : zhCopy.placeholderLabel}
          </p>
          <h1 className="max-w-3xl text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-steel">{summary}</p>

          <div className="mt-8 rounded-[24px] border border-primary/20 bg-primary-light/35 p-6">
            <SectionHeader title={statusTitle} description={statusDescription} />
            <div className="-mt-4 space-y-3 text-steel">
              {statusLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-line bg-white p-6 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-steel">
              {isEnglish ? 'Route Slug' : zhCopy.routeSlugLabel}
            </p>
            <code className="mt-3 block overflow-x-auto rounded-[16px] bg-dark-soft px-4 py-3 text-sm text-white-soft">
              {slug}
            </code>
          </div>
        </div>

        <div>
          <div className="rounded-[24px] border border-line bg-white p-6 shadow-card">
            <SectionHeader title={ctaTitle} description={ctaDescription} />
            <LeadForm locale={locale} sourcePage={localizeHref(`/news/${slug}`, locale)} />
          </div>
        </div>
      </div>
    </section>
  );
}
