interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 60,000 = 1 min)
  maxRequests?: number; // Max requests allowed per window (default: 10)
}

export function checkRateLimit(ip: string, actionKey: string, options: RateLimitOptions = {}): { allowed: boolean; remaining: number } {
  const windowMs = options.windowMs || 60000;
  const maxRequests = options.maxRequests || 10;
  const key = `${actionKey}:${ip || 'unknown'}`;
  const now = Date.now();

  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  rateLimitMap.set(key, record);
  return { allowed: true, remaining: maxRequests - record.count };
}
