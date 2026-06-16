import { LocalizedLink } from '@/components/routing/LocalizedLink';

type CTAVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type CTASize = 'sm' | 'md' | 'lg';

const variantClasses: Record<CTAVariant, string> = {
  primary:
    'border border-primary bg-primary text-white shadow-[0_14px_36px_rgba(0,82,204,0.18)] hover:bg-primary-dark hover:border-primary-dark',
  secondary:
    'border border-line bg-white text-ink hover:border-primary/30 hover:bg-primary-light/40',
  outline:
    'border border-line bg-white/80 text-ink hover:border-primary/35 hover:bg-primary-light/30',
  ghost:
    'text-steel hover:bg-primary-light/35 hover:text-ink',
};

const sizeClasses: Record<CTASize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-[15px]',
};

export function CTAButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  variant?: CTAVariant;
  size?: CTASize;
  className?: string;
}) {
  return (
    <LocalizedLink
      href={href}
      className={`inline-flex items-center justify-center rounded-full font-semibold tracking-[0.08em] transition-all duration-200 hover:-translate-y-0.5 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </LocalizedLink>
  );
}
