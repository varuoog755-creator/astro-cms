import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { getIntegrationSettings } from '../../../lib/settings';
import { PaytmChecksum } from '../../../lib/paytm/checksum';
import { logAudit } from '../../../lib/utilities/audit';
import { resolveGeoLocation } from '../../../lib/utilities/geo';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      params[key] = value.toString();
    }

    const orderNumber = params.ORDERID;
    const txnStatus = params.STATUS; // TXN_SUCCESS or TXN_FAILURE
    const checksumHash = params.CHECKSUMHASH;
    const txnId = params.TXNID;
    const txnAmount = parseFloat(params.TXNAMOUNT || '0');

    const settings = await getIntegrationSettings();
    const paytmKey = settings.paytm_mkey;

    // Verify Checksum
    let isChecksumValid = false;
    if (paytmKey && checksumHash) {
      isChecksumValid = PaytmChecksum.verifySignature(params, paytmKey, checksumHash);
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const geo = await resolveGeoLocation(clientIp);

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return redirect('/checkout?error=order_not_found');
    }

    if (txnStatus === 'TXN_SUCCESS' && isChecksumValid) {
      // Payment Verified Success
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          orderStatus: 'PROCESSING',
          notes: `Paytm Payment Verified. TXNID: ${txnId}`,
        },
      });

      await prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentMethod: 'PAYTM',
          paymentGateway: 'paytm_pg',
          amount: txnAmount || order.totalAmount,
          currency: 'INR',
          status: 'PAID',
          ipAddress: clientIp,
          location: geo.locationStr,
          gatewayResponse: JSON.stringify({
            txnId,
            status: txnStatus,
            bankTxnId: params.BANKTXNID,
            respCode: params.RESPCODE,
            respMsg: params.RESPMSG,
            gateway: 'paytm',
          }),
        },
      });

      await logAudit({
        action: 'order.paid',
        entity: 'Order',
        entityId: order.orderNumber,
        ipAddress: clientIp,
        metadata: {
          orderNumber: order.orderNumber,
          paymentMethod: 'PAYTM',
          paymentStatus: 'PAID',
          txnId,
          amount: txnAmount,
        },
      });

      return redirect(`/checkout/success?orderNumber=${encodeURIComponent(orderNumber)}&payment=success`);
    } else {
      // Payment Failed or Checksum mismatch
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'FAILED',
          notes: `Paytm payment failed or signature invalid. Status: ${txnStatus}, Code: ${params.RESPCODE}`,
        },
      });

      await prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentMethod: 'PAYTM',
          paymentGateway: 'paytm_pg',
          amount: txnAmount || order.totalAmount,
          currency: 'INR',
          status: 'FAILED',
          ipAddress: clientIp,
          location: geo.locationStr,
          errorMessage: params.RESPMSG || 'Payment failed on Paytm',
          gatewayResponse: JSON.stringify(params),
        },
      });

      return redirect(`/checkout/success?orderNumber=${encodeURIComponent(orderNumber)}&payment=failed`);
    }
  } catch (err) {
    console.error('Paytm callback error:', err);
    return redirect('/checkout?error=callback_failed');
  }
};
