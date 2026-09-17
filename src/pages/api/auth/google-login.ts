import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { createSession, hashPassword, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const idToken = body.idToken || body.credential || body.token;
    const email = body.email?.toString().trim().toLowerCase() || '';
    const displayName = body.displayName?.toString().trim() || 'Customer';
    const avatar = body.avatar?.toString().trim() || null;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required for Google login.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify Google / Firebase OAuth idToken server-side
    let verifiedEmail = email;
    if (idToken) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
        if (!verifyRes.ok) {
          return new Response(JSON.stringify({ error: 'Invalid Google OAuth Token.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const tokenInfo = await verifyRes.json();
        if (tokenInfo.email && tokenInfo.email.toLowerCase() === email) {
          verifiedEmail = tokenInfo.email.toLowerCase();
        } else {
          return new Response(JSON.stringify({ error: 'Google Token email mismatch.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } catch (tokenErr) {
        console.warn('Google token validation error:', tokenErr);
        return new Response(JSON.stringify({ error: 'Unable to verify Google OAuth Token.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else if (process.env.NODE_ENV === 'production') {
      return new Response(JSON.stringify({ error: 'Google OAuth idToken required.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: verifiedEmail },
          { username: verifiedEmail.split('@')[0] },
        ],
      },
      include: { role: true },
    });

    // Protect administrative accounts from unverified social login takeover
    if (existingUser && (existingUser.role?.slug === 'super-admin' || existingUser.role?.slug === 'administrator')) {
      return new Response(JSON.stringify({ error: 'Administrator accounts must sign in using primary credentials.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let userId = existingUser?.id;
    let isSuspended = existingUser?.status === 'suspended';

    if (!existingUser) {
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

      const newUser = await prisma.user.create({
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
      userId = newUser.id;
      isSuspended = false;
    }

    if (isSuspended) {
      return new Response(JSON.stringify({ error: 'Account is suspended.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User creation failed.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = await createSession(
      userId,
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
      userId,
      action: 'auth.google_login',
      entity: 'User',
      entityId: userId,
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
