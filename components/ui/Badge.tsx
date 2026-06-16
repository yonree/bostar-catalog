export function Badge({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline' | 'orange';
  className?: string;
}) {
  const base = 'inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]';

  const variants: Record<string, string> = {
    default: 'bg-primary-light text-primary',
    filled: 'bg-primary text-white',
    outline: 'border border-line bg-white/70 text-steel',
    orange: 'border border-primary/20 bg-primary-light text-primary',
  };

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}
