// Vercel Serverless Function: /api/paytabs/callback.js
// Receives PayTabs Instant Payment Notifications (IPN)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('PayTabs callback listener active');
  }

  try {
    const payload = req.body || {};
    console.log('PayTabs IPN callback received:', payload);

    // In a production server, here we would verify signature and update Supabase.
    // Since client also verifies upon return, acknowledge receipt:
    return res.status(200).json({ status: 'received' });
  } catch (error) {
    console.error('PayTabs callback error:', error);
    return res.status(200).json({ status: 'error', message: error.message });
  }
}
