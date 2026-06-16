export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <section className="section">
      <div className="container max-w-4xl">
        <div className="rounded-[28px] border border-line bg-white p-10 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">News Placeholder</p>
          <h1 className="mt-3 text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">
            新闻详情：{slug}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-steel">
            该路由用于后续接入新闻内容管理。当前页面已调整为与全站一致的浅色内容页结构。
          </p>
        </div>
      </div>
    </section>
  );
}
