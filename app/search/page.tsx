import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { getSearchResults } from '@/lib/cms-data';
import { isEnglishLocale } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

const searchPageCopy = {
  metadata: {
    title: {
      'zh-CN': '站内搜索',
      en: 'Site Search',
    },
    description: {
      'zh-CN': '搜索产品、文章、解决方案和 FAQ。',
      en: 'Search products, articles, solutions, and FAQs across the BOSTAR site.',
    },
  },
  page: {
    'zh-CN': {
      home: '首页',
      current: '搜索',
      title: '站内搜索',
      placeholder: '搜索静电喷枪、上粉率、控制器...',
      button: '搜索',
      emptyQuery: '请输入关键词后再搜索。',
      emptyResults: '没有找到匹配结果，请尝试更换关键词或进入分类页面继续浏览。',
      groups: {
        products: '产品',
        articles: '文章',
        solutions: '方案',
        faq: 'FAQ',
      },
    },
    en: {
      home: 'Home',
      current: 'Search',
      title: 'Site Search',
      placeholder: 'Search spray guns, transfer efficiency, controllers...',
      button: 'Search',
      emptyQuery: 'Enter a keyword to search the site.',
      emptyResults: 'No matching results were found. Try a different keyword or continue from a category page.',
      groups: {
        products: 'Products',
        articles: 'Articles',
        solutions: 'Solutions',
        faq: 'FAQ',
      },
    },
  },
} as const;

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: searchPageCopy.metadata.title,
    description: searchPageCopy.metadata.description,
    robots: {
      index: false,
      follow: false,
    },
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ locale }, { q: rawQuery }] = await Promise.all([getRequestContext(), searchParams]);
  const isEnglish = isEnglishLocale(locale);
  const copy = isEnglish ? searchPageCopy.page.en : searchPageCopy.page['zh-CN'];
  const q = (rawQuery || '').trim();
  const { products, articles, solutions, faqs } = await getSearchResults(q);
  const hasResults = products.length > 0 || articles.length > 0 || solutions.length > 0 || faqs.length > 0;

  return (
    <section className="section">
      <div className="container">
        <h1 className="text-4xl font-black">{copy.title}</h1>
        <form className="mt-6 flex max-w-2xl gap-3">
          <input
            name="q"
            defaultValue={q}
            className="min-w-0 flex-1 rounded border border-line px-4 py-3"
            placeholder={copy.placeholder}
          />
          <button className="rounded bg-primary px-5 py-3 font-bold text-white transition-colors">{copy.button}</button>
        </form>

        {!q ? (
          <p className="mt-10 text-sm text-steel">{copy.emptyQuery}</p>
        ) : !hasResults ? (
          <p className="mt-10 text-sm text-steel">{copy.emptyResults}</p>
        ) : (
          <div className="mt-10 grid gap-8">
            <ResultGroup
              title={copy.groups.products}
              items={products.map((item) => ({
                href: `/products/${item.categorySlug}/${item.slug}`,
                title: item.name,
                desc: item.summary,
              }))}
            />
            <ResultGroup
              title={copy.groups.articles}
              items={articles.map((item) => ({
                href: `/knowledge/${item.categorySlug}/${item.slug}`,
                title: item.title,
                desc: item.excerpt,
              }))}
            />
            <ResultGroup
              title={copy.groups.solutions}
              items={solutions.map((item) => ({
                href: `/solutions/${item.slug}`,
                title: item.title,
                desc: item.aiSummary,
              }))}
            />
            <ResultGroup
              title={copy.groups.faq}
              items={faqs.map((item) => ({ href: '/support/faq', title: item.question, desc: item.answer }))}
            />
          </div>
        )}
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: copy.home, path: '/' },
          { name: copy.current, path: '/search' },
        ]}
      />
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
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-black">{title}</h2>
      <div className="grid gap-3">
        {items.map((item) => (
          <LocalizedLink
            key={`${title}-${item.title}`}
            href={item.href}
            className="card-hover rounded border border-line bg-dark-soft p-5"
          >
            <h3 className="font-black">{item.title}</h3>
            <p className="mt-2 text-sm text-white-soft/50">{item.desc}</p>
          </LocalizedLink>
        ))}
      </div>
    </div>
  );
}
