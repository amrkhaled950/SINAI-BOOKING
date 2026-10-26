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

function getPageFromUrl() {
  const hash = (window.location.hash || '').replace(/^#\/?/, '').split('?')[0].split('/')[0]
  if (VALID_PAGES.includes(hash)) {
    return hash
  }
  const path = (window.location.pathname || '').replace(/^\//, '').split('?')[0].split('/')[0]
  if (VALID_PAGES.includes(path)) {
    return path
  }
  return 'home'
}

export default function App() {
  const [lang, setLang] = useState('en')
  const [currentPage, setCurrentPage] = useState(() => getPageFromUrl())
  const [selectedApartment, setSelectedApartment] = useState(() => {
    try {
      const saved = sessionStorage.getItem('sinai_selected_apt')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
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

  const navigate = (page, sectionHash) => {
    setCurrentPage(page)

    // Update URL hash smoothly
    if (page === 'home') {
      if (sectionHash) {
        window.location.hash = sectionHash
      } else {
        if (window.location.hash) {
          window.history.pushState(null, '', window.location.pathname)
        }
      }
    } else {
      window.location.hash = page
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
              navigate('room-detail')
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
