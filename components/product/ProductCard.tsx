import Image from 'next/image';
import Link from 'next/link';
import type { ProductView } from '@/lib/cms-data';
import { Badge } from '@/components/ui/Badge';

export function ProductCard({ product }: { product: ProductView }) {
  return (
    <article className="card-hover group overflow-hidden rounded-[28px] border border-line bg-white shadow-card">
      <Link href={`/products/${product.categorySlug}/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(180deg,#FFFFFF,#F8F9FA)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-8 transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="space-y-4 p-7">
          <div className="flex items-center justify-between gap-4">
            <Badge variant="default">{product.model}</Badge>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel">Precision Unit</span>
          </div>
          <h3 className="text-2xl font-black text-ink">{product.name}</h3>
          <p className="text-sm leading-7 text-steel line-clamp-3">{product.summary || product.aiSummary}</p>
        </div>
      </Link>
    </article>
  );
}
