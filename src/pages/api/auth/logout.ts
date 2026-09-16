import type { APIRoute } from 'astro';
import { destroySession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const ALL: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await destroySession(token);
    } catch (e) {
      console.error('Logout error:', e);
    }
  }

  // Clear session cookie
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });

  if (request.headers.get('accept')?.includes('text/html')) {
    return redirect('/login', 302);
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Logged out successfully' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
