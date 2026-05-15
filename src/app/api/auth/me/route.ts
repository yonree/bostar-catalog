import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { AppError, AuthenticationError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return errorResponse(new AuthenticationError());
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: { role: true },
    });

    if (!user) {
      return errorResponse(new AuthenticationError());
    }

    return successResponse({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      language: user.language,
      status: user.status,
      role: {
        id: user.role.id,
        name: user.role.name,
        slug: user.role.slug,
        permissions: user.role.permissions,
      },
    });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return errorResponse(new AppError('INTERNAL_ERROR', '获取用户信息失败', 500));
  }
}
