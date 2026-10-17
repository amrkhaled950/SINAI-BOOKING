import React from 'react'

export default function Logo({ className = "h-9", light = false }) {
  const src = light ? "/images/logo-light.png" : "/images/logo-dark.png"
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={src}
        alt="Sinai Booking"
        className="h-full w-auto object-contain select-none pointer-events-none"
      />
    </div>
  )
}
