// Vercel Serverless Function: /api/paytabs/verify-payment.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tran_ref } = req.body || {};

    if (!tran_ref) {
      return res.status(400).json({ error: 'Transaction reference (tran_ref) is required' });
    }

    const profileId = process.env.PAYTABS_PROFILE_ID || '155963';
    const serverKey = process.env.PAYTABS_SERVER_KEY || 'SRJ9WTBDGN-J9TKBMHBWM-ZDD9GNT6ZZ';
    const baseUrl = process.env.PAYTABS_BASE_URL || 'https://secure-egypt.paytabs.com';

    const response = await fetch(`${baseUrl}/payment/query`, {
      method: 'POST',
      headers: {
        'Authorization': serverKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profile_id: Number(profileId),
        tran_ref: String(tran_ref)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: data.message || 'Failed to query transaction status',
        details: data
      });
    }

    // PayTabs response_status:
    // 'A' = Authorised (Successful payment)
    // 'H' = On Hold
    // 'D' = Declined
    // 'E' = Error
    const responseStatus = data.payment_result?.response_status;
    const isPaid = responseStatus === 'A';

    return res.status(200).json({
      success: true,
      isPaid,
      response_status: responseStatus,
      response_message: data.payment_result?.response_message || '',
      tran_ref: data.tran_ref,
      cart_id: data.cart_id,
      cart_amount: data.cart_amount,
      cart_currency: data.cart_currency,
      payment_info: data.payment_info || null
    });

  } catch (error) {
    console.error('PayTabs verify-payment error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
