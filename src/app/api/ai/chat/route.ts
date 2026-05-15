import { NextRequest } from 'next/server';
import { aiChatSchema, validateBody } from '@/lib/validation';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { AppError, RateLimitError } from '@/lib/errors';
import { chatWithAI } from '@/lib/ai';

// In-memory rate limit: 10 per minute per IP
const rateLimit = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const rl = rateLimit.get(ip);

    if (rl && rl.count >= 10 && now < rl.resetAt) {
      return errorResponse(new RateLimitError('提问频率过高，请稍后再试'));
    }

    if (!rl || now > rl.resetAt) {
      rateLimit.set(ip, { count: 1, resetAt: now + 60000 });
    } else {
      rl.count++;
    }

    const body = await request.json();
    const data = validateBody(aiChatSchema, body);

    const result = await chatWithAI(data);

    return successResponse(result);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    console.error('AI chat error:', error);
    return internalErrorResponse();
  }
}
