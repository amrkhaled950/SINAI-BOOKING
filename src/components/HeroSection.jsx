import React, { useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'

export default function HeroSection({ t, lang = 'en' }) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const target = document.getElementById('destinations')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isAr = lang === 'ar'

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline, Search & Copy */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <span className="inline-block text-xs md:text-sm font-semibold tracking-[0.2em] text-[#C8553D] uppercase animate-fade-in-down">
                {t.hero.tag}
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-[70px] font-serif font-normal text-[#22211F] tracking-tight leading-[1.1] animate-fade-in-up stagger-1">
                {t.hero.title}
              </h1>
            </div>

            <p className="text-base sm:text-xl text-[#6C6963] font-normal leading-relaxed max-w-xl animate-fade-in-up stagger-2">
              {t.hero.subtitle}
            </p>

            {/* Handwritten prompt: Search for class & Search for the vibe */}
            <div className="flex items-center gap-3 pt-1 select-none animate-fade-in-up stagger-2">
              <span className={`${isAr ? 'font-scriptAr text-2xl' : 'font-script text-3xl'} text-[#C8553D] -rotate-2 inline-block animate-float`}>
                Search for class
              </span>
              <span className="text-[#8C867C] font-mono text-sm">•</span>
              <span className={`${isAr ? 'font-scriptAr text-xl' : 'font-script text-2xl'} text-[#6C6963] rotate-1 inline-block animate-float-reverse`}>
                Search for the vibe
              </span>
            </div>

            {/* "Search for the vibe" Input Bar from Figma */}
            <form onSubmit={handleSearch} className="max-w-md pt-1 animate-fade-in-up stagger-3">
              <div className="relative flex items-center bg-[#FAF6EF] rounded-full border border-[#22211F] shadow-sm hover:shadow-md transition-all px-5 sm:px-6 py-3 sm:py-3.5 group focus-within:ring-2 focus-within:ring-[#C8553D]/30 focus-within:border-[#C8553D]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'Search for class ... ابحث عن الرقي' : 'Search for class ~ Search for the vibe'}
                  className={`w-full bg-transparent text-[#22211F] placeholder-[#5A554E] ${isAr ? 'font-scriptAr text-lg sm:text-xl' : 'font-script text-xl sm:text-2xl'} focus:outline-none tracking-wide`}
                />
                <button
                  type="submit"
                  className="text-[#C8553D] hover:text-[#AB462C] transition-transform active:scale-90 p-1 flex-shrink-0 cursor-pointer"
                  title="Search"
                >
                  <Search size={22} className="stroke-[2.2]" />
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4 flex-wrap animate-fade-in-up stagger-4">
              <a
                href="#destinations"
                className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-[#C8553D] hover:bg-[#AB462C] text-white text-base font-medium rounded-full shadow-md hover:shadow-xl hover:scale-102 active:scale-95 transition-all duration-300 group"
              >
                <span>{t.hero.cta}</span>
                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href={`https://wa.me/201116664591?text=${encodeURIComponent('مساء الخير Sinai Booking، حابب استفسر واحجز.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] text-sm font-semibold rounded-full shadow-sm hover:shadow-md hover:scale-102 active:scale-95 transition-all duration-300"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
                <span>{lang === 'ar' ? 'واتساب 01116664591' : 'Send via WhatsApp'}</span>
              </a>
            </div>

            {/* Micro Tags */}
            <div className="pt-2 flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold tracking-widest text-[#6C6963] uppercase animate-fade-in stagger-5 flex-wrap">
              {t.hero.meta.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span>{item}</span>
                  {idx < t.hero.meta.length - 1 && (
                    <span className="text-[#C8553D]">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual with Overlays */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[540px] aspect-[4/4.2] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white/60">
              
              {/* Handwritten Signature Stamp: We are The old school of tourism */}
              <div className="absolute top-5 left-5 bg-[#FAF6EF]/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-[#E4D7C5] -rotate-3 hover:rotate-0 transition-transform duration-300 z-20 max-w-[210px] pointer-events-none">
                <p className={`${isAr ? 'font-scriptAr text-lg leading-tight' : 'font-script text-2xl leading-tight'} text-[#C8553D]`}>
                  We are The old school of tourism
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#8C867C] pt-0.5">
                  {isAr ? 'دليل سينا القديم' : 'Authentic Sinai'}
                </p>
              </div>

              {/* Main Dahab Bay Photo */}
              <img
                src="/images/hero-dahab.jpg"
                alt="Sinai Coast & Dahab Turquoise Bay"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Subtle Overlay for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Top-Right Decorative Star Badge (Yellow & Green) as in Figma Board */}
              <div className="absolute top-5 right-5 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E8C547] p-1 shadow-lg flex items-center justify-center hover:rotate-45 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-[#2A7242] flex items-center justify-center text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Floating Official "SB" Stamp Badge */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-24 sm:h-24 drop-shadow-2xl hover:rotate-12 transition-transform duration-300 z-10 pointer-events-none">
                <img
                  src="/images/sb-badge.png"
                  alt="Sinai Booking Stamp"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Bottom Pill Badge: "A slower kind of escape" */}
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-black/5 text-[#22211F] text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#2AA59B] animate-pulse"></span>
                  <span>{t.hero.badge}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
