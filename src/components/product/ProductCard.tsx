import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <Card hoverable className="h-full flex flex-col">
        <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
          {product.mainImage ? (
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="text-sm font-medium text-neutral-800 line-clamp-2">{product.name}</h3>
          {product.model && (
            <p className="text-xs text-neutral-400 mt-1">{product.model}</p>
          )}
          {product.tagline && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2 flex-1">{product.tagline}</p>
          )}
          <div className="flex items-center gap-1 mt-2">
            {product.isFeatured && <Badge variant="brand">推荐</Badge>}
            <span className="text-xs text-neutral-400 ml-auto">{product.productType === 'system' ? '系统方案' : '产品'}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
