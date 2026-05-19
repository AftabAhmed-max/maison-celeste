'use client'

import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import { rooms } from '@/data/rooms'
import { supabase, isRoomAvailable, getBookedDatesForRoom } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { X, ChevronLeft, ChevronRight, Users, Maximize2, Check, ArrowRight } from 'lucide-react'

function AvailabilityCalendar({ bookedDates }: { bookedDates: string[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  const isBooked = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return bookedDates.includes(dateStr)
  }

  return (
    <div style={{ background: 'rgba(245,239,224,0.03)', border: '1px solid rgba(245,239,224,0.08)', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => setCurrentMonth(new Date(year, month - 1))} style={{ background: 'none', border: 'none', color: '#F5EFE0', cursor: 'pointer', padding: '4px' }}><ChevronLeft size={16} /></button>
        <p style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B8935A' }}>{monthName}</p>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1))} style={{ background: 'none', border: 'none', color: '#F5EFE0', cursor: 'pointer', padding: '4px' }}><ChevronRight size={16} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '8px' }}>
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(245,239,224,0.3)', padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {days.map((day, i) => (
          <div key={i} className={`cal-day ${day ? (isBooked(day) ? 'booked' : 'available') : 'empty'}`} style={{ textAlign: 'center' }}>
            {day || ''}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', background: 'rgba(245,239,224,0.6)', borderRadius: '50%' }} />
          <span style={{ fontSize: '11px', color: 'rgba(245,239,224,0.4)' }}>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', background: 'rgba(184,147,90,0.4)', borderRadius: '50%' }} />
          <span style={{ fontSize: '11px', color: 'rgba(245,239,224,0.4)' }}>Booked</span>
        </div>
      </div>
    </div>
  )
}

function GuestSelect({ value, onChange, maxGuests = 4 }: { value: string; onChange: (v: string) => void; maxGuests?: number }) {
  const [open, setOpen] = useState(false)
  const options = ['', ...Array.from({ length: maxGuests }, (_, i) => String(i + 1))]
  const labels: Record<string, string> = {
    '': 'Number of Guests',
    ...Object.fromEntries(Array.from({ length: maxGuests }, (_, i) => [String(i + 1), `${i + 1} Guest${i + 1 > 1 ? 's' : ''}`])),
  }

  return (
    <div className="custom-select-wrapper">
      <button type="button" className={`custom-select-trigger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <span style={{ color: value ? '#F5EFE0' : 'rgba(245,239,224,0.3)' }}>{labels[value]}</span>
        <ChevronRight size={14} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', color: 'rgba(245,239,224,0.4)' }} />
      </button>
      {open && (
        <div className="custom-select-panel">
          {options.map(opt => (
            <button key={opt} type="button" className="custom-select-option" onClick={() => { onChange(opt); setOpen(false) }}>
              {opt ? labels[opt] : <span style={{ color: 'rgba(245,239,224,0.3)' }}>Number of Guests</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const room = rooms.find(r => r.slug === slug)
  if (!room) notFound()

  const { user } = useAuth()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [formData, setFormData] = useState({ guest_name: '', guest_email: '', check_in: '', check_out: '', guests: '', special_requests: '' })

  // Pre-fill email if logged in
  useEffect(() => {
    if (user?.email) setFormData(prev => ({ ...prev, guest_email: user.email! }))
  }, [user?.email])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  // Calculate nights and total price
  const nights = formData.check_in && formData.check_out
    ? Math.max(0, Math.round((new Date(formData.check_out).getTime() - new Date(formData.check_in).getTime()) / (1000 * 60 * 60 * 24)))
    : 0
  const totalPrice = nights * room.price_per_night

  useEffect(() => {
    const fetchBookings = async () => {
      const dates = await getBookedDatesForRoom(room.id, room.total_units)
      setBookedDates(dates)
    }
    fetchBookings()
  }, [room.id])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const init = async () => {
      const gsap = (await import('gsap')).default
      gsap.fromTo('.room-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 })
    }
    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.guests) { setError('Please select number of guests.'); return }
    if (nights < 1) { setError('Please select valid check-in and check-out dates.'); return }

    setSubmitting(true)
    setCheckingAvailability(true)
    setError('')

    // 1. Real-time availability check
    const available = await isRoomAvailable(room.id, room.total_units, formData.check_in, formData.check_out)
    setCheckingAvailability(false)

    if (!available) {
      setError('Sorry, this room is no longer available for your selected dates. Please choose different dates.')
      setSubmitting(false)
      const dates = await getBookedDatesForRoom(room.id, room.total_units)
      setBookedDates(dates)
      return
    }

    // 2. Create Razorpay order server-side
    const EUR_TO_INR = 90
    const orderRes = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(totalPrice * EUR_TO_INR),
        currency: 'INR',
        booking_meta: {
          room_name: room.name,
          guest_email: formData.guest_email,
          check_in: formData.check_in,
          check_out: formData.check_out,
        },
      }),
    })

    const orderData = await orderRes.json()
    if (!orderRes.ok || !orderData.order_id) {
      setError('Unable to initiate payment. Please try again.')
      setSubmitting(false)
      return
    }

    setSubmitting(false)

    // 3. Open Razorpay checkout popup
    const rzpOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Maison Celeste',
      description: `${room.name} · ${nights} night${nights > 1 ? 's' : ''}`,
      order_id: orderData.order_id,
      prefill: {
        name: formData.guest_name,
        email: formData.guest_email,
      },
      theme: { color: '#B8935A' },
      modal: {
        ondismiss: () => setError('Payment cancelled. Your booking was not confirmed.'),
      },
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        setSubmitting(true)
        setError('')

        // 4. Verify payment + save booking + send emails (all server-side)
        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            booking: {
              guest_name: formData.guest_name,
              guest_email: formData.guest_email,
              room_id: room.id,
              room_name: room.name,
              check_in: formData.check_in,
              check_out: formData.check_out,
              guests: parseInt(formData.guests),
              special_requests: formData.special_requests,
              total_price: totalPrice,
            },
          }),
        })

        const verifyData = await verifyRes.json()
        setSubmitting(false)

        if (!verifyRes.ok || !verifyData.success) {
          setError('Payment verification failed. Please contact us with your payment ID: ' + response.razorpay_payment_id)
          return
        }

        setSubmitted(true)
        const dates = await getBookedDatesForRoom(room.id, room.total_units)
        setBookedDates(dates)
      },
    }

    // Load Razorpay script dynamically
    if (!(window as any).Razorpay) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve()
        script.onerror = () => reject()
        document.body.appendChild(script)
      })
    }

    const rzp = new (window as any).Razorpay(rzpOptions)
    rzp.open()
  }

  return (
    <>
      <SmoothScroll />
      <Navbar />

      {/* GALLERY HERO */}
      <div style={{ paddingTop: '80px' }}>
        <div className="room-hero-grid">
          <div style={{ position: 'relative', gridRow: '1', cursor: 'pointer' }} onClick={() => { setLightboxIndex(0); setLightboxOpen(true) }}>
            <Image src={room.images[0]} alt={room.name} fill sizes="50vw" loading="eager" style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px' }}>
            {room.images.slice(1, 5).map((img, i) => (
              <div key={i} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => { setLightboxIndex(i + 1); setLightboxOpen(true) }}>
                <Image src={img} alt={room.name} fill sizes="25vw" style={{ objectFit: 'cover' }} />
                {i === 2 && room.images.length > 4 && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '14px', letterSpacing: '0.1em', color: '#F5EFE0' }}>+{room.images.length - 4} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px) 120px' }}>
        <div className="room-content-grid">

          {/* LEFT: Info */}
          <div>
            <div style={{ marginBottom: '48px' }}>
              <p className="section-label" style={{ marginBottom: '12px' }}>{room.category}</p>
              <h1 className="room-title" style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 300, marginBottom: '24px', opacity: 0 }}>{room.name}</h1>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(245,239,224,0.6)' }}>
                  <Users size={14} style={{ color: '#B8935A' }} /> Up to {room.capacity} guests
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(245,239,224,0.6)' }}>
                  <Maximize2 size={14} style={{ color: '#B8935A' }} /> {room.size_sqm} m²
                </span>
              </div>
              <div className="gold-divider" />
              <p style={{ fontSize: '16px', color: 'rgba(245,239,224,0.65)', lineHeight: 1.9, marginTop: '24px' }}>
                {room.description}
              </p>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: '56px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 300, marginBottom: '24px' }}>What&apos;s Included</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {room.amenities.map(a => (
                  <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check size={13} style={{ color: '#B8935A', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: 'rgba(245,239,224,0.65)' }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 300, marginBottom: '24px' }}>Availability</h3>
              <AvailabilityCalendar bookedDates={bookedDates} />
            </div>
          </div>

          {/* RIGHT: Booking form */}
          <div className="room-booking-sticky" style={{ position: 'sticky', top: '100px' }}>
            <div style={{ background: '#161616', border: '1px solid rgba(184,147,90,0.2)', padding: '32px' }}>
              <div style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid rgba(245,239,224,0.06)' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', color: '#B8935A', marginBottom: '4px' }}>
                  €{room.price_per_night.toLocaleString()}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(245,239,224,0.4)', letterSpacing: '0.08em' }}>per night · breakfast included</p>
              </div>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(184,147,90,0.1)', border: '1px solid #B8935A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={20} style={{ color: '#B8935A' }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 300, marginBottom: '12px' }}>Request Received</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.55)', lineHeight: 1.7 }}>
                    Payment received and reservation confirmed. A receipt has been sent to {formData.guest_email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label className="mc-label">Full Name</label>
                      <input required className="mc-input" type="text" placeholder="Your full name" value={formData.guest_name} onChange={e => setFormData({ ...formData, guest_name: e.target.value })} />
                    </div>
                    <div>
                      <label className="mc-label">Email Address</label>
                      <input required className="mc-input" type="email" placeholder="your@email.com" value={formData.guest_email} onChange={e => setFormData({ ...formData, guest_email: e.target.value })} readOnly={!!user} style={{ opacity: user ? 0.7 : 1 }} />
                      {!user && (
                        <p style={{ fontSize: '11px', color: 'rgba(245,239,224,0.25)', marginTop: '6px' }}>
                          <a href="/account" style={{ color: '#B8935A', textDecoration: 'none' }}>Sign in</a> to pre-fill your details and track this booking.
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="mc-label">Check In</label>
                        <input required className="mc-input" type="date" min={today} value={formData.check_in} onChange={e => setFormData({ ...formData, check_in: e.target.value })} style={{ colorScheme: 'dark' }} />
                      </div>
                      <div>
                        <label className="mc-label">Check Out</label>
                        <input required className="mc-input" type="date" min={formData.check_in || today} value={formData.check_out} onChange={e => setFormData({ ...formData, check_out: e.target.value })} style={{ colorScheme: 'dark' }} />
                      </div>
                    </div>
                    <div>
                      <label className="mc-label">Guests</label>
                      <GuestSelect value={formData.guests} onChange={v => setFormData({ ...formData, guests: v })} maxGuests={room.capacity} />
                    </div>
                    <div>
                      <label className="mc-label">Special Requests</label>
                      <textarea className="mc-input" placeholder="Dietary requirements, celebrations, accessibility needs..." rows={3} value={formData.special_requests} onChange={e => setFormData({ ...formData, special_requests: e.target.value })} style={{ resize: 'vertical', minHeight: '80px' }} />
                    </div>
                    {error && <p style={{ fontSize: '13px', color: '#ff9999' }}>{error}</p>}
                    <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}>
                      {submitting ? (checkingAvailability ? 'Checking availability...' : 'Processing...') : 'Pay & Confirm'} {!submitting && <ArrowRight size={13} />}
                    </button>
                    <p style={{ fontSize: '11px', color: 'rgba(245,239,224,0.3)', textAlign: 'center', lineHeight: 1.6 }}>
                      Secure payment via Razorpay. Booking confirmed on payment.
                    </p>
                    {nights > 0 && (
                      <div style={{ background: 'rgba(184,147,90,0.08)', border: '1px solid rgba(184,147,90,0.2)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'rgba(245,239,224,0.5)' }}>{nights} night{nights > 1 ? 's' : ''} × €{room.price_per_night}</span>
                        <span style={{ fontSize: '15px', color: '#B8935A', fontWeight: 500 }}>€{totalPrice.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#F5EFE0', cursor: 'pointer', zIndex: 2 }}>
            <X size={24} />
          </button>
          <button onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + room.images.length) % room.images.length) }} style={{ position: 'absolute', left: '24px', background: 'none', border: 'none', color: '#F5EFE0', cursor: 'pointer', zIndex: 2 }}>
            <ChevronLeft size={32} />
          </button>
          <div style={{ position: 'relative', width: '85vw', maxWidth: '1100px', height: '80vh' }} onClick={e => e.stopPropagation()}>
            <Image src={room.images[lightboxIndex]} alt={room.name} fill sizes="100vw" style={{ objectFit: 'contain' }} />
          </div>
          <button onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % room.images.length) }} style={{ position: 'absolute', right: '24px', background: 'none', border: 'none', color: '#F5EFE0', cursor: 'pointer', zIndex: 2 }}>
            <ChevronRight size={32} />
          </button>
          <div style={{ position: 'absolute', bottom: '24px', display: 'flex', gap: '8px' }}>
            {room.images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setLightboxIndex(i) }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === lightboxIndex ? '#B8935A' : 'rgba(245,239,224,0.3)', border: 'none', cursor: 'pointer', padding: 0 }} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
