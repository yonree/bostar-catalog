import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: '新闻动态',
  description: '博士达品牌新闻、产品更新和行业动态。',
};

export default function NewsPage() {
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: '新闻动态' }]} />
        <BreadcrumbJsonLd
          items={[
            { name: '首页', path: '/' },
            { name: '新闻', path: '/news' },
          ]}
        />
        <SectionHeader headingLevel="h1" title="新闻动态" description="预留品牌新闻、产品更新和行业活动内容入口。" />
      </div>
    </section>
  );
}
