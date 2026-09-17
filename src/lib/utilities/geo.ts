// In-memory cache for IP geo resolutions
const geoCache = new Map<string, { city: string; state: string; country: string; locationStr: string }>();

export async function resolveGeoLocation(ipAddress?: string | null, headers?: Headers | Record<string, string | null>): Promise<{
  city: string;
  state: string;
  country: string;
  locationStr: string;
}> {
  // 1. Check Cloudflare / CDN headers
  if (headers) {
    const getH = (k: string) => {
      if (typeof (headers as Headers).get === 'function') {
        return (headers as Headers).get(k);
      }
      return (headers as any)[k] || (headers as any)[k.toLowerCase()] || null;
    };

    const cfCity = getH('cf-ipcity');
    const cfRegion = getH('cf-region') || getH('cf-region-code');
    const cfCountry = getH('cf-ipcountry') || 'IN';

    if (cfCity || cfRegion) {
      const city = cfCity || 'Local';
      const state = cfRegion || '';
      const country = cfCountry || 'India';
      const locationStr = state ? `${city}, ${state}` : `${city}, ${country}`;
      return { city, state, country, locationStr };
    }
  }

  const rawIp = (ipAddress || '').split(',')[0].trim();
  if (!rawIp || rawIp === '127.0.0.1' || rawIp === '::1' || rawIp.startsWith('192.168.') || rawIp.startsWith('10.')) {
    return {
      city: 'Panipat',
      state: 'Haryana',
      country: 'India',
      locationStr: 'Panipat, Haryana (HQ)'
    };
  }

  // 2. Check memory cache
  if (geoCache.has(rawIp)) {
    return geoCache.get(rawIp)!;
  }

  // 3. Fallback external lookup with 2.5s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`http://ip-api.com/json/${rawIp}?fields=status,city,regionName,country`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success') {
        const city = data.city || 'Unknown';
        const state = data.regionName || '';
        const country = data.country || 'India';
        const locationStr = state ? `${city}, ${state}` : `${city}, ${country}`;

        const result = { city, state, country, locationStr };
        geoCache.set(rawIp, result);
        return result;
      }
    }
  } catch (e) {
    // Timeout or network glitch
  }

  const fallback = {
    city: 'India',
    state: '',
    country: 'India',
    locationStr: 'India'
  };
  geoCache.set(rawIp, fallback);
  return fallback;
}
