import type { APIRoute } from 'astro';
import { logAudit } from '../../../lib/utilities/audit';
import { getSession, getSessionTokenFromRequest } from '../../../lib/auth/session';
import { resolveGeoLocation } from '../../../lib/utilities/geo';
import { checkRateLimit } from '../../../lib/utilities/rateLimit';

export const POST: APIRoute = async ({ request }) => {
  try {
    const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Prevent database log spamming from runaway loops (max 30 events per minute per IP)
    const { allowed } = checkRateLimit(clientIp, 'cart_event', { maxRequests: 30, windowMs: 60000 });
    if (!allowed) {
      return new Response(JSON.stringify({ success: true, rateLimited: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    const {
      action = 'cart.add',
      productName,
      slug,
      size = '7 Feet',
      color = 'Standard',
      price = 0,
      quantity = 1,
      itemCount,
      cartTotal,
      details,
    } = data;

    const token = getSessionTokenFromRequest(request);
    const sessionUser = token ? await getSession(token) : null;

    // Resolve City, State & Country
    const geo = await resolveGeoLocation(clientIp, request.headers);

    await logAudit({
      userId: sessionUser?.userId || undefined,
      action: action, // cart.add, cart.remove, cart.quantity_change, cart.abandoned, cart.drawer_closed, cart.checkout_click
      entity: 'CartItem',
      entityId: slug || 'cart-session',
      ipAddress: clientIp,
      metadata: {
        productName: productName || (action === 'cart.abandoned' ? 'Abandoned Cart' : 'Curtain Product'),
        slug: slug || '',
        size: size,
        color: color,
        price: Number(price) || 0,
        quantity: Number(quantity) || 1,
        total: (Number(price) || 0) * (Number(quantity) || 1),
        itemCount: itemCount !== undefined ? Number(itemCount) : undefined,
        cartTotal: cartTotal !== undefined ? Number(cartTotal) : undefined,
        details: details || undefined,
        userEmail: sessionUser?.email || 'Visitor/Guest',
        userName: sessionUser?.displayName || sessionUser?.username || 'Guest Customer',
        location: geo.locationStr,
        city: geo.city,
        state: geo.state,
        country: geo.country,
        timestamp: new Date().toISOString(),
      },
    });

    return new Response(JSON.stringify({ success: true, location: geo.locationStr }), {
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
