'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import type { Booking } from '@/lib/supabase'
import { ArrowRight, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; label: string }> = {
    confirmed: { color: '#2C6E49', bg: 'rgba(44,110,73,0.12)', label: 'Confirmed' },
    cancelled: { color: '#991B1B', bg: 'rgba(153,27,27,0.12)', label: 'Cancelled' },
  }
  const s = map[status] || map.confirmed
  return (
    <span style={{ background: s.bg, color: s.color, padding: '4px 12px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {s.label}
    </span>
  )
}

// ── Sign-in view ─────────────────────────────────────────────────────────────
function SignInPanel() {
  const [tab, setTab] = useState<'magic' | 'password' | 'signup'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signInWithPassword, signUp } = useAuth()

  const resetState = () => { setError(''); setSent(false); setSuccess('') }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await signIn(email)
    setLoading(false)
    if (error) { setError(error); return }
    setSent(true)
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await signInWithPassword(email, password)
    setLoading(false)
    if (error) setError('Incorrect email or password.')
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError('')
    const { error, needsConfirmation } = await signUp(email, password)
    setLoading(false)
    if (error) { setError(error); return }
    if (needsConfirmation) {
      setSuccess('Account created. Check your email to confirm, then sign in.')
    }
  }

  const tabStyle = (t: typeof tab) => ({
    flex: 1, padding: '10px', background: 'none', border: 'none',
    borderBottom: tab === t ? '1px solid #B8935A' : '1px solid rgba(245,239,224,0.08)',
    color: tab === t ? '#B8935A' : 'rgba(245,239,224,0.35)',
    fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const,
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0E0E0E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <p className="section-label" style={{ marginBottom: '12px' }}>Guest Access</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', fontWeight: 300, color: '#F5EFE0', marginBottom: '40px', lineHeight: 1.1 }}>
          My Account
        </h1>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(184,147,90,0.1)', border: '1px solid rgba(184,147,90,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={20} style={{ color: '#B8935A' }} />
            </div>
            <p style={{ fontSize: '15px', color: '#F5EFE0', marginBottom: '12px' }}>Magic link sent</p>
            <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.4)', lineHeight: 1.8 }}>
              Check <span style={{ color: '#B8935A' }}>{email}</span> and click the link.<br />
              Or <button onClick={() => { setSent(false); setTab('password') }} style={{ background: 'none', border: 'none', color: '#B8935A', cursor: 'pointer', fontSize: '14px', padding: 0, fontFamily: "'DM Sans', sans-serif" }}>sign in with password instead</button>.
            </p>
          </div>
        ) : success ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <CheckCircle size={28} style={{ color: '#2C6E49', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontSize: '15px', color: '#F5EFE0', marginBottom: '12px' }}>Account created</p>
            <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.4)', lineHeight: 1.8, marginBottom: '24px' }}>{success}</p>
            <button onClick={() => { setSuccess(''); setTab('password') }} style={{ background: 'none', border: 'none', color: '#B8935A', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>
              Sign In →
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', marginBottom: '32px' }}>
              <button style={tabStyle('password')} onClick={() => { setTab('password'); resetState() }}>Password</button>
              <button style={tabStyle('magic')} onClick={() => { setTab('magic'); resetState() }}>Magic Link</button>
              <button style={tabStyle('signup')} onClick={() => { setTab('signup'); resetState() }}>Sign Up</button>
            </div>

            {tab === 'password' && (
              <form onSubmit={handlePasswordLogin}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="mc-label" style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
                    <input required type="email" className="mc-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="mc-label" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
                    <input required type="password" className="mc-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                  {error && <p style={{ fontSize: '13px', color: '#ff9999' }}>{error}</p>}
                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={13} />}
                  </button>
                  <p style={{ fontSize: '12px', color: 'rgba(245,239,224,0.2)', textAlign: 'center' }}>
                    No account yet?{' '}
                    <button type="button" onClick={() => { setTab('signup'); resetState() }} style={{ background: 'none', border: 'none', color: '#B8935A', cursor: 'pointer', fontSize: '12px', padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
                      Create one
                    </button>
                  </p>
                </div>
              </form>
            )}

            {tab === 'magic' && (
              <form onSubmit={handleMagicLink}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="mc-label" style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
                    <input required type="email" className="mc-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  {error && <p style={{ fontSize: '13px', color: '#ff9999' }}>{error}</p>}
                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Sending...' : 'Send Magic Link'} {!loading && <ArrowRight size={13} />}
                  </button>
                  <p style={{ fontSize: '12px', color: 'rgba(245,239,224,0.2)', textAlign: 'center', lineHeight: 1.7 }}>
                    We will email you a one-click sign-in link. No password needed.
                  </p>
                </div>
              </form>
            )}

            {tab === 'signup' && (
              <form onSubmit={handleSignUp}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="mc-label" style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
                    <input required type="email" className="mc-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="mc-label" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
                    <input required type="password" className="mc-input" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                  {error && <p style={{ fontSize: '13px', color: '#ff9999' }}>{error}</p>}
                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Creating account...' : 'Create Account'} {!loading && <ArrowRight size={13} />}
                  </button>
                  <p style={{ fontSize: '12px', color: 'rgba(245,239,224,0.2)', textAlign: 'center' }}>
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setTab('password'); resetState() }} style={{ background: 'none', border: 'none', color: '#B8935A', cursor: 'pointer', fontSize: '12px', padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Account / bookings view ───────────────────────────────────────────────────
function AccountPanel() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    if (!user?.email) return
    setLoading(true)
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('guest_email', user.email)
      .order('created_at', { ascending: false })
    if (data) setBookings(data as Booking[])
    setLoading(false)
  }, [user?.email])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const cancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setCancellingId(id)
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b))
    setCancellingId(null)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.check_in) >= new Date())
  const past = bookings.filter(b => b.status === 'confirmed' && new Date(b.check_in) < new Date())
  const cancelled = bookings.filter(b => b.status === 'cancelled')

  return (
    <>
      <SmoothScroll />
      <Navbar />
      <div style={{ background: '#0E0E0E', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 48px)' }}>

          {/* Header */}
          <div style={{ marginBottom: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p className="section-label" style={{ marginBottom: '12px' }}>Guest Account</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 300, color: '#F5EFE0', margin: '0 0 8px' }}>
                My Bookings
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.35)' }}>{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              style={{ fontSize: '12px', color: 'rgba(245,239,224,0.35)', background: 'none', border: '1px solid rgba(245,239,224,0.1)', padding: '8px 16px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'border-color 0.2s' }}
            >
              Sign Out
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.3)' }}>Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', border: '1px solid rgba(245,239,224,0.06)' }}>
              <Calendar size={32} style={{ color: 'rgba(245,239,224,0.15)', margin: '0 auto 20px' }} />
              <p style={{ fontSize: '18px', color: '#F5EFE0', fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: '12px' }}>No bookings yet</p>
              <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.35)', marginBottom: '32px' }}>Browse our rooms and make your first reservation.</p>
              <Link href="/rooms" className="btn-primary" style={{ display: 'inline-flex' }}>
                Explore Rooms <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {[
                { label: 'Upcoming', items: upcoming, icon: Clock },
                { label: 'Past Stays', items: past, icon: CheckCircle },
                { label: 'Cancelled', items: cancelled, icon: XCircle },
              ].filter(s => s.items.length > 0).map(section => (
                <div key={section.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <section.icon size={14} style={{ color: '#B8935A' }} />
                    <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8935A', margin: 0 }}>{section.label}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    {section.items.map(b => {
                      const nights = Math.round((new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / (1000 * 60 * 60 * 24))
                      const isUpcoming = b.status === 'confirmed' && new Date(b.check_in) >= new Date()
                      return (
                        <div key={b.id} style={{ background: 'rgba(245,239,224,0.02)', border: '1px solid rgba(245,239,224,0.07)', padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 400, color: '#F5EFE0', margin: 0 }}>{b.room_name}</p>
                              <StatusBadge status={b.status} />
                            </div>
                            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                              {[
                                new Date(b.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' → ' + new Date(b.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                                `${nights} night${nights > 1 ? 's' : ''}`,
                                `${b.guests} guest${b.guests > 1 ? 's' : ''}`,
                                `€${(b.total_price || 0).toLocaleString()}`,
                              ].map((val, i) => (
                                <span key={i} style={{ fontSize: '13px', color: 'rgba(245,239,224,0.4)' }}>{val}</span>
                              ))}
                            </div>
                          </div>
                          {isUpcoming && (
                            <button
                              onClick={() => cancelBooking(b.id)}
                              disabled={cancellingId === b.id}
                              style={{ fontSize: '11px', color: 'rgba(245,239,224,0.3)', background: 'none', border: '1px solid rgba(245,239,224,0.1)', padding: '6px 14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', opacity: cancellingId === b.id ? 0.5 : 1, transition: 'border-color 0.2s' }}
                            >
                              {cancellingId === b.id ? '...' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

// ── Page — shows sign-in or account based on auth ────────────────────────────
export default function AccountPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0E0E0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.3)', fontFamily: "'DM Sans', sans-serif" }}>Loading...</p>
      </div>
    )
  }

  return user ? <AccountPanel /> : <SignInPanel />
}
