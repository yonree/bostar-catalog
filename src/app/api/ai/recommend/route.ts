import { NextRequest } from 'next/server';
import { aiRecommendSchema, validateBody } from '@/lib/validation';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { AppError } from '@/lib/errors';
import { recommendProductsGPT } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = validateBody(aiRecommendSchema, body);

    const result = await recommendProductsGPT(data);

    return successResponse(result);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalErrorResponse();
  }
}
