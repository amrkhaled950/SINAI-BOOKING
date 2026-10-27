import React, { useState, useEffect } from 'react'
import { translations } from './data/translations'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ProcessStrip from './components/ProcessStrip'
import DestinationsSection from './components/DestinationsSection'
import DuplexSection from './components/DuplexSection'
import NirvanaCampSection from './components/NirvanaCampSection'
import ServicesSection from './components/ServicesSection'
import BlogGuidesSection from './components/BlogGuidesSection'
import CtaBanner from './components/CtaBanner'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import DahabAccommodationPage from './pages/DahabAccommodationPage'
import RoomDetailPage from './pages/RoomDetailPage'
import ExcursionsPage from './pages/ExcursionsPage'
import TransportationPage from './pages/TransportationPage'
import BlogPage from './pages/BlogPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import PaymentResultPage from './pages/PaymentResultPage'
import { useScrollReveal } from './hooks/useScrollReveal'
import { DEFAULT_APARTMENTS } from './lib/supabase'

const VALID_PAGES = [
  'home',
  'dahab-accommodation',
  'room-detail',
  'excursions',
  'transportation',
  'blog',
  'admin',
  'payment-result'
]

function getApartmentFromUrl() {
  const path = (window.location.pathname || '').toLowerCase()
  const hash = (window.location.hash || '').toLowerCase()
  const search = (window.location.search || '').toLowerCase()

  if (path.includes('studio-2') || hash.includes('studio-2') || search.includes('studio-2')) {
    return DEFAULT_APARTMENTS.find(a => a.code === 'studio-2' || a.id === 'studio-2') || DEFAULT_APARTMENTS[1]
  }
  if (path.includes('studio-1') || hash.includes('studio-1') || search.includes('studio-1')) {
    return DEFAULT_APARTMENTS.find(a => a.code === 'studio-1' || a.id === 'studio-1') || DEFAULT_APARTMENTS[0]
  }
  return null
}

