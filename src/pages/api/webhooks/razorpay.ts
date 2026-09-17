import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import prisma from '../../../lib/db';
import { getIntegrationSettings } from '../../../lib/settings';

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    const settings = await getIntegrationSettings();
    const secret = settings.razorpay_key_secret;

    // Verify webhook signature if secret is configured
    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return new Response(JSON.stringify({ error: 'Invalid webhook signature.' }), { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;
      const notes = paymentEntity?.notes || {};

      const orderId = notes.orderId;

      if (orderId || razorpayOrderId) {
        await prisma.order.updateMany({
          where: {
            OR: [
              ...(orderId ? [{ id: orderId }] : []),
              ...(razorpayOrderId ? [{ razorpayOrderId }] : []),
            ],
          },
          data: {
            paymentStatus: 'PAID',
            razorpayPaymentId: razorpayPaymentId || undefined,
          },
        });
      }
    }

    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
  } catch (err: any) {
    console.error('Razorpay webhook processing error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Webhook error' }), { status: 500 });
  }
};
