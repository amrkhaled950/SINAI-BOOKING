import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  MessageCircle,
  Calendar,
  Users,
  Check,
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  Home,
  Lock,
  AlertCircle
} from 'lucide-react'
import { saveApartmentBooking, fetchConfirmedApartmentBookings } from '../lib/supabase'

export default function RoomDetailPage({ t, lang, onNavigateBack, onNavigateHome, selectedApartment }) {
  const isAr = lang === 'ar'
  const page = t.accommodationPage

  const defaultGallery = [
    { src: '/images/duplex-hero-loft.jpg', label: isAr ? 'المنظور الكامل للدوبلكس والسرير العلوي' : 'Full Duplex Loft & Chandelier' },
    { src: '/images/duplex-full-structure.jpg', label: isAr ? 'هيكل الدوبلكس والدرج الخشبي والجلسة' : 'Loft Bed Railing & Wooden Stairs' },
    { src: '/images/duplex-lower-lounge.jpg', label: isAr ? 'الجلسة السفلية المريحة والستائر' : 'Lower Lounge Suite & Daybed' },
    { src: '/images/duplex-living-room.jpg', label: isAr ? 'الركن الرئيسي للمعيشة والكنبة' : 'Living Area Sofa & Warm Lighting' },
    { src: '/images/duplex-living-tv.jpg', label: isAr ? 'منطقة التلفزيون والأرفف والمطبخ' : 'Smart TV & Bookshelf Lounge' },
    { src: '/images/duplex-living-wide.jpg', label: isAr ? 'زاوية واسعة للأرضية الرخام والمدخل' : 'Wide Perspective & Marble Flooring' },
    { src: '/images/duplex-lounge-outward.jpg', label: isAr ? 'إطلالة من داخل جلسة الاسترخاء' : 'View Looking Out from Lower Lounge' },
    { src: '/images/duplex-coffee-corner.jpg', label: isAr ? 'طاولة الضيافة الخشبية وركن الشاي' : 'Coffee Table & Cozy Armchair' },
  ]

  const gallery = (selectedApartment?.images && selectedApartment.images.length > 0)
    ? selectedApartment.images.map((src, idx) => ({
        src,
        label: isAr ? `صورة الغرفة ${idx + 1}` : `Room Photo ${idx + 1}`
      }))
    : defaultGallery

  const roomTitle = isAr
    ? (selectedApartment?.title_ar || selectedApartment?.title || 'استوديو دوبلكس مشربه')
    : (selectedApartment?.title || 'Mashraba duplex (Studio 1)')
  const roomCode = selectedApartment?.code || 'Studio 1'
  const dailyPriceUsd = Number(selectedApartment?.price_usd) || 40
  const dailyPriceEgp = Number(selectedApartment?.price_egp) || 2000
  const monthlyPriceUsd = Number(selectedApartment?.monthly_usd) || 1200
  const monthlyPriceEgp = Number(selectedApartment?.monthly_egp) || 60000

  const [activePhoto, setActivePhoto] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Booking Form State
  const [stayType, setStayType] = useState('daily') // 'daily' or 'monthly'
  const todayStr = new Date().toISOString().split('T')[0]
  const [checkIn, setCheckIn] = useState('2026-10-20')
  const [checkOut, setCheckOut] = useState('2026-10-25')
  const [nationality, setNationality] = useState('egyptian') // 'egyptian' | 'foreign'
  const [guests, setGuests] = useState(2) // 1, 2, 3
  const [children, setChildren] = useState(0) // 0, 1, 2
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [cairoStation, setCairoStation] = useState('none') // 'riad' | 'embassy' | 'rehab' | 'madinaty' | 'none'
  const [paymentMethod, setPaymentMethod] = useState('wallet') // 'wallet' | 'instapay' | 'card'
  const [notes, setNotes] = useState('')

  // Confirmed Locked Dates State
  const [confirmedBookings, setConfirmedBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function loadConfirmed() {
      setLoadingBookings(true)
      const res = await fetchConfirmedApartmentBookings(roomCode)
      if (isMounted && res.data) {
        setConfirmedBookings(res.data)
      }
      if (isMounted) setLoadingBookings(false)
    }
    loadConfirmed()
    return () => { isMounted = false }
  }, [roomCode])

  // Overlap & Conflict Check
  const getConflictingBooking = (inDate, outDate) => {
    if (!inDate || !outDate) return null
    const dIn = new Date(inDate).getTime()
    const dOut = new Date(outDate).getTime()
    if (dOut <= dIn) return null

    for (const b of confirmedBookings) {
      if (!b.check_in_date || !b.check_out_date) continue
      const bIn = new Date(b.check_in_date).getTime()
      const bOut = new Date(b.check_out_date).getTime()
      // Overlap condition: start < booked_end && end > booked_start
      if (dIn < bOut && dOut > bIn) {
        return b
      }
    }
    return null
  }

  const conflictingBooking = getConflictingBooking(checkIn, checkOut)
  const isDatesConflict = Boolean(conflictingBooking)

  const handlePrev = (e) => {
    e.stopPropagation()
    setActivePhoto((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
  }

  const handleNext = (e) => {
    e.stopPropagation()
    setActivePhoto((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
  }

  // Calculate nights
  const calculateNights = () => {
    try {
      const d1 = new Date(checkIn)
      const d2 = new Date(checkOut)
      const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : 1
    } catch {
      return 1
    }
  }

  const nights = calculateNights()
  const totUsd = stayType === 'monthly' ? monthlyPriceUsd : nights * dailyPriceUsd
  const totEgp = stayType === 'monthly' ? monthlyPriceEgp : nights * dailyPriceEgp

  return (
    <div className="bg-[#FAF6EF] text-[#22211F] min-h-screen animate-in fade-in duration-300">
      
      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs font-medium text-[#8C867C] flex-wrap">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#C8553D] transition-colors cursor-pointer"
          >
            {page.breadcrumbHome}
          </button>
          <span>/</span>
          <button
            onClick={onNavigateBack}
            className="hover:text-[#C8553D] transition-colors cursor-pointer"
          >
            {page.breadcrumbCurrent}
          </button>
          <span>/</span>
          <span className="text-[#22211F] font-semibold">
            {roomTitle}
          </span>
        </nav>
      </div>

      {/* Main Room View Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        
        {/* Title Bar with Back Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 bg-[#E2ECE5] text-[#2A6543] text-xs font-semibold rounded-full uppercase">
                {selectedApartment?.badge || page.place.badge}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#22211F]">
              {roomTitle}
            </h1>
            <p className="text-sm sm:text-base text-[#6C6963] pt-1">
              {isAr ? `حتى ${selectedApartment?.max_guests || 3} أفراد • ${selectedApartment?.location_ar || 'المشربة، دهب'}` : `Upto ${selectedApartment?.max_guests || 3} person accommodation • ${selectedApartment?.location || 'Mashraba, Dahab'}`}
            </p>
          </div>

          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E3DBD0] rounded-full text-xs font-semibold text-[#5A554E] hover:border-[#C8553D] hover:text-[#C8553D] transition-all self-start md:self-auto shadow-sm cursor-pointer"
          >
            {isAr ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            <span>{isAr ? 'العودة لقائمة الشقق' : 'Back to Dahab Accommodations'}</span>
          </button>
        </div>

        {/* 2-Column: 8-Photo Gallery on Left, Complete Booking Widget on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left: 8-Photo Interactive Gallery */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Active Photo */}
            <div
              onClick={() => setLightboxOpen(true)}
              className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[28px] overflow-hidden shadow-lg border border-[#EAE3D5] bg-[#F2EDE4] group cursor-pointer"
            >
              <img
                src={gallery[activePhoto].src}
                alt={gallery[activePhoto].label}
                className="w-full h-full object-cover transition-all duration-500 ease-out"
              />

              <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                {activePhoto + 1} / {gallery.length} · {gallery[activePhoto].label}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxOpen(true)
                }}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full shadow transition-all cursor-pointer"
                title="View fullscreen"
              >
                <Maximize2 size={16} />
              </button>

              {/* Prev / Next Arrows */}
              <div className="absolute inset-y-0 left-3 flex items-center">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2.5 rounded-full bg-white/80 hover:bg-white text-[#22211F] shadow-lg backdrop-blur-md transition-all active:scale-90 opacity-80 group-hover:opacity-100 cursor-pointer"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2.5 rounded-full bg-white/80 hover:bg-white text-[#22211F] shadow-lg backdrop-blur-md transition-all active:scale-90 opacity-80 group-hover:opacity-100 cursor-pointer"
                  aria-label="Next Photo"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* 8 Clickable Thumbnails */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {gallery.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhoto(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhoto === idx
                      ? 'border-[#C8553D] ring-2 ring-[#C8553D]/30 scale-102'
                      : 'border-[#EAE3D5] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Amenities Grid for the Room */}
            <div className="bg-white rounded-[24px] p-6 border border-[#EAE3D5] mt-6 shadow-sm">
              <h3 className="text-xl font-serif text-[#22211F] mb-4">
                {isAr ? 'تجهيزات ومواصفات الوحدة' : 'Unit Amenities & Features'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#5A554E] font-medium">
                <div className="flex items-center gap-2 p-2 bg-[#FAF6EF] rounded-xl">
                  <Check size={14} className="text-[#2A6543]" />
                  <span>{isAr ? 'تكييف هواء' : 'Air conditioning'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#FAF6EF] rounded-xl">
                  <Check size={14} className="text-[#2A6543]" />
                  <span>{isAr ? 'حمام بسخان وشاور' : 'Heated shower'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#FAF6EF] rounded-xl">
                  <Check size={14} className="text-[#2A6543]" />
                  <span>{isAr ? 'شاشة LCD' : 'LCD Screen'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#FAF6EF] rounded-xl">
                  <Check size={14} className="text-[#2A6543]" />
                  <span>{isAr ? 'واي فاي سريع' : 'High-speed Wi-Fi'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#FAF6EF] rounded-xl">
                  <Check size={14} className="text-[#2A6543]" />
                  <span>{isAr ? 'ميني بار' : 'Mini bar'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#FAF6EF] rounded-xl">
                  <Check size={14} className="text-[#2A6543]" />
                  <span>{isAr ? 'مطبخ ومستلزمات' : 'Mini kitchen'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#FAF6EF] rounded-xl">
                  <Check size={14} className="text-[#2A6543]" />
                  <span>{isAr ? 'كنبة أمريكية' : 'American sofa'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#FAF6EF] rounded-xl">
                  <Check size={14} className="text-[#2A6543]" />
                  <span>{isAr ? 'مرتبة عالية الجودة' : 'Quality mattress'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#FAF6EF] rounded-xl">
                  <Check size={14} className="text-[#2A6543]" />
                  <span>{isAr ? 'حتى ٣ أفراد' : 'Up to 3 guests'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Dedicated Booking & Inquiry Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#F8F3EA] rounded-[28px] p-6 sm:p-8 border border-[#EAE1D1] space-y-6 shadow-md sticky top-28">
              
              <div>
                <span className="inline-block px-3 py-1 bg-[#E2ECE5] text-[#2A6543] text-xs font-semibold rounded-full uppercase tracking-wider">
                  {page.place.badge}
                </span>
              </div>

              {/* Rates Box */}
              <div className="bg-white/90 rounded-2xl p-4 border border-[#E8DFD0] space-y-2">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#22211F]">
                      40 $
                    </span>
                    <span className="text-xs text-[#8C867C] font-medium">
                      / night
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-[#1F7A8C]">
                    2000 جم ليله
                  </span>
                </div>

                <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#7A7367]">
                  <span className="font-medium text-[#C8553D] flex items-center gap-1">
                    <Clock size={13} />
                    {isAr ? 'الشهر 30 يوم / 31 يوم' : 'Monthly stay: 30 / 31 days'}
                  </span>
                  <span className="text-[11px] bg-[#FAF5ED] px-2 py-0.5 rounded border border-[#E9DFCF]">
                    {isAr ? 'حتى ٣ أفراد' : 'Max 3 guests'}
                  </span>
                </div>
              </div>

              {/* Booking Controls */}
              <div className="space-y-4 pt-1">
                
                {/* Stay Type Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-[#5A554E] uppercase tracking-wider mb-2">
                    {isAr ? 'نوع الإقامة' : 'Stay Duration Type'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-xl border border-[#E4DDD0]">
                    <button
                      type="button"
                      onClick={() => setStayType('daily')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        stayType === 'daily'
                          ? 'bg-[#C8553D] text-white shadow-sm'
                          : 'text-[#6C6963] hover:text-[#22211F]'
                      }`}
                    >
                      {isAr ? 'إقامة يومية' : 'Daily Stay'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStayType('monthly')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        stayType === 'monthly'
                          ? 'bg-[#132724] text-[#E7D6C4] shadow-sm'
                          : 'text-[#6C6963] hover:text-[#22211F]'
                      }`}
                    >
                      {isAr ? 'الشهر 30 / 31 يوم' : 'Monthly (30/31 days)'}
                    </button>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#5A554E] mb-1.5 flex items-center gap-1">
                        <Calendar size={12} className="text-[#C8553D]" />
                        {isAr ? 'الوصول' : 'Check-in'}
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={checkIn}
                        onChange={(e) => {
                          const val = e.target.value
                          setCheckIn(val)
                          if (val && checkOut && val >= checkOut) {
                            const d = new Date(val)
                            d.setDate(d.getDate() + 1)
                            setCheckOut(d.toISOString().split('T')[0])
                          }
                        }}
                        className={`w-full text-xs font-medium bg-white border rounded-xl px-3 py-2 text-[#22211F] focus:outline-none transition-all ${
                          isDatesConflict
                            ? 'border-red-500 ring-2 ring-red-200'
                            : 'border-[#E4DDD0] focus:ring-2 focus:ring-[#C8553D]/30'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5A554E] mb-1.5 flex items-center gap-1">
                        <Calendar size={12} className="text-[#C8553D]" />
                        {isAr ? 'المغادرة' : 'Check-out'}
                      </label>
                      <input
                        type="date"
                        min={checkIn || todayStr}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className={`w-full text-xs font-medium bg-white border rounded-xl px-3 py-2 text-[#22211F] focus:outline-none transition-all ${
                          isDatesConflict
                            ? 'border-red-500 ring-2 ring-red-200'
                            : 'border-[#E4DDD0] focus:ring-2 focus:ring-[#C8553D]/30'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Conflict Alert (Dates Closed) */}
                  {isDatesConflict && conflictingBooking && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2.5 shadow-xs animate-in fade-in duration-200">
                      <AlertCircle size={17} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-bold text-red-900">
                          {isAr ? '⚠️ عذراً، هذا الميعاد محجوز ومغلق بالفعل!' : '⚠️ Sorry, this date range is already locked!'}
                        </p>
                        <p className="text-[11px] text-red-700 leading-relaxed">
                          {isAr
                            ? `تم تأكيد حجز مسبق لهذه الغرفة من ${conflictingBooking.check_in_date} إلى ${conflictingBooking.check_out_date}. يرجى تغيير التواريخ للمتابعة.`
                            : `A confirmed reservation exists from ${conflictingBooking.check_in_date} to ${conflictingBooking.check_out_date}. Please choose other dates.`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Locked Dates Chips for Transparency */}
                  {confirmedBookings.length > 0 && (
                    <div className="bg-[#FAF2E8] border border-[#ECDCCB] rounded-xl p-2.5 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#8B4513] text-[11px] flex items-center gap-1">
                          <Lock size={11} className="text-[#C8553D]" />
                          {isAr ? 'فترات محجوزة ومغلقة للوحدة:' : 'Currently locked dates for this unit:'}
                        </span>
                        <span className="text-[10px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full">
                          {isAr ? 'مغلقة' : 'Closed'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {confirmedBookings.map((b) => (
                          <span
                            key={b.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-white text-red-700 text-[11px] font-mono font-medium rounded-lg border border-red-200 shadow-xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            <span>{b.check_in_date}</span>
                            <span className="text-red-400">←</span>
                            <span>{b.check_out_date}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-xs font-semibold text-[#5A554E] mb-1.5">
                    {isAr ? 'الجنسية' : 'Nationality'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNationality('egyptian')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        nationality === 'egyptian'
                          ? 'bg-[#22211F] text-white border-[#22211F] shadow-sm'
                          : 'bg-white text-[#6C6963] border-[#E4DDD0] hover:border-[#C8553D]'
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
                          ? 'bg-[#22211F] text-white border-[#22211F] shadow-sm'
                          : 'bg-white text-[#6C6963] border-[#E4DDD0] hover:border-[#C8553D]'
                      }`}
                    >
                      <span>🌍</span>
                      <span>{isAr ? 'أجنبي' : 'Foreign'}</span>
                    </button>
                  </div>
                </div>

                {/* No. of guests & No. of children */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5A554E] mb-1.5 flex items-center gap-1">
                      <Users size={12} className="text-[#C8553D]" />
                      {isAr ? 'عدد الأفراد' : 'No. of guests'}
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuests(num)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            guests === num
                              ? 'bg-[#22211F] text-white border-[#22211F]'
                              : 'bg-white text-[#6C6963] border-[#E4DDD0] hover:border-[#C8553D]'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5A554E] mb-1.5 flex items-center gap-1">
                      <Users size={12} className="text-[#8C867C]" />
                      {isAr ? 'عدد الأطفال' : 'No. of children'}
                    </label>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setChildren(num)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            children === num
                              ? 'bg-[#22211F] text-white border-[#22211F]'
                              : 'bg-white text-[#6C6963] border-[#E4DDD0] hover:border-[#C8553D]'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Room Feature Spec */}
                <div className="bg-[#FAF6EF] rounded-xl p-2.5 border border-[#EBE3D5] text-[11px] text-[#5A554E] leading-relaxed">
                  ✨ {isAr ? 'غرفة دوبلكس مريحة، إطلالة بحرية، تكييف وحمام خاص.' : 'Comfortable duplex loft, sea view, AC and private bathroom.'}
                </div>

                {/* Name & Phone number */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#5A554E] mb-1">
                      {isAr ? 'الاسم بالكامل' : 'Name'}
                    </label>
                    <input
                      type="text"
                      placeholder={isAr ? 'اسمك بالكامل' : 'Your full name'}
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full text-xs bg-white border border-[#E4DDD0] rounded-xl px-3 py-2 text-[#22211F] placeholder-[#A39E94] focus:outline-none focus:ring-2 focus:ring-[#C8553D]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A554E] mb-1">
                      {isAr ? 'رقم الهاتف / الواتساب' : 'Phone number'}
                    </label>
                    <input
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full text-xs bg-white border border-[#E4DDD0] rounded-xl px-3 py-2 text-[#22211F] placeholder-[#A39E94] focus:outline-none focus:ring-2 focus:ring-[#C8553D]/30 font-mono"
                    />
                  </div>
                </div>

                {/* Transportation from Cairo */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#22211F] flex items-center gap-1.5">
                      <span>🚐</span>
                      <span>{isAr ? 'الانتقالات من القاهرة' : 'Transportation from Cairo'}</span>
                    </label>
                    <span className="text-[10px] text-[#C8553D] font-medium">
                      {isAr ? 'رحلات يومية 🚐' : 'Daily departures 🚐'}
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
                            ? 'bg-[#FAF5ED] border-[#C8553D] text-[#22211F] font-semibold ring-1 ring-[#C8553D]/30'
                            : 'bg-white border-[#E7DFCE] text-[#6C6963] hover:border-[#C8553D]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="cairoStation"
                            checked={cairoStation === st.id}
                            onChange={() => setCairoStation(st.id)}
                            className="text-[#C8553D] focus:ring-[#C8553D]"
                          />
                          <span>{isAr ? st.labelAr : st.labelEn}</span>
                        </div>
                        {st.time && (
                          <span className="font-mono text-[11px] text-[#C8553D] bg-[#F4EBE1] px-2 py-0.5 rounded-full font-medium">
                            {st.time}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>

                  {cairoStation !== 'none' && (
                    <p className="text-[11px] text-[#7A756C] mt-2 bg-[#F6EFE5] p-2 rounded-lg leading-relaxed">
                      ℹ️ {isAr
                        ? 'سنرسل لك رقم كابتن الرحلة في الساعة 11 مساءً ليلة المغادرة (يتغير يومياً).'
                        : "We'll send you the trip captain's number at 11 PM the night before departure (it changes daily)."}
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="pt-1">
                  <label className="block text-xs font-semibold text-[#22211F] mb-1.5">
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
                            ? 'bg-[#22211F] text-white border-[#22211F] shadow-sm'
                            : 'bg-white text-[#6C6963] border-[#E4DDD0] hover:border-[#C8553D]'
                        }`}
                      >
                        <div className="text-sm mb-0.5">{pm.icon}</div>
                        <div className="text-[10px] font-semibold leading-tight">
                          {isAr ? pm.labelAr : pm.labelEn}
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-[#7A756C] mt-2 bg-[#FAF5ED] p-2 rounded-lg border border-[#EDE3D3] leading-relaxed">
                    💵 {isAr
                      ? 'أرسل العربون إلى رقم المحفظة الموضح أدناه، ثم أرفق لقطة شاشة للتحويل مع رسالة الواتساب. — 01116664591+'
                      : 'Send the deposit to the wallet number shown below, then attach a screenshot of the transfer to your WhatsApp message. — +201116664591'}
                  </p>
                </div>

                {/* Notes (optional) */}
                <div>
                  <label className="block text-xs font-semibold text-[#5A554E] mb-1">
                    {isAr ? 'ملاحظات (اختياري)' : 'Notes (optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? 'أي طلبات خاصة...' : 'Any special requests'}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs bg-white border border-[#E4DDD0] rounded-xl px-3 py-2 text-[#22211F] placeholder-[#A39E94] focus:outline-none focus:ring-2 focus:ring-[#C8553D]/30"
                  />
                </div>

              </div>

              {/* Total Summary */}
              <div className="bg-[#FAF5ED] rounded-xl p-3.5 border border-[#E9DFCF] text-xs space-y-1">
                <div className="flex items-center justify-between text-[#5A554E]">
                  <span>
                    {stayType === 'monthly'
                      ? (isAr ? 'إقامة شهرية (30 / 31 يوم)' : 'Monthly stay (30/31 days)')
                      : (isAr ? `إقامة يومية (${nights} ليالي)` : `Daily stay (${nights} nights)`)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#EDE5D8] font-semibold text-[#22211F]">
                  <span>{isAr ? 'الإجمالي التقديري:' : 'Estimated total:'}</span>
                  <span className="text-[#C8553D]">
                    ${totUsd} · {totEgp.toLocaleString()} جم
                  </span>
                </div>
              </div>

              {/* Send Request via WhatsApp */}
              <div className="pt-1 space-y-2">
                {isDatesConflict ? (
                  <button
                    type="button"
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-stone-300 text-stone-600 text-sm font-bold rounded-full shadow-none cursor-not-allowed border border-stone-300 select-none"
                  >
                    <Lock size={18} className="text-red-600" />
                    <span>{isAr ? 'عذراً، هذا الميعاد محجوز ومغلق بالفعل' : 'Dates Already Booked - Please Select Other Dates'}</span>
                  </button>
                ) : (
                  <a
                    href={(() => {
                      const stayLabel = stayType === 'monthly'
                        ? (isAr ? 'إقامة شهرية (30 / 31 يوم)' : 'Monthly stay (30 / 31 days)')
                        : (isAr ? `إقامة يومية (${nights} ليالي)` : `Daily stay (${nights} nights)`)

                      const cairoStationsMap = {
                        riad: isAr ? 'عبد المنعم رياض (12:00 AM)' : 'Abdel Moneim Riad (12:00 AM)',
                        embassy: isAr ? 'سفارة الإمارات — مصر الجديدة (12:30 AM)' : 'UAE Embassy — Masr El Gedida (12:30 AM)',
                        rehab: isAr ? 'الرحاب (1:00 AM)' : 'Rehab (1:00 AM)',
                        madinaty: isAr ? 'مدينتي (1:15 AM)' : 'Madinaty (1:15 AM)',
                        none: isAr ? 'بدون انتقالات (بمعرفتي)' : 'Without transportation (on my own)'
                      }

                      const paymentLabels = {
                        wallet: isAr ? 'محفظة إلكترونية كاش (+201116664591)' : 'Mobile Wallet (+201116664591)',
                        instapay: isAr ? 'انستاباي (InstaPay)' : 'InstaPay',
                        card: isAr ? 'دفع أونلاين بالفيزا/كارت' : 'Pay online by card'
                      }

                      const nationalityLabel = nationality === 'egyptian' ? (isAr ? '🇪🇬 مصري' : '🇪🇬 Egyptian') : (isAr ? '🌍 أجنبي' : '🌍 Foreign')

                      const msg = isAr
                        ? `السلام عليكم، أود تقديم طلب حجز ${roomTitle}:
• كود الوحدة: ${roomCode}
• الجنسية: ${nationalityLabel}
• نوع الإقامة: ${stayLabel}
• تاريخ الوصول: ${checkIn}
• تاريخ المغادرة: ${checkOut}
• عدد الأفراد: ${guests} أفراد
• عدد الأطفال: ${children}
• الاسم: ${guestName || 'غير محدد'}
• رقم الهاتف: ${guestPhone || 'غير محدد'}
• الانتقالات من القاهرة: ${cairoStationsMap[cairoStation]}
• طريقة الدفع: ${paymentLabels[paymentMethod]}
• السعر التقديري: $${totUsd} / ${totEgp.toLocaleString()} جم
${notes ? `• ملاحظات خاصة: ${notes}\n` : ''}أرجو تأكيد التوافر وإتمام الحجز.`
                        : `Hello! I would like to request a booking for ${roomTitle}:
• Unit Code: ${roomCode}
• Nationality: ${nationalityLabel}
• Stay type: ${stayLabel}
• Check-in: ${checkIn}
• Check-out: ${checkOut}
• Guests: ${guests} adults
• Children: ${children}
• Name: ${guestName || 'Not specified'}
• Phone: ${guestPhone || 'Not specified'}
• Transportation from Cairo: ${cairoStationsMap[cairoStation]}
• Payment Method: ${paymentLabels[paymentMethod]}
• Estimated total: $${totUsd} / ${totEgp.toLocaleString()} EGP
${notes ? `• Special requests: ${notes}\n` : ''}Please let me know availability and how to proceed.`

                      return `https://wa.me/201116664591?text=${encodeURIComponent(msg)}`
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      const stay = stayType === 'monthly' ? calculateMonthDays() : calculateNights()
                      const nightsCount = stay.count || nights
                      const cairoStationsMap = {
                        riad: 'Abdel Moneim Riad (12:00 AM)',
                        embassy: 'UAE Embassy — Masr El Gedida (12:30 AM)',
                        rehab: 'Rehab (1:00 AM)',
                        madinaty: 'Madinaty (1:15 AM)',
                        none: 'None'
                      }

                      saveApartmentBooking({
                        apartment_name: roomTitle,
                        apartment_code: roomCode,
                        customer_name: guestName || null,
                        customer_phone: guestPhone || null,
                        nationality: nationality,
                        check_in_date: checkIn,
                        check_out_date: checkOut,
                        nights_count: nightsCount,
                        guests_count: guests,
                        children_count: children,
                        stay_type: stayType,
                        transportation_station: cairoStationsMap[cairoStation],
                        payment_method: paymentMethod,
                        estimated_total_usd: totUsd,
                        estimated_total_egp: totEgp,
                        notes: notes || null,
                        status: 'pending'
                      })
                    }}
                    className="btn-shimmer w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-[#25D366] hover:bg-[#20BA5A] text-white text-base font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-102 transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageCircle size={20} className="fill-white" />
                    <span>{isAr ? 'إرسال طلب الحجز عبر واتساب' : 'Send request via WhatsApp'}</span>
                  </a>
                )}

                <p className="text-[11px] text-center text-[#8C867C]">
                  {isAr ? 'سنفتح الواتساب مع تفاصيل حجزك الكاملة جاهزة للإرسال.' : "We'll open WhatsApp with your full booking details ready to send."}
                </p>

                <div className="flex items-center justify-center gap-2 text-xs text-[#5A554E] pt-1">
                  <span className="font-medium">{isAr ? 'رقم سيناء بوكينج:' : 'Sinai booking line:'}</span>
                  <a
                    href="https://wa.me/201116664591"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-[#1F7A8C] hover:text-[#C8553D] transition-colors"
                  >
                    01116664591
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between text-white max-w-5xl mx-auto w-full">
            <span className="text-sm font-medium">
              {activePhoto + 1} / {gallery.length} · {gallery[activePhoto].label}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X size={26} />
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex items-center justify-center flex-grow max-w-5xl mx-auto w-full py-4"
          >
            <img
              src={gallery[activePhoto].src}
              alt={gallery[activePhoto].label}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 max-w-2xl mx-auto w-full overflow-x-auto py-2"
          >
            {gallery.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhoto(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                  activePhoto === idx
                    ? 'border-[#C8553D] ring-2 ring-[#C8553D]/40 scale-105'
                    : 'border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={photo.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
