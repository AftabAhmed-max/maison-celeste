'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import { ArrowRight } from 'lucide-react'

const timeline = [
  { year: '1932', event: 'Auguste Vernet builds the hunting lodge. Seven rooms, one hearth, a cellar already considered excessive.' },
  { year: '1958', event: 'His son Henri adds four rooms along the north face and the library, filling it with books he intends to read.' },
  { year: '1978', event: 'Celeste Vernet, Henri\'s daughter, opens the lodge quietly to paying guests. She refuses to advertise.' },
  { year: '1991', event: 'Architect Claude Ferrier adds the glass-walled Suite Blanc de Blancs. It wins a regional award Celeste finds embarrassing.' },
  { year: '2008', event: 'Le Penthouse is built. The planning process takes four years. The result takes two evenings to stop feeling real.' },
  { year: '2019', event: 'Jean-Paul Vernet, Celeste\'s son, takes over the lodge. His first act is to extend the cellar. His second is to do nothing else.' },
]

export default function AboutPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const init = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.fromTo('.page-hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.2 })
      gsap.utils.toArray('.about-reveal').forEach((el: any) => {
        gsap.fromTo(el, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.1, ease: 'power2.out',
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

      <section style={{ position: 'relative', height: '55vh', minHeight: '420px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', paddingBottom: '80px' }}>
        <Image src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=2000&q=85" alt="About" fill style={{ objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,14,14,0.15) 0%, rgba(14,14,14,0.82) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 clamp(24px, 5vw, 80px)', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          <p className="section-label" style={{ marginBottom: '16px' }}>Three Generations</p>
          <h1 className="page-hero-title" style={{ fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 300, opacity: 0 }}>
            Our<br /><em style={{ color: '#B8935A' }}>Story</em>
          </h1>
        </div>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(64px, 8vw, 100px) clamp(24px, 5vw, 80px) 120px' }}>

        {/* Intro */}
        <div style={{ maxWidth: '760px', marginBottom: '100px' }}>
          <p className="about-reveal" style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', lineHeight: 1.7, color: 'rgba(245,239,224,0.85)', marginBottom: '40px', opacity: 0 }}>
            "She refused to advertise. She refused a telephone in every room. She refused the word 'boutique'. She said: it is a house. People come and stay in it. That is enough."
          </p>
          <p className="about-reveal" style={{ fontSize: '13px', color: '#B8935A', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0 }}>
            On Celeste Vernet, 1934–2016
          </p>
          <div className="gold-divider about-reveal" style={{ opacity: 0 }} />
        </div>

        {/* Two column story */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(48px, 6vw, 80px)', marginBottom: '100px', alignItems: 'start' }}>
          <div>
            <p className="about-reveal" style={{ fontSize: '15px', color: 'rgba(245,239,224,0.6)', lineHeight: 1.9, marginBottom: '20px', opacity: 0 }}>
              Auguste Vernet built this lodge in 1932 because he wanted somewhere to put his dogs after a day on the mountain. The rooms were secondary. The fireplace was not. He chose this particular ridge because the valley below holds a quality of light in the late afternoon that he described to his wife as "the kind of light that makes promises".
            </p>
            <p className="about-reveal" style={{ fontSize: '15px', color: 'rgba(245,239,224,0.6)', lineHeight: 1.9, opacity: 0 }}>
              His daughter Celeste — for whom the lodge is named — understood that what they had was not a business to be expanded, but a thing to be preserved. She took no outside investment. She hired no consultants. She added rooms only when a member of the family needed somewhere to sleep.
            </p>
          </div>
          <div>
            <p className="about-reveal" style={{ fontSize: '15px', color: 'rgba(245,239,224,0.6)', lineHeight: 1.9, marginBottom: '20px', opacity: 0 }}>
              The lodge opened to paying guests in 1978 not because Celeste needed the income — her husband had done well in Lyon — but because she thought it was a pity for the rooms to sit empty in her absence. The first entry in the guest book is from December 14, 1978. It reads only: "Perfect. Thank you."
            </p>
            <p className="about-reveal" style={{ fontSize: '15px', color: 'rgba(245,239,224,0.6)', lineHeight: 1.9, opacity: 0 }}>
              Her son Jean-Paul runs it now. He has changed very little. The cellar is larger. The linens are better. The record player in the Chambre Alpestre was his idea. Otherwise, it is the same lodge that Celeste opened, that Henri expanded, that Auguste built.
            </p>
          </div>
        </div>

        {/* Image break */}
        <div className="about-reveal" style={{ position: 'relative', height: 'clamp(300px, 40vw, 500px)', overflow: 'hidden', marginBottom: '100px', opacity: 0 }}>
          <Image src="https://images.unsplash.com/photo-1551524559-8af4e6624178?w=2000&q=85" alt="The valley" fill style={{ objectFit: 'cover', objectPosition: 'center 50%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.3)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(20px, 3vw, 36px)', color: '#F5EFE0', textAlign: 'center', maxWidth: '700px', lineHeight: 1.5 }}>
              "The kind of light that makes promises."
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: '100px' }}>
          <h2 className="about-reveal" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, marginBottom: '56px', opacity: 0 }}>
            A brief <em style={{ color: '#B8935A' }}>history</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {timeline.map((item, i) => (
              <div key={item.year} className="about-reveal" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '40px', alignItems: 'start', padding: '32px 0', borderBottom: '1px solid rgba(245,239,224,0.06)', opacity: 0 }}>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', color: '#B8935A', fontWeight: 300 }}>{item.year}</p>
                </div>
                <p style={{ fontSize: '15px', color: 'rgba(245,239,224,0.6)', lineHeight: 1.8, paddingTop: '8px' }}>{item.event}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/rooms" className="btn-primary about-reveal" style={{ opacity: 0 }}>Reserve Your Room <ArrowRight size={13} /></Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
