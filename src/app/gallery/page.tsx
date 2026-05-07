'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1400&q=85', caption: 'The valley at first light', category: 'Landscape' },
  { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=85', caption: 'Chambre Alpestre', category: 'Rooms' },
  { src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400&q=85', caption: 'The cellar', category: 'Dining' },
  { src: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1400&q=85', caption: 'Off-piste with Marc', category: 'Experiences' },
  { src: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=1400&q=85', caption: 'The morning table', category: 'Dining' },
  { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1400&q=85', caption: 'Suite Vernet', category: 'Rooms' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85', caption: 'Above Courchevel 1550', category: 'Landscape' },
  { src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&q=85', caption: 'The main hall', category: 'Interiors' },
  { src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1400&q=85', caption: 'Chambre Neige', category: 'Rooms' },
  { src: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&q=85', caption: 'The library', category: 'Interiors' },
  { src: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1400&q=85', caption: 'Suite Blanc de Blancs', category: 'Rooms' },
  { src: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1400&q=85', caption: 'Snowshoe at dusk', category: 'Experiences' },
  { src: 'https://images.unsplash.com/photo-1543226926-a1c30a4b439e?w=1400&q=85', caption: 'The lodge in winter', category: 'Landscape' },
  { src: 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=1400&q=85', caption: 'Le Penthouse terrace', category: 'Rooms' },
  { src: 'https://images.unsplash.com/photo-1548133464-10f0a8bcf8c6?w=1400&q=85', caption: 'Ski guide service', category: 'Experiences' },
]

const categories = ['All', 'Rooms', 'Landscape', 'Dining', 'Interiors', 'Experiences']

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filtered = activeCategory === 'All' ? galleryImages : galleryImages.filter(i => i.category === activeCategory)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const init = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.fromTo('.page-hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.2 })
      gsap.utils.toArray('.gal-item').forEach((el: any, i: number) => {
        gsap.fromTo(el, { opacity: 0, scale: 0.97 }, {
          opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out',
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    }
    init()
  }, [activeCategory])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'ArrowRight') setLightboxIndex(p => (p + 1) % filtered.length)
      if (e.key === 'ArrowLeft') setLightboxIndex(p => (p - 1 + filtered.length) % filtered.length)
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, filtered.length])

  return (
    <>
      <SmoothScroll />
      <Navbar />

      <section style={{ position: 'relative', height: '50vh', minHeight: '380px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', paddingBottom: '80px' }}>
        <Image src="https://images.unsplash.com/photo-1543226926-a1c30a4b439e?w=2000&q=85" alt="Gallery" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,14,14,0.2) 0%, rgba(14,14,14,0.85) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 clamp(24px, 5vw, 80px)', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          <p className="section-label" style={{ marginBottom: '16px' }}>Photography</p>
          <h1 className="page-hero-title" style={{ fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 300, opacity: 0 }}>
            The Lodge<br /><em style={{ color: '#B8935A' }}>in Pictures</em>
          </h1>
        </div>
      </section>

      {/* Filter bar */}
      <div style={{ background: '#080808', borderBottom: '1px solid rgba(184,147,90,0.1)', padding: '0 clamp(24px, 5vw, 80px)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', maxWidth: '1280px', margin: '0 auto' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '20px 24px', background: 'none', border: 'none', borderBottom: activeCategory === cat ? '2px solid #B8935A' : '2px solid transparent', color: activeCategory === cat ? '#B8935A' : 'rgba(245,239,224,0.5)', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px) 120px' }}>
        <div style={{ columns: '3', columnGap: '12px' }}>
          {filtered.map((img, i) => (
            <div key={`${img.src}-${i}`} className="gal-item" style={{ breakInside: 'avoid', marginBottom: '12px', position: 'relative', cursor: 'pointer', overflow: 'hidden', opacity: 0 }}
              onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}>
              <div style={{ position: 'relative', width: '100%', paddingBottom: i % 4 === 0 ? '130%' : i % 3 === 0 ? '75%' : '100%' }}>
                <Image src={img.src} alt={img.caption} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0)', transition: 'background 0.3s', display: 'flex', alignItems: 'flex-end', padding: '16px' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(245,239,224,0.8)', opacity: 0, transition: 'opacity 0.3s' }}>{img.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#F5EFE0', cursor: 'pointer', zIndex: 10 }}><X size={24} /></button>
          <button onClick={e => { e.stopPropagation(); setLightboxIndex(p => (p - 1 + filtered.length) % filtered.length) }} style={{ position: 'absolute', left: '24px', background: 'none', border: 'none', color: '#F5EFE0', cursor: 'pointer', zIndex: 10 }}><ChevronLeft size={32} /></button>
          <div style={{ position: 'relative', width: '85vw', maxWidth: '1200px', height: '85vh' }} onClick={e => e.stopPropagation()}>
            <Image src={filtered[lightboxIndex].src} alt={filtered[lightboxIndex].caption} fill sizes="100vw" style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ position: 'absolute', bottom: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'rgba(245,239,224,0.6)', letterSpacing: '0.05em' }}>{filtered[lightboxIndex].caption}</p>
            <p style={{ fontSize: '11px', color: 'rgba(245,239,224,0.3)', marginTop: '4px' }}>{lightboxIndex + 1} / {filtered.length}</p>
          </div>
          <button onClick={e => { e.stopPropagation(); setLightboxIndex(p => (p + 1) % filtered.length) }} style={{ position: 'absolute', right: '24px', background: 'none', border: 'none', color: '#F5EFE0', cursor: 'pointer', zIndex: 10 }}><ChevronRight size={32} /></button>
        </div>
      )}

      <Footer />
    </>
  )
}
