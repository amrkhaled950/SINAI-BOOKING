// Vercel Serverless Function: /api/paytabs/create-payment.js
export default async function handler(req, res) {
  // Set CORS headers
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
    const {
      bookingId,
      bookingType, // 'apartment' | 'safari' | 'transfer'
      title,
      customerName,
      customerEmail,
      customerPhone,
      amount,
      currency = 'EGP',
      returnUrl,
      notes
    } = req.body || {};

    const profileId = process.env.PAYTABS_PROFILE_ID || '155963';
    const serverKey = process.env.PAYTABS_SERVER_KEY || 'SRJ9WTBDGN-J9TKBMHBWM-ZDD9GNT6ZZ';
    const baseUrl = process.env.PAYTABS_BASE_URL || 'https://secure-egypt.paytabs.com';

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Determine host for callback/return if not passed
    const host = req.headers.host || 'sinai-booking.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = `${protocol}://${host}`;

    const finalReturnUrl = returnUrl || `${origin}/payment-result?bookingId=${encodeURIComponent(bookingId || '')}&type=${encodeURIComponent(bookingType || '')}`;
    const callbackUrl = `${origin}/api/paytabs/callback`;

    // PayTabs Egypt processes primary card transactions in EGP.
    // If USD is requested and not enabled on merchant profile, convert to EGP at the rate
    const usdRate = Number(process.env.PAYTABS_USD_RATE || 50);
    let finalCurrency = (currency || 'EGP').toUpperCase();
    let finalAmount = Number(amount);

    // If currency is USD, convert to EGP for reliable Egyptian bank gateway processing
    if (finalCurrency === 'USD') {
      finalAmount = Math.round(finalAmount * usdRate);
      finalCurrency = 'EGP';
    }

    const payload = {
      profile_id: Number(profileId),
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: String(bookingId || `sb_${Date.now()}`),
      cart_description: String(title || 'Sinai Booking Reservation').slice(0, 60),
      cart_currency: finalCurrency,
      cart_amount: Number(finalAmount.toFixed(2)),
      callback: callbackUrl,
      return: finalReturnUrl,
      customer_details: {
        name: customerName?.trim() || 'Sinai Guest',
        email: customerEmail?.trim() || 'booking@sinaibooking.com',
        phone: customerPhone?.trim() || '+201116664591',
        street1: 'Mashraba',
        city: 'Dahab',
        state: 'South Sinai',
        country: 'EG'
      },
      hide_shipping: true
    };

    const response = await fetch(`${baseUrl}/payment/request`, {
      method: 'POST',
      headers: {
        'Authorization': serverKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.redirect_url) {
      console.error('PayTabs Error response:', data);
      return res.status(400).json({
        error: data.message || 'Failed to initiate PayTabs transaction',
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      redirect_url: data.redirect_url,
      tran_ref: data.tran_ref,
      cart_id: data.cart_id,
      amount: finalAmount,
      currency: finalCurrency
    });

  } catch (error) {
    console.error('PayTabs serverless function error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
