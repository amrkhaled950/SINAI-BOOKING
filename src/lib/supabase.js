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
 * Save booking record to Supabase
 */
export async function saveBooking(bookingData) {
  if (!supabase) {
    console.info('Supabase is not configured yet. Skipping remote insert:', bookingData)
    return { data: null, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()

    if (error) {
      console.error('Error saving booking to Supabase:', error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error saving booking:', err)
    return { data: null, error: err }
  }
}

/**
 * Save transfer request to Supabase
 */
export async function saveTransferRequest(transferData) {
  if (!supabase) {
    console.info('Supabase is not configured yet. Skipping transfer insert:', transferData)
    return { data: null, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('transfer_requests')
      .insert([transferData])
      .select()

    if (error) {
      console.error('Error saving transfer request to Supabase:', error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error saving transfer:', err)
    return { data: null, error: err }
  }
}

/**
 * Save newsletter subscriber to Supabase
 */
export async function saveNewsletterSubscriber(email, source = 'footer') {
  if (!supabase) {
    console.info('Supabase is not configured yet. Skipping newsletter insert:', email)
    return { data: null, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: email.toLowerCase().trim(), source }])
      .select()

    if (error && error.code !== '23505') { // ignore duplicate email error code
      console.error('Error saving newsletter subscriber:', error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error saving newsletter subscriber:', err)
    return { data: null, error: err }
  }
}
