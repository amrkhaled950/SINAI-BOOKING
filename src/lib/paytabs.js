// Sinai Booking - PayTabs Client Helper

/**
 * Initiate PayTabs payment session and get checkout redirect URL
 */
export async function createPayTabsSession({
  bookingId,
  bookingType = 'apartment',
  title = 'Sinai Booking',
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  amount = 0,
  currency = 'EGP',
  returnUrl = ''
}) {
  try {
    const res = await fetch('/api/paytabs/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bookingId,
        bookingType,
        title,
        customerName,
        customerEmail,
        customerPhone,
        amount,
        currency,
        returnUrl
      })
    })

    const data = await res.json()

    if (!res.ok || !data.redirect_url) {
      throw new Error(data.error || data.message || 'Failed to initiate PayTabs payment')
    }

    return {
      success: true,
      redirect_url: data.redirect_url,
      tran_ref: data.tran_ref,
      cart_id: data.cart_id,
      amount: data.amount,
      currency: data.currency
    }
  } catch (err) {
    console.error('createPayTabsSession error:', err)
    return {
      success: false,
      error: err.message || 'Network error while connecting to payment gateway'
    }
  }
}

/**
 * Verify PayTabs payment transaction status using tran_ref
 */
export async function verifyPayTabsTransaction(tran_ref) {
  try {
    const res = await fetch('/api/paytabs/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tran_ref })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to verify transaction')
    }

    return {
      success: true,
      isPaid: Boolean(data.isPaid),
      response_status: data.response_status,
      response_message: data.response_message,
      tran_ref: data.tran_ref,
      cart_id: data.cart_id,
      cart_amount: data.cart_amount,
      cart_currency: data.cart_currency,
      payment_info: data.payment_info
    }
  } catch (err) {
    console.error('verifyPayTabsTransaction error:', err)
    return {
      success: false,
      isPaid: false,
      error: err.message || 'Unable to verify payment'
    }
  }
}
