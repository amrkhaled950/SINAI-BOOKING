import React from 'react'

export default function CtaBanner({ t }) {
  return (
    <section className="py-16 lg:py-24 bg-[#FAF6EF] border-t border-[#ECE4D5] reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Copy Area */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-block text-xs md:text-sm font-semibold tracking-[0.2em] text-[#C45437] uppercase">
                {t.ctaBanner.tag}
              </span>
              <span className="font-script text-2xl sm:text-3xl text-[#C8553D] -rotate-2 inline-block animate-float">
                ~ Search for the vibe ~
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#22211F] tracking-tight">
              {t.ctaBanner.title}
            </h2>
            <p className="text-base sm:text-lg text-[#6C6963] font-normal leading-relaxed">
              {t.ctaBanner.subtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex-shrink-0 flex items-center gap-4 flex-wrap">
            <a
              href="https://wa.me/201116664591?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20Sinai%20Booking%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D9%88%D8%A7%D9%84%D8%AD%D8%AC%D8%B2."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-102 transition-all active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>واتساب 01116664591</span>
            </a>

            <a
              href="#destinations"
              className="btn-shimmer inline-flex items-center justify-center px-7 sm:px-8 py-3.5 sm:py-4 bg-[#C45437] hover:bg-[#AB462C] text-white text-sm sm:text-base font-medium rounded-full shadow-md hover:shadow-xl hover:scale-102 transition-all active:scale-95"
            >
              {t.ctaBanner.button}
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
