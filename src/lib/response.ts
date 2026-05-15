import { NextResponse } from 'next/server';
import { AppError } from './errors';

interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function successResponse<T>(data: T, meta?: SuccessResponse<T>['meta']) {
  const body: SuccessResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body);
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  return successResponse(data, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}

export function errorResponse(error: AppError) {
  const body: ErrorResponse = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
    },
  };
  if (error.details) {
    body.error.details = error.details;
  }
  return NextResponse.json(body, { status: error.statusCode });
}

export function internalErrorResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误',
      },
    },
    { status: 500 }
  );
}
