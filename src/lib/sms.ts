import prisma from './db';

export interface SendSmsResult {
  success: boolean;
  provider: 'fast2sms' | '2factor' | 'twilio' | 'msg91' | 'none';
  messageId?: string;
  error?: string;
}

/**
 * Universal Indian SMS OTP Dispatcher
 * Supports Fast2SMS (DLT-free OTP route), 2Factor.in, Twilio, and MSG91.
 */
export async function sendSmsOtp(phone10Digits: string, otp: string): Promise<SendSmsResult> {
  const cleanDigits = phone10Digits.replace(/\D/g, '').slice(-10);
  if (cleanDigits.length !== 10) {
    return { success: false, provider: 'none', error: 'Invalid 10-digit mobile number' };
  }

  // Retrieve any dynamic SMS settings from database
  let dbSettings: Record<string, string> = {};
  try {
    const rows = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            'fast2sms_api_key',
            'twofactor_api_key',
            'twilio_account_sid',
            'twilio_auth_token',
            'twilio_from_phone',
            'msg91_auth_key',
            'msg91_template_id',
            'sms_gateway_provider',
          ],
        },
      },
    });
    for (const r of rows) {
      dbSettings[r.key] = r.value;
    }
  } catch (e) {}

  const fast2smsKey = process.env.FAST2SMS_API_KEY || dbSettings.fast2sms_api_key;
  const twofactorKey = process.env.TWOFACTOR_API_KEY || dbSettings.twofactor_api_key;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID || dbSettings.twilio_account_sid;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN || dbSettings.twilio_auth_token;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER || dbSettings.twilio_from_phone;
  const msg91Key = process.env.MSG91_AUTH_KEY || dbSettings.msg91_auth_key;
  const msg91Template = process.env.MSG91_TEMPLATE_ID || dbSettings.msg91_template_id;

  // 1. Fast2SMS Quick OTP Route (No DLT required for pre-approved OTP route)
  if (fast2smsKey) {
    try {
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(fast2smsKey)}&variables_values=${encodeURIComponent(otp)}&route=otp&numbers=${cleanDigits}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'cache-control': 'no-cache' },
      });
      const data: any = await res.json();
      if (data && data.return === true) {
        return { success: true, provider: 'fast2sms', messageId: data.request_id };
      }
      console.warn('Fast2SMS response notice:', data);
    } catch (err: any) {
      console.error('Fast2SMS error:', err?.message);
    }
  }

  // 2. 2Factor.in Indian OTP Gateway
  if (twofactorKey) {
    try {
      const url = `https://2factor.in/v3/API/V1/${encodeURIComponent(twofactorKey)}/SMS/+91${cleanDigits}/${encodeURIComponent(otp)}/OTP1`;
      const res = await fetch(url);
      const data: any = await res.json();
      if (data && data.Status === 'Success') {
        return { success: true, provider: '2factor', messageId: data.Details };
      }
      console.warn('2Factor response notice:', data);
    } catch (err: any) {
      console.error('2Factor error:', err?.message);
    }
  }

  // 3. MSG91 OTP API
  if (msg91Key && msg91Template) {
    try {
      const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(msg91Template)}&mobile=91${cleanDigits}&authkey=${encodeURIComponent(msg91Key)}&otp=${encodeURIComponent(otp)}`;
      const res = await fetch(url, { method: 'POST' });
      const data: any = await res.json();
      if (data && data.type === 'success') {
        return { success: true, provider: 'msg91', messageId: data.message };
      }
    } catch (err: any) {
      console.error('MSG91 error:', err?.message);
    }
  }

  // 4. Twilio SMS
  if (twilioSid && twilioToken && twilioFrom) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const bodyParams = new URLSearchParams({
        To: `+91${cleanDigits}`,
        From: twilioFrom,
        Body: `Your Teepul Store verification code is ${otp}. Valid for 10 minutes. Please do not share this code.`,
      });

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
      });

      const data: any = await res.json();
      if (res.ok && data.sid) {
        return { success: true, provider: 'twilio', messageId: data.sid };
      }
      console.warn('Twilio response notice:', data);
    } catch (err: any) {
      console.error('Twilio error:', err?.message);
    }
  }

  return {
    success: false,
    provider: 'none',
    error: 'No external SMS provider configured. Please provide FAST2SMS_API_KEY, TWOFACTOR_API_KEY, or TWILIO credentials in admin settings.',
  };
}
