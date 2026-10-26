import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev middleware plugin for PayTabs API routes
function paytabsDevPlugin() {
  return {
    name: 'paytabs-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/paytabs/create-payment')) {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const parsedBody = body ? JSON.parse(body) : {}
              const {
                bookingId,
                title,
                customerName,
                customerEmail,
                customerPhone,
                amount,
                currency = 'EGP',
                returnUrl
              } = parsedBody

              const profileId = process.env.PAYTABS_PROFILE_ID || '155963'
              const serverKey = process.env.PAYTABS_SERVER_KEY || 'SRJ9WTBDGN-J9TKBMHBWM-ZDD9GNT6ZZ'
              const baseUrl = process.env.PAYTABS_BASE_URL || 'https://secure-egypt.paytabs.com'
              const usdRate = Number(process.env.PAYTABS_USD_RATE || 50)

              let finalCurrency = (currency || 'EGP').toUpperCase()
              let finalAmount = Number(amount || 0)

              if (finalCurrency === 'USD') {
                finalAmount = Math.round(finalAmount * usdRate)
                finalCurrency = 'EGP'
              }

              const protocol = 'http'
              const host = req.headers.host || 'localhost:5173'
              const origin = `${protocol}://${host}`
              const finalReturnUrl = returnUrl || `${origin}/#payment-result?bookingId=${encodeURIComponent(bookingId || '')}`

              const payload = {
                profile_id: Number(profileId),
                tran_type: 'sale',
                tran_class: 'ecom',
                cart_id: String(bookingId || `sb_${Date.now()}`),
                cart_description: String(title || 'Sinai Booking Reservation').slice(0, 60),
                cart_currency: finalCurrency,
                cart_amount: Number(finalAmount.toFixed(2)),
                callback: `${origin}/api/paytabs/callback`,
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
              }

              const apiRes = await fetch(`${baseUrl}/payment/request`, {
                method: 'POST',
                headers: {
                  'Authorization': serverKey,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
              })

              const data = await apiRes.json()
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = apiRes.ok ? 200 : 400
              res.end(JSON.stringify(data))
            } catch (err) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        if (req.url?.startsWith('/api/paytabs/verify-payment')) {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const { tran_ref } = body ? JSON.parse(body) : {}
              const profileId = process.env.PAYTABS_PROFILE_ID || '155963'
              const serverKey = process.env.PAYTABS_SERVER_KEY || 'SRJ9WTBDGN-J9TKBMHBWM-ZDD9GNT6ZZ'
              const baseUrl = process.env.PAYTABS_BASE_URL || 'https://secure-egypt.paytabs.com'

              const apiRes = await fetch(`${baseUrl}/payment/query`, {
                method: 'POST',
                headers: {
                  'Authorization': serverKey,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  profile_id: Number(profileId),
                  tran_ref: String(tran_ref)
                })
              })

              const data = await apiRes.json()
              const isPaid = data.payment_result?.response_status === 'A'

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({
                success: true,
                isPaid,
                response_status: data.payment_result?.response_status,
                response_message: data.payment_result?.response_message,
                tran_ref: data.tran_ref,
                cart_id: data.cart_id,
                cart_amount: data.cart_amount,
                cart_currency: data.cart_currency,
                payment_info: data.payment_info
              }))
            } catch (err) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), paytabsDevPlugin()],
  server: {
    port: 5173,
    host: true
  }
})
