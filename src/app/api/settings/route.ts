import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import { AppError, AuthenticationError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());

    const settings = await prisma.systemSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;

    return successResponse(map);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!user.permissions.includes('settings:write') && user.role !== 'super_admin') {
      return errorResponse(new AppError('FORBIDDEN', '没有操作权限', 403));
    }

    const body = await request.json();
    const { settings } = body as { settings: { key: string; value: string }[] };

    for (const { key, value } of settings) {
      await prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    return successResponse({ updated: true });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
