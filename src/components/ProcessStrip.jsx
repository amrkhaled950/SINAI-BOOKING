import React from 'react'

export default function ProcessStrip({ t }) {
  return (
    <div className="w-full bg-white/90 backdrop-blur-sm border-y border-[#ECE5D8] py-5 sm:py-6 shadow-xs reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 text-sm md:text-base">
          
          {/* Label */}
          <div className="text-xs md:text-sm font-bold tracking-[0.2em] text-[#C45437] uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C45437] animate-pulse"></span>
            <span>{t.process.label}</span>
          </div>

          {/* Steps */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 lg:gap-14 font-semibold text-[#22211F]">
            {t.process.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 group cursor-pointer transition-transform hover:-translate-y-0.5 duration-200"
              >
                <span className="w-5 h-5 rounded-full bg-[#FAF6EF] border border-[#D9D0C2] text-[10px] font-mono font-bold flex items-center justify-center text-[#7A7367] group-hover:bg-[#C45437] group-hover:text-white group-hover:border-[#C45437] transition-all">
                  {idx + 1}
                </span>
                <span className="text-[#22211F] text-xs sm:text-sm md:text-base group-hover:text-[#C45437] transition-colors">
                  {step}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
