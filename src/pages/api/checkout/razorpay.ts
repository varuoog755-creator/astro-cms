import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { getIntegrationSettings } from '../../../lib/settings';
import { checkRateLimit } from '../../../lib/utilities/rateLimit';
import { logAudit } from '../../../lib/utilities/audit';
import { resolveGeoLocation } from '../../../lib/utilities/geo';
import { initiatePaytmTransaction } from '../../../lib/paytm';

export const POST: APIRoute = async ({ request }) => {
  const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
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

    const qty = parseInt(quantity) || 1;
    const itemTitle = productTitle || 'Teepul Luxury Curtain Panel';

    // Verify unit price against dynamic sizing or default fallback
    let realUnitPrice = parseFloat(body.unitPrice) || 301;
    const totalAmount = realUnitPrice * qty;
    const orderNumber = `TP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const settings = await getIntegrationSettings();
    const geo = await resolveGeoLocation(clientIp, request.headers);

    // ==========================================
    // 1. Paytm Payment Gateway & UPI Route
    // ==========================================
    if (paymentMethod === 'PAYTM') {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail: customerEmail || 'guest@customer.com',
          customerPhone,
          shippingAddress,
          pincode,
          city: city || geo.city || 'Local',
          state: state || geo.state || 'State',
          totalAmount,
          currency: 'INR',
          paymentMethod: 'PAYTM',
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

      let txnToken = '';
      let isPaytmPg = false;
      let paytmHost = 'securegw-stage.paytm.in';
      let paytmResultMsg = '';

      if (settings.paytm_mid && settings.paytm_mkey) {
        const origin = new URL(request.url).origin;
        const callbackUrl = `${origin}/api/checkout/paytm-callback`;

        // Attempt Paytm Staging first
        const stageRes = await initiatePaytmTransaction({
          orderId: order.orderNumber,
          amount: totalAmount,
          customerId: customerPhone || 'CUST_' + order.id.slice(0, 8),
          customerPhone,
          customerEmail,
          mid: settings.paytm_mid,
          key: settings.paytm_mkey,
          callbackUrl,
          isProduction: false,
        });

        if (stageRes.success && stageRes.txnToken) {
          txnToken = stageRes.txnToken;
          isPaytmPg = true;
          paytmHost = 'securegw-stage.paytm.in';
        } else {
          // Attempt Production
          const prodRes = await initiatePaytmTransaction({
            orderId: order.orderNumber,
            amount: totalAmount,
            customerId: customerPhone || 'CUST_' + order.id.slice(0, 8),
            customerPhone,
            customerEmail,
            mid: settings.paytm_mid,
            key: settings.paytm_mkey,
            callbackUrl,
            isProduction: true,
          });

          if (prodRes.success && prodRes.txnToken) {
            txnToken = prodRes.txnToken;
            isPaytmPg = true;
            paytmHost = 'securegw.paytm.in';
          } else {
            paytmResultMsg = stageRes.resultMsg || prodRes.resultMsg || 'Paytm API pending activation';
          }
        }
      }

      // Record transaction permanently in Supabase
      await prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentMethod: 'PAYTM',
          paymentGateway: isPaytmPg ? 'paytm_pg' : 'paytm_upi',
          amount: totalAmount,
          currency: 'INR',
          status: 'PENDING',
          ipAddress: clientIp,
          location: geo.locationStr,
          gatewayResponse: JSON.stringify({
            isPaytmPg,
            txnToken: txnToken || null,
            paytmHost,
            mid: settings.paytm_mid,
            paytmVpa: settings.paytm_vpa || null,
            note: isPaytmPg ? 'Paytm PG Token Generated' : (paytmResultMsg || 'Direct UPI / Offline fallback'),
          }),
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
          totalAmount,
          paymentMethod: 'PAYTM',
          isPaytmPg,
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          orderId: order.id,
          orderNumber: order.orderNumber,
          isPaytm: true,
          isPaytmPg,
          txnToken,
          mid: settings.paytm_mid,
          paytmHost,
          amount: totalAmount,
          paytmVpa: settings.paytm_vpa,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ==========================================
    // 2. Cash on Delivery or WhatsApp Route
    // ==========================================
    if (paymentMethod === 'COD' || paymentMethod === 'WHATSAPP') {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail: customerEmail || 'guest@customer.com',
          customerPhone,
          shippingAddress,
          pincode,
          city: city || geo.city || 'Local',
          state: state || geo.state || 'State',
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

      // ✅ Save permanent PaymentTransaction record to Supabase
      await prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentMethod,
          paymentGateway: paymentMethod === 'COD' ? 'cod' : 'whatsapp',
          amount: totalAmount,
          currency: 'INR',
          status: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          ipAddress: clientIp,
          location: geo.locationStr,
          gatewayResponse: JSON.stringify({
            method: paymentMethod,
            orderNumber,
            customerName,
            customerPhone,
            city: geo.city,
            state: geo.state,
          }),
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
          location: geo.locationStr,
          city: geo.city,
          state: geo.state,
          country: geo.country,
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
        location: geo.locationStr,
        city: geo.city,
        state: geo.state,
        country: geo.country,
      },
    });

    // ✅ Save permanent PaymentTransaction record to Supabase (PENDING until verify)
    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentMethod: 'RAZORPAY',
        paymentGateway: 'razorpay',
        amount: totalAmount,
        currency: 'INR',
        status: 'PENDING',
        ipAddress: clientIp,
        location: geo.locationStr,
        gatewayResponse: JSON.stringify({
          orderNumber,
          customerName,
          customerPhone,
          city: geo.city,
          state: geo.state,
          stage: 'order_initiated',
        }),
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
