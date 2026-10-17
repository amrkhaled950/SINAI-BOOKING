import React, { useState } from 'react'
import Logo from './Logo'
import { Instagram, Facebook } from 'lucide-react'

export default function Footer({ t, lang = 'en', onNavigate }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  const isAr = lang === 'ar'

  return (
    <footer className="bg-[#122432] text-white pt-20 pb-14 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Col 1: Brand Logo & Tagline */}
          <div className="md:col-span-4 space-y-3">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="inline-block focus:outline-none cursor-pointer"
            >
              <Logo light={true} className="h-10 sm:h-12" />
            </button>
            <p className={`${isAr ? 'font-scriptAr text-2xl pt-2' : 'font-script text-2xl sm:text-[28px]'} text-white/95 tracking-wide`}>
              {t.footer.tagline}
            </p>
            <div className="pt-3 flex flex-wrap items-center gap-2.5">
              <a
                href="https://wa.me/201116664591"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-mono text-white transition-all shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                <span className="font-sans text-[11px] text-white/80">{isAr ? 'واتساب:' : 'WhatsApp:'}</span>
                <span className="font-bold text-white tracking-wider">01116664591</span>
              </a>

              <a
                href="https://www.instagram.com/sinai_booking?vrfl=bHBxOTFqbzNyMW9h"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#833AB4]/25 via-[#FD1D1D]/25 to-[#FCAF45]/25 hover:from-[#833AB4]/40 hover:via-[#FD1D1D]/40 hover:to-[#FCAF45]/40 border border-white/20 rounded-full text-xs text-white transition-all shadow-sm group"
                title="Sinai Booking Instagram"
              >
                <Instagram size={14} className="text-[#FCAF45] group-hover:scale-110 transition-transform" />
                <span className="font-mono font-semibold tracking-wider">@sinai_booking</span>
              </a>

              <a
                href="https://www.facebook.com/share/1Er8aG2qfE/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1877F2]/20 hover:bg-[#1877F2]/35 border border-white/20 rounded-full text-xs text-white transition-all shadow-sm group"
                title="Sinai Booking Facebook"
              >
                <Facebook size={14} className="text-[#1877F2] fill-[#1877F2] group-hover:scale-110 transition-transform" />
                <span className="font-semibold tracking-wide">Facebook</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-4 lg:col-span-3 space-y-2">
            <ul className="space-y-3 text-[15px] sm:text-base text-white/80 font-normal">
              {t.footer.links.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      if (idx === 0 && onNavigate) {
                        onNavigate('dahab-accommodation')
                      } else if (idx === 1 && onNavigate) {
                        onNavigate('excursions')
                      } else if (idx === 2 && onNavigate) {
                        onNavigate('transportation')
                      } else if (idx === 3 && onNavigate) {
                        onNavigate('blog')
                      } else if (onNavigate) {
                        onNavigate('home')
                      }
                    }}
                    className="hover:text-[#C8553D] transition-colors inline-block text-left rtl:text-right cursor-pointer"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Newsletter Box */}
          <div className="md:col-span-4 lg:col-span-5 space-y-4 max-w-md">
            <h4 className={`${isAr ? 'font-scriptAr text-2xl sm:text-3xl' : 'font-script text-3xl sm:text-4xl'} text-white font-normal tracking-wide`}>
              {t.footer.newsletterTitle}
            </h4>

            {subscribed ? (
              <div className="p-4 bg-[#2A7242]/20 border border-[#2A7242] rounded-2xl text-sm text-[#4ADE80]">
                {t.footer.subscribedMessage}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.footer.emailPlaceholder}
                    required
                    className="w-full px-6 py-3.5 bg-[#FAF6EF] text-[#22211F] placeholder-[#8C867C] rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8553D] text-sm transition-all"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-[#C8553D] hover:bg-[#AB462C] text-white text-sm font-medium rounded-full shadow transition-all active:scale-95"
                  >
                    {t.footer.subscribe}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Copyright Area */}
        <div className="pt-16 mt-12 text-xs sm:text-sm text-white/60">
          <p>{t.footer.copyright}</p>
        </div>

      </div>
    </footer>
  )
}
