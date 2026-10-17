import React from 'react'

export default function ProcessStrip({ t }) {
  return (
    <div className="w-full bg-white border-y border-[#ECE5D8] py-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-sm md:text-base">
          
          {/* Label */}
          <div className="text-xs md:text-sm font-bold tracking-[0.2em] text-[#C45437] uppercase">
            {t.process.label}
          </div>

          {/* Steps */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 lg:gap-16 font-semibold text-[#22211F]">
            {t.process.steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2 group cursor-pointer">
                <span className="text-[#22211F] group-hover:text-[#C45437] transition-colors">
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
