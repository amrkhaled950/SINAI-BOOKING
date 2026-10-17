import React from 'react'
import { ArrowUpRight, Instagram, Facebook } from 'lucide-react'

export default function BlogGuidesSection({ t, lang = 'en', onNavigate }) {
  const guideImages = [
    {
      src: "/images/kitesurf.png",
      fallback: "/design-refs/media_1792193255849.png",
      fallbackClass: "object-left",
    },
    {
      src: "/images/camel-beach.png",
      fallback: "/design-refs/media_1792193255849.png",
      fallbackClass: "object-center",
    },
    {
      src: "/images/mountains-sea.png",
      fallback: "/design-refs/media_1792193255849.png",
      fallbackClass: "object-right",
    }
  ]

  return (
    <section id="blog" className="py-16 lg:py-24 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Handwritten Touch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 lg:mb-16 reveal">
          <div className="space-y-4">
            <span className="inline-block text-xs md:text-sm font-semibold tracking-[0.2em] text-[#C45437] uppercase">
              {t.blog.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#22211F] tracking-tight">
              {t.blog.title}
            </h2>
            <p className="text-base sm:text-lg text-[#6C6963] font-normal leading-relaxed">
              {t.blog.subtitle}
            </p>
          </div>
          <div className="hidden sm:inline-block">
            <span className="font-script text-2xl sm:text-3xl text-[#8C867C] -rotate-2 inline-block animate-float">
              "We are The old school of tourism"
            </span>
          </div>
        </div>

        {/* 3 Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {t.blog.cards.map((story, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate && onNavigate('blog')}
              className={`bg-[#F6F0E6] rounded-[28px] overflow-hidden border border-[#ECE4D5] shadow-xs card-shadow-hover reveal-scale ${
                idx === 0 ? 'stagger-1' : idx === 1 ? 'stagger-2' : 'stagger-3'
              } flex flex-col group cursor-pointer active:scale-98 transition-all`}
              title={`Read on blog: ${story.title}`}
            >
              {/* Image */}
              <div className="aspect-[16/9] overflow-hidden bg-[#ECE4D5] relative">
                <img
                  src={guideImages[idx].src}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.target.src = guideImages[idx].fallback
                    e.target.className = `w-full h-full object-cover ${guideImages[idx].fallbackClass}`
                  }}
                />
              </div>

              {/* Story Body */}
              <div className="p-7 sm:p-8 flex flex-col justify-between flex-grow space-y-5">
                <div className="space-y-3">
                  <span className="block text-xs font-bold tracking-[0.15em] text-[#C45437] uppercase">
                    {story.category}
                  </span>
                  <h3 className="text-2xl font-serif font-normal text-[#22211F] leading-snug group-hover:text-[#C45437] transition-colors">
                    {story.title}
                  </h3>
                </div>

                <div className="pt-4 border-t border-[#EBE1D0] flex items-center justify-between text-xs font-semibold tracking-wider text-[#6C6963] uppercase">
                  <span>{story.time}</span>
                  <span className="inline-flex items-center gap-1 text-[#25D366] font-bold group-hover:text-[#1F9D4D]">
                    <span>{story.action}</span>
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Community Banner */}
        <div className="mt-12 p-6 sm:p-8 bg-[#F6F0E6] rounded-[28px] border border-[#ECE4D5] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <h4 className="text-xl font-serif text-[#22211F] flex items-center gap-2">
              <Instagram size={20} className="text-[#E1306C]" />
              <span>لحظات ويوميات سيناء على إنستجرام</span>
            </h4>
            <p className="text-sm text-[#6C6963]">
              تابع تجارب حية، إقامات، وقصص يومية من الطريق عبر حسابنا الرسمي @sinai_booking
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
            <a
              href="https://www.instagram.com/sinai_booking?vrfl=bHBxOTFqbzNyMW9h"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-95 text-white text-sm font-semibold rounded-full shadow transition-all active:scale-95"
            >
              <Instagram size={17} />
              <span>@sinai_booking</span>
            </a>

            <a
              href="https://www.facebook.com/share/1Er8aG2qfE/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-semibold rounded-full shadow transition-all active:scale-95"
            >
              <Facebook size={17} className="fill-white" />
              <span>Facebook</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
