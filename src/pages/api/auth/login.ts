import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { createSession, SESSION_COOKIE_NAME, verifyPassword } from '../../../lib/auth/session';
import { logAudit } from '../../../lib/utilities/audit';
import { checkRateLimit } from '../../../lib/utilities/rateLimit';

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const referer = request.headers.get('referer') || '';
  const isAdminLogin = referer.includes('/admin/login');
  const errorRedirect = (msg: string) => redirect(`${isAdminLogin ? '/admin/login' : '/login'}?error=${encodeURIComponent(msg)}`);

  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const { allowed } = checkRateLimit(clientIp, 'login', { maxRequests: 5, windowMs: 60000 });
  if (!allowed) {
    return errorRedirect('Too many login attempts. Please wait 1 minute before trying again.');
  }

  let isAdmin = isAdminLogin;
  let targetErrorRedirect = errorRedirect;

  try {
    const formData = await request.formData();
    if (formData.get('isAdminPortal') === 'true') {
      isAdmin = true;
      targetErrorRedirect = (msg: string) => redirect(`/admin/login?error=${encodeURIComponent(msg)}`);
    }

    const login = formData.get('login')?.toString().trim() || '';
    const password = formData.get('password')?.toString().trim() || '';

    if (!login || !password) {
      return targetErrorRedirect('Please fill in all fields.');
    }

    const cleanLogin = login.toLowerCase();
    const isMasterAdminLogin = cleanLogin === 'govinda755rock755@gmail.com' || cleanLogin === 'govinda755';

    // If logging in from the Admin login portal, strictly allow only authorized Super Admin
    if (isAdmin && !isMasterAdminLogin) {
      return targetErrorRedirect('Invalid email/username or password.');
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanLogin },
          { username: cleanLogin },
          { email: login },
          { username: login },
        ],
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return targetErrorRedirect('Invalid email/username or password.');
    }

    if (isAdmin && user.role?.name !== 'Super Admin') {
      return targetErrorRedirect('Invalid email/username or password.');
    }

    if (user.status === 'suspended') {
      return targetErrorRedirect('Account is suspended. Please contact admin.');
    }

    const validPassword = await verifyPassword(password, user.passwordHash);

    if (!validPassword) {
      return targetErrorRedirect('Invalid email/username or password.');
    }

    const token = await createSession(user.id, request.headers.get('x-forwarded-for') || undefined, request.headers.get('user-agent') || undefined);

    cookies.set(SESSION_COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    await logAudit({
      userId: user.id,
      action: 'auth.login',
      entity: 'User',
      entityId: user.id,
      metadata: { username: user.username },
    });

    const url = new URL(request.url);
    const isMasterAdmin =
      (user.email?.toLowerCase() === 'govinda755rock755@gmail.com' ||
        user.username?.toLowerCase() === 'govinda755') &&
      user.role?.name === 'Super Admin';

    let targetRedirect = url.searchParams.get('redirect');
    if (isMasterAdmin) {
      targetRedirect = targetRedirect || '/admin';
    } else {
      // Non-admins and customers always redirect to /account or /products, never /admin
      if (!targetRedirect || targetRedirect.startsWith('/admin')) {
        targetRedirect = '/account';
      }
    }

    return redirect(targetRedirect);
  } catch (err: any) {
    console.error('Login error:', err);
    const isDbError = err?.message?.includes('database') || err?.message?.includes('reach') || err?.code?.startsWith?.('P');
    const msg = isDbError
      ? 'Database connection error. Please try again in a few moments.'
      : 'An unexpected error occurred. Please try again.';
    return targetErrorRedirect(msg);
  }
};
