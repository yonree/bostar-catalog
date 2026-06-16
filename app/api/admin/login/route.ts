import { NextResponse } from 'next/server';
import { adminAuth, createSessionToken, verifyAdminCredentials } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || '');
  const password = String(body.password || '');

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json({ success: false, message: '账号或密码错误。' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, message: '登录成功。' });
  response.cookies.set(adminAuth.cookieName, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return response;
}
