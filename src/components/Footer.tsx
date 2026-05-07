import Link from 'next/link'
import { MapPin, Phone, Mail, ExternalLink, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#080808', borderTop: '1px solid rgba(184,147,90,0.15)', padding: '80px 0 40px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '64px', marginBottom: '64px' }}>
          
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: 300, marginBottom: '16px' }}>
              Maison <span style={{ color: '#B8935A' }}>Celeste</span>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.5)', lineHeight: 1.8, maxWidth: '260px' }}>
              A converted hunting lodge in the French Alps. Open December through April. Fourteen rooms.
            </p>
            <div className="gold-divider" style={{ marginTop: '24px' }} />
            <p style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B8935A' }}>
              Est. 1932
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p className="section-label" style={{ marginBottom: '24px' }}>Navigate</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { href: '/rooms', label: 'Rooms & Suites' },
                { href: '/experiences', label: 'Experiences' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/about', label: 'Our Story' },
                { href: '/contact', label: 'Contact & Directions' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="section-label" style={{ marginBottom: '24px' }}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={14} style={{ color: '#B8935A', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', color: 'rgba(245,239,224,0.5)', lineHeight: 1.6 }}>
                  Lieu-dit Les Granges<br />73120 Courchevel 1550<br />Savoie, France
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Phone size={14} style={{ color: '#B8935A', flexShrink: 0 }} />
                <a href="tel:+33479081234" className="footer-link">+33 (0)4 79 08 12 34</a>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Mail size={14} style={{ color: '#B8935A', flexShrink: 0 }} />
                <a href="mailto:hello@maisoncelestehotel.com" className="footer-link">hello@maisoncelestehotel.com</a>
              </div>
            </div>
          </div>

          {/* Season info */}
          <div>
            <p className="section-label" style={{ marginBottom: '24px' }}>Season</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#B8935A', marginBottom: '4px', letterSpacing: '0.05em' }}>Winter Season</p>
                <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.5)' }}>14 December – 15 April</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#B8935A', marginBottom: '4px', letterSpacing: '0.05em' }}>Check-in / Check-out</p>
                <p style={{ fontSize: '14px', color: 'rgba(245,239,224,0.5)' }}>From 15:00 / Until 12:00</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#B8935A', marginBottom: '4px', letterSpacing: '0.05em' }}>Follow</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href="#" style={{ color: 'rgba(245,239,224,0.4)', transition: 'color 0.3s' }}>
                    <ExternalLink size={16} />
                  </a>
                  <a href="#" style={{ color: 'rgba(245,239,224,0.4)', transition: 'color 0.3s' }}>
                    <Globe size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(245,239,224,0.06)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(245,239,224,0.25)' }}>
            © {new Date().getFullYear()} Maison Celeste. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="#" className="footer-link" style={{ fontSize: '12px' }}>Privacy Policy</a>
            <a href="#" className="footer-link" style={{ fontSize: '12px' }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
