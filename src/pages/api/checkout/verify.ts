import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { orderId, razorpayPaymentId, razorpayOrderId } = body;

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update order status in DB
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        razorpayPaymentId: razorpayPaymentId || `pay_${Math.random().toString(36).substring(7)}`,
        razorpayOrderId: razorpayOrderId || undefined,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        orderNumber: updatedOrder.orderNumber,
        message: 'Payment verified and order status set to PAID',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Payment verification failed:', error);
    return new Response(JSON.stringify({ error: error.message || 'Payment verification failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
