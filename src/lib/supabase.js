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
 * 1. Save apartment booking (جدول حجوزات الشقق)
 */
export async function saveApartmentBooking(bookingData) {
  if (!supabase) {
    console.info('Supabase not configured. Skipping apartment booking:', bookingData)
    return { data: null, error: null }
  }

  try {
    const payload = {
      apartment_name: bookingData.item_title || bookingData.apartment_name || 'Mashraba duplex (Studio 1)',
      apartment_code: bookingData.apartment_code || 'Studio 1',
      customer_name: bookingData.customer_name || null,
      customer_phone: bookingData.customer_phone || null,
      customer_email: bookingData.customer_email || null,
      check_in_date: bookingData.check_in_date || null,
      check_out_date: bookingData.check_out_date || null,
      nights_count: bookingData.nights_count || 1,
      guests_count: bookingData.guests_count || 2,
      stay_type: bookingData.stay_type || 'daily',
      estimated_total_usd: bookingData.estimated_total_usd || null,
      estimated_total_egp: bookingData.estimated_total_egp || null,
      status: bookingData.status || 'pending',
      notes: bookingData.notes || null,
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
 * 2. Save safari tour booking (جدول حجوزات رحلات السفاري)
 */
export async function saveSafariBooking(safariData) {
  if (!supabase) {
    console.info('Supabase not configured. Skipping safari booking:', safariData)
    return { data: null, error: null }
  }

  try {
    const payload = {
      tour_name: safariData.item_title || safariData.tour_name || 'Desert Safari',
      tour_id: safariData.item_id || safariData.tour_id || 'safari',
      preferred_camp: safariData.preferred_camp || null,
      customer_name: safariData.customer_name || null,
      customer_phone: safariData.customer_phone || null,
      customer_email: safariData.customer_email || null,
      tour_date: safariData.tour_date || safariData.check_in_date || null,
      travelers_count: safariData.guests_count || safariData.travelers_count || 2,
      duration: safariData.duration || null,
      estimated_price_usd: safariData.estimated_total_usd || null,
      estimated_price_egp: safariData.estimated_total_egp || null,
      status: safariData.status || 'pending',
      notes: safariData.notes || null,
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
 * 3. Save bus & transfer booking (جدول حجوزات الباصات والانتقالات)
 */
export async function saveTransferBooking(transferData) {
  if (!supabase) {
    console.info('Supabase not configured. Skipping transfer booking:', transferData)
    return { data: null, error: null }
  }

  try {
    const payload = {
      service_type: transferData.vehicle_type === 'private' ? 'private_car' : 'hiace_bus',
      pickup_location: transferData.pickup_location,
      dropoff_location: transferData.dropoff_location,
      travel_date: transferData.travel_date || null,
      passengers_count: transferData.passengers_count || 1,
      customer_name: transferData.customer_name || null,
      customer_phone: transferData.customer_phone || null,
      status: transferData.status || 'pending',
      notes: transferData.notes || null,
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
 * Smart Backwards Compatibility Adapters
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
