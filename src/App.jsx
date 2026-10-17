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

export default function App() {
  const [lang, setLang] = useState('en')
  const [currentPage, setCurrentPage] = useState('home') // 'home' | 'dahab-accommodation' | 'room-detail' | 'excursions' | 'transportation' | 'blog' | 'admin'
  const [selectedApartment, setSelectedApartment] = useState(null)
  const t = translations[lang]

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const handleUrl = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setCurrentPage('admin')
      }
    }
    handleUrl()
    window.addEventListener('hashchange', handleUrl)
    return () => window.removeEventListener('hashchange', handleUrl)
  }, [])

  const navigate = (page, hash) => {
    setCurrentPage(page)
    if (page === 'admin') {
      window.location.hash = 'admin'
    } else if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash)
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
    <div className={`min-h-screen bg-[#FAF6EF] text-[#22211F] selection:bg-[#C45437] selection:text-white ${lang === 'ar' ? 'font-sans' : ''}`}>
      {/* Navbar with brand, links, language toggle, and active state */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        currentPage={currentPage}
        onNavigate={navigate}
      />

      <main>
        {currentPage === 'blog' ? (
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
            <DuplexSection t={t} onNavigate={navigate} />

            {/* 5. Dark Section: Sleep Closer to the Stars (Nirvana Camp) */}
            <NirvanaCampSection t={t} />

            {/* 6. Services & Help */}
            <ServicesSection t={t} onNavigate={navigate} />

            {/* 7. Notes From The Road (Guides & Blog) */}
            <BlogGuidesSection t={t} onNavigate={navigate} />

            {/* 8. Call to Action Banner */}
            <CtaBanner t={t} />
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
