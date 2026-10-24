import React, { useState, useEffect } from 'react'
import Logo from './Logo'
import { Menu, X, MessageCircle, Instagram, Facebook } from 'lucide-react'

export default function Navbar({ lang, setLang, t, currentPage = 'home', onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'))
  }

  const isAr = lang === 'ar'

  // Links array tailored to match Figma exact layout order
  const links = isAr
    ? [
        { id: 'taba-nuweiba', label: t.nav.tabaNuweiba, externalUrl: 'https://www.nirvana-camp.com/' },
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
        { id: 'taba-nuweiba', label: t.nav.tabaNuweiba, externalUrl: 'https://www.nirvana-camp.com/' },
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
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b border-[#EAE3D5] transition-all duration-300 ${
      isScrolled ? 'bg-[#FAF6EF]/98 shadow-sm py-0' : 'bg-[#FAF6EF]/90 py-1'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 transition-all duration-300">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center focus:outline-none cursor-pointer hover:opacity-90 active:scale-95 transition-transform duration-200"
            >
              <Logo className="h-9 sm:h-10 transition-transform duration-300" />
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
              className="btn-shimmer inline-flex items-center justify-center px-6 py-2.5 bg-[#C8553D] hover:bg-[#AB462C] text-white text-[15px] font-medium rounded-full shadow-sm hover:shadow-md hover:scale-102 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {t.nav.bookNow}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-xs font-semibold text-[#22211F] bg-[#EFE8DC] active:bg-[#E5DCCF] rounded-full transition-all"
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#22211F] hover:bg-[#EFE8DC] active:scale-90 transition-transform duration-200 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} className="animate-scale-in" /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE3D5] bg-[#FAF6EF]/98 backdrop-blur-xl px-5 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col space-y-2 text-base font-medium text-[#22211F]">
            {links.map((link, idx) => {
              const isActive = (link.page && currentPage === link.page)
              return (
                <button
                  key={link.id}
                  onClick={(e) => {
                    setMobileMenuOpen(false)
                    handleLinkClick(e, link)
                  }}
                  className={`py-3 px-3 rounded-xl flex items-center justify-between border-b border-[#F0E9DC]/60 text-left rtl:text-right active:bg-[#EFE8DC] transition-all duration-150 ${
                    isActive ? 'text-[#C8553D] font-bold bg-[#EFE8DC]/50' : 'hover:text-[#C8553D]'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <span className="text-[15px]">{link.label}</span>
                  {link.badge && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold text-white bg-[#466B4E] rounded-full shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
          <div className="pt-3 space-y-3">
            <a
              href={`https://wa.me/201116664591?text=${encodeURIComponent('مساء الخير Sinai Booking، حابب استفسر واحجز.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] active:bg-[#20BA5A] text-white font-semibold text-sm rounded-full shadow-md active:scale-98 transition-all"
            >
              <MessageCircle size={18} className="fill-white" />
              <span>{isAr ? 'واتساب 01116664591' : 'Send via WhatsApp'}</span>
            </a>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="https://www.instagram.com/sinai_booking?vrfl=bHBxOTFqbzNyMW9h"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-semibold text-xs rounded-full shadow-sm active:scale-95 transition-all"
              >
                <Instagram size={16} />
                <span>Instagram</span>
              </a>

              <a
                href="https://www.facebook.com/share/1Er8aG2qfE/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-[#1877F2] text-white font-semibold text-xs rounded-full shadow-sm active:scale-95 transition-all"
              >
                <Facebook size={16} className="fill-white" />
                <span>Facebook</span>
              </a>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                if (onNavigate) onNavigate('dahab-accommodation')
              }}
              className="btn-shimmer w-full flex items-center justify-center py-3.5 bg-[#C8553D] hover:bg-[#AB462C] text-white font-medium rounded-full shadow-md active:scale-98 transition-all"
            >
              {t.nav.bookNow}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
