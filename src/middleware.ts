import { defineMiddleware } from 'astro:middleware';
import { getSession, getSessionTokenFromRequest } from './lib/auth/session';

export const onRequest = defineMiddleware(async (context, next) => {
  const token = getSessionTokenFromRequest(context.request);
  const sessionUser = await getSession(token || undefined);

  context.locals.user = sessionUser;

  const { pathname } = context.url;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!sessionUser) {
      return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
    }

    // Require subscriber+ or specific roles
    if (sessionUser.status === 'suspended') {
      return new Response('Account suspended.', { status: 403 });
    }
  }

  // Redirect logged-in users away from login/register
  if ((pathname === '/login' || pathname === '/register') && sessionUser) {
    return context.redirect('/admin');
  }

  return next();
});
