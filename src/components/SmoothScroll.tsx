'use client'

import { useEffect } from 'react'

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let lenis: any
    
    const initLenis = async () => {
      const Lenis = (await import('@studio-freight/lenis')).default
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      })

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }

    initLenis()

    return () => {
      if (lenis) lenis.destroy()
    }
  }, [])

  return null
}
