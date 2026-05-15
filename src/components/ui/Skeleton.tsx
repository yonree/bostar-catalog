import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-skeleton bg-neutral-200 rounded-md', className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}
