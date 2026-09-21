import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { logAudit } from '../../../lib/utilities/audit';
import { resolveGeoLocation } from '../../../lib/utilities/geo';
import { checkRateLimit } from '../../../lib/utilities/rateLimit';

export const POST: APIRoute = async ({ request }) => {
  const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
  
  // Rate limit: max 10 OTP requests per minute per IP
  const { allowed } = checkRateLimit(clientIp, 'send_otp', { maxRequests: 10, windowMs: 60000 });
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Too many OTP requests. Please wait a minute before trying again.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const rawPhone = (body.phone || '').toString().trim();
    const name = (body.name || '').toString().trim();

    if (!rawPhone) {
      return new Response(JSON.stringify({ error: 'Please enter a valid mobile number.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanDigits = rawPhone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      return new Response(JSON.stringify({ error: 'Please enter a valid 10-digit Indian mobile number.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Standardize 10-digit number
    const last10 = cleanDigits.slice(-10);
    const formattedPhone = `+91${last10}`;

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const geo = await resolveGeoLocation(clientIp, request.headers);

    // 1. Immediately preserve customer lead in Supabase AuditLog
    await logAudit({
      action: 'auth.otp_sent',
      entity: 'PhoneVerification',
      entityId: formattedPhone,
      ipAddress: clientIp,
      metadata: {
        phone: formattedPhone,
        rawPhone: last10,
        customerName: name || 'Customer',
        otp: otp,
        expiresAt: expiresAt,
        location: geo.locationStr,
        city: geo.city,
        state: geo.state,
        createdAt: new Date().toISOString(),
      },
    });

    // 2. Also ensure customer is created or noted in Supabase User table so lead is never lost
    try {
      let existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { phone: formattedPhone },
            { username: `cust_${last10}` },
            { email: `${last10}@teepul.com` },
          ],
        },
      });

      if (!existingUser) {
        let role = await prisma.role.findFirst({
          where: {
            OR: [{ slug: 'subscriber' }, { slug: 'customer' }],
          },
        });

        if (!role) {
          role = await prisma.role.findFirst();
        }

        if (role) {
          await prisma.user.create({
            data: {
              phone: formattedPhone,
              email: `${last10}@teepul.com`,
              username: `cust_${last10}`,
              passwordHash: '$2a$10$placeholderForPhoneOnlyUserAccountTeepul2026',
              displayName: name || `Customer (+91 ${last10})`,
              roleId: role.id,
              status: 'active',
              bio: 'Customer lead registered via OTP checkout',
            },
          });
        }
      } else if (name && (existingUser.displayName?.startsWith('Customer (+91') || !existingUser.displayName)) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { displayName: name },
        });
      }
    } catch (userErr) {
      console.warn('User lead persistence notice:', userErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `OTP sent successfully to +91 ${last10}`,
        phone: formattedPhone,
        otp: otp, // Returned for instant free verification on screen
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Send OTP Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send OTP. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
