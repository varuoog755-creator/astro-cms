import { defineMiddleware } from 'astro:middleware';
import { getSession, getSessionTokenFromRequest } from './lib/auth/session';

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const token = getSessionTokenFromRequest(context.request);
    const sessionUser = await getSession(token || undefined);

    context.locals.user = sessionUser;

    const { pathname } = context.url;

    // Determine if the current session belongs to Super Admin Govinda
    const isMasterAdmin =
      !!sessionUser &&
      (sessionUser.email?.toLowerCase() === 'govinda755rock755@gmail.com' ||
        sessionUser.username?.toLowerCase() === 'govinda755') &&
      sessionUser.role === 'Super Admin';

    // Admin login page bypass
    if (pathname === '/admin/login') {
      if (isMasterAdmin) {
        return context.redirect('/admin');
      } else if (sessionUser) {
        // Logged-in customers or non-admins are sent to customer account, never admin
        return context.redirect('/account');
      }
      return next();
    }

    // Protect all admin routes and admin APIs: strictly allow ONLY govinda755rock755@gmail.com
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (!sessionUser) {
        if (pathname.startsWith('/api/admin')) {
          return new Response(JSON.stringify({ error: 'Unauthorized: Admin authentication required.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return context.redirect('/admin/login');
      }

      if (!isMasterAdmin) {
        if (pathname.startsWith('/api/admin')) {
          return new Response(
            JSON.stringify({ error: 'Forbidden: Access restricted strictly to Super Admin Govinda (govinda755rock755@gmail.com).' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
        // Customers attempting to open /admin are safely redirected to /account
        return context.redirect('/account?error=Admin%20access%20is%20restricted%20solely%20to%20Super%20Admin%20Govinda.');
      }
    }

    // Redirect logged-in users away from login/register
    if ((pathname === '/login' || pathname === '/register') && sessionUser) {
      return context.redirect(isMasterAdmin ? '/admin' : '/account');
    }

    const response = await next();
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    return response;
  } catch (error) {
    console.error('Middleware execution error:', error);
    return next();
  }
});
