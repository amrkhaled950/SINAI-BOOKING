import React, { useState, useEffect } from 'react'
import { ArrowUpRight, Bed, Users, Sparkles, Check } from 'lucide-react'
import { fetchApartments, DEFAULT_APARTMENTS } from '../lib/supabase'

export default function DahabAccommodationPage({ t, lang, onNavigateHome, onSelectApartment }) {
  const page = t.accommodationPage
  const isAr = lang === 'ar'
  const [apartments, setApartments] = useState(DEFAULT_APARTMENTS)
  const [loading, setLoading] = useState(false)

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

  const primaryApartment = apartments[0] || DEFAULT_APARTMENTS[0]
  const additionalApartments = apartments.slice(1)

  const handleOpenApartment = (apt = primaryApartment) => {
    if (onSelectApartment) {
      onSelectApartment(apt)
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
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="inline-block px-3.5 py-1 bg-[#E2ECE5] text-[#2A6543] text-xs font-semibold tracking-wider rounded-full uppercase">
                  {page.hero.badge}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-normal text-[#22211F] tracking-tight leading-[1.12]">
                {page.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-[#6C6963] font-normal leading-relaxed max-w-lg">
                {page.hero.subtitle}
              </p>

              {/* 3 Pill Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {page.hero.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-1.5 bg-white rounded-full text-xs font-semibold tracking-wider text-[#5A554E] uppercase border border-[#E3DBD0] shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Duplex Photo with Bottom-Right Base Badge */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <div
                onClick={() => handleOpenApartment(primaryApartment)}
                className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-[16/11] rounded-[32px] overflow-hidden shadow-xl border-4 border-white/70 group cursor-pointer"
              >
                <img
                  src={primaryApartment.images?.[0] || '/images/duplex-hero-loft.jpg'}
                  alt={primaryApartment.title || 'Mashraba Duplex in Dahab'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-5 right-5 rtl:right-auto rtl:left-5">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg border border-black/5">
                    <p className="text-sm font-bold text-[#22211F]">
                      {page.hero.cardOverlayTitle}
                    </p>
                    <p className="text-xs text-[#8C867C] font-normal">
                      {primaryApartment.code || page.hero.cardOverlaySubtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The Place Section: "Meet the Mashraba duplex" */}
      <section className="py-16 lg:py-20 border-t border-[#EAE3D5]/60 bg-[#FAF6EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Heading */}
          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#C8553D] uppercase block">
              {page.place.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#22211F] tracking-tight">
              {page.place.title}
            </h2>
            <p className="text-base text-[#6C6963] font-normal">
              {page.place.subtitle}
            </p>
          </div>

          {/* 2-Column Grid: Image on Left, Details Card on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left: Clean Single Duplex Photo */}
            <div className="lg:col-span-7 space-y-3">
              <div
                onClick={() => handleOpenApartment(primaryApartment)}
                className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[28px] overflow-hidden shadow-md border border-[#EAE3D5] bg-[#F2EDE4] group cursor-pointer"
              >
                <img
                  src={primaryApartment.images?.[1] || primaryApartment.images?.[0] || '/images/duplex-full-structure.jpg'}
                  alt={primaryApartment.title || 'Meet the Mashraba duplex'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <p className="text-xs text-[#8C867C] pt-1">
                {page.place.note}
              </p>
            </div>

            {/* Right: Exactly as Figma Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#F8F3EA] rounded-[28px] p-8 sm:p-10 border border-[#EAE1D1] space-y-6 shadow-sm">
                
                {/* Tag Badge */}
                <div>
                  <span className="inline-block px-3 py-1 bg-[#E2ECE5] text-[#2A6543] text-xs font-semibold rounded-full uppercase tracking-wider">
                    {primaryApartment.badge || page.place.badge}
                  </span>
                </div>

                {/* Title & Desc */}
                <div className="space-y-2.5">
                  <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#22211F]">
                    {isAr ? (primaryApartment.title_ar || page.place.stayTitle) : (primaryApartment.title || page.place.stayTitle)}
                  </h3>
                  <p className="text-sm text-[#6C6963] leading-relaxed">
                    {isAr ? (primaryApartment.description_ar || page.place.stayDesc) : (primaryApartment.description || page.place.stayDesc)}
                  </p>
                </div>

                {/* Price Display */}
                <div className="border-t border-[#EAE1D1] pt-6 space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#22211F]">
                      ${primaryApartment.price_usd || 40}
                    </span>
                    <span className="text-sm text-[#8C867C]">
                      {page.place.priceUsdSuffix}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1F7A8C]">
                    {(primaryApartment.price_egp || 2000).toLocaleString()} EGP / {isAr ? 'ليلة' : 'night'}
                  </p>
                </div>

                {/* CTA Button: Ask about your dates */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenApartment(primaryApartment)}
                    className="w-full inline-flex items-center justify-center py-4 px-6 bg-[#BA4B33] hover:bg-[#A33E28] text-white text-base font-semibold rounded-full shadow hover:shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    {page.place.button}
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Additional Apartments Grid (if more than 1 room exists in CMS) */}
      {additionalApartments.length > 0 && (
        <section className="py-16 bg-white border-t border-[#EAE3D5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-[#C8553D] uppercase block">
                {isAr ? 'المزيد من الوحدات المتاحة' : 'More Available Units'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#22211F]">
                {isAr ? 'اختر الغرفة أو الاستوديو المناسب لإقامتك في دهب' : 'Select from Our Curated Dahab Stays'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalApartments.map((apt) => (
                <div key={apt.id} className="bg-[#FAF6EF] rounded-3xl overflow-hidden border border-[#EAE1D1] shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                    <img
                      src={apt.images?.[0] || '/images/duplex-hero-loft.jpg'}
                      alt={apt.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded-full uppercase">
                      {apt.code || 'Studio'}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-xl font-serif font-bold text-[#22211F]">
                        {isAr ? (apt.title_ar || apt.title) : apt.title}
                      </h4>
                      <p className="text-xs text-[#8C867C] mt-1 line-clamp-2">
                        {isAr ? (apt.description_ar || apt.description) : apt.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EAE1D1] flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-[#BA4B33]">${apt.price_usd}</span>
                        <span className="text-xs text-[#8C867C]"> / {isAr ? 'ليلة' : 'night'}</span>
                        <div className="text-xs font-medium text-[#1F7A8C]">{apt.price_egp?.toLocaleString()} EGP</div>
                      </div>

                      <button
                        onClick={() => handleOpenApartment(apt)}
                        className="px-5 py-2.5 bg-[#BA4B33] hover:bg-[#A33E28] text-white text-xs font-semibold rounded-full shadow transition-all active:scale-95 cursor-pointer"
                      >
                        {isAr ? 'عرض وحجز' : 'View & Book'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
