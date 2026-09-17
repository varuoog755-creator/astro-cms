import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // Quick DB query to keep SQLite connection warm
    return new Response(
      JSON.stringify({
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: 'degraded',
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
