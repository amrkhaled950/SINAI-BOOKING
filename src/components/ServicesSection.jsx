import React from 'react'
import { ArrowUpRight } from 'lucide-react'

export default function ServicesSection({ t, lang = 'en', onNavigate }) {
  const isAr = lang === 'ar'
  const serviceImages = [
    {
      src: "/images/camel-beach.png",
      fallback: "/design-refs/media_1792193210134.png",
      fallbackClass: "object-center",
    },
    {
      src: "/images/mountains-sea.png",
      fallback: "/design-refs/media_1792193210134.png",
      fallbackClass: "object-right",
    },
    {
      src: "/images/kitesurf.png",
      fallback: "/design-refs/media_1792193210134.png",
      fallbackClass: "object-left",
    }
  ]

  return (
    <section id="services" className="py-16 lg:py-24 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Handwritten Annotation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 lg:mb-16 reveal">
          <div className="space-y-4">
            <span className="inline-block text-xs md:text-sm font-semibold tracking-[0.2em] text-[#C45437] uppercase">
              {t.services.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#22211F] tracking-tight">
              {t.services.title}
            </h2>
            <p className="text-base sm:text-lg text-[#6C6963] font-normal leading-relaxed">
              {t.services.subtitle}
            </p>
          </div>
          <div className="hidden sm:inline-block">
            <span className="font-script text-3xl sm:text-4xl text-[#C8553D] rotate-2 inline-block animate-float">
              ~ Search for class ~
            </span>
          </div>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {t.services.cards.map((card, idx) => {
            // Context-specific WhatsApp messages for each tab
            const waMsgs = [
              'السلام عليكم سيناء بوكينج، أود الاستفسار وحجز الرحلات والأنشطة (Excursions) في سيناء.',
              'السلام عليكم سيناء بوكينج، أود طلب خدمة المواصلات والانتقالات (Transportation) في سيناء.',
              'السلام عليكم سيناء بوكينج، أود معرفة نصائح وترشيحات السفر في سيناء.'
            ]
            const cardWaUrl = `https://wa.me/201116664591?text=${encodeURIComponent(waMsgs[idx])}`
            const cardAnchorId = idx === 0 ? 'excursions' : idx === 1 ? 'transportation' : 'notes'

            const handleClick = (e) => {
              if (idx === 0 && onNavigate) {
                e.preventDefault()
                onNavigate('excursions')
              } else if (idx === 1 && onNavigate) {
                e.preventDefault()
                onNavigate('transportation')
              }
            }

            return (
              <a
                key={idx}
                id={cardAnchorId}
                href={cardWaUrl}
                onClick={handleClick}
                target={idx === 0 ? undefined : "_blank"}
                rel={idx === 0 ? undefined : "noopener noreferrer"}
                className={`bg-white rounded-[28px] overflow-hidden border border-[#EAE3D5] shadow-xs card-shadow-hover reveal-scale ${
                  idx === 0 ? 'stagger-1' : idx === 1 ? 'stagger-2' : 'stagger-3'
                } flex flex-col group cursor-pointer active:scale-98 transition-all`}
                title={idx === 0 ? "Explore Excursions" : `WhatsApp Sinai Booking: 01116664591 - ${card.title}`}
              >
                {/* Image */}
                <div className="aspect-[16/9] overflow-hidden bg-[#F2EDE4] relative">
                  <img
                    src={serviceImages[idx].src}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.target.src = serviceImages[idx].fallback
                      e.target.className = `w-full h-full object-cover ${serviceImages[idx].fallbackClass}`
                    }}
                  />
                  <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-medium rounded-full opacity-90 group-hover:opacity-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
                    01116664591
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-7 flex flex-col justify-between flex-grow space-y-4">
                  <h3 className="text-2xl font-serif font-normal text-[#22211F]">
                    {card.title}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-[#F5EFE4] text-sm">
                    <span className="text-[#6C6963]">
                      {card.desc}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#25D366] font-semibold group-hover:text-[#1F9D4D]">
                      <span>
                        {idx < 2 ? card.link : isAr ? `${card.link} (واتساب)` : 'Send via WhatsApp'}
                      </span>
                      <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

      </div>
    </section>
  )
}
