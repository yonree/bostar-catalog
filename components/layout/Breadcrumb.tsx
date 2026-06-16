import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { getLocaleCopy } from '@/lib/locale-copy';
import { getRequestContext } from '@/lib/request-context';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export async function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const { locale } = await getRequestContext();
  const copy = getLocaleCopy(locale);

  return (
    <nav className="mb-6 text-sm text-steel" aria-label="Breadcrumb">
      <LocalizedLink href="/" className="transition-colors hover:text-primary">
        {copy.homeLabel}
      </LocalizedLink>
      {items.map((item) => (
        <span key={`${item.label}-${item.href || 'current'}`}>
          <span className="px-2">/</span>
          {item.href ? (
            <LocalizedLink href={item.href} className="transition-colors hover:text-primary">
              {item.label}
            </LocalizedLink>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
