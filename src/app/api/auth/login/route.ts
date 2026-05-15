import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, signToken, setAuthCookie } from '@/lib/auth';
import { loginSchema, validateBody } from '@/lib/validation';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { AppError, AuthenticationError, RateLimitError } from '@/lib/errors';

// Simple in-memory rate limiting
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const attempts = loginAttempts.get(ip);

    if (attempts && attempts.count >= 5 && now < attempts.resetAt) {
      return errorResponse(new RateLimitError('登录尝试次数过多，请15分钟后再试'));
    }

    if (!attempts || now > attempts.resetAt) {
      loginAttempts.set(ip, { count: 0, resetAt: now + 15 * 60 * 1000 });
    }

    const body = await request.json();
    const { email, password } = validateBody(loginSchema, body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || user.status !== 'active') {
      loginAttempts.set(ip, {
        count: (loginAttempts.get(ip)?.count || 0) + 1,
        resetAt: now + 15 * 60 * 1000,
      });
      return errorResponse(new AuthenticationError('邮箱或密码错误'));
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      loginAttempts.set(ip, {
        count: (loginAttempts.get(ip)?.count || 0) + 1,
        resetAt: now + 15 * 60 * 1000,
      });
      return errorResponse(new AuthenticationError('邮箱或密码错误'));
    }

    // Reset attempts on success
    loginAttempts.delete(ip);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role.slug,
    });

    const response = NextResponse.json(
      successResponse({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          language: user.language,
          role: {
            id: user.role.id,
            name: user.role.name,
            slug: user.role.slug,
            permissions: user.role.permissions,
          },
        },
      })
    );

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    console.error('Login error:', error);
    return internalErrorResponse();
  }
}
