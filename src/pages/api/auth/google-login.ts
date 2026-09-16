import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { createSession, hashPassword, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const email = body.email?.toString().trim().toLowerCase() || '';
    const displayName = body.displayName?.toString().trim() || 'Customer';
    const avatar = body.avatar?.toString().trim() || null;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required for Google login.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: email.split('@')[0] },
        ],
      },
    });

    if (!user) {
      // Find or create customer subscriber role
      let role = await prisma.role.findFirst({
        where: {
          OR: [{ slug: 'subscriber' }, { slug: 'customer' }, { name: 'Subscriber' }],
        },
      });

      if (!role) {
        role = await prisma.role.create({
          data: {
            name: 'Subscriber',
            slug: 'subscriber',
            description: 'Registered Store Customer',
            isSystem: false,
          },
        });
      }

      const randomPassword = Math.random().toString(36).substring(2, 14);
      const passwordHash = await hashPassword(randomPassword);
      const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
      const uniqueUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

      user = await prisma.user.create({
        data: {
          email: email,
          username: uniqueUsername,
          passwordHash,
          displayName: displayName,
          avatar: avatar,
          roleId: role.id,
          status: 'active',
          bio: 'Registered via Google Sign-In',
        },
      });
    }

    if (user.status === 'suspended') {
      return new Response(JSON.stringify({ error: 'Account is suspended.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = await createSession(
      user.id,
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    cookies.set(SESSION_COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    await logAudit({
      userId: user.id,
      action: 'auth.google_login',
      entity: 'User',
      entityId: user.id,
      metadata: { email: email },
    });

    return new Response(JSON.stringify({ success: true, redirect: '/' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Google login API error:', err);
    return new Response(JSON.stringify({ error: 'Server error during Google login.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
