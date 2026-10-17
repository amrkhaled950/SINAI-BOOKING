import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'

export default function FloatingWhatsApp({ lang = 'en' }) {
  const isAr = lang === 'ar'
  const [showTooltip, setShowTooltip] = useState(false)

  const defaultMsg = isAr
    ? 'السلام عليكم سيناء بوكينج، أود الاستفسار والحجز.'
    : 'Hello Sinai Booking, I would like to inquire and book.'

  const waUrl = `https://wa.me/201116664591?text=${encodeURIComponent(defaultMsg)}`

  return (
    <div
      className={`fixed bottom-5 sm:bottom-6 ${
        isAr ? 'left-5 sm:left-6' : 'right-5 sm:right-6'
      } z-50 flex items-center gap-3 group`}
    >
      {/* Tooltip / Prompt Bubble */}
      <div
        className={`hidden sm:flex items-center gap-2 bg-[#122432]/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl border border-white/20 text-xs font-medium text-white transition-all duration-300 ${
          showTooltip
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 pointer-events-none translate-y-1 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
        <span className="text-white/80">{isAr ? 'واتساب مباشر:' : 'Direct WhatsApp:'}</span>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono font-bold text-[#25D366] hover:text-[#4ADE80] transition-colors"
        >
          01116664591
        </a>
      </div>

      {/* Main WhatsApp Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="Direct WhatsApp Chat 01116664591"
        title={isAr ? 'تواصل معنا عبر واتساب 01116664591' : 'Chat with Sinai Booking 01116664591'}
      >
        {/* Subtle Ambient Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/25 animate-ping opacity-60 pointer-events-none" />
        
        <MessageCircle size={28} className="fill-white relative z-10" />
        {/* Pulsing online badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full z-20"></span>
      </a>
    </div>
  )
}
