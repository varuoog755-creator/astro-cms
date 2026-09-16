import type { APIRoute } from 'astro';
import { getSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import prisma from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await getSession(token) : null;

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized. Please login again.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { displayName, phone, address, city, state, pincode } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        displayName: displayName || session.displayName,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Profile updated successfully!',
        user: {
          displayName: updatedUser.displayName,
          phone: updatedUser.phone,
          address: updatedUser.address,
          city: updatedUser.city,
          state: updatedUser.state,
          pincode: updatedUser.pincode,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Update profile error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Failed to update profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
