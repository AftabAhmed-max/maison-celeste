'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return
    const close = () => setUserMenuOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [userMenuOpen])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    router.push('/')
  }

  const links = [
    { href: '/rooms', label: 'Rooms' },
    { href: '/experiences', label: 'Experiences' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  const initials = user?.email ? user.email[0].toUpperCase() : '?'

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: scrolled ? '16px 48px' : '28px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.4s ease',
          background: scrolled ? 'rgba(14,14,14,0.96)' : 'linear-gradient(to bottom, rgba(14,14,14,0.7) 0%, rgba(14,14,14,0) 100%)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(184,147,90,0.1)' : 'none',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontWeight: 400, letterSpacing: '0.04em', color: '#F5EFE0', textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span>Maison</span>
          <span style={{ color: '#B8935A' }}>Celeste</span>
        </Link>

        {/* Desktop links */}
        <div className="hide-mobile" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {links.map(l => <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>)}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/rooms" className="btn-primary hide-mobile" style={{ padding: '10px 24px', fontSize: '11px' }}>
            Reserve
          </Link>

          {/* Auth area */}
          {!loading && (
            user ? (
              // Logged in — avatar with dropdown
              <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'rgba(184,147,90,0.15)', border: '1px solid rgba(184,147,90,0.4)',
                    color: '#B8935A', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s',
                  }}
                >
                  {initials}
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: '#1C1C1C', border: '1px solid rgba(184,147,90,0.2)',
                    minWidth: '200px', zIndex: 200, padding: '8px 0',
                  }}>
                    <p style={{ padding: '10px 16px 6px', fontSize: '11px', color: 'rgba(245,239,224,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                      {user.email}
                    </p>
                    <div style={{ height: '1px', background: 'rgba(245,239,224,0.06)', margin: '4px 0' }} />
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#F5EFE0', textDecoration: 'none' }}
                    >
                      <User size={13} style={{ color: '#B8935A' }} /> My Bookings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#F5EFE0', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <LogOut size={13} style={{ color: '#B8935A' }} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not logged in
              <Link href="/account" className="hide-mobile" style={{ fontSize: '12px', color: 'rgba(245,239,224,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}>
                Sign In
              </Link>
            )
          )}

          <button className="hide-desktop" onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', color: '#F5EFE0', cursor: 'pointer', padding: '4px' }}>
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#0E0E0E', display: 'flex', flexDirection: 'column', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
            <Link href="/" onClick={() => setMenuOpen(false)} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', color: '#F5EFE0', textDecoration: 'none' }}>
              Maison <span style={{ color: '#B8935A' }}>Celeste</span>
            </Link>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#F5EFE0', cursor: 'pointer' }}>
              <X size={22} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {links.map((l, i) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '40px', fontWeight: 300, color: '#F5EFE0', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(245,239,224,0.08)', animationDelay: `${i * 0.05}s` }}>
                {l.label}
              </Link>
            ))}
            {user && (
              <Link href="/account" onClick={() => setMenuOpen(false)} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '40px', fontWeight: 300, color: '#B8935A', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(245,239,224,0.08)' }}>
                My Bookings
              </Link>
            )}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!user && (
              <Link href="/account" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ width: '100%', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(184,147,90,0.4)', color: '#B8935A' }}>
                Sign In
              </Link>
            )}
            <Link href="/rooms" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>
              Reserve a Room
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
