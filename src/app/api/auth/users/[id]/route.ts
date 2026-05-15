import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { AppError, AuthenticationError, AuthorizationError } from '@/lib/errors';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAuthUser(request);
    if (!currentUser) return errorResponse(new AuthenticationError());
    if (!hasPermission(currentUser, 'users:write')) return errorResponse(new AuthorizationError());

    const { id } = await params;
    const body = await request.json();
    const { name, email, password, roleId, status } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (roleId !== undefined) updateData.roleId = roleId;
    if (status !== undefined) updateData.status = status;
    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true, email: true, name: true, status: true, language: true,
        lastLoginAt: true, createdAt: true,
        role: { select: { id: true, name: true, slug: true } },
      },
    });

    return successResponse(updated);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    console.error('User PUT error:', error);
    return internalErrorResponse();
  }
}
