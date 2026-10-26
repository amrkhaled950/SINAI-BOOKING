import React, { useState } from 'react'
import {
  ArrowUpRight,
  X,
  MessageCircle,
  Calendar,
  Users,
  MapPin,
  Car,
  Bus,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard
} from 'lucide-react'
import { saveTransferBooking } from '../lib/supabase'
import { createPayTabsSession } from '../lib/paytabs'

export default function TransportationPage({ t, lang, onNavigateHome }) {
  const page = t.transportationPage
  const isAr = lang === 'ar'

  const getTodayStr = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Booking / Enquiry Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [pickup, setPickup] = useState('Cairo')
  const [dropoff, setDropoff] = useState('Dahab')
  const [travelDate, setTravelDate] = useState(() => getTodayStr())
  const [passengers, setPassengers] = useState(2)
  const [children, setChildren] = useState(0)
  const [nationality, setNationality] = useState('egyptian')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [cairoStation, setCairoStation] = useState('riad')
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [notes, setNotes] = useState('')
  const [rideType, setRideType] = useState('hiace') // 'hiace' | 'private'
  const [isPaying, setIsPaying] = useState(false)
  const [payError, setPayError] = useState('')

  const handleOpenPlanner = (type, dest) => {
    if (type) setRideType(type)
    if (dest) setDropoff(dest)
    setPayError('')
    setIsPaying(false)
    setModalOpen(true)
  }

  const handlePayTabsTransferCheckout = async () => {
    try {
      setIsPaying(true)
      setPayError('')

      const totalEgp = rideType === 'private' ? 4500 : (Number(passengers) || 1) * 650

      const cairoStationsMap = {
        riad: isAr ? 'عبد المنعم رياض (12:00 بالليل)' : 'Abdel Moneim Riad (12:00 AM)',
        embassy: isAr ? 'سفارة الإمارات — مصر الجديدة (12:30 بالليل)' : 'UAE Embassy — Masr El Gedida (12:30 AM)',
        rehab: isAr ? 'الرحاب (1:00 صباحاً)' : 'Rehab (1:00 AM)',
        madinaty: isAr ? 'مدينتي (1:15 صباحاً)' : 'Madinaty (1:15 AM)',
        custom: isAr ? 'نقطة تحرك مخصصة' : 'Custom Pick-up'
      }

      const { data: savedBooking } = await saveTransferBooking({
        service_type: rideType === 'private' ? 'private_car' : 'hiace_bus',
        pickup_location: cairoStation === 'custom' ? pickup : cairoStationsMap[cairoStation],
        dropoff_location: dropoff,
        cairo_station: cairoStation !== 'custom' ? cairoStationsMap[cairoStation] : null,
        travel_date: travelDate,
        passengers_count: Number(passengers) || 1,
        children_count: Number(children) || 0,
        nationality: nationality,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        payment_method: 'card',
        payment_status: 'pending_payment',
        paid_amount: totalEgp,
        paid_currency: 'EGP',
        notes: notes || null,
        status: 'pending'
      })

      const bookingId = savedBooking?.id || `transfer_${Date.now()}`

      const session = await createPayTabsSession({
        bookingId,
        bookingType: 'transfer',
        title: `${rideType === 'private' ? (isAr ? 'عربية خاصة' : 'Private Car') : (isAr ? 'ميكروباص هايس' : 'Hiace Bus')} - ${dropoff} (${passengers} ${isAr ? 'ركاب' : 'passengers'})`,
        customerName,
        customerPhone,
        amount: totalEgp,
        currency: 'EGP',
        returnUrl: `${window.location.origin}/payment-result?bookingId=${encodeURIComponent(bookingId)}&type=transfer`
      })

      if (session.success && session.redirect_url) {
        window.location.href = session.redirect_url
      } else {
        setPayError(session.error || (isAr ? 'تعذر الاتصال ببوابة PayTabs حالياً' : 'Could not connect to payment gateway'))
      }
    } catch (err) {
      setPayError(err.message || 'Payment initiation failed')
    } finally {
      setIsPaying(false)
    }
  }

  const handleSendWhatsApp = () => {
    const vehicleLabel = rideType === 'hiace'
      ? (isAr ? 'ميكروباص هايس (Hiace - عائلي ومجموعات)' : 'Hiace Bus (Group/Family)')
      : (isAr ? 'عربية ملاكي خاصة (Private Car)' : 'Private Car Transfer')

    const cairoStationsMap = {
      riad: isAr ? 'عبد المنعم رياض (12:00 بالليل)' : 'Abdel Moneim Riad (12:00 AM)',
      embassy: isAr ? 'سفارة الإمارات — مصر الجديدة (12:30 بالليل)' : 'UAE Embassy — Masr El Gedida (12:30 AM)',
      rehab: isAr ? 'الرحاب (1:00 صباحاً)' : 'Rehab (1:00 AM)',
      madinaty: isAr ? 'مدينتي (1:15 صباحاً)' : 'Madinaty (1:15 AM)',
      custom: isAr ? 'نقطة تحرك مخصصة' : 'Custom Pick-up'
    }

    const paymentLabels = {
      wallet: isAr ? 'محفظة كاش (+201116664591)' : 'Mobile Wallet (+201116664591)',
      instapay: isAr ? 'انستاباي (InstaPay)' : 'InstaPay',
      card: isAr ? 'دفع أونلاين بالفيزا/كارت' : 'Pay online by card'
    }

    const nationalityLabel = nationality === 'egyptian' ? (isAr ? '🇪🇬 مصري' : '🇪🇬 Egyptian') : (isAr ? '🌍 أجنبي' : '🌍 Foreign')

    const msg = isAr
      ? `مساء الخير سيناء بوكينج، حابب احجز خدمة انتقالات ومواصلات:
• نوع النقل: ${vehicleLabel}
• الجنسية: ${nationalityLabel}
• من (المحطة): ${cairoStation === 'custom' ? pickup : cairoStationsMap[cairoStation]}
• إلى (الوجهة): ${dropoff}
• ميعاد السفر: ${travelDate}
• عدد الركاب: ${passengers}
• عدد الأطفال: ${children}
• الاسم: ${customerName || 'مش محدد'}
• رقم التليفون: ${customerPhone || 'مش محدد'}
• طريقة الدفع: ${paymentLabels[paymentMethod]}
${notes ? `• طلبات خاصة: ${notes}\n` : ''}يا ريت تأكدوا لنا التوافر والتكلفة وميعاد الحجز.`
      : `Hello Sinai Booking! I would like to book a transfer:
• Vehicle Preference: ${vehicleLabel}
• Nationality: ${nationalityLabel}
• From (Station): ${cairoStation === 'custom' ? pickup : cairoStationsMap[cairoStation]}
• To (Destination): ${dropoff}
• Travel Date: ${travelDate}
• Passengers: ${passengers}
• Children: ${children}
• Name: ${customerName || 'Not specified'}
• Phone: ${customerPhone || 'Not specified'}
• Payment Method: ${paymentLabels[paymentMethod]}
${notes ? `• Special requests: ${notes}\n` : ''}Please confirm availability and rate.`

    saveTransferBooking({
      service_type: rideType === 'private' ? 'private_car' : 'hiace_bus',
      pickup_location: cairoStation === 'custom' ? pickup : cairoStationsMap[cairoStation],
      dropoff_location: dropoff,
      cairo_station: cairoStation !== 'custom' ? cairoStationsMap[cairoStation] : null,
      travel_date: travelDate,
      passengers_count: passengers,
      children_count: children,
      nationality: nationality,
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
      payment_method: paymentMethod,
      notes: notes || null,
      status: 'pending'
    })

    window.open(`https://wa.me/201116664591?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="bg-[#FAF6EF] text-[#22211F] animate-in fade-in duration-300">
      
      {/* 1. Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs font-medium text-[#8C867C]">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#C8553D] transition-colors cursor-pointer"
          >
            {page.breadcrumbHome}
          </button>
          <span>/</span>
          <span className="text-[#22211F] font-semibold">{page.breadcrumbCurrent}</span>
        </nav>
      </div>

      {/* 2. Top Hero Section */}
      <section className="pt-6 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="inline-block px-3.5 py-1 bg-[#E2ECE5] text-[#2A6543] text-xs font-semibold tracking-wider rounded-full uppercase">
                  {page.hero.badge}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-bold text-[#183B33] tracking-tight leading-[1.08] whitespace-pre-line">
                {page.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-[#656057] font-normal leading-relaxed max-w-xl">
                {page.hero.subtitle}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => handleOpenPlanner()}
                  className="px-8 py-3.5 bg-[#9C4328] hover:bg-[#85371F] text-white text-sm font-semibold rounded-full shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  {page.hero.cta}
                </button>
                <div className="text-xs text-[#7A7367] font-medium pt-3">
                  {page.hero.quickLinks}
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image with Floating Badge Card */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-md border border-[#E8DFD0]">
                <img
                  src={page.hero.image}
                  alt="Getting around Sinai"
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Floating Info Card */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 rtl:right-auto rtl:left-4 sm:rtl:left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-black/5 max-w-[240px] sm:max-w-[270px]">
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#C45437] tracking-wider uppercase block">
                    {page.hero.overlay.badge}
                  </span>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-[#22211F] mt-0.5">
                    {page.hero.overlay.title}
                  </h4>
                  <p className="text-xs text-[#7A7367] mt-0.5">
                    {page.hero.overlay.subtitle}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Section 2: "Choose the ride that fits" (2 Ride Cards) */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-2 mb-10">
            <span className="text-xs font-bold tracking-[0.16em] text-[#C45437] uppercase block">
              {page.vehiclesSection.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1D1A] tracking-tight">
              {page.vehiclesSection.title}
            </h2>
            <p className="text-sm sm:text-base text-[#6B665E] max-w-2xl leading-relaxed">
              {page.vehiclesSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {page.vehiclesSection.rides.map((ride) => {
              const isDark = ride.theme === 'dark'
              return (
                <div
                  key={ride.id}
                  className={`rounded-[26px] p-7 sm:p-9 flex flex-col justify-between shadow-sm transition-all duration-300 ${
                    isDark
                      ? 'bg-[#132824] text-white border border-[#23423B]'
                      : 'bg-[#F5EFE6] text-[#22211F] border border-[#E7DFCE]'
                  }`}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full font-serif font-bold text-base flex items-center justify-center ${
                          isDark
                            ? 'bg-white/10 text-[#F2C078] border border-white/20'
                            : 'bg-[#DCEEE2] text-[#2A6543]'
                        }`}
                      >
                        {ride.iconLetter}
                      </div>
                      <span
                        className={`px-3 py-1 text-[11px] font-bold tracking-wider rounded-full uppercase ${
                          isDark
                            ? 'bg-white/10 text-white/90 border border-white/15'
                            : 'bg-white text-[#5C574F] border border-[#E3DBD0]'
                        }`}
                      >
                        {ride.badge}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className={`font-serif font-bold text-2xl sm:text-3xl mt-6 ${isDark ? 'text-white' : 'text-[#22211F]'}`}>
                      {ride.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed mt-2.5 max-w-md ${isDark ? 'text-white/80' : 'text-[#666159]'}`}>
                      {ride.desc}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="pt-8">
                    <button
                      onClick={() => handleOpenPlanner(ride.id)}
                      className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer group ${
                        isDark ? 'text-[#F2C078] hover:text-[#FFD18B]' : 'text-[#C45437] hover:text-[#9C4328]'
                      }`}
                    >
                      <span>{ride.action}</span>
                      <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* 4. Section 3: "Where are you headed?" (Sage background with 3 Destination Route Cards) */}
      <section className="py-16 bg-[#EBEFEA] border-y border-[#DCE4DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-2 mb-10 reveal">
            <span className="text-xs font-bold tracking-[0.16em] text-[#C45437] uppercase block">
              {page.destinationsSection.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1D1A] tracking-tight">
              {page.destinationsSection.title}
            </h2>
            <p className="text-sm sm:text-base text-[#666159] max-w-2xl leading-relaxed">
              {page.destinationsSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
            {page.destinationsSection.routes.map((route, idx) => (
              <div
                key={route.id}
                className={`bg-white rounded-[22px] overflow-hidden border border-[#D9E1D8] shadow-xs card-shadow-hover reveal-scale ${
                  idx === 0 ? 'stagger-1' : idx === 1 ? 'stagger-2' : 'stagger-3'
                } group flex flex-col justify-between active:scale-98 transition-all`}
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden bg-[#EDE5D8]">
                  <img
                    src={route.image}
                    alt={route.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Body */}
                <div className="p-5 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#22211F]">
                      {route.title}
                    </h3>
                    <p className="text-xs text-[#7A7367] mt-0.5">
                      {route.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenPlanner('hiace', route.title)}
                    className="text-xs font-semibold text-[#C45437] hover:text-[#9C4328] flex items-center gap-1 cursor-pointer flex-shrink-0 hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>{route.action}</span>
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Section 4: "A few details are all we need." (Dark Section) */}
      <section className="py-20 bg-[#102420] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: 3 Steps */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-[0.16em] text-[#E5AC67] uppercase block">
                  {page.detailsSection.badge}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-white tracking-tight leading-tight">
                  {page.detailsSection.title}
                </h2>
                <p className="text-sm sm:text-base text-white/70 max-w-lg leading-relaxed">
                  {page.detailsSection.subtitle}
                </p>
              </div>

              {/* 3 Step Items */}
              <div className="space-y-6 pt-2">
                {page.detailsSection.steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#1A3831] border border-white/10 text-xs font-bold text-[#E5AC67] flex items-center justify-center flex-shrink-0 font-mono">
                      {st.num}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {st.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-white/60 mt-0.5">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Direct Enquiry Box */}
            <div className="lg:col-span-5">
              <div className="bg-[#18352F] rounded-[24px] border border-white/10 p-7 sm:p-9 space-y-6 shadow-xl">
                <div>
                  <span className="px-3 py-1 bg-[#234F44] text-[#86EFAC] text-xs font-bold tracking-wider rounded-full uppercase inline-block">
                    {page.detailsSection.card.badge}
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-white mt-3">
                    {page.detailsSection.card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-mono mt-1">
                    {page.detailsSection.card.whatsapp}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleOpenPlanner()}
                    className="w-full py-4 px-6 bg-[#E5AC67] hover:bg-[#D49852] text-[#102420] font-bold text-sm sm:text-base rounded-full text-center transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    <span>{page.detailsSection.card.button}</span>
                  </button>
                  <span className="text-[11px] text-white/50 text-center block mt-3">
                    {page.detailsSection.card.note}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Interactive Modal for Planning Transfer */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-[#FAF6EF] w-full max-w-lg rounded-[28px] border border-[#E7DFCE] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E7DFCE] pb-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#C45437] uppercase">
                  {isAr ? 'حجز واستفسار الانتقالات' : 'TRANSFER ENQUIRY'}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#22211F] mt-1">
                  {isAr ? 'خطط لمسار انتقالك' : 'Plan your transfer'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white border border-[#E3DBD0] flex items-center justify-center text-[#6C6963] hover:text-black cursor-pointer shadow-sm"
              >
                <X size={18} />
              </button>
            </div>

            {/* Vehicle Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block">
                {isAr ? 'اختر وسيلة النقل' : 'Select Ride Type'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRideType('hiace')}
                  className={`p-3.5 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                    rideType === 'hiace'
                      ? 'border-[#9C4328] bg-white ring-2 ring-[#9C4328]/20'
                      : 'border-[#E7DFCE] bg-white/60 hover:bg-white'
                  }`}
                >
                  <Bus size={18} className="text-[#9C4328] mb-1.5" />
                  <span className="text-xs font-bold text-[#22211F] block">
                    {isAr ? 'ميكروباص هايس' : 'Hiace Bus'}
                  </span>
                  <span className="text-[10px] text-[#7A7367] block">
                    {isAr ? 'حتى 14 راكب' : 'Up to 14 guests'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRideType('private')}
                  className={`p-3.5 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                    rideType === 'private'
                      ? 'border-[#9C4328] bg-white ring-2 ring-[#9C4328]/20'
                      : 'border-[#E7DFCE] bg-white/60 hover:bg-white'
                  }`}
                >
                  <Car size={18} className="text-[#9C4328] mb-1.5" />
                  <span className="text-xs font-bold text-[#22211F] block">
                    {isAr ? 'سيارة خاصة ملاكي' : 'Private Car'}
                  </span>
                  <span className="text-[10px] text-[#7A7367] block">
                    {isAr ? 'خصوصية وراحة' : 'Comfort & privacy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Route Inputs */}
            <div className="space-y-4">
              
              {/* Nationality */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1.5">
                  {isAr ? 'الجنسية' : 'Nationality'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNationality('egyptian')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      nationality === 'egyptian'
                        ? 'bg-[#183B33] text-white border-[#183B33] shadow-sm'
                        : 'bg-white text-[#6C6963] border-[#D9D0C2] hover:border-[#183B33]'
                    }`}
                  >
                    <span>🇪🇬</span>
                    <span>{isAr ? 'مصري' : 'Egyptian'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNationality('foreign')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      nationality === 'foreign'
                        ? 'bg-[#183B33] text-white border-[#183B33] shadow-sm'
                        : 'bg-white text-[#6C6963] border-[#D9D0C2] hover:border-[#183B33]'
                    }`}
                  >
                    <span>🌍</span>
                    <span>{isAr ? 'أجنبي' : 'Foreign'}</span>
                  </button>
                </div>
              </div>

              {/* Transportation from Cairo (Stations) */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#22211F] flex items-center gap-1.5">
                    <span>🚐</span>
                    <span>{isAr ? 'محطات التحرك من القاهرة' : 'Transportation from Cairo'}</span>
                  </label>
                  <span className="text-[10px] text-[#C45437] font-bold">
                    {isAr ? 'رحلات يومية من القاهرة 🚐' : 'Daily departures from Cairo 🚐'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {[
                    { id: 'riad', labelEn: 'Abdel Moneim Riad', labelAr: 'عبد المنعم رياض', time: '12:00 AM' },
                    { id: 'embassy', labelEn: 'UAE Embassy — Masr El Gedida', labelAr: 'سفارة الإمارات — مصر الجديدة', time: '12:30 AM' },
                    { id: 'rehab', labelEn: 'Rehab', labelAr: 'الرحاب', time: '1:00 AM' },
                    { id: 'madinaty', labelEn: 'Madinaty', labelAr: 'مدينتي', time: '1:15 AM' },
                    { id: 'custom', labelEn: 'Custom pick-up point', labelAr: 'مكان تحرك مخصص آخر', time: null },
                  ].map((st) => (
                    <label
                      key={st.id}
                      onClick={() => setCairoStation(st.id)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        cairoStation === st.id
                          ? 'bg-[#FAF5ED] border-[#C45437] text-[#22211F] font-semibold ring-1 ring-[#C45437]/30'
                          : 'bg-white border-[#E7DFCE] text-[#6C6963] hover:border-[#C45437]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="cairoStationTransfer"
                          checked={cairoStation === st.id}
                          onChange={() => setCairoStation(st.id)}
                          className="text-[#C45437] focus:ring-[#C45437]"
                        />
                        <span>{isAr ? st.labelAr : st.labelEn}</span>
                      </div>
                      {st.time && (
                        <span className="font-mono text-[11px] text-[#C45437] bg-[#F4EBE1] px-2 py-0.5 rounded-full font-bold">
                          {st.time}
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                {cairoStation !== 'custom' ? (
                  <p className="text-[11px] text-[#7A756C] mt-2 bg-[#F6EFE5] p-2 rounded-lg leading-relaxed">
                    ℹ️ {isAr
                      ? 'سنرسل لك رقم كابتن الرحلة في الساعة 11 مساءً ليلة المغادرة (يتغير يومياً).'
                      : "We'll send you the trip captain's number at 11 PM the night before departure (it changes daily)."}
                  </p>
                ) : (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder={isAr ? 'اكتب نقطة التحرك المخصصة (مثال: مطار شرم الشيخ، دهب...)' : 'Enter custom pick-up (e.g. Sharm Airport, Dahab...)'}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#D9D0C2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                    />
                  </div>
                )}
              </div>

              {/* Destination & Date & Passengers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1.5">
                    {isAr ? 'الوجهة (إلى)' : 'Destination (To)'}
                  </label>
                  <input
                    type="text"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    placeholder="e.g. Dahab, Nuweiba, Taba..."
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#D9D0C2] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1.5">
                    {isAr ? 'تاريخ السفر' : 'Travel Date'}
                  </label>
                  <input
                    type="date"
                    min={getTodayStr()}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#D9D0C2] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1.5">
                    {isAr ? 'عدد الركاب البالغين' : 'No. of passengers'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#D9D0C2] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1.5">
                    {isAr ? 'عدد الأطفال' : 'No. of children'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#D9D0C2] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                </div>
              </div>

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1">
                    {isAr ? 'الاسم بالكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? 'اسمك بالكامل' : 'Your full name'}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#D9D0C2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1">
                    {isAr ? 'رقم الهاتف / الواتساب' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#D9D0C2] text-xs font-medium font-mono focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#22211F] block mb-1.5">
                  {isAr ? 'طريقة الدفع' : 'Payment method'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'wallet', labelEn: 'Mobile Wallet', labelAr: 'محفظة كاش', icon: '📱' },
                    { id: 'instapay', labelEn: 'InstaPay', labelAr: 'انستاباي', icon: '⚡' },
                    { id: 'card', labelEn: 'Pay online card', labelAr: 'دفع بالفيزا', icon: '💳' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'bg-[#183B33] text-white border-[#183B33] shadow-sm'
                          : 'bg-white text-[#6C6963] border-[#E7DFCE] hover:border-[#183B33]'
                      }`}
                    >
                      <div className="text-sm mb-0.5">{pm.icon}</div>
                      <div className="text-[10px] font-bold leading-tight">
                        {isAr ? pm.labelAr : pm.labelEn}
                      </div>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' ? (
                  <p className="text-[11px] text-[#183B33] mt-2 bg-[#E8F3EE] p-2 rounded-lg border border-[#BCD9CD] leading-relaxed flex items-center gap-1.5 font-medium">
                    💳 {isAr
                      ? 'الدفع الإلكتروني عبر بوابة PayTabs الآمنة بالفيزا أو الماستركارد أو ميزة.'
                      : 'Secure online payment via PayTabs with Visa, MasterCard, or Meeza.'}
                  </p>
                ) : (
                  <p className="text-[11px] text-[#7A756C] mt-2 bg-[#FAF5ED] p-2 rounded-lg border border-[#EDE3D3] leading-relaxed">
                    💵 {isAr
                      ? 'ابعت العربون لرقم المحفظة اللي تحت، وابعثلنا سكرين شوت بالتحويل على الواتساب. — 01116664591+'
                      : 'Send the deposit to the wallet number shown below, then attach a screenshot of the transfer to your WhatsApp message. — +201116664591'}
                  </p>
                )}
              </div>

              {/* Notes (optional) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1">
                  {isAr ? 'ملاحظات (اختياري)' : 'Notes (optional)'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'أي طلبات أو تفاصيل خاصة...' : 'Any special requests'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#D9D0C2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                />
              </div>

              {/* Estimated Total */}
              <div className="p-3.5 bg-[#F2ECE1] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7A7367] font-medium block">
                    {isAr ? 'إجمالي التكلفة التقديرية' : 'Estimated Cost'}
                  </span>
                  <span className="text-lg font-bold text-[#183B33]">
                    {rideType === 'private'
                      ? (isAr ? '4,500 ج.م' : '4,500 EGP')
                      : (isAr ? `${(Number(passengers) || 1) * 650} ج.م` : `${(Number(passengers) || 1) * 650} EGP`)}
                  </span>
                </div>
                <span className="text-[11px] text-[#7A7367] font-medium text-right rtl:text-left">
                  {rideType === 'private'
                    ? (isAr ? 'مشوار خاص مريح بالكامل' : 'Private transfer')
                    : (isAr ? `${passengers} أفراد في هايس مكيف` : `${passengers} seats in Hiace`)}
                </span>
              </div>

            </div>

            {/* Error Message */}
            {payError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                {payError}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 space-y-2">
              {paymentMethod === 'card' ? (
                <button
                  type="button"
                  onClick={handlePayTabsTransferCheckout}
                  disabled={isPaying}
                  className="w-full py-4 px-6 rounded-xl bg-[#183B33] hover:bg-[#122c26] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
                >
                  <CreditCard size={20} />
                  <span>
                    {isPaying
                      ? (isAr ? 'جاري فتح بوابة الدفع...' : 'Connecting to PayTabs...')
                      : (isAr
                          ? `ادفع الآن بالفيزا (${rideType === 'private' ? '4,500' : (Number(passengers) || 1) * 650} ج.م)`
                          : `Pay Now with Card (${rideType === 'private' ? '4,500' : (Number(passengers) || 1) * 650} EGP)`)}
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleSendWhatsApp}
                  className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <MessageCircle size={20} />
                  <span>{isAr ? 'ابعت طلب الحجز ع الواتساب' : 'Send via WhatsApp'}</span>
                </button>
              )}

              {paymentMethod === 'card' && (
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full py-2 text-xs text-[#7A7367] hover:text-[#22211F] text-center font-medium cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={14} className="text-[#25D366]" />
                  <span>{isAr ? 'أو كمّل الحجز بالواتساب والدفع عند الوصول / محفظة' : 'Or book via WhatsApp instead'}</span>
                </button>
              )}

              <p className="text-[11px] text-[#7A7367] text-center">
                {isAr ? 'تأكيد فوري وآمن مع فريق خدمة عملاء سيناء بوكينج على مدار الساعة.' : 'Instant, secure confirmation with Sinai Booking 24/7 team.'}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
