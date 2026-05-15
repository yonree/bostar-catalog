import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { AppError } from '@/lib/errors';

const PUBLIC_KEYS = ['site_name', 'site_name_en', 'company_name', 'company_name_en', 'contact_phone', 'contact_email', 'contact_address', 'contact_address_en', 'ai_enabled'];

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: { key: { in: PUBLIC_KEYS } },
    });

    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;

    return successResponse(map);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
