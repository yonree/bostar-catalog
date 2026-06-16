import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-6 text-sm text-steel" aria-label="面包屑">
      <Link href="/" className="transition-colors hover:text-primary">
        首页
      </Link>
      {items.map((item) => (
        <span key={`${item.label}-${item.href || 'current'}`}>
          <span className="px-2">/</span>
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
