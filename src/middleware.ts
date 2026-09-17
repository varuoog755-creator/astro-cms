import { defineMiddleware } from 'astro:middleware';
import { getSession, getSessionTokenFromRequest } from './lib/auth/session';

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const token = getSessionTokenFromRequest(context.request);
    const sessionUser = await getSession(token || undefined);

    context.locals.user = sessionUser;

    const { pathname } = context.url;

    // Admin login page bypass
    if (pathname === '/admin/login') {
      if (sessionUser) {
        return context.redirect('/admin');
      }
      return next();
    }

    // Protect admin routes: strictly enforce Super Admin or Administrator role
    if (pathname.startsWith('/admin')) {
      if (!sessionUser) {
        return context.redirect('/admin/login');
      }

      const isAdmin = sessionUser.role === 'Super Admin' || sessionUser.role === 'Administrator';
      if (!isAdmin) {
        return new Response('Unauthorized: Administrator access required.', { status: 403 });
      }
    }

    // Redirect logged-in users away from login/register
    if ((pathname === '/login' || pathname === '/register') && sessionUser) {
      const isAdmin = sessionUser.role === 'Super Admin' || sessionUser.role === 'Administrator';
      return context.redirect(isAdmin ? '/admin' : '/account');
    }

    const response = await next();
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    return response;
  } catch (error) {
    console.error('Middleware execution error:', error);
    return next();
  }
});
