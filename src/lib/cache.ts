// High-Performance In-Memory Cache with TTL & Invalidation
type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const store = new Map<string, CacheEntry<any>>();

/**
 * Get an item from memory cache or compute and store it if expired or missing.
 * @param key Unique cache key
 * @param ttlSeconds Time-to-live in seconds
 * @param fn Async factory function to fetch fresh data
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = store.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  try {
    const fresh = await fn();
    store.set(key, {
      data: fresh,
      expiresAt: now + ttlSeconds * 1000,
    });
    return fresh;
  } catch (err) {
    // If fresh fetch fails but stale data exists, return stale data as fallback
    if (cached) {
      console.warn(`[Cache] Fallback to stale data for key: ${key}`);
      return cached.data as T;
    }
    throw err;
  }
}

/**
 * Invalidate a specific cache key or all keys matching a prefix.
 */
export function invalidateCache(keyOrPrefix?: string): void {
  if (!keyOrPrefix) {
    store.clear();
    return;
  }
  for (const k of store.keys()) {
    if (k === keyOrPrefix || k.startsWith(keyOrPrefix)) {
      store.delete(k);
    }
  }
}
