import React, { useState, useEffect } from 'react'
import { ArrowUpRight, Bed, Users, Sparkles, Check, MapPin, Flame } from 'lucide-react'
import { fetchApartments, DEFAULT_APARTMENTS } from '../lib/supabase'

export default function DahabAccommodationPage({ t, lang, onNavigateHome, onSelectApartment }) {
  const page = t.accommodationPage
  const isAr = lang === 'ar'
  const [apartments, setApartments] = useState(DEFAULT_APARTMENTS)
  const [loading, setLoading] = useState(false)
  const [selectedPhotoMap, setSelectedPhotoMap] = useState({})

  useEffect(() => {
    let isMounted = true
    async function load() {
      setLoading(true)
      const res = await fetchApartments()
      if (isMounted && res.data && res.data.length > 0) {
        setApartments(res.data)
      }
      if (isMounted) setLoading(false)
    }
    load()
    return () => { isMounted = false }
  }, [])

  // Order apartments so the new 2BR Boho Stone House (studio-2) is showcased first, followed by studio-1
  const sortedApartments = [...apartments].sort((a, b) => {
    if (a.code === 'studio-2' || a.id === 'studio-2') return -1
    if (b.code === 'studio-2' || b.id === 'studio-2') return 1
    return 0
  })

  const primaryApartment = sortedApartments[0] || DEFAULT_APARTMENTS[1]

  const handleOpenApartment = (apt = primaryApartment) => {
    if (onSelectApartment) {
      onSelectApartment(apt)
    }
  }

  const scrollToUnit = (unitId) => {
    const el = document.getElementById(unitId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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

      {/* 2. Hero Section: "A little more room to feel at home." */}
      <section className="pt-6 pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Copy & Tags */}
            <div className="lg:col-span-6 space-y-6 animate-fade-in-up">
              <div>
                <span className="inline-block px-3.5 py-1 bg-[#E2ECE5] text-[#2A6543] text-xs font-semibold tracking-wider rounded-full uppercase animate-fade-in-down">
                  {page.hero.badge}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-normal text-[#22211F] tracking-tight leading-[1.12]">
                {page.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-[#6C6963] font-normal leading-relaxed max-w-lg">
                {isAr
                  ? 'بيوت واستوديوهات خاصة ومريحة في المشربة وبين اللايت هاوس والعصلة، متجهزة لكل تفاصيل روقانك في دهب.'
                  : page.hero.subtitle}
              </p>

              {/* Quick Jump Buttons to Both Units */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
                {sortedApartments.map((apt) => (
                  <button
                    key={apt.id || apt.code}
                    type="button"
                    onClick={() => scrollToUnit(`showcase-${apt.code || apt.id}`)}
                    className="px-4 py-2 bg-white hover:bg-[#FAF3E8] rounded-full text-xs font-bold tracking-wide text-[#22211F] border border-[#E3DBD0] shadow-xs hover:border-[#BA4B33] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#BA4B33]"></span>
                    <span>
                      {isAr
                        ? (apt.code === 'studio-2' ? 'استوديو وبيت بوهو وروف (العصلة)' : 'دوبلكس المشربة')
                        : (apt.code === 'studio-2' ? '2BR Boho Stone House' : 'Mashraba Duplex')}
                    </span>
                    <span className="text-[#8C867C] font-normal">
                      ${apt.price_usd} / {isAr ? 'ليلة' : 'nt'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Feature Highlights */}
              <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-[#5A554E]">
                <span className="px-3.5 py-1.5 bg-[#F0ECE1] rounded-full font-medium">
                  {isAr ? 'حتى 5 أفراد' : 'Up to 5 guests'}
                </span>
                <span className="px-3.5 py-1.5 bg-[#F0ECE1] rounded-full font-medium">
                  {isAr ? 'واي فاي سريع وتكييف' : 'Wi-Fi & AC'}
                </span>
                <span className="px-3.5 py-1.5 bg-[#F0ECE1] rounded-full font-medium">
                  {isAr ? 'روف وتراس خاص' : 'Private Roof Terrace'}
                </span>
                <span className="px-3.5 py-1.5 bg-[#F0ECE1] rounded-full font-medium">
                  {isAr ? 'كانون نار وشواء' : 'Fire Pit & BBQ'}
                </span>
              </div>
            </div>

            {/* Right: Featured Boho House Preview Photo with Overlay Badge */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end animate-fade-in-up stagger-2">
              <div
                onClick={() => handleOpenApartment(primaryApartment)}
                className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-[16/11] rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-xl border-4 border-white/80 group cursor-pointer active:scale-98 transition-transform"
              >
                <img
                  src={primaryApartment.images?.[0] || '/images/studio-assala-courtyard-day.jpg'}
                  alt={primaryApartment.title || 'Boho Stone House in Dahab'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 sm:bottom-5 right-4 sm:right-5 rtl:right-auto rtl:left-4 sm:rtl:left-5">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 shadow-lg border border-black/5">
                    <p className="text-xs sm:text-sm font-bold text-[#22211F]">
                      {isAr ? (primaryApartment.badge_ar || 'بيت واستوديو بوهو') : (primaryApartment.badge || 'Boho Stone House')}
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#8C867C] font-normal">
                      {isAr ? (primaryApartment.location_ar || 'بين اللايت هاوس والعصلة') : (primaryApartment.location || 'Between Lighthouse & Assala')}
                    </p>
                  </div>
                </div>

                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                  <span className="px-3.5 py-1.5 bg-[#BA4B33] text-white text-xs font-bold rounded-full shadow-md uppercase tracking-wider">
                    {isAr ? 'جديد ومتاح للحجز' : 'Featured Stay'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The Places Section: Luxury 2-Column Showcases */}
      <section className="py-16 lg:py-20 border-t border-[#EAE3D5]/60 bg-[#FAF6EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-24">
          
          {/* Main Section Heading */}
          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#C8553D] uppercase block">
              {page.place.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#22211F] tracking-tight">
              {isAr ? 'تعال نكتشف أماكن الإقامة في دهب' : 'Meet Our Dahab Stays'}
            </h2>
            <p className="text-base text-[#6C6963] font-normal max-w-2xl leading-relaxed">
              {isAr
                ? 'استوديوهات وبيوت هادية ومريحة في المشربة وبين اللايت هاوس والعصلة، متجهزة بكل اللي تحتاجه بين مغامراتك اليومية.'
                : 'Curated retreats with thoughtful essentials, crafted for peaceful mornings and starry nights in South Sinai.'}
            </p>
          </div>

          {/* Render Each Apartment in the Luxury 2-Column Figma Layout */}
          {sortedApartments.map((apt, index) => {
            const isStudio2 = apt.code === 'studio-2' || apt.id === 'studio-2'
            const currentPhoto = selectedPhotoMap[apt.id || apt.code] || apt.images?.[0] || '/images/studio-assala-courtyard-day.jpg'
            const previewThumbnails = (apt.images || []).slice(0, 5)

            // Section titles customized for each stay
            const sectionTag = isStudio2
              ? (isAr ? 'المكان · بيت بوهو حجري وروف خاص' : 'THE PLACE · 2BR BOHO STONE HOUSE')
              : (isAr ? 'المكان · دوبلكس المشربة' : 'THE PLACE · MASHRABA DUPLEX')

            const sectionTitle = isStudio2
              ? (isAr ? 'بيت واستوديو بوهو غرفتين وروف خاص' : 'Meet the 2BR Boho Stone House & Private Roof')
              : (isAr ? (apt.title_ar || page.place.title) : (apt.title || page.place.title))

            const sectionSubtitle = isStudio2
              ? (isAr ? 'بين اللايت هاوس والعصلة · غرفتين نوم مكيفتين، حديقة خاصة، كانون نار وروف ببرجولة خشبية وإطلالة جبلية.' : 'Between Lighthouse & Assala · 2 AC Bedrooms, Private Garden & Rooftop Mountain Views.')
              : (isAr ? page.place.subtitle : 'Thoughtful essentials, with room to settle in.')

            return (
              <div
                key={apt.id || apt.code || index}
                id={`showcase-${apt.code || apt.id}`}
                className="pt-10 first:pt-0 border-t first:border-t-0 border-[#EAE3D5]/80 space-y-8 scroll-mt-24"
              >
                {/* Stay Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-[0.2em] text-[#C8553D] uppercase block">
                      {sectionTag}
                    </span>
                    {isStudio2 && (
                      <span className="px-2.5 py-0.5 bg-[#E8A94C] text-[#22211F] text-[11px] font-bold rounded-full">
                        {isAr ? 'حتى 5 أفراد' : 'Up to 5 guests'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-[#22211F] tracking-tight">
                    {sectionTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-[#6C6963] font-normal leading-relaxed max-w-2xl">
                    {sectionSubtitle}
                  </p>
                </div>

                {/* 2-Column Grid: Image & Thumbnails on Left, Details Card on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                  
                  {/* Left: Large Photo + Interactive Thumbnail Gallery */}
                  <div className="lg:col-span-7 space-y-4">
                    <div
                      onClick={() => handleOpenApartment(apt)}
                      className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[28px] overflow-hidden shadow-md border border-[#EAE3D5] bg-[#F2EDE4] group cursor-pointer"
                      title={isAr ? 'اضغط لعرض كافة الصور والتفاصيل' : 'Click to view full gallery and details'}
                    >
                      <img
                        src={currentPhoto}
                        alt={apt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Top Overlay Tag */}
                      <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-2">
                        <span className="px-3.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full">
                          {isAr ? (apt.location_ar || 'دهب') : (apt.location || 'Dahab')}
                        </span>
                      </div>

                      {/* Bottom Overlay Hint */}
                      <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-[#22211F] text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5">
                          <Sparkles size={14} className="text-[#C8553D]" />
                          <span>{isAr ? `${apt.images?.length || 35}+ صورة حصرية` : `${apt.images?.length || 35}+ photos`}</span>
                        </span>
                      </div>
                    </div>

                    {/* Interactive Thumbnail Gallery Strip */}
                    {previewThumbnails.length > 1 && (
                      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 pt-1 no-scrollbar">
                        {previewThumbnails.map((thumbUrl, tIdx) => {
                          const isActive = currentPhoto === thumbUrl
                          return (
                            <button
                              key={tIdx}
                              type="button"
                              onClick={() => setSelectedPhotoMap(prev => ({ ...prev, [apt.id || apt.code]: thumbUrl }))}
                              className={`relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                isActive ? 'border-[#BA4B33] scale-102 shadow-md' : 'border-[#EAE1D1] hover:border-[#8C867C] opacity-80 hover:opacity-100'
                              }`}
                            >
                              <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                            </button>
                          )
                        })}
                        <button
                          type="button"
                          onClick={() => handleOpenApartment(apt)}
                          className="flex-shrink-0 h-14 sm:h-16 px-3 rounded-xl bg-[#F0ECE1] hover:bg-[#E4DDCF] border border-[#EAE1D1] text-[11px] font-bold text-[#6C6963] hover:text-[#22211F] transition-colors flex items-center justify-center cursor-pointer"
                        >
                          {isAr ? 'عرض الكل' : 'View all'}
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-[#8C867C] pt-1">
                      {page.place.note}
                    </p>
                  </div>

                  {/* Right: Exactly as Figma Card */}
                  <div className="lg:col-span-5">
                    <div className="bg-[#F8F3EA] rounded-[28px] p-7 sm:p-9 border border-[#EAE1D1] space-y-6 shadow-sm">
                      
                      {/* Tag Badge & Specs Pills */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="inline-block px-3 py-1 bg-[#E2ECE5] text-[#2A6543] text-xs font-semibold rounded-full uppercase tracking-wider">
                            {isAr ? (apt.badge_ar || apt.badge) : apt.badge}
                          </span>
                          {apt.max_guests && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF3E8] border border-[#E4DDCF] text-[#6C6963] text-xs font-semibold rounded-full">
                              <Users size={13} className="text-[#BA4B33]" />
                              <span>{isAr ? `حتى ${apt.max_guests} أفراد` : `Up to ${apt.max_guests} guests`}</span>
                            </span>
                          )}
                        </div>

                        {/* Feature Badges for Studio 2 or Studio 1 */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {isStudio2 ? (
                            <>
                              <span className="px-2.5 py-1 bg-white text-[#5A554E] text-[11px] font-medium rounded-lg border border-[#EAE1D1]">
                                {isAr ? 'غرفتين نوم مكيفتين' : '2 AC Bedrooms'}
                              </span>
                              <span className="px-2.5 py-1 bg-white text-[#5A554E] text-[11px] font-medium rounded-lg border border-[#EAE1D1]">
                                {isAr ? 'روف خاص بإطلالة جبلية' : 'Private Mountain Roof'}
                              </span>
                              <span className="px-2.5 py-1 bg-white text-[#5A554E] text-[11px] font-medium rounded-lg border border-[#EAE1D1]">
                                {isAr ? 'حديقة وكانون نار' : 'Garden & Fire Pit'}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="px-2.5 py-1 bg-white text-[#5A554E] text-[11px] font-medium rounded-lg border border-[#EAE1D1]">
                                {isAr ? 'غرفة علوية دوبلكس' : 'Duplex Loft'}
                              </span>
                              <span className="px-2.5 py-1 bg-white text-[#5A554E] text-[11px] font-medium rounded-lg border border-[#EAE1D1]">
                                {isAr ? 'تكييف وواي فاي' : 'A/C & Fast Wi-Fi'}
                              </span>
                              <span className="px-2.5 py-1 bg-white text-[#5A554E] text-[11px] font-medium rounded-lg border border-[#EAE1D1]">
                                {isAr ? 'مطبخ تحضيري' : 'Kitchenette'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-2.5">
                        <h4 className="text-2xl sm:text-3xl font-serif font-normal text-[#22211F]">
                          {isAr ? (apt.title_ar || apt.title) : apt.title}
                        </h4>
                        <p className="text-sm text-[#6C6963] leading-relaxed">
                          {isAr ? (apt.description_ar || apt.description) : apt.description}
                        </p>
                      </div>

                      {/* Price Display */}
                      <div className="border-t border-[#EAE1D1] pt-6 space-y-1.5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-bold text-[#22211F]">
                            ${apt.price_usd}
                          </span>
                          <span className="text-sm text-[#8C867C]">
                            {page.place.priceUsdSuffix}
                          </span>
                        </div>
                        <p className="text-base font-bold text-[#1F7A8C]">
                          {(apt.price_egp)?.toLocaleString()} EGP / {isAr ? 'ليلة' : 'night'}
                        </p>
                      </div>

                      {/* CTA Button: Ask about your dates */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleOpenApartment(apt)}
                          className="w-full inline-flex items-center justify-center py-4 px-6 bg-[#BA4B33] hover:bg-[#A33E28] text-white text-base font-semibold rounded-full shadow hover:shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          {page.place.button}
                        </button>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )
          })}

        </div>
      </section>

      {/* 4. The Everyday Details Section: "Everything you need to settle in" */}
      <section className="py-20 lg:py-24 bg-[#EFF4EC] border-t border-[#E4ECE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Heading */}
          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#C8553D] uppercase block">
              {page.details.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#22211F] tracking-tight">
              {page.details.title}
            </h2>
            <p className="text-base text-[#6C6963] font-normal">
              {page.details.subtitle}
            </p>
          </div>

          {/* 6 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {page.details.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#DEE7DB] flex items-start gap-4 hover:shadow-md transition-all duration-300"
              >
                <span className="text-xs font-bold text-[#C8553D] flex-shrink-0 pt-0.5">
                  {item.num}
                </span>
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-[#22211F]">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-[#6C6963] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Dark Intermezzo Banner: "Make Dahab your own." */}
      <section className="py-20 lg:py-24 bg-[#132724] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Make Dahab your own */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-semibold tracking-wider text-[#D46246] uppercase block">
                {page.ctaBanner.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-normal text-white tracking-tight leading-tight">
                {page.ctaBanner.title}
              </h2>
              <p className="text-sm sm:text-base text-[#B0C0BC] font-normal leading-relaxed max-w-lg">
                {page.ctaBanner.subtitle}
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleOpenApartment}
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-[#E8A94C] hover:bg-[#D99B3E] text-[#22211F] font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  {page.ctaBanner.button}
                </button>
              </div>
            </div>

            {/* Right Column: Also exploring Taba nuweiba? */}
            <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-white/10 lg:pl-12 rtl:lg:border-l-0 rtl:lg:border-r rtl:lg:border-white/10 rtl:lg:pl-0 rtl:lg:pr-12">
              <h3 className="text-2xl font-serif font-normal text-white">
                {page.ctaBanner.secondaryTitle}
              </h3>
              <p className="text-sm text-[#B0C0BC] leading-relaxed">
                {page.ctaBanner.secondaryDesc}
              </p>
              <div className="pt-1">
                <a
                  href="https://www.nirvana-camp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#E8A94C] hover:text-[#F3BA62] font-semibold text-sm transition-colors group cursor-pointer"
                >
                  <span>{page.ctaBanner.secondaryLink}</span>
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
