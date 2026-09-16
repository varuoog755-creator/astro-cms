import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { createSession, hashPassword, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    let phone = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      phone = body.phone || '';
    } else {
      const formData = await request.formData();
      phone = formData.get('phone')?.toString() || '';
    }

    phone = phone.trim();
    if (!phone) {
      return new Response(JSON.stringify({ error: 'Phone number is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Standardize phone number format (e.g. +91XXXXXXXXXX)
    const cleanDigits = phone.replace(/\D/g, '');
    const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: formattedPhone },
          { phone: phone },
          { username: formattedPhone },
          { username: cleanDigits },
        ],
      },
    });

    if (!user) {
      // Find or create customer subscriber role
      let role = await prisma.role.findFirst({
        where: {
          OR: [{ slug: 'subscriber' }, { slug: 'customer' }, { name: 'Customer' }],
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

      const randomPassword = Math.random().toString(36).substring(2, 12);
      const passwordHash = await hashPassword(randomPassword);

      user = await prisma.user.create({
        data: {
          phone: formattedPhone,
          email: `${cleanDigits}@teepul.com`,
          username: `cust_${cleanDigits}`,
          passwordHash,
          displayName: `Customer (${formattedPhone})`,
          roleId: role.id,
          status: 'active',
          bio: 'Registered via Customer Phone Login',
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
      action: 'auth.phone_login',
      entity: 'User',
      entityId: user.id,
      metadata: { phone: formattedPhone },
    });

    return new Response(JSON.stringify({ success: true, redirect: '/' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Phone login error:', err);
    return new Response(JSON.stringify({ error: 'Server error during phone login.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