function getPageFromUrl() {
  const path = (window.location.pathname || '').replace(/^\//, '').split('?')[0].split('#')[0]
  const hash = (window.location.hash || '').replace(/^#\/?/, '').split('?')[0].split('/')[0]

  if (path.startsWith('room/') || path.startsWith('rooms/') || path.startsWith('room') || path.startsWith('rooms')) {
    return 'room-detail'
  }
  if (hash.startsWith('room/') || hash.startsWith('rooms/')) {
    return 'room-detail'
  }
  if (VALID_PAGES.includes(path)) {
    return path
  }
  if (VALID_PAGES.includes(hash)) {
    return hash
  }
  const search = window.location.search || ''
  if (search.includes('tranRef') || search.includes('payment-result') || search.includes('respStatus')) {
    return 'payment-result'
  }
  return 'home'
}

export default function App() {
  const [lang, setLang] = useState('en')
  const [currentPage, setCurrentPage] = useState(() => getPageFromUrl())
  const [selectedApartment, setSelectedApartment] = useState(() => {
    const fromUrl = getApartmentFromUrl()
    if (fromUrl) return fromUrl
    try {
      const saved = sessionStorage.getItem('sinai_selected_apt')
      return saved ? JSON.parse(saved) : DEFAULT_APARTMENTS[0]
    } catch {
      return DEFAULT_APARTMENTS[0]
    }
  })
  const t = translations[lang]

  // Activate scroll reveal animation on page navigation
  useScrollReveal(currentPage)

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  // Save selected apartment in session storage to persist across page reloads
  useEffect(() => {
    if (selectedApartment) {
      try {
        sessionStorage.setItem('sinai_selected_apt', JSON.stringify(selectedApartment))
      } catch (e) {
        console.error(e)
      }
    }
  }, [selectedApartment])

  // Synchronize state with browser URL (handles refresh, back/forward buttons, direct links)
  useEffect(() => {
    const handleUrlChange = () => {
      const page = getPageFromUrl()
      setCurrentPage(page)
      const aptFromUrl = getApartmentFromUrl()
      if (aptFromUrl) {
        setSelectedApartment(aptFromUrl)
      }
    }

    // Run on initial mount
    handleUrlChange()

    window.addEventListener('hashchange', handleUrlChange)
    window.addEventListener('popstate', handleUrlChange)
    return () => {
      window.removeEventListener('hashchange', handleUrlChange)
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [])

  const navigate = (page, sectionHash, extraApt) => {
    setCurrentPage(page)

    // Update URL path cleanly for each section and room
    if (page === 'room-detail') {
      const apt = extraApt || selectedApartment || DEFAULT_APARTMENTS[0]
      const aptCode = apt.code || apt.id || 'studio-1'
      window.history.pushState(null, '', `/room/${aptCode}`)
      window.location.hash = ''
    } else if (page === 'home') {
      if (sectionHash) {
        window.location.hash = sectionHash
      } else {
        window.history.pushState(null, '', '/')
        window.location.hash = ''
      }
    } else {
      window.history.pushState(null, '', `/${page}`)
      window.location.hash = ''
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (sectionHash) {
      setTimeout(() => {
        const el = document.getElementById(sectionHash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  // Full-screen Admin Dashboard Portal
  if (currentPage === 'admin') {
    return (
      <div className={`min-h-screen bg-[#0E1715] text-[#F3EFE6] selection:bg-[#C45437] selection:text-white ${lang === 'ar' ? 'font-sans' : ''}`}>
        <AdminDashboardPage
          lang={lang}
          onNavigateHome={() => navigate('home')}
        />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col bg-[#122432] text-[#22211F] selection:bg-[#C45437] selection:text-white ${lang === 'ar' ? 'font-sans' : ''}`}>
      {/* Navbar with brand, links, language toggle, and active state */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        currentPage={currentPage}
        onNavigate={navigate}
      />

      <main className="flex-1 bg-[#FAF6EF]">
        {currentPage === 'payment-result' ? (
          /* PayTabs Payment Result & Confirmation Page */
          <PaymentResultPage
            lang={lang}
            onNavigateHome={() => navigate('home')}
          />
        ) : currentPage === 'blog' ? (
          /* Dedicated Field Notes & Blog Inner Page */
          <BlogPage
            t={t}
            lang={lang}
            onNavigateHome={() => navigate('home')}
          />
        ) : currentPage === 'transportation' ? (
          /* Dedicated Transportation & Transfers Inner Page */
          <TransportationPage
            t={t}
            lang={lang}
            onNavigateHome={() => navigate('home')}
          />
        ) : currentPage === 'excursions' ? (
          /* Dedicated Excursions & Desert Safaris Inner Page */
          <ExcursionsPage
            t={t}
            lang={lang}
            onNavigateHome={() => navigate('home')}
          />
        ) : currentPage === 'room-detail' ? (
          /* Dedicated Apartment / Room Details & Booking Page */
          <RoomDetailPage
            t={t}
            lang={lang}
            selectedApartment={selectedApartment}
            onNavigateBack={() => navigate('dahab-accommodation')}
            onNavigateHome={() => navigate('home')}
          />
        ) : currentPage === 'dahab-accommodation' ? (
          /* Dahab Accommodation Showcase Page */
          <DahabAccommodationPage
            t={t}
            lang={lang}
            onNavigateHome={() => navigate('home')}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt)
              navigate('room-detail', null, apt)
            }}
          />
        ) : (
          /* Homepage */
          <>
            {/* 1. Hero Section with Search for the Vibe */}
            <HeroSection t={t} lang={lang} />

            {/* 2. Process / Step Bar */}
            <ProcessStrip t={t} />

            {/* 3. Destinations: Dahab & Taba Nuweiba */}
            <DestinationsSection t={t} onNavigate={navigate} />

            {/* 4. Featured Stay: Mashraba Duplex */}
            <DuplexSection t={t} lang={lang} onNavigate={navigate} />

            {/* 5. Dark Section: Sleep Closer to the Stars (Nirvana Camp) */}
            <NirvanaCampSection t={t} lang={lang} />

            {/* 6. Services & Help */}
            <ServicesSection t={t} lang={lang} onNavigate={navigate} />

            {/* 7. Notes From The Road (Guides & Blog) */}
            <BlogGuidesSection t={t} lang={lang} onNavigate={navigate} />

            {/* 8. Call to Action Banner */}
            <CtaBanner t={t} lang={lang} />
          </>
        )}
      </main>

      {/* 9. Footer */}
      <Footer
        t={t}
        lang={lang}
        currentPage={currentPage}
        onNavigate={navigate}
      />

      {/* Floating WhatsApp Action Widget (Available across entire website) */}
      <FloatingWhatsApp lang={lang} />
    </div>
  )
}
