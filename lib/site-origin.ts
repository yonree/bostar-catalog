export const PRIMARY_SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fjbosd.com';

export const PRIMARY_SITE_HOST = 'www.fjbosd.com';

export const LEGACY_REDIRECT_HOSTS = new Set([
  'fjbosd.com',
  'www.bostarcoating.com',
  'bostarcoating.com',
]);

export function normalizeHostHeader(host: string | null | undefined) {
  return (host || '').split(':')[0].trim().toLowerCase();
}

export function resolveRedirectHost(host: string | null | undefined) {
  const normalized = normalizeHostHeader(host);
  return LEGACY_REDIRECT_HOSTS.has(normalized) ? PRIMARY_SITE_HOST : null;
}

export function isPendingDownloadAsset(fileUrl: string | null | undefined) {
  if (!fileUrl) return false;

  try {
    const pathname = new URL(fileUrl, PRIMARY_SITE_ORIGIN).pathname;
    return pathname === '/sample-download.pdf';
  } catch {
    return false;
  }
}
