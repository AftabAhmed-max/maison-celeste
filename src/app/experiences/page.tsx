'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import { ArrowRight } from 'lucide-react'

const allExperiences = [
  {
    title: 'The Cellar',
    label: 'Wine & Gastronomy',
    description: 'Forty years of acquisition. A cellar of 800 bottles. Dinner for twelve, served in the cave itself. The sommelier — Jean-Paul Vernet, third-generation — pours without notes. Available by reservation only, minimum six guests.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400&q=85',
    details: ['Available December – April', 'Minimum 6 guests', 'Reservation required 72 hours in advance', 'Includes 5-course menu'],
  },
  {
    title: 'Off-Piste',
    label: 'Mountain Experiences',
    description: 'A former ski champion lives in the valley. He guides guests through terrain that doesn\'t appear on maps. Six guests maximum per season. Early booking is essential — some years this fills before the lodge opens.',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1400&q=85',
    details: ['Maximum 6 guests per season', 'Full-day experience', 'Equipment not included', 'Guide: Marc Trossard'],
  },
  {
    title: 'The Morning Table',
    label: 'Breakfast Ritual',
    description: 'Bread baked before five. Honey from the Beaufortain. Eggs from a farm nine kilometres away. A breakfast that makes departure feel like grief. Served in the main dining room or, upon request, in your room.',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=1400&q=85',
    details: ['Daily 7:30 – 10:30', 'Included with all rooms', 'In-room available upon request', 'Special diets accommodated'],
  },
  {
    title: 'Snowshoe at Dusk',
    label: 'Winter Walking',
    description: 'The lodge keeper has walked every path in this valley for forty years. Two evenings per week he leads a small group through the forest at dusk, returning for a glass of something warm by the fire.',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1400&q=85',
    details: ['Tuesday & Friday evenings', 'Maximum 8 guests', 'Snowshoes provided', 'Hot drinks on return'],
  },
  {
    title: 'The Library Evening',
    label: 'Culture & Quiet',
    description: 'The original library holds over four hundred books accumulated by the family across decades. On certain evenings, with a fire and a bottle, it becomes the best room in the Alps. No programme. No entertainment. Simply a room that rewards being in.',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&q=85',
    details: ['Open every evening', 'Private hire available', 'Curated wine available', 'No booking required'],
  },
  {
    title: 'Private Ski Lessons',
    label: 'On the Mountain',
    description: 'Through an arrangement with a former World Cup coach, guests at Maison Celeste have access to instruction that is simply unavailable through normal channels. For beginners and for those who thought they had nothing left to learn.',
    image: 'https://images.unsplash.com/photo-1548133464-10f0a8bcf8c6?w=1400&q=85',
    details: ['Available upon request', 'All levels welcome', 'Half or full day', 'Equipment hire arranged'],
  },
]

export default function ExperiencesPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const init = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.fromTo('.page-hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.2 })
      gsap.utils.toArray('.exp-reveal').forEach((el: any) => {
        gsap.fromTo(el, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
    }
    init()
  }, [])

  return (
    <>
      <SmoothScroll />
      <Navbar />

      {/* HERO */}
      <section style={{ position: 'relative', height: '55vh', minHeight: '420px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', paddingBottom: '80px' }}>
        <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=85" alt="Experiences" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,14,14,0.2) 0%, rgba(14,14,14,0.8) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 clamp(24px, 5vw, 80px)', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          <p className="section-label" style={{ marginBottom: '16px' }}>The Lodge</p>
          <h1 className="page-hero-title" style={{ fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 300, opacity: 0 }}>
            Quiet<br /><em style={{ color: '#B8935A' }}>Pleasures</em>
          </h1>
        </div>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(64px, 8vw, 100px) clamp(24px, 5vw, 80px) 120px' }}>
        <p className="exp-reveal" style={{ fontSize: '18px', color: 'rgba(245,239,224,0.6)', lineHeight: 1.9, maxWidth: '680px', marginBottom: '80px', opacity: 0 }}>
          We do not offer a spa. We do not offer a pool. We do not have a concierge with a laminated list of local activities. 
          What we offer instead is the particular pleasure of a place that has been considered rather than assembled.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
          {allExperiences.map((exp, i) => (
            <div key={exp.title} className="exp-reveal" style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', direction: i % 2 === 0 ? 'ltr' : 'rtl', gap: 'clamp(48px, 6vw, 80px)', alignItems: 'center', opacity: 0 }}>
              <div style={{ position: 'relative', height: 'clamp(300px, 40vw, 500px)', overflow: 'hidden' }}>
                <Image src={exp.image} alt={exp.title} fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ direction: 'ltr' }}>
                <p className="section-label" style={{ marginBottom: '16px' }}>{exp.label}</p>
                <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, marginBottom: '24px' }}>{exp.title}</h2>
                <div className="gold-divider" style={{ marginBottom: '24px' }} />
                <p style={{ fontSize: '15px', color: 'rgba(245,239,224,0.6)', lineHeight: 1.9, marginBottom: '28px' }}>{exp.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {exp.details.map(d => (
                    <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '4px', height: '4px', background: '#B8935A', borderRadius: '50%', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: 'rgba(245,239,224,0.45)', letterSpacing: '0.03em' }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '120px', padding: '80px 0', borderTop: '1px solid rgba(245,239,224,0.06)' }}>
          <p className="section-label exp-reveal" style={{ marginBottom: '20px', opacity: 0 }}>Ready to Visit?</p>
          <h2 className="exp-reveal" style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, marginBottom: '40px', opacity: 0 }}>
            Reserve your stay.<br /><em style={{ color: '#B8935A' }}>The season won&apos;t wait.</em>
          </h2>
          <Link href="/rooms" className="btn-primary exp-reveal" style={{ opacity: 0 }}>View Rooms <ArrowRight size={13} /></Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
