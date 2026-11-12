// Vercel Serverless Function: /api/paytabs/return.js
// Handles PayTabs browser redirect (POST or GET) and converts it to a clean GET redirect to /payment-result
// Prevents HTTP 405 Method Not Allowed on static SPA routes.

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return Object.fromEntries(new URLSearchParams(req.body));
    }
  }
  return {};
}

async function updateSupabaseBookingServerSide(bookingType, bookingId, tranRef, amount, currency) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey || !bookingId || !UUID_REGEX.test(bookingId)) return;

  const tableMap = {
    apartment: 'apartment_bookings',
    safari: 'safari_bookings',
    transfer: 'transfer_bookings'
  };
  const table = tableMap[bookingType] || 'apartment_bookings';
  const endpoint = `${supabaseUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(bookingId)}`;
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal'
  };

  const fullUpdate = {
    status: 'confirmed',
    payment_status: 'paid',
    paytabs_tran_ref: tranRef,
    paid_amount: amount ? Number(amount) : null,
    paid_currency: currency || 'EGP'
  };

  try {
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(fullUpdate)
    });
    if (!res.ok) {
      // Fallback if optional payment columns are not yet migrated in live Supabase
      await fetch(endpoint, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          status: 'confirmed',
          payment_method: 'card',
          notes: `PayTabs Paid (${amount || ''} ${currency || 'EGP'}) - Ref: ${tranRef}`
        })
      });
    }
  } catch (err) {
    console.error('Server-side Supabase update error:', err);
  }
}

export default async function handler(req, res) {
  try {
    const body = parseBody(req);
    const query = req.query || {};

    const tranRef = body.tranRef || body.tran_ref || query.tranRef || query.tran_ref || '';
    const respStatus = body.respStatus || body.resp_status || query.respStatus || query.resp_status || '';
    const cartId = body.cartId || body.cart_id || query.cartId || query.cart_id || '';
    const bookingId = query.bookingId || cartId || '';
    const bookingType = query.type || 'apartment';

    // Server-side verification & DB update if tranRef is present
    if (tranRef) {
      const profileId = process.env.PAYTABS_PROFILE_ID || '155963';
      const serverKey = process.env.PAYTABS_SERVER_KEY || 'SRJ9WTBDGN-J9TKBMHBWM-ZDD9GNT6ZZ';
      const baseUrl = process.env.PAYTABS_BASE_URL || 'https://secure-egypt.paytabs.com';

      try {
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
          await updateSupabaseBookingServerSide(
            bookingType,
            bookingId || verifyData.cart_id,
            verifyData.tran_ref || tranRef,
            verifyData.cart_amount,
            verifyData.cart_currency
          );
        }
      } catch (verifyErr) {
        console.error('Return verification error:', verifyErr);
      }
    }

    const host = req.headers.host || 'www.sinaibooking.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const redirectParams = new URLSearchParams();
    if (bookingId) redirectParams.set('bookingId', bookingId);
    if (bookingType) redirectParams.set('type', bookingType);
    if (tranRef) redirectParams.set('tranRef', tranRef);
    if (respStatus) redirectParams.set('respStatus', respStatus);

    const destination = `${protocol}://${host}/payment-result?${redirectParams.toString()}`;
    res.writeHead(303, { Location: destination });
    res.end();
  } catch (error) {
    console.error('PayTabs return handler error:', error);
    res.writeHead(303, { Location: '/payment-result' });
    res.end();
  }
}
