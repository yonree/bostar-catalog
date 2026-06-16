import Link from 'next/link';
import { getRequestContext } from '@/lib/request-context';
import { getLocaleCopy } from '@/lib/locale-copy';
import { localizeHref } from '@/lib/i18n';

export async function LocaleSwitcher() {
  const { locale, contentPathname } = await getRequestContext();
  const copy = getLocaleCopy(locale);

  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-steel">
      <span className="sr-only">{copy.localeSwitchLabel}</span>
      <Link
        href={localizeHref(contentPathname, 'zh-CN')}
        className={locale === 'zh-CN' ? 'text-ink' : 'transition-colors hover:text-ink'}
      >
        中文
      </Link>
      <span>/</span>
      <Link
        href={localizeHref(contentPathname, 'en')}
        className={locale === 'en' ? 'text-ink' : 'transition-colors hover:text-ink'}
      >
        EN
      </Link>
    </div>
  );
}
