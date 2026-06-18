const globalRateLimitState = globalThis as unknown as {
  leadRateLimitStore?: Map<string, { count: number; resetAt: number }>;
};

function getRateLimitStore() {
  if (!globalRateLimitState.leadRateLimitStore) {
    globalRateLimitState.leadRateLimitStore = new Map();
  }

  return globalRateLimitState.leadRateLimitStore;
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
  return forwarded.split(',')[0]?.trim() || 'unknown';
}

export function assertSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (!origin || !host) {
    return true;
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export function consumeRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
) {
  const now = Date.now();
  const store = getRateLimitStore();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: current.resetAt - now };
  }

  current.count += 1;
  return { ok: true, remaining: limit - current.count };
}
