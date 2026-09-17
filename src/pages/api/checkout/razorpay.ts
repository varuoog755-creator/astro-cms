import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { getIntegrationSettings } from '../../../lib/settings';
import { checkRateLimit } from '../../../lib/utilities/rateLimit';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request }) => {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const { allowed } = checkRateLimit(clientIp, 'checkout_razorpay', { maxRequests: 10, windowMs: 60000 });
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Too many checkout requests. Please wait a minute before trying again.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, pincode, city, state, productId, productTitle, color, size, quantity, paymentMethod } = body;

    if (!customerName || !customerPhone || !shippingAddress) {
      return new Response(JSON.stringify({ error: 'Missing required shipping or contact details' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Server-side authoritative product lookup
    let realUnitPrice = 1499; // Default price fallback
    let itemTitle = productTitle || 'Storefront Item';

    if (productId) {
      const dbProduct = await prisma.product.findFirst({
        where: { OR: [{ id: productId }, { slug: productId }] },
      });
      if (dbProduct) {
        realUnitPrice = dbProduct.price;
        itemTitle = dbProduct.name;

        if (size && dbProduct.sizesJson) {
          try {
            const parsedSizes = JSON.parse(dbProduct.sizesJson);
            if (Array.isArray(parsedSizes)) {
              const matched = parsedSizes.find((s: any) => (typeof s === 'object' ? s.name : s)?.toString().toLowerCase() === size.toLowerCase());
              if (matched && typeof matched === 'object' && !isNaN(Number(matched.price))) {
                realUnitPrice = Number(matched.price);
              }
            }
          } catch (e) {
            console.error('Error parsing sizesJson in checkout API:', e);
          }
        }
      }
    }

    if (body.unitPrice && !isNaN(Number(body.unitPrice)) && Number(body.unitPrice) > 0) {
      // If client calculated valid size price matching catalog
      if (realUnitPrice === 1499 || Math.abs(realUnitPrice - Number(body.unitPrice)) < 500) {
        realUnitPrice = Number(body.unitPrice);
      }
    }

    const qty = Math.max(1, Number(quantity) || 1);
    const totalAmount = realUnitPrice * qty;
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
                productTitle: itemTitle,
                color: color || 'Default',
                size: size || 'Standard',
                unitPrice: realUnitPrice,
                quantity: qty,
                totalPrice: totalAmount,
              },
            ],
          },
        },
      });

      await logAudit({
        action: 'order.placed',
        entity: 'Order',
        entityId: order.orderNumber,
        ipAddress: clientIp,
        metadata: {
          orderNumber,
          customerName,
          customerPhone,
          customerEmail,
          totalAmount,
          itemTitle,
          size,
          color,
          quantity: qty,
          paymentMethod,
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
              productTitle: itemTitle,
              color: color || 'Default',
              size: size || 'Standard',
              unitPrice: realUnitPrice,
              quantity: qty,
              totalPrice: totalAmount,
            },
          ],
        },
      },
    });

    await logAudit({
      action: 'order.placed',
      entity: 'Order',
      entityId: order.orderNumber,
      ipAddress: clientIp,
      metadata: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        totalAmount,
        itemTitle,
        size,
        color,
        quantity: qty,
        paymentMethod: 'RAZORPAY',
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
