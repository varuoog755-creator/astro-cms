import type { APIRoute } from 'astro';
import prisma from '../../lib/db';

export const GET: APIRoute = async () => {
  try {
    // Quick DB query to keep SQLite connection warm
    const userCount = await prisma.user.count();

    return new Response(
      JSON.stringify({
        status: 'healthy',
        database: 'connected',
        users: userCount,
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
