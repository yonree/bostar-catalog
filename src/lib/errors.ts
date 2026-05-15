export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = '未登录或登录已过期') {
    super('AUTHENTICATION_ERROR', message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = '没有操作权限') {
    super('AUTHORIZATION_ERROR', message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = '资源') {
    super('NOT_FOUND', `${resource}不存在`, 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = '请求过于频繁，请稍后再试') {
    super('RATE_LIMIT', message, 429);
    this.name = 'RateLimitError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = '资源已存在') {
    super('CONFLICT', message, 409);
    this.name = 'ConflictError';
  }
}
