import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { createSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import { logAudit } from '../../../lib/utilities/audit';
import { resolveGeoLocation } from '../../../lib/utilities/geo';
import { checkRateLimit } from '../../../lib/utilities/rateLimit';

export const POST: APIRoute = async ({ request, cookies }) => {
  const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
  
  // Rate limit: max 15 attempts per minute per IP
  const { allowed } = checkRateLimit(clientIp, 'verify_otp', { maxRequests: 15, windowMs: 60000 });
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Too many verification attempts. Please wait a minute.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const rawPhone = (body.phone || '').toString().trim();
    const enteredOtp = (body.otp || '').toString().trim();
    const name = (body.name || '').toString().trim();

    if (!rawPhone || !enteredOtp) {
      return new Response(JSON.stringify({ error: 'Please enter both mobile number and 6-digit OTP.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanDigits = rawPhone.replace(/\D/g, '');
    const last10 = cleanDigits.slice(-10);
    const formattedPhone = `+91${last10}`;

    // Find latest OTP sent to this phone in Supabase
    const latestOtpLog = await prisma.auditLog.findFirst({
      where: {
        action: 'auth.otp_sent',
        entity: 'PhoneVerification',
        entityId: formattedPhone,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestOtpLog || !latestOtpLog.metadata) {
      return new Response(JSON.stringify({ error: 'No OTP request found for this number. Please click Resend OTP.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let meta: any = {};
    try {
      meta = JSON.parse(latestOtpLog.metadata);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Corrupted OTP verification session. Please request a new OTP.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check expiry
    if (meta.expiresAt && Date.now() > meta.expiresAt) {
      return new Response(JSON.stringify({ error: 'OTP has expired. Please request a new OTP code.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify OTP code match
    if (meta.otp !== enteredOtp) {
      return new Response(JSON.stringify({ error: 'Invalid OTP code. Please enter the correct 6-digit code.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find or create customer in Supabase User table
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: formattedPhone },
          { username: `cust_${last10}` },
          { email: `${last10}@teepul.com` },
        ],
      },
    });

    if (!user) {
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

      user = await prisma.user.create({
        data: {
          phone: formattedPhone,
          email: `${last10}@teepul.com`,
          username: `cust_${last10}`,
          passwordHash: '$2a$10$placeholderForPhoneOnlyUserAccountTeepul2026',
          displayName: name || meta.customerName || `Customer (+91 ${last10})`,
          roleId: role.id,
          status: 'active',
          bio: 'Verified customer via Phone OTP',
        },
      });
    } else {
      const updateData: any = { status: 'active' };
      if (name && (user.displayName.startsWith('Customer (+91') || !user.displayName)) {
        updateData.displayName = name;
      }
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    // Create session
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

    const geo = await resolveGeoLocation(clientIp, request.headers);

    // Log verified audit event in Supabase
    await logAudit({
      userId: user.id,
      action: 'auth.phone_verified',
      entity: 'User',
      entityId: user.id,
      ipAddress: clientIp,
      metadata: {
        phone: formattedPhone,
        customerName: user.displayName,
        location: geo.locationStr,
        city: geo.city,
        state: geo.state,
        verifiedAt: new Date().toISOString(),
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Phone verified successfully!',
        user: {
          id: user.id,
          displayName: user.displayName,
          phone: user.phone,
          email: user.email,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Verify OTP Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to verify OTP. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
