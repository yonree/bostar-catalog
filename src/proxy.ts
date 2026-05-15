import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

const ADMIN_PATHS = ['/admin'];
const PUBLIC_API_PATHS = ['/api/events', '/api/inquiries', '/api/ai', '/api/categories', '/api/products', '/api/salespersons/', '/api/settings/public'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Salesperson tracking cookie injection
  const salesRef = request.cookies.get('bostar_ref')?.value;
  if (salesRef) {
    response.headers.set('x-salesperson-slug', salesRef);
  }

  // Generate visitor ID if not present
  if (!request.cookies.get('bostar_visitor')) {
    const visitorId = crypto.randomUUID();
    response.cookies.set('bostar_visitor', visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
  }

  // CORS headers for public APIs
  const isPublicApi = PUBLIC_API_PATHS.some(p => pathname.startsWith(p));
  if (isPublicApi && request.method !== 'GET') {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Handle OPTIONS preflight for public APIs
  if (isPublicApi && request.method === 'OPTIONS') {
    const preflight = NextResponse.json({}, { status: 204 });
    preflight.headers.set('Access-Control-Allow-Origin', '*');
    preflight.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    preflight.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return preflight;
  }

  // Protect admin routes (except login)
  const isAdminPath = ADMIN_PATHS.some(p => pathname.startsWith(p));
  if (isAdminPath && !pathname.startsWith('/admin/login')) {
    const token =
      request.cookies.get('bostar_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    const decoded = token ? verifyToken(token) : null;
    if (!decoded) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
