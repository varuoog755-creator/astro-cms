import type { APIRoute } from 'astro';
import prisma from '../../../../lib/db';
import { hasPermission, PERMISSIONS } from '../../../../lib/permissions/rbac';
import { logAudit } from '../../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.SETTINGS_MANAGE)) {
    return new Response('Unauthorized', { status: 403 });
  }

  const formData = await request.formData();

  // Define keys and their respective setting groups
  const keyGroups: Record<string, string> = {
    // Razorpay & Payments
    razorpay_key_id: 'payments',
    razorpay_key_secret: 'payments',
    razorpay_enabled: 'payments',
    paytm_mid: 'payments',
    paytm_mkey: 'payments',
    paytm_vpa: 'payments',
    paytm_enabled: 'payments',
    cod_enabled: 'payments',

    // WhatsApp
    whatsapp_number: 'integrations',
    whatsapp_enabled: 'integrations',
    whatsapp_floating_widget: 'integrations',
    whatsapp_buy_button: 'integrations',
    whatsapp_default_message: 'integrations',

    // Google Search Console & Merchant
    gsc_verification_tag: 'seo',
    gsc_enabled: 'seo',
    gmc_enabled: 'integrations',
    gmc_brand_name: 'integrations',
    gmc_currency: 'integrations',

    // GA4 & Meta
    ga_measurement_id: 'analytics',
    ga_enabled: 'analytics',
    meta_pixel_id: 'analytics',
    meta_pixel_enabled: 'analytics',
  };

  // Set boolean defaults to false if missing from unchecked checkboxes
  const checkboxKeys = [
    'razorpay_enabled', 'paytm_enabled', 'cod_enabled',
    'whatsapp_enabled', 'whatsapp_floating_widget', 'whatsapp_buy_button',
    'gsc_enabled', 'gmc_enabled', 'ga_enabled', 'meta_pixel_enabled'
  ];

  for (const key of Object.keys(keyGroups)) {
    const group = keyGroups[key];
    let val = formData.get(key)?.toString() || '';

    if (checkboxKeys.includes(key)) {
      val = formData.has(key) ? 'true' : 'false';
    }

    await prisma.setting.upsert({
      where: { key },
      update: { value: val, group },
      create: { key, value: val, group },
    });
  }

  await logAudit({
    userId: locals.user.userId,
    action: 'integrations.update',
    entity: 'Setting',
    metadata: { action: 'Updated Payments & Marketing Integration Keys' },
  });

  return redirect('/admin/integrations?saved=true');
};
