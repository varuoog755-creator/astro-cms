import prisma from './db';

export interface IntegrationSettings {
  // Razorpay
  razorpay_key_id: string;
  razorpay_key_secret: string;
  razorpay_enabled: boolean;

  // Paytm / UPI
  paytm_mid: string;
  paytm_mkey: string;
  paytm_vpa: string;
  paytm_enabled: boolean;

  // COD & WhatsApp
  cod_enabled: boolean;
  whatsapp_number: string;
  whatsapp_enabled: boolean;
  whatsapp_floating_widget: boolean;
  whatsapp_buy_button: boolean;
  whatsapp_default_message: string;

  // Google Search Console & SEO
  gsc_verification_tag: string;
  gsc_enabled: boolean;

  // Google Merchant Center
  gmc_enabled: boolean;
  gmc_brand_name: string;
  gmc_currency: string;

  // Google Analytics 4
  ga_measurement_id: string;
  ga_enabled: boolean;

  // Meta Pixel
  meta_pixel_id: string;
  meta_pixel_enabled: boolean;
}

export const DEFAULT_INTEGRATION_SETTINGS: IntegrationSettings = {
  razorpay_key_id: '',
  razorpay_key_secret: '',
  razorpay_enabled: true,

  paytm_mid: '',
  paytm_mkey: '',
  paytm_vpa: 'teepul@upi',
  paytm_enabled: true,

  cod_enabled: true,
  whatsapp_number: '919876543210',
  whatsapp_enabled: true,
  whatsapp_floating_widget: true,
  whatsapp_buy_button: true,
  whatsapp_default_message: 'Hi Teepul Store! I am interested in ordering: {product_title} (Color: {color}, Size: {size}). Total: ₹{price}. Please assist with my order.',

  gsc_verification_tag: '',
  gsc_enabled: true,

  gmc_enabled: true,
  gmc_brand_name: 'Teepul Streetwear',
  gmc_currency: 'INR',

  ga_measurement_id: '',
  ga_enabled: true,

  meta_pixel_id: '',
  meta_pixel_enabled: true,
};

export async function getIntegrationSettings(): Promise<IntegrationSettings> {
  try {
    const settingsRows = await prisma.setting.findMany({
      where: {
        group: { in: ['integrations', 'payments', 'seo', 'analytics'] },
      },
    });

    const settingsMap: Record<string, string> = {};
    for (const row of settingsRows) {
      settingsMap[row.key] = row.value;
    }

    return {
      razorpay_key_id: settingsMap.razorpay_key_id ?? DEFAULT_INTEGRATION_SETTINGS.razorpay_key_id,
      razorpay_key_secret: settingsMap.razorpay_key_secret ?? DEFAULT_INTEGRATION_SETTINGS.razorpay_key_secret,
      razorpay_enabled: settingsMap.razorpay_enabled !== undefined ? settingsMap.razorpay_enabled === 'true' : DEFAULT_INTEGRATION_SETTINGS.razorpay_enabled,

      paytm_mid: settingsMap.paytm_mid ?? DEFAULT_INTEGRATION_SETTINGS.paytm_mid,
      paytm_mkey: settingsMap.paytm_mkey ?? DEFAULT_INTEGRATION_SETTINGS.paytm_mkey,
      paytm_vpa: settingsMap.paytm_vpa ?? DEFAULT_INTEGRATION_SETTINGS.paytm_vpa,
      paytm_enabled: settingsMap.paytm_enabled !== undefined ? settingsMap.paytm_enabled === 'true' : DEFAULT_INTEGRATION_SETTINGS.paytm_enabled,

      cod_enabled: settingsMap.cod_enabled !== undefined ? settingsMap.cod_enabled === 'true' : DEFAULT_INTEGRATION_SETTINGS.cod_enabled,
      whatsapp_number: settingsMap.whatsapp_number ?? DEFAULT_INTEGRATION_SETTINGS.whatsapp_number,
      whatsapp_enabled: settingsMap.whatsapp_enabled !== undefined ? settingsMap.whatsapp_enabled === 'true' : DEFAULT_INTEGRATION_SETTINGS.whatsapp_enabled,
      whatsapp_floating_widget: settingsMap.whatsapp_floating_widget !== undefined ? settingsMap.whatsapp_floating_widget === 'true' : DEFAULT_INTEGRATION_SETTINGS.whatsapp_floating_widget,
      whatsapp_buy_button: settingsMap.whatsapp_buy_button !== undefined ? settingsMap.whatsapp_buy_button === 'true' : DEFAULT_INTEGRATION_SETTINGS.whatsapp_buy_button,
      whatsapp_default_message: settingsMap.whatsapp_default_message ?? DEFAULT_INTEGRATION_SETTINGS.whatsapp_default_message,

      gsc_verification_tag: settingsMap.gsc_verification_tag ?? DEFAULT_INTEGRATION_SETTINGS.gsc_verification_tag,
      gsc_enabled: settingsMap.gsc_enabled !== undefined ? settingsMap.gsc_enabled === 'true' : DEFAULT_INTEGRATION_SETTINGS.gsc_enabled,

      gmc_enabled: settingsMap.gmc_enabled !== undefined ? settingsMap.gmc_enabled === 'true' : DEFAULT_INTEGRATION_SETTINGS.gmc_enabled,
      gmc_brand_name: settingsMap.gmc_brand_name ?? DEFAULT_INTEGRATION_SETTINGS.gmc_brand_name,
      gmc_currency: settingsMap.gmc_currency ?? DEFAULT_INTEGRATION_SETTINGS.gmc_currency,

      ga_measurement_id: settingsMap.ga_measurement_id ?? DEFAULT_INTEGRATION_SETTINGS.ga_measurement_id,
      ga_enabled: settingsMap.ga_enabled !== undefined ? settingsMap.ga_enabled === 'true' : DEFAULT_INTEGRATION_SETTINGS.ga_enabled,

      meta_pixel_id: settingsMap.meta_pixel_id ?? DEFAULT_INTEGRATION_SETTINGS.meta_pixel_id,
      meta_pixel_enabled: settingsMap.meta_pixel_enabled !== undefined ? settingsMap.meta_pixel_enabled === 'true' : DEFAULT_INTEGRATION_SETTINGS.meta_pixel_enabled,
    };
  } catch (error) {
    console.error('Failed to load integration settings:', error);
    return DEFAULT_INTEGRATION_SETTINGS;
  }
}
