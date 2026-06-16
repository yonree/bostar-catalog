import Link from 'next/link';
import type { ReactNode } from 'react';
import { getLocalizedHref } from '@/lib/request-context';

type LocalizedLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  prefetch?: boolean;
};

export async function LocalizedLink({
  href,
  className,
  children,
  prefetch,
}: LocalizedLinkProps) {
  const localizedHref = await getLocalizedHref(href);

  return (
    <Link href={localizedHref} className={className} prefetch={prefetch}>
      {children}
    </Link>
  );
}
