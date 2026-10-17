import React, { useState } from 'react'
import Logo from './Logo'
import { Menu, X, MessageCircle, Instagram, Facebook } from 'lucide-react'

export default function Navbar({ lang, setLang, t, currentPage = 'home', onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'))
  }

  const isAr = lang === 'ar'

  // Links array tailored to match Figma exact layout order
  const links = isAr
    ? [
        { id: 'taba-nuweiba', label: t.nav.tabaNuweiba, badge: t.nav.campsBadge, externalUrl: 'https://www.nirvana-camp.com/', badgeFirst: true },
        { id: 'blog', label: t.nav.blog, page: 'blog' },
        { id: 'transportation', label: t.nav.transportation, page: 'transportation' },
        { id: 'excursions', label: t.nav.excursions, page: 'excursions' },
        { id: 'dahab', label: t.nav.dahab, page: 'dahab-accommodation' },
      ]
    : [
        { id: 'dahab', label: t.nav.dahab, page: 'dahab-accommodation' },
        { id: 'excursions', label: t.nav.excursions, page: 'excursions' },
        { id: 'transportation', label: t.nav.transportation, page: 'transportation' },
        { id: 'blog', label: t.nav.blog, page: 'blog' },
        { id: 'taba-nuweiba', label: t.nav.tabaNuweiba, badge: t.nav.campsBadge, externalUrl: 'https://www.nirvana-camp.com/', badgeFirst: false },
      ]

  const handleLinkClick = (e, link) => {
    e.preventDefault()
    if (link.externalUrl) {
      window.open(link.externalUrl, '_blank')
    } else if (link.page) {
      if (onNavigate) onNavigate(link.page)
    } else {
      if (currentPage !== 'home') {
        if (onNavigate) onNavigate('home', link.id)
      } else {
        const el = document.getElementById(link.id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    if (onNavigate) onNavigate('home')
  }

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6EF]/95 backdrop-blur-md border-b border-[#EAE3D5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center focus:outline-none cursor-pointer"
            >
              <Logo className="h-9 sm:h-10" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 rtl:space-x-reverse text-[15px] font-medium text-[#22211F]">
            {links.map((link) => {
              const isActive = (link.page && currentPage === link.page)
              return (
                <button
                  key={link.id}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`flex items-center gap-2 transition-all cursor-pointer select-none py-1 ${
                    isActive
                      ? 'text-[#C8553D] underline underline-offset-8 decoration-2 decoration-[#C8553D] font-semibold'
                      : 'hover:text-[#C8553D] text-[#22211F]'
                  }`}
                >
                  {link.badge ? (
                    link.badgeFirst ? (
                      <>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-white bg-[#466B4E] rounded-full">
                          {link.badge}
                        </span>
                        <span>{link.label}</span>
                      </>
                    ) : (
                      <>
                        <span>{link.label}</span>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-white bg-[#466B4E] rounded-full">
                          {link.badge}
                        </span>
                      </>
                    )
                  ) : (
                    <span>{link.label}</span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right Action Area: Language Switcher & Book Now CTA */}
          <div className="hidden sm:flex items-center space-x-5 rtl:space-x-reverse">
            {/* WhatsApp Direct Link (من برا) */}
            <a
              href="https://wa.me/201116664591?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20Sinai%20Booking%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D9%88%D8%A7%D9%84%D8%AD%D8%AC%D8%B2."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-semibold rounded-full border border-[#25D366]/30 transition-all shadow-sm group"
              title="WhatsApp: 01116664591"
            >
              <MessageCircle size={15} className="fill-[#25D366] text-[#25D366] group-hover:scale-110 transition-transform" />
              <span className="font-mono tracking-wider">01116664591</span>
            </a>

            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/sinai_booking?vrfl=bHBxOTFqbzNyMW9h"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-full text-[#6C6963] hover:text-[#E1306C] hover:bg-[#EFE8DC] transition-all"
              title="Instagram @sinai_booking"
            >
              <Instagram size={18} />
            </a>

            {/* Facebook Link */}
            <a
              href="https://www.facebook.com/share/1Er8aG2qfE/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-full text-[#6C6963] hover:text-[#1877F2] hover:bg-[#EFE8DC] transition-all"
              title="Facebook Sinai Booking"
            >
              <Facebook size={18} />
            </a>

            {/* Language Switcher: EN | عربي */}
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium text-[#22211F] hover:text-[#C8553D] transition-colors py-1 cursor-pointer select-none"
              title="Toggle English / العربية"
            >
              <span className={lang === 'en' ? 'font-bold' : 'text-[#6C6963]'}>EN</span>
              <span className="mx-1.5 text-[#B5AEA2]">|</span>
              <span className={lang === 'ar' ? 'font-bold' : 'text-[#6C6963]'}>عربي</span>
            </button>

            {/* Book Now Button */}
            <button
              onClick={() => {
                if (onNavigate) onNavigate('dahab-accommodation')
              }}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-[#C8553D] hover:bg-[#AB462C] text-white text-[15px] font-medium rounded-full shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              {t.nav.bookNow}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-semibold text-[#22211F] bg-[#EFE8DC] rounded-full"
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#22211F] hover:bg-[#EFE8DC] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE3D5] bg-[#FAF6EF] px-5 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3.5 text-base font-medium text-[#22211F]">
            {links.map((link) => {
              const isActive = (link.page && currentPage === link.page)
              return (
                <button
                  key={link.id}
                  onClick={(e) => {
                    setMobileMenuOpen(false)
                    handleLinkClick(e, link)
                  }}
                  className={`py-2 flex items-center justify-between border-b border-[#F0E9DC] text-left rtl:text-right ${
                    isActive ? 'text-[#C8553D] font-bold' : 'hover:text-[#C8553D]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold text-white bg-[#466B4E] rounded-full">
                      {link.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
          <div className="pt-2 space-y-2.5">
            <a
              href="https://wa.me/201116664591?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20Sinai%20Booking%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D9%88%D8%A7%D9%84%D8%AD%D8%AC%D8%B2."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-semibold text-sm rounded-full shadow"
            >
              <MessageCircle size={18} className="fill-white" />
              <span>واتساب 01116664591</span>
            </a>

            <a
              href="https://www.instagram.com/sinai_booking?vrfl=bHBxOTFqbzNyMW9h"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-semibold text-sm rounded-full shadow"
            >
              <Instagram size={18} />
              <span>إنستجرام @sinai_booking</span>
            </a>

            <a
              href="https://www.facebook.com/share/1Er8aG2qfE/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#1877F2] text-white font-semibold text-sm rounded-full shadow"
            >
              <Facebook size={18} className="fill-white" />
              <span>فيسبوك Sinai Booking</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                if (onNavigate) onNavigate('dahab-accommodation')
              }}
              className="w-full flex items-center justify-center py-3 bg-[#C8553D] text-white font-medium rounded-full shadow"
            >
              {t.nav.bookNow}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
