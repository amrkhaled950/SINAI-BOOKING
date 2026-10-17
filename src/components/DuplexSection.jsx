import React from 'react'

export default function DuplexSection({ t, onNavigate }) {
  return (
    <section id="dahab" className="py-16 lg:py-24 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Handwritten Touch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-4">
            <span className="inline-block text-xs md:text-sm font-semibold tracking-[0.2em] text-[#C45437] uppercase">
              {t.duplex.tag}
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-normal text-[#22211F] tracking-tight">
              {t.duplex.title}
            </h2>
          </div>
          <div>
            <span className="font-script text-2xl sm:text-3xl text-[#8C867C] -rotate-2 inline-block">
              "We are The old school of tourism"
            </span>
          </div>
        </div>

        {/* Duplex Grid: Image on Left, Details Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Authentic Duplex Interior Image */}
          <div className="lg:col-span-6">
            <div
              onClick={() => onNavigate && onNavigate('dahab-accommodation')}
              className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[32px] overflow-hidden shadow-lg border border-[#EAE3D5] group cursor-pointer"
              title="Explore Dahab Duplex"
            >
              <img
                src="/images/mashraba-duplex.png"
                alt="Mashraba Duplex Interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          {/* Right: Detailed Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#F5EEE2] rounded-[32px] p-8 sm:p-10 lg:p-12 border border-[#EBE3D3] space-y-7 shadow-sm">
              
              {/* Badge */}
              <div>
                <span className="inline-block px-4 py-1.5 bg-white rounded-full text-xs font-bold tracking-wider text-[#C45437] uppercase shadow-sm">
                  {t.duplex.badge}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="text-3xl sm:text-4xl font-serif font-normal text-[#22211F]">
                  {t.duplex.cardTitle}
                </h3>
                <p className="text-base text-[#6C6963] leading-relaxed">
                  {t.duplex.cardDesc}
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-2 text-sm text-[#4E4B46] font-medium pt-2 border-t border-[#EAE1D1]">
                <div className="flex flex-wrap items-center gap-2">
                  {t.duplex.amenitiesRow1.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span>{item}</span>
                      {idx < t.duplex.amenitiesRow1.length - 1 && (
                        <span className="text-[#C45437]">•</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {t.duplex.amenitiesRow2.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span>{item}</span>
                      {idx < t.duplex.amenitiesRow2.length - 1 && (
                        <span className="text-[#C45437]">•</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Price and Action */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-t border-[#EAE1D1]">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-lg sm:text-xl font-bold text-[#C45437]">
                      {t.duplex.price}
                    </span>
                  </div>
                  <div className="text-xs text-[#7A7367] font-medium">
                    {t.duplex.priceSuffix}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href="https://wa.me/201116664591?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%AD%D8%AC%D8%B2%20%D9%81%D9%8A%20Studio%201%20(%D8%A7%D8%B3%D8%AA%D9%88%D8%AF%D9%8A%D9%88%20%D8%AF%D9%88%D8%A8%D9%84%D9%83%D8%B3%20%D9%85%D8%B4%D8%B1%D8%A8%D9%87)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs sm:text-sm font-semibold rounded-full shadow transition-all active:scale-95"
                  >
                    <span>واتساب 01116664591</span>
                  </a>

                  <button
                    onClick={() => onNavigate && onNavigate('dahab-accommodation')}
                    className="inline-flex items-center justify-center px-7 py-3.5 bg-[#24221F] hover:bg-black text-white text-sm font-medium rounded-full shadow transition-all active:scale-95 text-center cursor-pointer"
                  >
                    {t.duplex.button}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
