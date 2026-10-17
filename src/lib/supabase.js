import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * 1. Save apartment booking (حجوزات الشقق)
 */
export async function saveApartmentBooking(b) {
  if (!supabase) {
    console.info('Supabase not configured. Skipping apartment booking:', b)
    return { data: null, error: null }
  }

  try {
    const payload = {
      apartment_name: b.apartment_name || b.item_title || 'Mashraba duplex (Studio 1)',
      apartment_code: b.apartment_code || 'Studio 1',
      customer_name: b.customer_name || null,
      customer_phone: b.customer_phone || null,
      customer_email: b.customer_email || null,
      nationality: b.nationality || 'egyptian',
      check_in_date: b.check_in_date || null,
      check_out_date: b.check_out_date || null,
      nights_count: b.nights_count || 1,
      guests_count: b.guests_count || 2,
      children_count: b.children_count || 0,
      stay_type: b.stay_type || 'daily',
      transportation_station: b.transportation_station || null,
      payment_method: b.payment_method || 'wallet',
      estimated_total_usd: b.estimated_total_usd || null,
      estimated_total_egp: b.estimated_total_egp || null,
      status: b.status || 'pending',
      notes: b.notes || null,
    }

    const { error } = await supabase.from('apartment_bookings').insert([payload])
    if (error) {
      console.error('Error saving apartment booking:', error)
      return { data: null, error }
    }
    return { data: true, error: null }
  } catch (err) {
    console.error('Unexpected error saving apartment booking:', err)
    return { data: null, error: err }
  }
}

/**
 * 2. Save safari tour booking (حجوزات رحلات السفاري)
 */
export async function saveSafariBooking(s) {
  if (!supabase) {
    console.info('Supabase not configured. Skipping safari booking:', s)
    return { data: null, error: null }
  }

  try {
    const payload = {
      tour_name: s.tour_name || s.item_title || 'Desert Safari',
      tour_id: s.tour_id || s.item_id || 'safari',
      preferred_camp: s.preferred_camp || null,
      customer_name: s.customer_name || null,
      customer_phone: s.customer_phone || null,
      customer_email: s.customer_email || null,
      nationality: s.nationality || 'egyptian',
      tour_date: s.tour_date || s.check_in_date || null,
      travelers_count: s.travelers_count || s.guests_count || 2,
      children_count: s.children_count || 0,
      transportation_station: s.transportation_station || null,
      payment_method: s.payment_method || 'wallet',
      duration: s.duration || null,
      estimated_price_usd: s.estimated_price_usd || s.estimated_total_usd || null,
      estimated_price_egp: s.estimated_price_egp || s.estimated_total_egp || null,
      status: s.status || 'pending',
      notes: s.notes || null,
    }

    const { error } = await supabase.from('safari_bookings').insert([payload])
    if (error) {
      console.error('Error saving safari booking:', error)
      return { data: null, error }
    }
    return { data: true, error: null }
  } catch (err) {
    console.error('Unexpected error saving safari booking:', err)
    return { data: null, error: err }
  }
}

/**
 * 3. Save bus & transfer booking (حجوزات الباصات والانتقالات)
 */
export async function saveTransferBooking(t) {
  if (!supabase) {
    console.info('Supabase not configured. Skipping transfer booking:', t)
    return { data: null, error: null }
  }

  try {
    const payload = {
      service_type: t.service_type || (t.vehicle_type === 'private' ? 'private_car' : 'hiace_bus'),
      pickup_location: t.pickup_location,
      dropoff_location: t.dropoff_location,
      cairo_station: t.cairo_station || t.transportation_station || null,
      travel_date: t.travel_date || null,
      passengers_count: t.passengers_count || t.guests_count || 1,
      children_count: t.children_count || 0,
      nationality: t.nationality || 'egyptian',
      customer_name: t.customer_name || null,
      customer_phone: t.customer_phone || null,
      payment_method: t.payment_method || 'wallet',
      status: t.status || 'pending',
      notes: t.notes || null,
    }

    const { error } = await supabase.from('transfer_bookings').insert([payload])
    if (error) {
      console.error('Error saving transfer booking:', error)
      return { data: null, error }
    }
    return { data: true, error: null }
  } catch (err) {
    console.error('Unexpected error saving transfer booking:', err)
    return { data: null, error: err }
  }
}

/**
 * 4. Save newsletter subscriber (جدول النشرة البريدية)
 */
export async function saveNewsletterSubscriber(email, source = 'footer') {
  if (!supabase) {
    console.info('Supabase not configured. Skipping newsletter insert:', email)
    return { data: null, error: null }
  }

  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: email.toLowerCase().trim(), source }])

    if (error && error.code !== '23505') {
      console.error('Error saving newsletter subscriber:', error)
      return { data: null, error }
    }
    return { data: true, error: null }
  } catch (err) {
    console.error('Unexpected error saving newsletter subscriber:', err)
    return { data: null, error: err }
  }
}

/**
 * Backwards compatibility wrappers
 */
export async function saveBooking(bookingData) {
  if (bookingData.booking_type === 'apartment') {
    return saveApartmentBooking(bookingData)
  }
  return saveSafariBooking(bookingData)
}

export async function saveTransferRequest(transferData) {
  return saveTransferBooking(transferData)
}
