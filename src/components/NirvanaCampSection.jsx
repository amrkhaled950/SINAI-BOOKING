import React from 'react'
import { ArrowUpRight } from 'lucide-react'

export default function NirvanaCampSection({ t }) {
  return (
    <section id="taba-nuweiba" className="py-20 lg:py-28 bg-[#122432] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Camp Sunset Photo with Camel */}
          <div className="lg:col-span-6 reveal-scale">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl border-2 border-white/10 group">
              <img
                src="/images/camel-sunset.jpg"
                alt="Sinai Beach Camp at Sunset"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right: Section Copy & CTA */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8 reveal stagger-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-block text-xs sm:text-sm font-semibold tracking-wider text-[#D5A26B] uppercase">
                {t.nirvana.tag}
              </span>
              <span className="font-script text-2xl sm:text-3xl text-[#E8C547] -rotate-3 inline-block animate-float">
                ~ Search for the vibe ~
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-normal text-white tracking-tight leading-[1.12]">
              {t.nirvana.title}
            </h2>

            <p className="text-base sm:text-lg text-[#C2D0DB] font-normal leading-relaxed max-w-lg">
              {t.nirvana.desc}
            </p>

            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <a
                href={`https://wa.me/201116664591?text=${encodeURIComponent('السلام عليكم سيناء بوكينج، أود الاستفسار والحجز في كامات طابا ونويبع (Nirvana Camp).')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-102 transition-all active:scale-95"
              >
                <span>واتساب الكامات 01116664591</span>
              </a>

              <a
                href="https://www.nirvana-camp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#C45437] hover:bg-[#AB462C] text-white text-sm sm:text-base font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-102 transition-all group active:scale-95"
              >
                <span>{t.nirvana.cta}</span>
                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
