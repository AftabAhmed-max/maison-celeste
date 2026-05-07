'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import { rooms } from '@/data/rooms'
import { ArrowRight, Users, Maximize2 } from 'lucide-react'

const categories = ['All', 'Deluxe Room', 'Suite', 'Penthouse Suite']

export default function RoomsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const init = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.fromTo('.page-hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.2 })
      gsap.fromTo('.page-hero-sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.6 })
      gsap.utils.toArray('.room-reveal').forEach((el: any, i: number) => {
        gsap.fromTo(el, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
    }
    init()
  }, [activeCategory])

  const filtered = activeCategory === 'All' ? rooms : rooms.filter(r => r.category === activeCategory)

  return (
    <>
      <SmoothScroll />
      <Navbar />

      {/* PAGE HERO */}
      <section style={{ position: 'relative', height: '60vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', paddingBottom: '80px' }}>
        <Image src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=2000&q=85" alt="Rooms" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,14,14,0.2) 0%, rgba(14,14,14,0.8) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 clamp(24px, 5vw, 80px)', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          <p className="section-label" style={{ marginBottom: '16px' }}>Accommodation</p>
          <h1 className="page-hero-title" style={{ fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 300, opacity: 0 }}>
            Rooms &<br /><em style={{ color: '#B8935A' }}>Suites</em>
          </h1>
          <p className="page-hero-sub" style={{ fontSize: '16px', color: 'rgba(245,239,224,0.65)', maxWidth: '440px', lineHeight: 1.8, marginTop: '24px', opacity: 0 }}>
            Fourteen rooms across three categories. Each designed to frame a different view of the valley.
          </p>
        </div>
      </section>

      {/* FILTER */}
      <section style={{ background: '#080808', borderBottom: '1px solid rgba(184,147,90,0.1)', padding: '0 clamp(24px, 5vw, 80px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '0', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '20px 28px', background: 'none', border: 'none',
                borderBottom: activeCategory === cat ? '2px solid #B8935A' : '2px solid transparent',
                color: activeCategory === cat ? '#B8935A' : 'rgba(245,239,224,0.5)',
                fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.3s', whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ROOMS GRID */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px) 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '40px', alignItems: 'start' }}>
          {filtered.map(room => (
            <div key={room.id} className="room-card room-reveal" style={{ opacity: 0, display: 'flex', flexDirection: 'column' }}>
              <div className="img-wrap" style={{ position: 'relative', height: '340px', marginBottom: '24px', flexShrink: 0 }}>
                <Image src={room.images[0]} alt={room.name} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,14,14,0.7) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(14,14,14,0.75)', backdropFilter: 'blur(4px)', color: '#B8935A', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '5px 10px' }}>
                    {room.category}
                  </span>
                  {!room.featured && false && (
                    <span style={{ background: 'rgba(100,0,0,0.75)', color: '#ff9999', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 10px' }}>Unavailable</span>
                  )}
                </div>
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(245,239,224,0.7)' }}>
                      <Users size={12} /> {room.capacity}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(245,239,224,0.7)' }}>
                      <Maximize2 size={12} /> {room.size_sqm}m²
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 300 }}>{room.name}</h3>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', color: '#B8935A' }}>
                      €{room.price_per_night.toLocaleString()}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(245,239,224,0.4)', letterSpacing: '0.05em' }}>per night</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.55)', lineHeight: 1.8, marginBottom: '20px' }}>
                  {room.short_description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {room.amenities.slice(0, 3).map(a => (
                    <span key={a} style={{ fontSize: '11px', color: 'rgba(245,239,224,0.4)', border: '1px solid rgba(245,239,224,0.1)', padding: '4px 10px', letterSpacing: '0.05em' }}>
                      {a}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span style={{ fontSize: '11px', color: '#B8935A', padding: '4px 0', letterSpacing: '0.05em' }}>
                      +{room.amenities.length - 3} more
                    </span>
                  )}
                </div>
                <Link href={`/rooms/${room.slug}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
                  View Room <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}
