import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const cookieName = 'bostar_admin_session';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@bostarcoating.com';
const passwordHash =
  process.env.ADMIN_PASSWORD_HASH ||
  'ee70b06a43cd441a573387122b3342995dd3a5363d69122a0f923dc2153ab83e';
const sessionSecret =
  process.env.ADMIN_SESSION_SECRET || 'change-this-session-secret-before-production';

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin') && pathname !== '/api/admin/login';
  const isUploadApi = pathname === '/api/upload';

  if (isAdminPage || isAdminApi || isUploadApi) {
    const expected = await sha256(`${adminEmail}:${passwordHash}:${sessionSecret}`);
    const actual = request.cookies.get(cookieName)?.value;

    if (actual !== expected) {
      if (isAdminApi || isUploadApi) {
        return NextResponse.json({ success: false, message: '未登录。' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/upload'],
};
