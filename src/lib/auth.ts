import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
import { AuthenticationError, AuthorizationError, AppError } from './errors';
import { errorResponse, internalErrorResponse } from './response';
import { verifyToken } from './jwt';
import type { AuthUser } from '@/types';
import type { Permission, RoleSlug } from '@/lib/constants';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = 86400; // 24 hours in seconds

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export { verifyToken } from './jwt';

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token =
      request.cookies.get('bostar_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user || user.status !== 'active') return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.slug as RoleSlug,
      permissions: (user.role.permissions as Permission[]) || [],
    };
  } catch {
    return null;
  }
}

export function hasPermission(user: AuthUser, permission: Permission): boolean {
  if (user.role === 'super_admin') return true;
  return user.permissions.includes(permission);
}

export function requirePermission(permission: Permission) {
  return function (handler: Function) {
    return async function (request: NextRequest, context?: unknown) {
      try {
        const user = await getAuthUser(request);
        if (!user) {
          return errorResponse(new AuthenticationError());
        }
        if (!hasPermission(user, permission)) {
          return errorResponse(new AuthorizationError());
        }
        ;(request as any).user = user;
        return handler(request, context);
      } catch (error) {
        if (error instanceof AppError) return errorResponse(error);
        return internalErrorResponse();
      }
    };
  };
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('bostar_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set('bostar_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}
