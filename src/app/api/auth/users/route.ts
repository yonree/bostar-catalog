import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { AppError, AuthenticationError, AuthorizationError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'users:read')) return errorResponse(new AuthorizationError());

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        language: true,
        lastLoginAt: true,
        createdAt: true,
        role: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(users);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getAuthUser(request);
    if (!currentUser) return errorResponse(new AuthenticationError());
    if (!hasPermission(currentUser, 'users:write')) return errorResponse(new AuthorizationError());

    const body = await request.json();
    const { name, email, password, roleId, status } = body;

    if (!name || !email || !password || !roleId) {
      return errorResponse(new AppError('MISSING_FIELDS', '请填写所有必填字段', 400));
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse(new AppError('EMAIL_EXISTS', '该邮箱已被使用', 409));
    }

    const passwordHash = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: { name, email, passwordHash, roleId, status: status || 'active' },
      select: {
        id: true, email: true, name: true, status: true, language: true,
        lastLoginAt: true, createdAt: true,
        role: { select: { id: true, name: true, slug: true } },
      },
    });

    return successResponse(newUser);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    console.error('Users POST error:', error);
    return internalErrorResponse();
  }
}
