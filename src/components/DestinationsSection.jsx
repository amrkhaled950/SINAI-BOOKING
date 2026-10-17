import React from 'react'
import { ArrowUpRight } from 'lucide-react'

export default function DestinationsSection({ t }) {
  const images = [
    {
      src: "/images/camel-beach.png",
      fallback: "/design-refs/media_1792193210135.png",
      fallbackClass: "object-left",
    },
    {
      src: "/images/kitesurf.png",
      fallback: "/design-refs/media_1792193210135.png",
      fallbackClass: "object-right",
    }
  ]

  return (
    <section id="destinations" className="py-16 lg:py-24 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Handwritten Annotation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div className="space-y-4">
            <span className="inline-block text-xs md:text-sm font-semibold tracking-[0.2em] text-[#C45437] uppercase">
              {t.destinations.tag}
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-normal text-[#22211F] tracking-tight">
              {t.destinations.title}
            </h2>
            <p className="text-lg text-[#6C6963] max-w-2xl font-normal">
              {t.destinations.subtitle}
            </p>
          </div>

          <div className="hidden sm:inline-block">
            <span className="font-script text-3xl sm:text-4xl text-[#C8553D] -rotate-3 inline-block">
              ~ Search for class ~
            </span>
          </div>
        </div>

        {/* 2 Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {t.destinations.cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[32px] overflow-hidden border border-[#EAE3D5] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              {/* Card Image Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F2EDE4]">
                <img
                  src={images[idx].src}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.target.src = images[idx].fallback
                    e.target.className = `w-full h-full object-cover ${images[idx].fallbackClass}`
                  }}
                />
                
                {/* Tag Overlay */}
                <div className="absolute top-5 left-5 rtl:left-auto rtl:right-5">
                  <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase text-[#22211F] shadow-md">
                    {card.tag}
                  </span>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-8 sm:p-10 flex flex-col justify-between flex-grow space-y-6">
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-normal text-[#22211F]">
                    {card.title}
                  </h3>
                  <p className="text-base text-[#6C6963]">
                    {card.desc}
                  </p>
                </div>

                <div>
                  <a
                    href={`#${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center gap-1.5 text-[#C45437] font-semibold text-sm hover:text-[#AB462C] transition-colors group-hover:gap-2"
                  >
                    <span>{card.link}</span>
                    <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
