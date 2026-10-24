import React, { useState } from 'react'
import {
  ArrowUpRight,
  X,
  MessageCircle,
  Calendar,
  Users,
  Clock,
  MapPin,
  Check,
  AlertCircle,
  Moon,
  Sparkles,
  Tent,
  Compass,
  Footprints,
  Utensils,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { saveSafariBooking } from '../lib/supabase'

export default function ExcursionsPage({ t, lang, onNavigateHome }) {
  const page = t.excursionsPage
  const isAr = lang === 'ar'

  // State
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [activeTab, setActiveTab] = useState('arada-canyon') // for the detailed itinerary view
  const [guestCount, setGuestCount] = useState(4) // default 4 (minimum per brochure)
  const [childrenCount, setChildrenCount] = useState(0)
  const [nationality, setNationality] = useState('egyptian')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [cairoStation, setCairoStation] = useState('none')
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [notes, setNotes] = useState('')
  const [selectedDate, setSelectedDate] = useState('2026-10-25')
  const [selectedCamp, setSelectedCamp] = useState('zigzag') // for 2-day trip
  const [activeDay, setActiveDay] = useState(1) // for 2-day trip tab
  const [essentialsTab, setEssentialsTab] = useState('one-day')
  const [showModalItinerary, setShowModalItinerary] = useState(false)
  const [showModalEssentials, setShowModalEssentials] = useState(false)

  const handleOpenTripModal = (trip) => {
    setSelectedTrip(trip)
    setShowModalItinerary(false)
    setShowModalEssentials(false)
  }

  const handleDirectWhatsApp = (trip) => {
    const msg = isAr
      ? `مساء الخير، حابب استفسر واحجز "${trip.title}" (${trip.price}) عن طريق Sinai Booking.`
      : `Hello! I would like to book the "${trip.title}" (${trip.price}) through Sinai Booking.`
    window.open(`https://wa.me/201116664591?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleModalWhatsApp = () => {
    if (!selectedTrip) return
    const campNote = selectedTrip.twoDays
      ? (isAr ? `\nالكامب المفضل: ${selectedCamp === 'zigzag' ? 'كانيون زجزاج (الرومانسي)' : 'الهواء الطلق جنب جبل مخروم (النجوم)'}` : `\nPreferred Camp: ${selectedCamp === 'zigzag' ? 'Zigzag Canyon (Romantic)' : 'Open Air near Gebel Makhroum (Stargazer)'}`)
      : ''

    const cairoStationsMap = {
      riad: isAr ? 'عبد المنعم رياض (12:00 بالليل)' : 'Abdel Moneim Riad (12:00 AM)',
      embassy: isAr ? 'سفارة الإمارات — مصر الجديدة (12:30 بالليل)' : 'UAE Embassy — Masr El Gedida (12:30 AM)',
      rehab: isAr ? 'الرحاب (1:00 صباحاً)' : 'Rehab (1:00 AM)',
      madinaty: isAr ? 'مدينتي (1:15 صباحاً)' : 'Madinaty (1:15 AM)',
      none: isAr ? 'من غير انتقالات (هاجي بمعرفتي)' : 'Without transportation (on my own)'
    }

    const paymentLabels = {
      wallet: isAr ? 'محفظة كاش (+201116664591)' : 'Mobile Wallet (+201116664591)',
      instapay: isAr ? 'انستاباي (InstaPay)' : 'InstaPay',
      card: isAr ? 'دفع أونلاين بالفيزا/كارت' : 'Pay online by card'
    }

    const nationalityLabel = nationality === 'egyptian' ? (isAr ? '🇪🇬 مصري' : '🇪🇬 Egyptian') : (isAr ? '🌍 أجنبي' : '🌍 Foreign')
    
    const msg = isAr
      ? `مساء الخير، حابب احجز رحلة "${selectedTrip.title}" عن طريق Sinai Booking.
• الجنسية: ${nationalityLabel}
• التاريخ المطلوب: ${selectedDate}
• عدد الأفراد: ${guestCount} أفراد (أقل عدد 4)
• عدد الأطفال: ${childrenCount}
• الاسم: ${customerName || 'مش محدد'}
• رقم الهاتف: ${customerPhone || 'مش محدد'}
• الانتقالات من القاهرة: ${cairoStationsMap[cairoStation]}
• طريقة الدفع: ${paymentLabels[paymentMethod]}${campNote}
• السعر التقديري: $${selectedTrip.priceUsd * guestCount}
${notes ? `• طلبات خاصة: ${notes}\n` : ''}يا ريت تأكدوا لنا التوافر ومواعيد الحجز.`
      : `Hello! I would like to book "${selectedTrip.title}" via Sinai Booking.
• Nationality: ${nationalityLabel}
• Requested Date: ${selectedDate}
• Guests: ${guestCount} adults (min. 4 people)
• Children: ${childrenCount}
• Name: ${customerName || 'Not specified'}
• Phone: ${customerPhone || 'Not specified'}
• Transportation from Cairo: ${cairoStationsMap[cairoStation]}
• Payment Method: ${paymentLabels[paymentMethod]}${campNote}
• Estimated total: $${selectedTrip.priceUsd * guestCount}
${notes ? `• Special requests: ${notes}\n` : ''}Please confirm availability and dates.`
    
    saveSafariBooking({
      tour_name: selectedTrip.title,
      tour_id: selectedTrip.id,
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
      nationality: nationality,
      tour_date: selectedDate,
      travelers_count: guestCount,
      children_count: childrenCount,
      transportation_station: cairoStationsMap[cairoStation],
      payment_method: paymentMethod,
      preferred_camp: selectedTrip.twoDays ? selectedCamp : null,
      duration: selectedTrip.twoDays ? '2 Days / 1 Night' : 'Full Day',
      estimated_price_usd: selectedTrip.priceUsd * guestCount,
      notes: notes || null,
      status: 'pending'
    })

    window.open(`https://wa.me/201116664591?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const currentTabTrip = page.trips.find(tr => tr.id === activeTab) || page.trips[0]

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

      {/* 2. Top Hero Section: "Desert days from Dahab." */}
      <section className="pt-6 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headings & Copy */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold tracking-[0.16em] text-[#C45437] uppercase">
                  {page.hero.badge}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-bold text-[#183B33] tracking-tight leading-[1.08] whitespace-pre-line">
                {page.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-[#656057] font-normal leading-relaxed max-w-xl">
                {page.hero.subtitle}
              </p>
            </div>

            {/* Right Column: Hero Image (Dahab Coastline & Azure Sea) */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-md border border-[#E8DFD0]">
                <img
                  src={page.hero.image}
                  alt="Dahab Coastline Desert Safaris"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Section 2: "Choose your desert trip" with 3 Trip Cards (Exact match to screenshot & PDF page 1) */}
      <section className="pt-4 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="space-y-2 mb-10 reveal">
            <span className="text-xs font-bold tracking-[0.16em] text-[#C45437] uppercase block">
              {page.section.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#22211F] tracking-tight">
              {page.section.title}
            </h2>
            <p className="text-sm sm:text-base text-[#6B665E] max-w-2xl leading-relaxed">
              {page.section.subtitle}
            </p>
          </div>

          {/* 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
            {page.trips.map((trip, idx) => (
              <div
                key={trip.id}
                className={`bg-[#FBF9F4] rounded-[22px] border border-[#E7DFCE] p-3.5 sm:p-4 flex flex-col justify-between shadow-xs card-shadow-hover reveal-scale ${
                  idx === 0 ? 'stagger-1' : idx === 1 ? 'stagger-2' : 'stagger-3'
                } group active:scale-98 transition-all`}
              >
                {/* Top Image */}
                <div className="aspect-[16/10] rounded-[16px] overflow-hidden mb-4 bg-[#EDE5D8]">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold tracking-wider text-[#C45437] uppercase block">
                      {trip.tag}
                    </span>
                    <h3 className="text-xl sm:text-[22px] font-serif font-bold text-[#22211F] leading-snug">
                      {trip.title}
                    </h3>
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <div className="text-sm sm:text-[15px] font-bold text-[#A8432B]">
                        {trip.price}
                      </div>
                      <span className="text-[11px] text-[#7A7367] font-medium">
                        {trip.minPeople}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#7A7367] flex items-center gap-1.5 pt-0.5">
                      <Clock size={12} className="text-[#C45437]" />
                      <span>{trip.schedule}</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#69645C] leading-relaxed pt-1">
                      {trip.desc}
                    </p>
                  </div>

                  {/* Action Button: "View details & book ↗" */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTripModal(trip)}
                      className="btn-shimmer w-full py-3 px-4 rounded-[12px] bg-[#9C4328] hover:bg-[#85371F] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:scale-102 transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      <span>{trip.button}</span>
                      <ArrowUpRight size={16} className="inline-block flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Adaptation Banner (From Page 1 & 4 of PDF) */}
          <div className="mt-8 bg-[#9C4328] text-white rounded-[20px] p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-lg sm:text-xl font-bold tracking-tight">
                {page.adaptBanner.title}
              </h4>
              <p className="text-xs sm:text-sm text-white/90">
                {page.adaptBanner.subtitle}
              </p>
            </div>
            <a
              href="https://wa.me/201116664591?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D9%86%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AA%D9%81%D8%B5%D9%8A%D9%84%20%D8%B1%D8%AD%D9%84%D8%A9%20%D8%B3%D9%81%D8%A7%D8%B1%D9%8A%20%D8%AE%D8%A7%D8%B5%D8%A9%20%D8%A8%D9%85%D8%AC%D9%85%D9%88%D8%B9%D8%AA%D9%86%D8%A7%20(Custom%20Safari)"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#9C4328] hover:bg-[#FAF6EF] text-xs sm:text-sm font-bold rounded-full transition-all shadow active:scale-95 flex-shrink-0"
            >
              <MessageCircle size={16} />
              <span>{page.adaptBanner.cta}</span>
            </a>
          </div>

        </div>
      </section>

      {/* 4. Section 3: Detailed Day-by-Day Itineraries (From PDF Page 2 & 3) */}
      <section className="py-14 bg-[#F5EDE1] border-y border-[#E7DFCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="text-xs font-bold tracking-[0.16em] text-[#C45437] uppercase">
              {isAr ? 'تفاصيل المسار والمحطات اليومية' : 'DETAILED TRIP ITINERARIES'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1D1A]">
              {isAr ? 'خطوة بخطوة في عمق صحراء جنوب سيناء' : 'Two ways to spend a day & a two-day journey'}
            </h2>
            <p className="text-sm sm:text-base text-[#6B665E]">
              {isAr ? 'تعرف على التوقيتات والمحطات والأنشطة المقررة لكل رحلة بالتفصيل:' : 'Explore the full hour-by-hour schedules, hikes, and fossil plateaus for each safari:'}
            </p>
          </div>

          {/* Trip Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-6">
            {page.trips.map((tr) => (
              <button
                key={tr.id}
                onClick={() => {
                  setActiveTab(tr.id)
                  setActiveDay(1)
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === tr.id
                    ? 'bg-[#183B33] text-white shadow-md'
                    : 'bg-white text-[#6B665E] hover:bg-[#EBE2D4] border border-[#E7DFCE]'
                }`}
              >
                {tr.title}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="bg-white rounded-[24px] border border-[#E7DFCE] p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D5]">
              <div>
                <span className="text-xs font-bold text-[#C45437] uppercase tracking-wider block">
                  {currentTabTrip.badge || currentTabTrip.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1D1A] mt-1">
                  {currentTabTrip.title}
                </h3>
                {currentTabTrip.subtitle && (
                  <p className="text-xs sm:text-sm italic text-[#7A7367] mt-1 max-w-2xl">
                    "{currentTabTrip.subtitle}"
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-sm sm:text-base font-bold text-[#A8432B]">{currentTabTrip.price}</span>
                  <span className="text-xs text-[#6B665E] font-medium">· {currentTabTrip.minPeople}</span>
                  <span className="text-xs text-[#183B33] bg-[#E2ECE5] px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                    <Clock size={12} />
                    <span>{currentTabTrip.schedule}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenTripModal(currentTabTrip)}
                  className="px-6 py-3 rounded-full bg-[#9C4328] hover:bg-[#85371F] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>{isAr ? 'احجز الرحلة دي' : 'Book this trip'}</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            {/* If 2 Days Trip: Day 1 / Day 2 Switcher */}
            {currentTabTrip.twoDays && (
              <div className="flex items-center gap-2 pt-6">
                <button
                  onClick={() => setActiveDay(1)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeDay === 1
                      ? 'bg-[#A8432B] text-white shadow-sm'
                      : 'bg-[#F2ECE1] text-[#6B665E] hover:bg-[#E5DDCF]'
                  }`}
                >
                  {isAr ? 'اليوم الأول: النقوش، الكانيون، والمبيت' : 'Day 1 — Inscriptions, canyon and camp'}
                </button>
                <button
                  onClick={() => setActiveDay(2)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeDay === 2
                      ? 'bg-[#A8432B] text-white shadow-sm'
                      : 'bg-[#F2ECE1] text-[#6B665E] hover:bg-[#E5DDCF]'
                  }`}
                >
                  {isAr ? 'اليوم الثاني: الجبال، الكثبان، والرجوع' : 'Day 2 — Mountains, dunes, home'}
                </button>
              </div>
            )}

            {/* Timeline Items */}
            <div className="mt-8 space-y-6">
              {((currentTabTrip.twoDays ? (activeDay === 1 ? currentTabTrip.day1 : currentTabTrip.day2) : currentTabTrip.itinerary) || []).map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 sm:gap-6 group">
                  {/* Timeline Badge */}
                  <div className="flex-shrink-0 w-24 sm:w-28 pt-1">
                    <span className="inline-block px-2.5 py-1 bg-[#F5EDE1] text-[#183B33] text-[11px] sm:text-xs font-mono font-bold rounded-md">
                      {step.time}
                    </span>
                  </div>

                  {/* Bullet & Connector Line */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#C45437] ring-4 ring-[#FAF6EF]"></div>
                    {idx < (currentTabTrip.twoDays ? (activeDay === 1 ? currentTabTrip.day1.length : currentTabTrip.day2.length) : currentTabTrip.itinerary.length) - 1 && (
                      <div className="w-0.5 h-full bg-[#EAE3D5] my-1 flex-1 min-h-[36px]"></div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 pb-6 space-y-1">
                    <h4 className="text-base sm:text-lg font-bold text-[#22211F] group-hover:text-[#C45437] transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#666159] leading-relaxed max-w-2xl">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Photo Highlights Bar inside Itinerary (PDF Page 2 & 3) */}
            <div className="mt-8 pt-6 border-t border-[#EAE3D5]">
              <span className="text-xs font-bold text-[#7A7367] uppercase tracking-wider block mb-4">
                {isAr ? 'معالم موثقة بالصور من خط سير الرحلة' : 'Photo Highlights From The Route'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {(page.galleryHighlights || [
                  { title: isAr ? 'صخرة نقوش وادي عراضة' : 'Rock of Inscriptions', image: '/images/excursion-inscriptions.jpg' },
                  { title: isAr ? 'مقابر النواميس الأثرية' : 'The Nawamis tombs', image: '/images/excursion-nawamis-tombs.jpg' },
                  { title: isAr ? 'التزلج على كثبان هدودة' : 'Sandboarding on Hedoda', image: '/images/pdf_img_4.jpg' },
                  { title: isAr ? 'قمة كثبان هدودة الرملية' : 'The crest of Hedoda', image: '/images/excursion-hedoda-dunes.jpg' },
                  { title: isAr ? 'هايكنج الكانيون المزدوج' : 'The Double Canyon', image: '/images/excursion-double-canyon.jpg' }
                ]).map((item, idx) => (
                  <div key={idx} className="group flex flex-col space-y-1.5">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#EDE5D8] border border-[#E7DFCE] shadow-xs">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#22211F] line-clamp-1 group-hover:text-[#C45437] transition-colors">
                      {isAr ? (item.title || item.enTitle) : (item.enTitle || item.title)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Section 4: "Where you'll sleep — choose your camp" (PDF Page 4) */}
      <section className="py-16 bg-[#162534] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-bold tracking-[0.16em] text-[#E07A5F] uppercase">
              {page.whereYouSleep.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white">
              {page.whereYouSleep.title}
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              {page.whereYouSleep.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {page.whereYouSleep.camps.map((camp) => (
              <div
                key={camp.id}
                className="bg-white/5 rounded-[28px] border border-white/10 overflow-hidden hover:border-[#E07A5F]/50 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Camp Image */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={camp.image}
                    alt={camp.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-[#E07A5F] uppercase tracking-wider">
                    {camp.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white">
                      {camp.title}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {camp.desc}
                    </p>

                    {camp.tip && (
                      <div className="p-4 bg-white/10 rounded-2xl border border-white/15 text-xs text-[#F2C078] leading-relaxed flex items-start gap-2.5">
                        <Moon size={16} className="flex-shrink-0 mt-0.5 text-[#F2C078]" />
                        <span>{camp.tip}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-white/60">
                      {isAr ? 'مشمول ضمن رحلة اليومين' : 'Included in 2-Day Desert Trip'}
                    </span>
                    <button
                      onClick={() => {
                        const trip = page.trips.find(t => t.id === 'overnight')
                        setSelectedCamp(camp.id)
                        handleOpenTripModal(trip)
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#E07A5F] hover:bg-[#C45437] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      {isAr ? 'اختر هذا الكامب' : 'Select this camp'}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Section 5: Trip Essentials (Included, Not Included, What to Bring) (PDF Page 2 & 4) */}
      <section className="py-16 bg-[#FAF6EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-bold tracking-[0.16em] text-[#C45437] uppercase">
              {isAr ? 'كل ما تحتاج معرفته' : 'EVERYTHING YOU NEED TO KNOW'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1D1A]">
              {page.tripEssentials.sectionTitle || (isAr ? 'تجهيزات وتفاصيل الرحلة' : 'Trip Essentials')}
            </h2>
            <p className="text-sm sm:text-base text-[#6B665E]">
              {page.tripEssentials.sectionSubtitle || (isAr ? 'تعرف على كل المشمول والمطلوب إحضاره لكل رحلة بالتفصيل:' : 'Everything included and what you should bring for each trip:')}
            </p>
          </div>

          {/* Switcher between 1-Day trips and 2-Day Overnight Trip (From PDF Page 2 & Page 4) */}
          <div className="flex justify-center items-center gap-3 mb-10">
            <button
              onClick={() => setEssentialsTab('one-day')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                essentialsTab === 'one-day'
                  ? 'bg-[#183B33] text-white shadow-md'
                  : 'bg-white text-[#6B665E] hover:bg-[#EBE2D4] border border-[#E7DFCE]'
              }`}
            >
              {isAr ? 'رحلات اليوم الواحد (95 USD)' : 'One-Day Trips (95 USD)'}
            </button>
            <button
              onClick={() => setEssentialsTab('overnight')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                essentialsTab === 'overnight'
                  ? 'bg-[#183B33] text-white shadow-md'
                  : 'bg-white text-[#6B665E] hover:bg-[#EBE2D4] border border-[#E7DFCE]'
              }`}
            >
              {isAr ? 'رحلة المبيت يومين وليلة (190 USD)' : 'The Overnight Trip (190 USD)'}
            </button>
          </div>

          {(() => {
            const currentEssentials = (essentialsTab === 'one-day' ? page.tripEssentials.oneDay : page.tripEssentials.overnight) || page.tripEssentials.oneDay || page.tripEssentials
            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7DFCE] pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#C45437] uppercase tracking-wider block">
                      {currentEssentials.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#22211F]">
                      {currentEssentials.title}
                    </h3>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#A8432B] bg-[#FAF1EE] border border-[#E7DFCE] px-3.5 py-1.5 rounded-full w-fit">
                    {currentEssentials.priceInfo}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {/* 1. Included */}
                  <div className="bg-white rounded-[24px] border border-[#E7DFCE] p-7 shadow-sm space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E2ECE5] text-[#2A6543] flex items-center justify-center">
                      <Check size={20} />
                    </div>
                    <h4 className="text-xl font-serif font-bold text-[#22211F]">
                      {currentEssentials.includedTitle}
                    </h4>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#5C574F]">
                      {(currentEssentials.included || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-[#2A6543] font-bold mt-0.5">✓</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 2. Not Included */}
                  <div className="bg-white rounded-[24px] border border-[#E7DFCE] p-7 shadow-sm space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FDE8E8] text-[#9C2727] flex items-center justify-center">
                      <X size={20} />
                    </div>
                    <h4 className="text-xl font-serif font-bold text-[#22211F]">
                      {currentEssentials.notIncludedTitle}
                    </h4>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#5C574F]">
                      {(currentEssentials.notIncluded || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-[#9C2727] font-bold mt-0.5">✕</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. What to Bring */}
                  <div className="bg-white rounded-[24px] border border-[#E7DFCE] p-7 shadow-sm space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                      <Footprints size={20} />
                    </div>
                    <h4 className="text-xl font-serif font-bold text-[#22211F]">
                      {currentEssentials.bringTitle}
                    </h4>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#5C574F]">
                      {(currentEssentials.bring || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-[#D97706] font-bold mt-0.5">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })()}

        </div>
      </section>

      {/* 7. Bottom Callout Banner (Exact match to PDF Page 4 Bottom) */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#9C4328] text-white rounded-[28px] p-8 sm:p-12 shadow-lg text-center space-y-5">
            <h3 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
              {isAr ? 'أي رحلة تناسب مغامرتك الجاية؟' : 'Which trip is yours?'}
            </h3>
            <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto">
              {isAr
                ? 'رحلة اليوم الواحد 95 دولار · رحلة التزلج على الرمال 95 دولار · رحلة المبيت ليلتين 190 دولار للفرد · أقل عدد 4 أفراد · كل الرحلات نقدر نعدلها ونفصلها على مقاسك.'
                : 'Day trip 95 USD · Sandboarding 95 USD · Overnight 190 USD per person · min. 4 people · all trips can be adapted.'}
            </p>
            <p className="font-script text-2xl sm:text-3xl text-white/95">
              {isAr ? 'ابعت لنا تواريخك ومجموعتك وهنساعدك تختار الأنسب.' : 'Send us your dates and we\'ll help you choose.'}
            </p>
            <div className="pt-2 flex justify-center">
              <a
                href="https://wa.me/201116664591?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B5%D8%AD%D8%B1%D8%A7%D8%A1%20%D9%88%D8%A7%D9%84%D8%B3%D9%81%D8%A7%D8%B1%D9%8A%20%D9%85%D9%86%20%D8%AF%D9%87%D8%A8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-[#FAF6EF] text-[#9C4328] font-bold text-sm sm:text-base rounded-full shadow-lg transition-all active:scale-95"
              >
                <MessageCircle size={20} />
                <span>{isAr ? 'كلمنا واتساب: 01116664591' : 'Send via WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Interactive Booking & Details Modal */}
      {selectedTrip && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedTrip(null)}
        >
          <div
            className="bg-[#FAF6EF] w-full max-w-xl rounded-[28px] border border-[#E7DFCE] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E7DFCE] pb-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#C45437] uppercase">
                  {selectedTrip.tag}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#22211F] mt-1">
                  {selectedTrip.title}
                </h3>
                <p className="text-sm font-bold text-[#A8432B] mt-0.5">
                  {selectedTrip.price} · <span className="text-xs font-normal text-[#6B665E]">{selectedTrip.minPeople}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="w-9 h-9 rounded-full bg-white border border-[#E3DBD0] flex items-center justify-center text-[#6C6963] hover:text-black cursor-pointer shadow-sm"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image Preview */}
            <div className="aspect-[16/9] rounded-[18px] overflow-hidden shadow-sm">
              <img
                src={selectedTrip.image}
                alt={selectedTrip.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description & Timing */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#183B33] bg-[#E2ECE5] px-3.5 py-1.5 rounded-full w-fit">
                <Clock size={14} />
                <span>{selectedTrip.schedule}</span>
              </div>
              <p className="text-sm text-[#5C574F] leading-relaxed">
                {selectedTrip.desc}
              </p>
            </div>

            {/* Camp selector if two days */}
            {selectedTrip.twoDays && (
              <div className="space-y-2 pt-2 border-t border-[#E7DFCE]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block">
                  {isAr ? 'اختر الكامب المفضل لك للمبيت:' : 'Choose your preferred camp:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCamp('zigzag')}
                    className={`p-3 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                      selectedCamp === 'zigzag'
                        ? 'border-[#9C4328] bg-white ring-2 ring-[#9C4328]/20'
                        : 'border-[#E7DFCE] bg-white/60 hover:bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#9C4328] block">
                      {isAr ? 'كانيون زجزاج (رومانسي)' : 'Zigzag Canyon (Romantic)'}
                    </span>
                    <span className="text-[11px] text-[#6B665E] block mt-0.5">
                      {isAr ? 'عشاء بالشموع وخصوصية بين الجدران' : 'Candle-lit dinner wrapped in stone'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCamp('stargazer')}
                    className={`p-3 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                      selectedCamp === 'stargazer'
                        ? 'border-[#9C4328] bg-white ring-2 ring-[#9C4328]/20'
                        : 'border-[#E7DFCE] bg-white/60 hover:bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#9C4328] block">
                      {isAr ? 'قرب جبل مخروم (نجوم)' : 'Gebel Makhroum (Stargazer)'}
                    </span>
                    <span className="text-[11px] text-[#6B665E] block mt-0.5">
                      {isAr ? 'تحت سماء المجرة المفتوحة' : 'Open air under the Milky Way'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Details Accordion inside Modal */}
            <div className="space-y-2 pt-2 border-t border-[#E7DFCE]">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModalItinerary(!showModalItinerary)
                    if (!showModalItinerary) setShowModalEssentials(false)
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    showModalItinerary
                      ? 'bg-[#183B33] text-white border-[#183B33]'
                      : 'bg-white text-[#6B665E] border-[#D9D0C2] hover:bg-[#FAF6EF]'
                  }`}
                >
                  <Clock size={13} />
                  <span>{isAr ? 'محطات خط السير بالتفصيل' : 'Detailed Itinerary'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModalEssentials(!showModalEssentials)
                    if (!showModalEssentials) setShowModalItinerary(false)
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    showModalEssentials
                      ? 'bg-[#183B33] text-white border-[#183B33]'
                      : 'bg-white text-[#6B665E] border-[#D9D0C2] hover:bg-[#FAF6EF]'
                  }`}
                >
                  <Check size={13} />
                  <span>{isAr ? 'المشمول وما يلزمك' : 'Included & Bring'}</span>
                </button>
              </div>

              {/* Itinerary Dropdown */}
              {showModalItinerary && (
                <div className="p-4 bg-white rounded-2xl border border-[#E7DFCE] space-y-3 max-h-56 overflow-y-auto text-xs animate-in fade-in duration-200">
                  <span className="font-bold text-[#C45437] block">
                    {selectedTrip.twoDays
                      ? (isAr ? 'برنامج اليومين وليلة في الصحراء:' : '2-Day Desert Program:')
                      : (isAr ? 'برنامج الرحلة اليومية:' : 'Full Day Schedule:')}
                  </span>
                  {(selectedTrip.twoDays ? [...(selectedTrip.day1 || []), ...(selectedTrip.day2 || [])] : (selectedTrip.itinerary || [])).map((st, i) => (
                    <div key={i} className="border-b border-[#F2ECE1] pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-1.5 font-bold text-[#22211F]">
                        <span className="text-[#C45437]">{st.time}</span>
                        <span>—</span>
                        <span>{st.title}</span>
                      </div>
                      <p className="text-[#6B665E] mt-0.5 leading-relaxed">{st.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Essentials Dropdown */}
              {showModalEssentials && (
                <div className="p-4 bg-white rounded-2xl border border-[#E7DFCE] space-y-3 max-h-56 overflow-y-auto text-xs animate-in fade-in duration-200">
                  {(() => {
                    const ess = selectedTrip.twoDays ? page.tripEssentials.overnight : page.tripEssentials.oneDay
                    return (
                      <div className="space-y-3">
                        <div>
                          <span className="font-bold text-[#2A6543] block mb-1">
                            {ess.includedTitle}:
                          </span>
                          <ul className="space-y-1 text-[#5C574F]">
                            {(ess.included || []).map((inc, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#2A6543] font-bold">✓</span>
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-bold text-[#D97706] block mb-1">
                            {ess.bringTitle}:
                          </span>
                          <ul className="space-y-1 text-[#5C574F]">
                            {(ess.bring || []).map((br, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#D97706] font-bold">•</span>
                                <span>{br}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>

            {/* Booking Inputs */}
            <div className="space-y-4 pt-2 border-t border-[#E7DFCE]">
              
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

              {/* Date & Guests & Children */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Date Picker */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1.5">
                    {isAr ? 'تاريخ الرحلة' : 'Trip Date'}
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#D9D0C2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                </div>

                {/* Guests Picker */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block">
                      {isAr ? 'الأفراد' : 'Guests'}
                    </label>
                    <span className="text-[10px] text-[#9C4328] font-bold">
                      {isAr ? '(الحد الأدنى 4)' : '(min. 4)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-[#D9D0C2]">
                    {[4, 5, 6, 7, 8].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestCount(num)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          guestCount === num
                            ? 'bg-[#183B33] text-white shadow-sm'
                            : 'text-[#6C6963] hover:bg-[#F2ECE1]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Children Picker */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1.5">
                    {isAr ? 'عدد الأطفال' : 'Children'}
                  </label>
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-[#D9D0C2]">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setChildrenCount(num)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          childrenCount === num
                            ? 'bg-[#183B33] text-white shadow-sm'
                            : 'text-[#6C6963] hover:bg-[#F2ECE1]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Phone */}
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

              {/* Transportation from Cairo */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#22211F] flex items-center gap-1.5">
                    <span>🚐</span>
                    <span>{isAr ? 'الانتقالات من القاهرة' : 'Transportation from Cairo'}</span>
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
                    { id: 'none', labelEn: 'Without transportation (on my own)', labelAr: 'بدون انتقالات (بمعرفتي)', time: null },
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
                          name="cairoStationSafari"
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

                {cairoStation !== 'none' && (
                  <p className="text-[11px] text-[#7A756C] mt-2 bg-[#F6EFE5] p-2 rounded-lg leading-relaxed">
                    ℹ️ {isAr
                      ? 'هنبعت لك رقم كابتن الرحلة الساعة 11 بالليل يوم السفر (بيتغير كل يوم).'
                      : "We'll send you the trip captain's number at 11 PM the night before departure (it changes daily)."}
                  </p>
                )}
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

                <p className="text-[11px] text-[#7A756C] mt-2 bg-[#FAF5ED] p-2 rounded-lg border border-[#EDE3D3] leading-relaxed">
                  💵 {isAr
                    ? 'ابعت العربون لرقم المحفظة اللي تحت، وابعثلنا سكرين شوت بالتحويل على الواتساب. — 01116664591+'
                    : 'Send the deposit to the wallet number shown below, then attach a screenshot of the transfer to your WhatsApp message. — +201116664591'}
                </p>
              </div>

              {/* Notes (optional) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1">
                  {isAr ? 'ملاحظات (اختياري)' : 'Notes (optional)'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'أي طلبات خاصة...' : 'Any special requests'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#D9D0C2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                />
              </div>

              {/* Estimated Total Calculation */}
              <div className="p-4 bg-[#F2ECE1] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7A7367] font-medium block">
                    {isAr ? `إجمالي التكلفة التقديرية (${guestCount} أفراد)` : `Estimated Total (${guestCount} guests)`}
                  </span>
                  <span className="text-xl font-bold text-[#183B33]">
                    ${selectedTrip.priceUsd * guestCount}
                  </span>
                </div>
                <span className="text-[11px] text-[#7A7367] font-medium text-right rtl:text-left">
                  {isAr ? 'شامل الانتقالات والوجبات والمرشد' : 'Includes transfers, meals & guide'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleModalWhatsApp}
                className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle size={20} />
                <span>{isAr ? 'ابعت طلب الحجز ع الواتساب' : 'Send via WhatsApp'}</span>
              </button>

              <button
                onClick={() => handleDirectWhatsApp(selectedTrip)}
                className="w-full py-2.5 text-xs text-[#7A7367] hover:text-[#22211F] text-center font-medium cursor-pointer"
              >
                {isAr ? 'أو كلمنا مباشرة لو عندك أي استفسار: 01116664591' : 'Or ask a question directly: 01116664591'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
