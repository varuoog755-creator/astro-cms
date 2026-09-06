import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { createSession, SESSION_COOKIE_NAME, verifyPassword } from '../../../lib/auth/session';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  try {
    const formData = await request.formData();
    const login = formData.get('login')?.toString().trim();
    const password = formData.get('password')?.toString();

    if (!login || !password) {
      return redirect('/login?error=Please fill in all fields.');
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    });

    if (!user) {
      return redirect('/login?error=Invalid email/username or password.');
    }

    if (user.status === 'suspended') {
      return redirect('/login?error=Account is suspended. Please contact admin.');
    }

    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return redirect('/login?error=Invalid email/username or password.');
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
    return redirect('/login?error=An unexpected error occurred.');
  }
};
