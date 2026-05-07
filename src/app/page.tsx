'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import { rooms, testimonials, experiences } from '@/data/rooms'
import { ArrowRight, ChevronDown } from 'lucide-react'

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLDivElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const heroCTARef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const initGSAP = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const tl = gsap.timeline({ delay: 0.4 })
      tl.fromTo('.hero-line', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, stagger: 0.15, ease: 'power3.out' })
        .fromTo(heroSubRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.8')
        .fromTo(heroCTARef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.7')
        .fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.5')

      gsap.to('.hero-bg', {
        yPercent: 25, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      gsap.utils.toArray('.reveal-up').forEach((el: any) => {
        gsap.fromTo(el, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        })
      })

      gsap.utils.toArray('.stagger-child').forEach((el: any, i: number) => {
        gsap.fromTo(el, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: i * 0.1,
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        })
      })

      gsap.utils.toArray('.parallax-img').forEach((img: any) => {
        gsap.to(img, {
          yPercent: -12, ease: 'none',
          scrollTrigger: { trigger: img.closest('.parallax-section'), start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    }
    initGSAP()
  }, [])

  const featuredRooms = rooms.filter(r => r.featured).slice(0, 4)
  const marqueeItems = ['Courchevel 1550','14 Rooms Only','Open Since 1932','Est. Savoie, France','The French Alps','A Family Lodge','Intimate & Private','No Loyalty Points']

  return (
    <>
      <SmoothScroll />
      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="grain-overlay" style={{ position: 'relative', height: '100vh', minHeight: '700px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="hero-bg" style={{ position: 'absolute', inset: '-10%', zIndex: 0 }}>
          <Image src="https://images.unsplash.com/photo-1551524559-8af4e6624178?w=2000&q=90" alt="Maison Celeste" fill priority style={{ objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,14,14,0.3) 0%, rgba(14,14,14,0.55) 60%, rgba(14,14,14,0.9) 100%)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
          <p className="section-label" style={{ marginBottom: '28px' }}>Courchevel 1550 · French Alps</p>
          <div ref={heroTitleRef}>
            <h1 style={{ fontSize: 'clamp(52px, 9vw, 108px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              <div className="hero-line" style={{ opacity: 0 }}><span style={{ display: 'block' }}>Where the</span></div>
              <div className="hero-line" style={{ opacity: 0 }}><span style={{ display: 'block', color: '#B8935A', fontStyle: 'italic' }}>mountains</span></div>
              <div className="hero-line" style={{ opacity: 0 }}><span style={{ display: 'block' }}>remember you.</span></div>
            </h1>
          </div>
          <p ref={heroSubRef} style={{ marginTop: '32px', fontSize: '16px', color: 'rgba(245,239,224,0.7)', maxWidth: '420px', margin: '32px auto 0', lineHeight: 1.8, opacity: 0 }}>
            A converted 1932 hunting lodge. Fourteen rooms. No loyalty programmes. A cellar of eight hundred bottles.
          </p>
          <div ref={heroCTARef} style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '48px', flexWrap: 'wrap', opacity: 0 }}>
            <Link href="/rooms" className="btn-primary">View Rooms <ArrowRight size={14} /></Link>
            <Link href="/about" className="btn-outline">Our Story</Link>
          </div>
        </div>
        <div ref={scrollIndicatorRef} style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0 }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.4)' }}>Scroll</span>
          <ChevronDown size={14} style={{ color: '#B8935A' }} />
        </div>
      </section>

      {/* MARQUEE */}
      <section style={{ background: '#080808', borderTop: '1px solid rgba(184,147,90,0.2)', borderBottom: '1px solid rgba(184,147,90,0.2)', padding: '18px 0', overflow: 'hidden' }}>
        <div className="marquee-track" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.45)', padding: '0 40px' }}>{item}</span>
              <span style={{ color: '#B8935A', fontSize: '7px' }}>◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* INTRO */}
      <section style={{ padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(48px, 8vw, 120px)', alignItems: 'center' }}>
          <div className="reveal-up">
            <p className="section-label" style={{ marginBottom: '24px' }}>The Lodge</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, lineHeight: 1.1, marginBottom: '32px' }}>
              Not a hotel.<br /><em style={{ color: '#B8935A' }}>A house</em><br />in the mountains.
            </h2>
            <div className="gold-divider" />
            <p style={{ fontSize: '15px', color: 'rgba(245,239,224,0.6)', lineHeight: 1.9, marginTop: '24px', marginBottom: '16px' }}>
              Built in 1932 as a private hunting lodge for the Vernet family, Maison Celeste passed through three generations before it quietly opened its doors to guests in 1978. Nothing significant has changed since.
            </p>
            <p style={{ fontSize: '15px', color: 'rgba(245,239,224,0.6)', lineHeight: 1.9 }}>
              We have fourteen rooms, a cellar, a fireplace that has never been cold, and a valley that looks exactly as it did when the lodge was built.
            </p>
            <Link href="/about" className="btn-outline" style={{ marginTop: '40px' }}>Read Our Story <ArrowRight size={14} /></Link>
          </div>
          <div className="reveal-up parallax-section" style={{ position: 'relative', height: 'clamp(400px, 50vw, 600px)', overflow: 'hidden' }}>
            <div className="parallax-img" style={{ position: 'absolute', inset: '-10%', width: '120%', height: '120%' }}>
              <Image src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=85" alt="Lodge interior" fill sizes="50vw" style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '32px', left: '32px', zIndex: 2 }}>
              <div style={{ background: 'rgba(14,14,14,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(184,147,90,0.3)', padding: '20px 24px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B8935A', marginBottom: '4px' }}>Est.</p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', fontWeight: 300, lineHeight: 1 }}>1932</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS SHOWCASE */}
      <section style={{ padding: '0 0 clamp(80px, 10vw, 140px)' }}>
        <div style={{ padding: '0 clamp(24px, 5vw, 80px)', marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
          <div className="reveal-up">
            <p className="section-label" style={{ marginBottom: '16px' }}>Accommodation</p>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300 }}>
              Fourteen rooms.<br /><em style={{ color: '#B8935A' }}>Each one distinct.</em>
            </h2>
          </div>
          <Link href="/rooms" className="btn-outline hide-mobile reveal-up">All Rooms <ArrowRight size={14} /></Link>
        </div>
        <div style={{ padding: '0 clamp(24px, 5vw, 80px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {featuredRooms.map(room => (
            <Link key={room.id} href={`/rooms/${room.slug}`} className="room-card stagger-child" style={{ textDecoration: 'none', display: 'block' }}>
              <div className="img-wrap" style={{ height: 'clamp(280px, 30vw, 380px)', position: 'relative', marginBottom: '20px' }}>
                <Image src={room.images[0]} alt={room.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span style={{ background: 'rgba(14,14,14,0.8)', backdropFilter: 'blur(4px)', color: '#B8935A', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 12px' }}>{room.category}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '21px', fontWeight: 300, color: '#F5EFE0' }}>{room.name}</h3>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', color: '#B8935A', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                  €{room.price_per_night.toLocaleString()}<span style={{ fontSize: '12px', color: 'rgba(245,239,224,0.4)', fontFamily: "'DM Sans', sans-serif" }}>/night</span>
                </span>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.5)', lineHeight: 1.7 }}>{room.short_description}</p>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '48px' }} className="hide-desktop">
          <Link href="/rooms" className="btn-outline">All Rooms <ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* ATMOSPHERIC BREAK */}
      <section className="parallax-section grain-overlay" style={{ position: 'relative', height: '65vh', minHeight: '400px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="parallax-img" style={{ position: 'absolute', inset: '-15%', width: '130%', height: '130%' }}>
          <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=85" alt="Alpine peaks" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center 40%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.45)' }} />
        </div>
        <p className="reveal-up" style={{ position: 'relative', zIndex: 2, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(22px, 4vw, 50px)', maxWidth: '820px', lineHeight: 1.5, color: '#F5EFE0', textAlign: 'center', padding: '0 32px' }}>
          "Some places exist to be visited. <span style={{ color: '#B8935A' }}>Maison Celeste exists to be returned to.</span>"
        </p>
      </section>

      {/* EXPERIENCES */}
      <section style={{ padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '80px' }}>
          <p className="section-label reveal-up" style={{ marginBottom: '16px' }}>What We Offer</p>
          <h2 className="reveal-up" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300 }}>Quiet <em style={{ color: '#B8935A' }}>pleasures.</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
          {experiences.map(exp => (
            <div key={exp.title} className="stagger-child parallax-section">
              <div style={{ height: '300px', position: 'relative', overflow: 'hidden', marginBottom: '28px' }}>
                <div className="parallax-img" style={{ position: 'absolute', inset: '-10%', width: '120%', height: '120%' }}>
                  <Image src={exp.image} alt={exp.title} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,14,14,0.5) 0%, transparent 60%)' }} />
                </div>
              </div>
              <p className="section-label" style={{ marginBottom: '10px' }}>{exp.label}</p>
              <h3 style={{ fontSize: '26px', fontWeight: 300, marginBottom: '14px' }}>{exp.title}</h3>
              <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.55)', lineHeight: 1.8 }}>{exp.description}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <Link href="/experiences" className="btn-outline reveal-up">All Experiences <ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: '#080808', padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)', borderTop: '1px solid rgba(184,147,90,0.1)', borderBottom: '1px solid rgba(184,147,90,0.1)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p className="section-label reveal-up" style={{ textAlign: 'center', marginBottom: '80px' }}>What Guests Say</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="reveal-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: i % 2 === 0 ? 'flex-start' : 'flex-end', textAlign: i % 2 === 0 ? 'left' : 'right' }}>
                <blockquote style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(20px, 3vw, 26px)', lineHeight: 1.6, maxWidth: '720px' }}>"{t.quote}"</blockquote>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '17px', marginBottom: '4px' }}>{t.author}</p>
                  <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B8935A' }}>{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="parallax-section grain-overlay" style={{ position: 'relative', height: '60vh', minHeight: '450px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="parallax-img" style={{ position: 'absolute', inset: '-15%', width: '130%', height: '130%' }}>
          <Image src="https://images.unsplash.com/photo-1543226926-a1c30a4b439e?w=2000&q=85" alt="Lodge at night" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center 60%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.6)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 32px' }}>
          <p className="section-label reveal-up" style={{ marginBottom: '24px' }}>Reserve Your Stay</p>
          <h2 className="reveal-up" style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300, marginBottom: '40px' }}>
            The season fills<br /><em style={{ color: '#B8935A' }}>quietly.</em>
          </h2>
          <div className="reveal-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/rooms" className="btn-primary">View Availability <ArrowRight size={14} /></Link>
            <Link href="/contact" className="btn-outline">Enquire Directly</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
