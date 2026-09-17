import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { createSession, hashPassword, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import { logAudit } from '../../../lib/utilities/audit';
import { checkRateLimit } from '../../../lib/utilities/rateLimit';

export const POST: APIRoute = async ({ request, cookies }) => {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const { allowed } = checkRateLimit(clientIp, 'customer_register', { maxRequests: 5, windowMs: 60000 });
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Too many registration attempts. Please wait 1 minute before trying again.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let displayName = '';
    let email = '';
    let password = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      displayName = body.displayName || '';
      email = body.email || '';
      password = body.password || '';
    } else {
      const formData = await request.formData();
      displayName = formData.get('displayName')?.toString() || '';
      email = formData.get('email')?.toString() || '';
      password = formData.get('password')?.toString() || '';
    }

    displayName = displayName.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    if (!displayName || !email || !password) {
      return new Response(JSON.stringify({ error: 'Please fill in all required fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters long.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: email }],
      },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'An account with this email address already exists. Please sign in.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Find or create Subscriber role
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

    const passwordHash = await hashPassword(password);
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
    const uniqueUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

    const user = await prisma.user.create({
      data: {
        email: email,
        username: uniqueUsername,
        passwordHash,
        displayName: displayName,
        roleId: role.id,
        status: 'active',
        bio: 'Store Customer Account',
      },
    });

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
      action: 'auth.customer_register',
      entity: 'User',
      entityId: user.id,
      metadata: { email: email },
    });

    return new Response(JSON.stringify({ success: true, redirect: '/' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Customer registration API error:', err);
    return new Response(JSON.stringify({ error: 'Server error during account registration.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
