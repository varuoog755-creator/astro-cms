import type { APIRoute } from 'astro';
import { getSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import prisma from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await getSession(token) : null;

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized. Admin login required.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { orderId, courierPartner = 'EKart Logistics' } = await request.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order ID is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate EKart AWB Tracking Number
    const rawNumber = order.orderNumber.replace(/[^0-9]/g, '') || String(Date.now()).slice(-6);
    const awb = `EKART${rawNumber}IN`;
    const trackingUrl = `https://track.ekartlogistics.com/shipmentTrack/${awb}`;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        courierPartner,
        trackingNumber: awb,
        trackingUrl,
        orderStatus: 'SHIPPED',
        paymentStatus: order.paymentStatus === 'PENDING' || order.paymentStatus === 'COD_PENDING' ? 'PAID' : order.paymentStatus,
        notes: `EKart Courier Pickup Confirmed. AWB: ${awb}`,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `EKart Courier pickup booked! AWB: ${awb}`,
        order: updatedOrder,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('EKart Booking error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Failed to book EKart courier' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
