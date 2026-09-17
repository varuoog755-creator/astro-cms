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

  try {
    const formData = await request.formData();
    const login = formData.get('login')?.toString().trim() || '';
    const password = formData.get('password')?.toString().trim() || '';

    if (!login || !password) {
      return errorRedirect('Please fill in all fields.');
    }

    const cleanLogin = login.toLowerCase();

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanLogin },
          { username: cleanLogin },
          { email: login },
          { username: login },
        ],
      },
    });

    if (!user) {
      return errorRedirect('Invalid email/username or password.');
    }

    if (user.status === 'suspended') {
      return errorRedirect('Account is suspended. Please contact admin.');
    }

    const validPassword = await verifyPassword(password, user.passwordHash);

    if (!validPassword) {
      return errorRedirect('Invalid email/username or password.');
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
    const targetRedirect = url.searchParams.get('redirect') || (user.roleId ? '/admin' : '/products');

    return redirect(targetRedirect);
  } catch (err: any) {
    console.error('Login error:', err);
    return errorRedirect('An unexpected error occurred.');
  }
};
