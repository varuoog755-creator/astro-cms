import type { APIRoute } from 'astro';
import { destroySession, getSessionTokenFromRequest, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, redirect, cookies, locals }) => {
  const token = getSessionTokenFromRequest(request);
  if (token) {
    if (locals.user) {
      await logAudit({
        userId: locals.user.userId,
        action: 'auth.logout',
        entity: 'User',
        entityId: locals.user.userId,
      });
    }
    await destroySession(token);
  }

  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
  return redirect('/login');
};
