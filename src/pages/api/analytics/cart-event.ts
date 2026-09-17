import type { APIRoute } from 'astro';
import { logAudit } from '../../../lib/utilities/audit';
import { getSession, getSessionTokenFromRequest } from '../../../lib/auth/session';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const {
      action = 'cart.add',
      productName,
      slug,
      size = '7 Feet',
      color = 'Standard',
      price = 0,
      quantity = 1,
    } = data;

    const token = getSessionTokenFromRequest(request);
    const sessionUser = token ? await getSession(token) : null;
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';

    await logAudit({
      userId: sessionUser?.userId || undefined,
      action: action, // cart.add, cart.remove, cart.quantity_change
      entity: 'CartItem',
      entityId: slug || 'cart-item',
      ipAddress: clientIp,
      metadata: {
        productName: productName || 'Curtain Product',
        slug: slug || '',
        size: size,
        color: color,
        price: Number(price) || 0,
        quantity: Number(quantity) || 1,
        total: (Number(price) || 0) * (Number(quantity) || 1),
        userEmail: sessionUser?.email || 'Visitor/Guest',
        userName: sessionUser?.displayName || sessionUser?.username || 'Guest Customer',
        timestamp: new Date().toISOString(),
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to log cart event:', error);
    return new Response(JSON.stringify({ success: false }), {
      status: 200, // Return 200 so frontend never breaks on logging
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
