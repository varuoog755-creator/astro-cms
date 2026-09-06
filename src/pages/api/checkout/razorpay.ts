import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { getIntegrationSettings } from '../../../lib/settings';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, pincode, city, state, productId, productTitle, color, size, quantity, unitPrice, paymentMethod } = body;

    if (!customerName || !customerPhone || !shippingAddress || !unitPrice) {
      return new Response(JSON.stringify({ error: 'Missing required shipping or item details' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const totalAmount = Number(unitPrice) * (Number(quantity) || 1);
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const settings = await getIntegrationSettings();

    // Handle Cash on Delivery or Paytm/WhatsApp Direct Order
    if (paymentMethod === 'COD' || paymentMethod === 'PAYTM' || paymentMethod === 'WHATSAPP') {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail: customerEmail || 'guest@customer.com',
          customerPhone,
          shippingAddress,
          pincode,
          city: city || 'Local',
          state: state || 'State',
          totalAmount,
          currency: 'INR',
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'COD_PENDING' : 'PENDING',
          orderStatus: 'PROCESSING',
          items: {
            create: [
              {
                productId: productId || 'prod-1',
                productTitle: productTitle || 'Storefront Item',
                color: color || 'Default',
                size: size || 'Standard',
                unitPrice: Number(unitPrice),
                quantity: Number(quantity) || 1,
                totalPrice: totalAmount,
              },
            ],
          },
        },
      });

      return new Response(JSON.stringify({ success: true, orderId: order.id, orderNumber }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Razorpay Integration
    const keyId = settings.razorpay_key_id;
    const keySecret = settings.razorpay_key_secret;

    // Create database order record
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail: customerEmail || 'guest@customer.com',
        customerPhone,
        shippingAddress,
        pincode,
        city: city || 'Local',
        state: state || 'State',
        totalAmount,
        currency: 'INR',
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'PENDING',
        orderStatus: 'PROCESSING',
        items: {
          create: [
            {
              productId: productId || 'prod-1',
              productTitle: productTitle || 'Storefront Item',
              color: color || 'Default',
              size: size || 'Standard',
              unitPrice: Number(unitPrice),
              quantity: Number(quantity) || 1,
              totalPrice: totalAmount,
            },
          ],
        },
      },
    });

    let razorpayOrderId = `rzp_order_${order.id.slice(0, 8)}`;

    // Call Razorpay REST API if live keys are provided
    if (keyId && keySecret) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify({
            amount: Math.round(totalAmount * 100), // amount in paise
            currency: 'INR',
            receipt: orderNumber,
            notes: { orderId: order.id },
          }),
        });

        if (rzpResponse.ok) {
          const rzpData = await rzpResponse.json();
          razorpayOrderId = rzpData.id;
          await prisma.order.update({
            where: { id: order.id },
            data: { razorpayOrderId },
          });
        }
      } catch (err) {
        console.error('Razorpay API error fallback to local ID:', err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        orderNumber,
        razorpayOrderId,
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        keyId: keyId || 'rzp_test_placeholderKey',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Checkout API failure:', error);
    return new Response(JSON.stringify({ error: error.message || 'Checkout processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
