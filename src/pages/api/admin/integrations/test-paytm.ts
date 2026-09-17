import type { APIRoute } from 'astro';
import { getSession, SESSION_COOKIE_NAME } from '../../../../lib/auth/session';
import { getIntegrationSettings } from '../../../../lib/settings';
import { initiatePaytmTransaction } from '../../../../lib/paytm';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await getSession(token) : null;

  const isAdmin = session && (session.role === 'Super Admin' || session.role === 'Administrator');
  if (!isAdmin) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const settings = await getIntegrationSettings();

    const mid = body.mid || settings.paytm_mid;
    const key = body.key || settings.paytm_mkey;

    if (!mid || !key) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Paytm MID or Merchant Key is missing. Please save keys first.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const testOrderId = 'TEST_' + Date.now();
    const testCustomerId = 'CUST_TEST_' + Date.now().toString().slice(-4);

    // Test Staging Environment
    const stageResult = await initiatePaytmTransaction({
      orderId: testOrderId + '_S',
      amount: 1.0,
      customerId: testCustomerId,
      mid,
      key,
      callbackUrl: 'https://teepul.com/api/checkout/paytm-callback',
      isProduction: false,
    });

    // Test Production Environment
    const prodResult = await initiatePaytmTransaction({
      orderId: testOrderId + '_P',
      amount: 1.0,
      customerId: testCustomerId,
      mid,
      key,
      callbackUrl: 'https://teepul.com/api/checkout/paytm-callback',
      isProduction: true,
    });

    let activeEnv = 'none';
    let diagnosis = '';

    if (stageResult.success) {
      activeEnv = 'staging';
      diagnosis = 'Staging credentials are ACTIVE and working! txnToken generated successfully.';
    } else if (prodResult.success) {
      activeEnv = 'production';
      diagnosis = 'Production credentials are ACTIVE and working! txnToken generated successfully.';
    } else {
      if (stageResult.resultCode === '501' || prodResult.resultCode === '501') {
        diagnosis = `Paytm returned "501 System Error". This happens when the Merchant ID (${mid}) is newly registered and is pending activation in Paytm's Payment Gateway routing system, or requires onboarding completion from your Paytm Merchant SPOC.`;
      } else {
        diagnosis = `Paytm Staging: ${stageResult.resultMsg || stageResult.error} | Prod: ${prodResult.resultMsg || prodResult.error}`;
      }
    }

    return new Response(
      JSON.stringify({
        success: stageResult.success || prodResult.success,
        activeEnv,
        mid,
        diagnosis,
        stage: {
          code: stageResult.resultCode,
          msg: stageResult.resultMsg,
          success: stageResult.success,
        },
        prod: {
          code: prodResult.resultCode,
          msg: prodResult.resultMsg,
          success: prodResult.success,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Failed to run test' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
