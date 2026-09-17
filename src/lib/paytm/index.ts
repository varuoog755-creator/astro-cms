import { PaytmChecksum } from './checksum';

export interface PaytmInitiateParams {
  orderId: string;
  amount: number;
  customerId: string;
  customerPhone?: string;
  customerEmail?: string;
  mid: string;
  key: string;
  callbackUrl: string;
  isProduction?: boolean;
}

export interface PaytmInitiateResult {
  success: boolean;
  txnToken?: string;
  orderId: string;
  mid: string;
  isProduction: boolean;
  resultCode?: string;
  resultMsg?: string;
  error?: string;
  raw?: any;
}

export async function initiatePaytmTransaction(
  params: PaytmInitiateParams
): Promise<PaytmInitiateResult> {
  const {
    orderId,
    amount,
    customerId,
    mid,
    key,
    callbackUrl,
    isProduction = false,
  } = params;

  const host = isProduction
    ? 'securegw.paytm.in'
    : 'securegw-stage.paytm.in';

  const websiteName = isProduction ? 'DEFAULT' : 'WEBSTAGING';

  const paytmParams: Record<string, any> = {
    body: {
      requestType: 'Payment',
      mid,
      websiteName,
      orderId,
      callbackUrl,
      txnAmount: {
        value: amount.toFixed(2),
        currency: 'INR',
      },
      userInfo: {
        custId: customerId || 'CUST_GUEST',
        mobile: params.customerPhone || undefined,
        email: params.customerEmail || undefined,
      },
    },
  };

  try {
    const signature = await PaytmChecksum.generateSignature(
      paytmParams.body,
      key
    );

    paytmParams.head = {
      channelId: 'WEB',
      signature,
    };

    const url = `https://${host}/theia/api/v1/initiateTransaction?mid=${encodeURIComponent(mid)}&orderId=${encodeURIComponent(orderId)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paytmParams),
    });

    const data = await response.json();
    const resultInfo = data?.body?.resultInfo;

    if (resultInfo?.resultStatus === 'S' && data?.body?.txnToken) {
      return {
        success: true,
        txnToken: data.body.txnToken,
        orderId,
        mid,
        isProduction,
        resultCode: resultInfo.resultCode,
        resultMsg: resultInfo.resultMsg,
        raw: data,
      };
    }

    return {
      success: false,
      orderId,
      mid,
      isProduction,
      resultCode: resultInfo?.resultCode || 'UNKNOWN',
      resultMsg: resultInfo?.resultMsg || 'Transaction initiation failed',
      error: `Paytm [${resultInfo?.resultCode}]: ${resultInfo?.resultMsg}`,
      raw: data,
    };
  } catch (err: any) {
    console.error('Paytm Initiate API Exception:', err);
    return {
      success: false,
      orderId,
      mid,
      isProduction,
      error: err?.message || 'Network error connecting to Paytm',
    };
  }
}
