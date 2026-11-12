// Vercel Serverless Function: /api/paytabs/callback.js
// Receives PayTabs Instant Payment Notifications (IPN) and updates Supabase server-side

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('PayTabs callback listener active');
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const tranRef = payload.tran_ref || payload.tranRef;
    const cartId = payload.cart_id || payload.cartId;
    const bookingType = req.query?.type || 'apartment';

    if (tranRef && cartId && UUID_REGEX.test(cartId)) {
      const profileId = process.env.PAYTABS_PROFILE_ID || '155963';
      const serverKey = process.env.PAYTABS_SERVER_KEY || 'SRJ9WTBDGN-J9TKBMHBWM-ZDD9GNT6ZZ';
      const baseUrl = process.env.PAYTABS_BASE_URL || 'https://secure-egypt.paytabs.com';

      const verifyRes = await fetch(`${baseUrl}/payment/query`, {
        method: 'POST',
        headers: {
          Authorization: serverKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile_id: Number(profileId),
          tran_ref: String(tranRef)
        })
      });
      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData?.payment_result?.response_status === 'A') {
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const serviceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && serviceKey) {
          const tableMap = {
            apartment: 'apartment_bookings',
            safari: 'safari_bookings',
            transfer: 'transfer_bookings'
          };
          const table = tableMap[bookingType] || 'apartment_bookings';
          const endpoint = `${supabaseUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(cartId)}`;
          const headers = {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal'
          };

          const patchRes = await fetch(endpoint, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              status: 'confirmed',
              payment_status: 'paid',
              paytabs_tran_ref: verifyData.tran_ref || tranRef,
              paid_amount: verifyData.cart_amount ? Number(verifyData.cart_amount) : null,
              paid_currency: verifyData.cart_currency || 'EGP'
            })
          });

          if (!patchRes.ok) {
            await fetch(endpoint, {
              method: 'PATCH',
              headers,
              body: JSON.stringify({
                status: 'confirmed',
                payment_method: 'card',
                notes: `PayTabs Paid (${verifyData.cart_amount || ''} ${verifyData.cart_currency || 'EGP'}) - Ref: ${verifyData.tran_ref || tranRef}`
              })
            });
          }
        }
      }
    }

    return res.status(200).json({ status: 'received' });
  } catch (error) {
    console.error('PayTabs callback error:', error);
    return res.status(200).json({ status: 'error', message: error.message });
  }
}
