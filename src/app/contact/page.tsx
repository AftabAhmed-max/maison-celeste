'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const init = async () => {
      const gsap = (await import('gsap')).default
      gsap.fromTo('.page-hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.2 })
      gsap.utils.toArray('.contact-reveal').forEach((el: any) => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    }
    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    } catch {}
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <>
      <SmoothScroll />
      <Navbar />

      <section style={{ position: 'relative', height: '50vh', minHeight: '380px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', paddingBottom: '80px' }}>
        <Image src="https://images.unsplash.com/photo-1543226926-a1c30a4b439e?w=2000&q=85" alt="Contact" fill style={{ objectFit: 'cover', objectPosition: 'center 70%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,14,14,0.2) 0%, rgba(14,14,14,0.85) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 clamp(24px, 5vw, 80px)', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          <p className="section-label" style={{ marginBottom: '16px' }}>Get In Touch</p>
          <h1 className="page-hero-title" style={{ fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 300, opacity: 0 }}>
            Contact<br /><em style={{ color: '#B8935A' }}>& Directions</em>
          </h1>
        </div>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(64px, 8vw, 100px) clamp(24px, 5vw, 80px) 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(48px, 6vw, 80px)' }}>

          {/* Left: Info */}
          <div>
            <h2 className="contact-reveal" style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 300, marginBottom: '40px', opacity: 0 }}>
              We would be glad<br /><em style={{ color: '#B8935A' }}>to hear from you.</em>
            </h2>

            <div className="contact-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '56px', opacity: 0 }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', border: '1px solid rgba(184,147,90,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={16} style={{ color: '#B8935A' }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B8935A', marginBottom: '6px' }}>Address</p>
                  <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.6)', lineHeight: 1.7 }}>Lieu-dit Les Granges<br />73120 Courchevel 1550<br />Savoie, France</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', border: '1px solid rgba(184,147,90,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={16} style={{ color: '#B8935A' }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B8935A', marginBottom: '6px' }}>Telephone</p>
                  <a href="tel:+33479081234" style={{ fontSize: '14px', color: 'rgba(245,239,224,0.6)', textDecoration: 'none' }}>+33 (0)4 79 08 12 34</a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', border: '1px solid rgba(184,147,90,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={16} style={{ color: '#B8935A' }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B8935A', marginBottom: '6px' }}>Email</p>
                  <a href="mailto:hello@maisoncelestehotel.com" style={{ fontSize: '14px', color: 'rgba(245,239,224,0.6)', textDecoration: 'none' }}>hello@maisoncelestehotel.com</a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', border: '1px solid rgba(184,147,90,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={16} style={{ color: '#B8935A' }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B8935A', marginBottom: '6px' }}>Season</p>
                  <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.6)', lineHeight: 1.7 }}>14 December – 15 April<br />Check-in from 15:00</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="contact-reveal" style={{ opacity: 0 }}>
              <p className="section-label" style={{ marginBottom: '16px' }}>Find Us</p>
              <div style={{ height: '280px', border: '1px solid rgba(184,147,90,0.2)', overflow: 'hidden' }}>
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=6.5,45.35,6.7,45.45&layer=mapnik&marker=45.4,6.6"
                  style={{ width: '100%', height: '100%', border: 'none', filter: 'invert(0.9) hue-rotate(180deg) brightness(0.8) contrast(0.9)' }}
                  title="Courchevel 1550 map"
                />
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(245,239,224,0.3)', marginTop: '8px' }}>Courchevel 1550, Savoie — 2h from Lyon–Saint Exupéry Airport</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-reveal" style={{ opacity: 0 }}>
            <div style={{ background: '#161616', border: '1px solid rgba(184,147,90,0.15)', padding: 'clamp(32px, 4vw, 48px)' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 300, marginBottom: '8px' }}>Send an Enquiry</h3>
              <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.45)', marginBottom: '32px', lineHeight: 1.6 }}>
                We respond to all enquiries within 24 hours. For reservations, please use the booking form on individual room pages.
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div className="gold-divider" style={{ margin: '0 auto 24px', width: '40px' }} />
                  <h4 style={{ fontSize: '22px', fontWeight: 300, marginBottom: '12px' }}>Message Received</h4>
                  <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.5)', lineHeight: 1.7 }}>
                    Thank you for reaching out. We will reply to {formData.email} within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label className="mc-label">Full Name</label>
                      <input required className="mc-input" type="text" placeholder="Your name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="mc-label">Email Address</label>
                      <input required className="mc-input" type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                      <label className="mc-label">Phone (optional)</label>
                      <input className="mc-input" type="tel" placeholder="+33 6 00 00 00 00" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="mc-label">Message</label>
                      <textarea required className="mc-input" rows={5} placeholder="Tell us what you have in mind — dates, room preferences, special occasions..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} style={{ resize: 'vertical', minHeight: '120px' }} />
                    </div>
                    <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', marginTop: '8px', opacity: submitting ? 0.7 : 1 }}>
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
