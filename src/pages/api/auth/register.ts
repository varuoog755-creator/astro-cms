import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { hashPassword, createSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  try {
    const formData = await request.formData();
    const displayName = formData.get('displayName')?.toString().trim();
    const username = formData.get('username')?.toString().trim().toLowerCase();
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const password = formData.get('password')?.toString();

    if (!displayName || !username || !email || !password) {
      return redirect('/register?error=Please fill in all required fields.');
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return redirect('/register?error=Username or email already exists.');
    }

    const subscriberRole = await prisma.role.findUnique({
      where: { slug: 'subscriber' },
    });

    if (!subscriberRole) {
      return redirect('/register?error=Default role missing. Please run database seed.');
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        displayName,
        username,
        email,
        passwordHash,
        roleId: subscriberRole.id,
      },
    });

    const token = await createSession(newUser.id, request.headers.get('x-forwarded-for') || undefined, request.headers.get('user-agent') || undefined);

    cookies.set(SESSION_COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    await logAudit({
      userId: newUser.id,
      action: 'auth.register',
      entity: 'User',
      entityId: newUser.id,
    });

    return redirect('/products?registered=true');
  } catch (err: any) {
    console.error('Registration error:', err);
    return redirect('/register?error=Registration failed.');
  }
};
