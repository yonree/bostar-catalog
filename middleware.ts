import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getLocaleFromPathname, stripLocalePrefix } from '@/lib/i18n';
import { PRIMARY_SITE_ORIGIN, resolveRedirectHost } from '@/lib/site-origin';

const cookieName = 'bostar_admin_session';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@bostarcoating.com';
const passwordHash =
  process.env.ADMIN_PASSWORD_HASH ||
  'ee70b06a43cd441a573387122b3342995dd3a5363d69122a0f923dc2153ab83e';
const sessionSecret =
  process.env.ADMIN_SESSION_SECRET || 'change-this-session-secret-before-production';

const publicFilePattern = /\.[^/]+$/;

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function shouldCanonicalizeHost(request: NextRequest) {
  return resolveRedirectHost(request.headers.get('host')) !== null;
}

function withRequestHeaders(request: NextRequest) {
  const existingHeaders = request.headers;
  const pathname = existingHeaders.get('x-bostar-pathname') || request.nextUrl.pathname;
  const locale = getLocaleFromPathname(pathname);
  const internalPathname = stripLocalePrefix(pathname);
  const requestHeaders = new Headers(existingHeaders);

  requestHeaders.set('x-bostar-pathname', pathname);
  requestHeaders.set('x-bostar-locale', locale);
  requestHeaders.set('x-bostar-internal-pathname', internalPathname);

  return { locale, internalPathname, requestHeaders };
}

function isPublicFile(pathname: string) {
  return publicFilePattern.test(pathname) || pathname.startsWith('/_next');
}

export async function middleware(request: NextRequest) {
  if (shouldCanonicalizeHost(request)) {
    const redirectUrl = request.nextUrl.clone();
    const primaryOrigin = new URL(PRIMARY_SITE_ORIGIN);
    redirectUrl.protocol = primaryOrigin.protocol;
    redirectUrl.host = resolveRedirectHost(request.headers.get('host')) || primaryOrigin.host;
    redirectUrl.port = '';
    return NextResponse.redirect(redirectUrl, 301);
  }

  const { pathname } = request.nextUrl;
  const { internalPathname, requestHeaders } = withRequestHeaders(request);

  if (isPublicFile(pathname) && internalPathname !== '/api/upload') {
    return NextResponse.next();
  }

  const isAdminPage = internalPathname.startsWith('/admin') && internalPathname !== '/admin/login';
  const isAdminApi =
    internalPathname.startsWith('/api/admin') && internalPathname !== '/api/admin/login';
  const isUploadApi = internalPathname === '/api/upload';

  if (isAdminPage || isAdminApi || isUploadApi) {
    const expected = await sha256(`${adminEmail}:${passwordHash}:${sessionSecret}`);
    const actual = request.cookies.get(cookieName)?.value;

    if (actual !== expected) {
      if (isAdminApi || isUploadApi) {
        return NextResponse.json({ success: false, message: '未登录。' }, { status: 401 });
      }

      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }
  }

  const response =
    pathname === internalPathname
      ? NextResponse.next({ request: { headers: requestHeaders } })
      : NextResponse.rewrite(
          new URL(`${internalPathname}${request.nextUrl.search}`, request.url),
          { request: { headers: requestHeaders } }
        );

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
