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
  Sparkles
} from 'lucide-react'

export default function TransportationPage({ t, lang, onNavigateHome }) {
  const page = t.transportationPage
  const isAr = lang === 'ar'

  // Booking / Enquiry Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [pickup, setPickup] = useState('Sharm El Sheikh Airport')
  const [dropoff, setDropoff] = useState('Dahab')
  const [travelDate, setTravelDate] = useState('2026-10-25')
  const [passengers, setPassengers] = useState(2)
  const [rideType, setRideType] = useState('hiace') // 'hiace' | 'private'

  const handleOpenPlanner = (type, dest) => {
    if (type) setRideType(type)
    if (dest) setDropoff(dest)
    setModalOpen(true)
  }

  const handleSendWhatsApp = () => {
    const vehicleLabel = rideType === 'hiace'
      ? (isAr ? 'ميكروباص هايس (Hiace Bus - عائلي/مجموعات)' : 'Hiace Bus (Group/Family)')
      : (isAr ? 'سيارة ملاكي خاصة (Private Car)' : 'Private Car Transfer')

    const msg = isAr
      ? `السلام عليكم سيناء بوكينج، أود حجز واستفسار عن خدمة الانتقالات والمواصلات:\n- من: ${pickup}\n- إلى: ${dropoff}\n- التاريخ: ${travelDate}\n- عدد الأفراد: ${passengers}\n- وسيلة النقل المفضلة: ${vehicleLabel}\nبرجاء موافاتنا بالتوافر والتكلفة.`
      : `Hello Sinai Booking! I would like to enquire about a transfer:\n- From: ${pickup}\n- To: ${dropoff}\n- Date: ${travelDate}\n- Passengers: ${passengers}\n- Vehicle Preference: ${vehicleLabel}\nPlease confirm availability and rate.`

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
          
          <div className="space-y-2 mb-10">
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
            {page.destinationsSection.routes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-[22px] overflow-hidden border border-[#D9E1D8] shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden bg-[#EDE5D8]">
                  <img
                    src={route.image}
                    alt={route.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
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
                    className="text-xs font-semibold text-[#C45437] hover:text-[#9C4328] flex items-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    <span>{route.action}</span>
                    <ArrowUpRight size={14} />
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
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1.5">
                    {isAr ? 'نقطة التحرك (من)' : 'Pick-up Location (From)'}
                  </label>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="e.g. Sharm Airport, Cairo, Dahab..."
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#D9D0C2] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1.5">
                    {isAr ? 'تاريخ السفر' : 'Travel Date'}
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#D9D0C2] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7A7367] block mb-1.5">
                    {isAr ? 'عدد المسافرين' : 'Passengers'}
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
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle size={20} />
                <span>{isAr ? 'إرسال تفاصيل المسار عبر واتساب' : 'Send Route Request via WhatsApp'}</span>
              </button>
              <p className="text-[11px] text-[#7A7367] text-center">
                {isAr ? 'سيتم التواصل معك فوراً لتأكيد التوقيت والتكلفة وتأمين سيارتك.' : 'Our team will respond immediately to confirm rate and schedule.'}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
