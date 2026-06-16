import type { ArticleView } from '@/lib/cms-data';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { Badge } from '@/components/ui/Badge';

export function ArticleCard({ article }: { article: ArticleView }) {
  return (
    <article className="card-hover rounded-[26px] border border-line bg-white p-7 shadow-card">
      <Badge variant="outline">Knowledge</Badge>
      <h3 className="mt-5 text-2xl font-black text-ink">
        <LocalizedLink
          href={`/knowledge/${article.categorySlug}/${article.slug}`}
          className="transition-colors hover:text-primary"
        >
          {article.title}
        </LocalizedLink>
      </h3>
      <p className="mt-4 text-sm leading-7 text-steel">{article.excerpt}</p>
    </article>
  );
}
