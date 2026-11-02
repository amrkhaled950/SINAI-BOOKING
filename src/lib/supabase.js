import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  (supabaseAnonKey || supabaseServiceKey) &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
)

// Use service role key if provided to ensure full unrestricted admin & booking access, fallback to anon
const activeKey = supabaseServiceKey || supabaseAnonKey

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, activeKey)
  : null

// Default Studio 1 & 2 fallback rooms
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
  },
  {
    id: 'studio-2',
    title: '2BR Boho Stone House & Private Roof (Lighthouse & Assala)',
    title_ar: 'بيت واستوديو بوهو غرفتين وروف خاص (بين اللايت هاوس والعصلة)',
    code: 'studio-2',
    location: 'Dahab - Between Lighthouse & Assala',
    location_ar: 'دهب - بين اللايت هاوس والعصلة',
    badge: '2BR HOUSE & PRIVATE ROOF',
    badge_ar: 'بيت غرفتين وروف وحديقة خاصة',
    price_usd: 60,
    price_egp: 3000,
    monthly_usd: 1300,
    monthly_egp: 65000,
    max_guests: 5,
    description: 'Authentic 2BR boho stone house & private roof between Lighthouse and Assala. Accommodates up to 5 guests with 2 AC bedrooms (one featuring an architecturally stunning vaulted brick dome ceiling with skylight), private garden & summer house, fire pit & BBQ lounge, spiral staircase to private rooftop terrace with mountain views, full kitchen, modern bathroom, and fast Wi-Fi.',
    description_ar: 'بيت واستوديو بوهو حجري مميز بين اللايت هاوس والعصلة يسع حتى 5 أفراد. يضم غرفتين نوم مكيفتين (غرفة بسقف قبة طوب حراري مميز مع فتحة سماوية وغرفة بأسرة خشبية مريحة)، حديقة خاصة وسلاية سمر هاوس، كانون شواء وفاير بيت (BBQ & Fire Pit)، سلم حلزوني لروف وتراس خاص بإطلالة جبلية، مطبخ متكامل وحمام مودرن وواي فاي سريع.',
    images: [
      '/images/studio-assala-courtyard-day.jpg',
      '/images/studio-assala-dome-bedroom.jpg',
      '/images/studio-assala-dome-skylight-wide.jpg',
      '/images/studio-assala-dome-bedroom-full.jpg',
      '/images/studio-assala-dome-bedroom-center.jpg',
      '/images/studio-assala-dome-bed-front.jpg',
      '/images/studio-assala-dome-desk.jpg',
      '/images/studio-assala-dome-arch-view.jpg',
      '/images/studio-assala-dome-warm-light.jpg',
      '/images/studio-assala-bedroom.jpg',
      '/images/studio-assala-bedroom-wood-mashrabiya.jpg',
      '/images/studio-assala-bedroom-wood-bed.jpg',
      '/images/studio-assala-bed-detail.jpg',
      '/images/studio-assala-rooftop-majlis.jpg',
      '/images/studio-assala-rooftop-pergola.jpg',
      '/images/studio-assala-rooftop-view.jpg',
      '/images/studio-assala-patio-aerial-day.jpg',
      '/images/studio-assala-patio.jpg',
      '/images/studio-assala-facade-night.jpg',
      '/images/studio-assala-patio-night.jpg',
      '/images/studio-assala-courtyard-night-aerial.jpg',
      '/images/studio-assala-firepit.jpg',
      '/images/studio-assala-majlis-night.jpg',
      '/images/studio-assala-kitchen-full.jpg',
      '/images/studio-assala-kitchen.jpg',
      '/images/studio-assala-fruit-basket.jpg',
      '/images/studio-assala-corridor.jpg',
      '/images/studio-assala-stairs.jpg',
      '/images/studio-assala-bougainvillea-stairs.jpg',
      '/images/studio-assala-spiral-stairs-night.jpg',
      '/images/studio-assala-aerial-patio.jpg',
      '/images/studio-assala-entrance.jpg',
      '/images/studio-assala-bathroom-1.jpg',
      '/images/studio-assala-bathroom-2.jpg',
      '/images/studio-assala-bathroom-wide.jpg'
    ],
    amenities: [
      'Up to 5 Guests',
      '2 AC Bedrooms (Vaulted Dome & Wood Ceiling)',
      'Private Garden & Summer House',
      'Private Rooftop Terrace with Mountain View',
      'Campfire / Fire Pit & BBQ Lounge',
      'Equipped Kitchen & Refrigerator',
      'Modern Bathroom & Heated Shower',
      'High-Speed Wi-Fi',
      'Rustic Boho Stone Architecture'
    ],
    amenities_ar: [
      'يسع حتى 5 أفراد',
      'غرفتين نوم مكيفتين (منهم غرفة بقبة طوب حراري وسقف مقوس)',
      'حديقة خاصة وسلاية سمر هاوس (Summer House)',
      'روف وتراس خاص بإطلالة بانورامية على الجبال',
      'كانون نار وفاير بيت ومنطقة شواء (BBQ & Fire Pit)',
      'مطبخ متكامل بثلاجة وبوتاجاز وميكروويف وأواني طهي',
      'حمام خاص مودرن وسخان مياه',
      'واي فاي سريع ومجاني',
      'طراز معماري بوهيمي حجري فاخر'
    ],
    is_available: true,
  },
  {
    id: 'villa-mashraba',
    title: '3BR Luxury Villa with Private Pool (Mashraba)',
    title_ar: 'فيلا المشربة الفاخرة بحمام سباحة خاص (3 غرف مكيّفة)',
    code: 'villa-mashraba',
    location: 'Dahab - Mashraba',
    location_ar: 'دهب - المشربة',
    badge: 'LUXURY VILLA & PRIVATE POOL',
    badge_ar: 'فيلا خاصة بحمام سباحة',
    price_usd: 120,
    price_egp: 6000,
    monthly_usd: 2800,
    monthly_egp: 140000,
    max_guests: 6,
    description: 'Exclusive 3-bedroom luxury villa in Dahab - Mashraba. Accommodates up to 6 guests with private crystal swimming pool, outdoor shaded pergola lounge with swing chair, 3 air-conditioned bedrooms, grand living salon with smart TV, 2 full bathrooms (with bathtub), and fully equipped modern kitchen with dining island & washing machine.',
    description_ar: 'فيلا فاخرة راقية في قلب المشربة بدهب تسع حتى 6 أفراد. تضم حمام سباحة خاص بمياه نقية، جلسة خارجية مظللة ببرجولة ومرجيحة استرخاء، 3 غرف نوم مكيّفة بالكامل، صالون معيشة واسع وشاشة ذكية، 2 حمام متكاملين (منهم حمام ببانيو)، ومطبخ حديث مجهز بالكامل بجزيرة طعام وغسالة ملابس.',
    images: [
      '/images/villa-mashraba-pool.jpg',
      '/images/villa-mashraba-patio-gazebo.jpg',
      '/images/villa-mashraba-living-main.jpg',
      '/images/villa-mashraba-living-grand.jpg',
      '/images/villa-mashraba-living-red-sofas.jpg',
      '/images/villa-mashraba-master-bedroom.jpg',
      '/images/villa-mashraba-bedroom-2.jpg',
      '/images/villa-mashraba-bedroom-3.jpg',
      '/images/villa-mashraba-bedroom-wardrobe.jpg',
      '/images/villa-mashraba-kitchen-full.jpg',
      '/images/villa-mashraba-kitchen-counter.jpg',
      '/images/villa-mashraba-kitchen-angle.jpg',
      '/images/villa-mashraba-staircase.jpg',
      '/images/villa-mashraba-staircase-view.jpg',
      '/images/villa-mashraba-bathroom-1.jpg',
      '/images/villa-mashraba-bathroom-1-bathtub.jpg',
      '/images/villa-mashraba-bathroom-1-wide.jpg',
      '/images/villa-mashraba-bathroom-2.jpg',
      '/images/villa-mashraba-bathroom-2-shower.jpg'
    ],
    amenities: [
      'Private Swimming Pool',
      'Up to 6 Guests',
      '3 Air-Conditioned Bedrooms',
      '2 Full Bathrooms with Bathtub',
      'Outdoor Shaded Pergola Lounge & Swing Chair',
      'Grand Living Salon with Smart TV',
      'Fully Equipped Kitchen & Dining Island',
      'Washing Machine & Microwave',
      'High-Speed Wi-Fi',
      'Prime Mashraba Location'
    ],
    amenities_ar: [
      'حمام سباحة خاص',
      'تسع حتى 6 أفراد',
      '3 غرف نوم مكيّفة بالكامل',
      '2 حمام متكامل (مع بانيو وشاور)',
      'جلسة خارجية مظللة ببرجولة ومرجيحة استرخاء',
      'صالون معيشة واسع وشاشة سمارت',
      'مطبخ متكامل حديث مع جزيرة طعام',
      'غسالة ملابس وميكروويف وبوتاجاز فرن',
      'واي فاي سريع ومجاني',
      'موقع هادئ ومميز في قلب المشربة'
    ],
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
      paytabs_tran_ref: b.paytabs_tran_ref || null,
      payment_status: b.payment_status || 'unpaid',
      paid_amount: b.paid_amount || null,
      paid_currency: b.paid_currency || null,
      estimated_total_usd: b.estimated_total_usd || null,
      estimated_total_egp: b.estimated_total_egp || null,
      status: b.status || 'pending',
      notes: b.notes || null,
    }
    const { data, error } = await supabase.from('apartment_bookings').insert([payload]).select().single()
    return { data: data || !error, error }
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
      paytabs_tran_ref: s.paytabs_tran_ref || null,
      payment_status: s.payment_status || 'unpaid',
      paid_amount: s.paid_amount || null,
      paid_currency: s.paid_currency || null,
      duration: s.duration || null,
      estimated_price_usd: s.estimated_price_usd || s.estimated_total_usd || null,
      estimated_price_egp: s.estimated_price_egp || s.estimated_total_egp || null,
      status: s.status || 'pending',
      notes: s.notes || null,
    }
    const { data, error } = await supabase.from('safari_bookings').insert([payload]).select().single()
    return { data: data || !error, error }
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
      paytabs_tran_ref: t.paytabs_tran_ref || null,
      payment_status: t.payment_status || 'unpaid',
      paid_amount: t.paid_amount || null,
      paid_currency: t.paid_currency || null,
      status: t.status || 'pending',
      notes: t.notes || null,
    }
    const { data, error } = await supabase.from('transfer_bookings').insert([payload]).select().single()
    return { data: data || !error, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function updateBookingPaymentStatus(type, id, updateData = {}) {
  if (!supabase || !id) return { data: null, error: null }
  const tableMap = {
    apartment: 'apartment_bookings',
    safari: 'safari_bookings',
    transfer: 'transfer_bookings'
  }
  const table = tableMap[type] || 'apartment_bookings'
  try {
    const { data, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function getBookingById(type, id) {
  if (!supabase || !id) return { data: null, error: null }
  const tableMap = {
    apartment: 'apartment_bookings',
    safari: 'safari_bookings',
    transfer: 'transfer_bookings'
  }
  const table = tableMap[type] || 'apartment_bookings'
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
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

    // Merge: ensure all DEFAULT_APARTMENTS exist, giving precedence to DB rows
    const existingCodes = new Set(data.map(d => d.code || d.id))
    const missingDefaults = DEFAULT_APARTMENTS.filter(def => !existingCodes.has(def.code) && !existingCodes.has(def.id))
    const merged = [...data, ...missingDefaults]

    return { data: merged, error: null }
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

export async function uploadRoomImage(file) {
  if (!supabase) return { url: null, error: 'Database not connected' }
  try {
    const fileExt = file.name.split('.').pop()
    const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
    const filePath = `room_${Date.now()}_${cleanName}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('rooms')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Storage upload error:', error)
      return { url: null, error }
    }

    const { data: pubData } = supabase.storage
      .from('rooms')
      .getPublicUrl(filePath)

    return { url: pubData.publicUrl, error: null }
  } catch (err) {
    return { url: null, error: err }
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
