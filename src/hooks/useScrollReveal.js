import { useEffect } from 'react'

/**
 * Initializes an IntersectionObserver to reveal elements with `.reveal` or `.reveal-scale` classes
 * as they scroll into view. Automatically disconnects and unobserves elements once revealed.
 */
export function useScrollReveal(dependency) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal, .reveal-scale').forEach((el) => {
        el.classList.add('is-revealed')
      })
      return
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      document.querySelectorAll('.reveal, .reveal-scale').forEach((el) => {
        el.classList.add('is-revealed')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      }
    )

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal:not(.is-revealed), .reveal-scale:not(.is-revealed)')
      elements.forEach((el) => observer.observe(el))
    }, 60)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [dependency])
}
