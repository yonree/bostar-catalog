import { NextRequest } from 'next/server';
import { getAuthUser, hasPermission } from '@/lib/auth';
import { successResponse, errorResponse, internalErrorResponse } from '@/lib/response';
import { AppError, AuthenticationError, AuthorizationError } from '@/lib/errors';
import { uploadFile, validateFileType } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse(new AuthenticationError());
    if (!hasPermission(user, 'images:write') && !hasPermission(user, 'documents:write') && !hasPermission(user, 'products:write'))
      return errorResponse(new AuthorizationError());

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = (formData.get('type') as string) || 'image';

    if (!file) {
      return errorResponse(new AppError('NO_FILE', '请选择文件', 400));
    }

    if (!validateFileType(file, type as 'image' | 'video' | 'document')) {
      return errorResponse(new AppError('INVALID_TYPE', '不支持的文件格式', 400));
    }

    const result = await uploadFile(file, type + 's');

    return successResponse(result);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    console.error('Upload error:', error);
    return internalErrorResponse();
  }
}
