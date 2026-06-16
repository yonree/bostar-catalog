import type { Locale } from '@/lib/i18n';
import type { SiteSettings } from '@/lib/site-settings';

const englishSiteDescription =
  'BOSTAR industrial coating equipment, electrostatic spray systems, product resources, and engineering inquiry entry points.';

export function getLocalizedSiteDescription(locale: Locale, site: SiteSettings) {
  return locale === 'en' ? englishSiteDescription : site.description;
}

export function getEnglishSiteDescription() {
  return englishSiteDescription;
}
