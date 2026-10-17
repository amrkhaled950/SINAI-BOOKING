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

// Default Studio 1 fallback room
export const DEFAULT_APARTMENTS = [
  {
    id: 'studio-1',
    title: 'Mashraba duplex (Studio 1)',
    title_ar: 'استوديو دوبلكس مشربه (Studio 1)',
    code: 'studio-1',
    location: 'Dahab - Mashraba',
    location_ar: 'دهب - المشربة',
    badge: 'DUPLEX APARTMENT',
    badge_ar: 'استوديو دوبلكس',
    price_usd: 40,
    price_egp: 2000,
    monthly_usd: 1200,
    monthly_egp: 60000,
    max_guests: 3,
    description: 'Comfortable duplex loft, sea view, AC and private bathroom with cozy living area and wooden staircase.',
    description_ar: 'غرفة دوبلكس مريحة، إطلالة بحرية، تكييف وحمام خاص، مع ركن معيشة فندقي مودرن ودرج خشبي للدور العلوي.',
    images: [
      '/images/duplex-hero-loft.jpg',
      '/images/duplex-full-structure.jpg',
      '/images/duplex-lower-lounge.jpg',
      '/images/duplex-living-room.jpg',
      '/images/duplex-living-tv.jpg',
      '/images/duplex-living-wide.jpg',
      '/images/duplex-lounge-outward.jpg',
      '/images/duplex-coffee-corner.jpg'
    ],
    amenities: ['Air Conditioning', 'High-Speed Wi-Fi', 'Private Bathroom', 'Smart TV', 'Kitchenette', 'Sea/Garden View'],
    amenities_ar: ['تكييف هواء سبليت', 'واي فاي سريع', 'حمام خاص متكامل', 'تلفزيون ذكي سمارت', 'مطبخ تحضيري', 'إطلالة هادئة'],
    is_available: true,
  }
]

/* ==========================================================
   1. Client Public Insert Methods
   ========================================================== */

export async function saveApartmentBooking(b) {
  if (!supabase) return { data: null, error: null }
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
    return { data: !error, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function saveSafariBooking(s) {
  if (!supabase) return { data: null, error: null }
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
    return { data: !error, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function saveTransferBooking(t) {
  if (!supabase) return { data: null, error: null }
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
    return { data: !error, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function saveNewsletterSubscriber(email, source = 'footer') {
  if (!supabase) return { data: null, error: null }
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: email.toLowerCase().trim(), source }])
    return { data: !error, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

/* ==========================================================
   2. Admin Fetching & Management Methods
   ========================================================== */

export async function fetchApartmentBookings() {
  if (!supabase) return { data: [], error: null }
  try {
    const { data, error } = await supabase
      .from('apartment_bookings')
      .select('*')
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  } catch (err) {
    return { data: [], error: err }
  }
}

export async function fetchConfirmedApartmentBookings(apartmentCode) {
  if (!supabase) return { data: [], error: null }
  try {
    const { data, error } = await supabase
      .from('apartment_bookings')
      .select('id, apartment_name, apartment_code, check_in_date, check_out_date, status, customer_name')
      .eq('status', 'confirmed')

    if (error) return { data: [], error }
    let list = data || []
    if (apartmentCode) {
      const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      const target = norm(apartmentCode)
      list = list.filter(b => {
        const c = norm(b.apartment_code)
        const n = norm(b.apartment_name)
        return !target || c.includes(target) || target.includes(c) || n.includes(target)
      })
    }
    return { data: list, error: null }
  } catch (err) {
    return { data: [], error: err }
  }
}

export async function fetchSafariBookings() {
  if (!supabase) return { data: [], error: null }
  try {
    const { data, error } = await supabase
      .from('safari_bookings')
      .select('*')
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  } catch (err) {
    return { data: [], error: err }
  }
}

export async function fetchTransferBookings() {
  if (!supabase) return { data: [], error: null }
  try {
    const { data, error } = await supabase
      .from('transfer_bookings')
      .select('*')
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  } catch (err) {
    return { data: [], error: err }
  }
}

export async function fetchNewsletterSubscribers() {
  if (!supabase) return { data: [], error: null }
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  } catch (err) {
    return { data: [], error: err }
  }
}

export async function updateBookingStatus(tableName, id, newStatus) {
  if (!supabase) return { data: null, error: null }
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update({ status: newStatus })
      .eq('id', id)
    return { data, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function deleteBookingRecord(tableName, id) {
  if (!supabase) return { data: null, error: null }
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
    return { data: !error, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

/* ==========================================================
   3. Apartments & Rooms CMS Methods
   ========================================================== */

export async function fetchApartments() {
  if (!supabase) return { data: DEFAULT_APARTMENTS, error: null }
  try {
    const { data, error } = await supabase
      .from('apartments')
      .select('*')
      .order('created_at', { ascending: true })

    if (error || !data || data.length === 0) {
      return { data: DEFAULT_APARTMENTS, error: null }
    }
    return { data, error: null }
  } catch (err) {
    return { data: DEFAULT_APARTMENTS, error: null }
  }
}

export async function createApartment(apt) {
  if (!supabase) return { data: null, error: 'Database not connected' }
  try {
    const { data, error } = await supabase
      .from('apartments')
      .insert([apt])
      .select()
    return { data: data?.[0] || null, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function updateApartment(id, updates) {
  if (!supabase) return { data: null, error: 'Database not connected' }
  try {
    const { data, error } = await supabase
      .from('apartments')
      .update(updates)
      .eq('id', id)
      .select()
    return { data: data?.[0] || null, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function deleteApartment(id) {
  if (!supabase) return { data: null, error: 'Database not connected' }
  try {
    const { error } = await supabase
      .from('apartments')
      .delete()
      .eq('id', id)
    return { data: !error, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

// Backwards compatibility adapters
export async function saveBooking(bookingData) {
  if (bookingData.booking_type === 'apartment') {
    return saveApartmentBooking(bookingData)
  }
  return saveSafariBooking(bookingData)
}

export async function saveTransferRequest(transferData) {
  return saveTransferBooking(transferData)
}
