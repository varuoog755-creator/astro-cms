import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import prisma from '../../../lib/db';
import { getIntegrationSettings } from '../../../lib/settings';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const settings = await getIntegrationSettings();
    const secret = settings.razorpay_key_secret;

    // Cryptographic HMAC SHA-256 Signature Verification
    if (secret && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return new Response(JSON.stringify({ error: 'Invalid payment signature verification failed.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else if (process.env.NODE_ENV === 'production' && secret) {
      return new Response(JSON.stringify({ error: 'Razorpay payment signature required in production.' }), {
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
