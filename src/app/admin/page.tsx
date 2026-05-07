'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { Booking } from '@/lib/supabase'
import { rooms as localRooms } from '@/data/rooms'
import { LogOut, Calendar, CheckCircle, XCircle, RefreshCw, Home, TrendingUp, BedDouble, Users, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const ADMIN_PASSWORD = 'celeste2024'
type Tab = 'bookings' | 'rooms' | 'revenue'

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const c: Record<string, { bg: string; color: string }> = {
    confirmed: { bg: '#D1FAE5', color: '#065F46' },
    cancelled: { bg: '#FEE2E2', color: '#991B1B' },
  }
  const s = c[status] || c.confirmed
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'capitalize' }}>
      {status}
    </span>
  )
}

// ── Room Availability Timeline ────────────────────────────────────────────────
function RoomTimeline({ room, bookings }: { room: typeof localRooms[0]; bookings: Booking[] }) {
  const days = 42 // 6 weeks
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build array of next `days` dates
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })

  // For each date, count how many confirmed bookings overlap
  const confirmedForRoom = bookings.filter(b => b.room_id === room.id && b.status === 'confirmed')

  function bookedUnitsOnDate(date: Date): number {
    return confirmedForRoom.filter(b => {
      const ci = new Date(b.check_in); ci.setHours(0,0,0,0)
      const co = new Date(b.check_out); co.setHours(0,0,0,0)
      return date >= ci && date < co
    }).length
  }

  // Group dates into weeks for grid display
  const weeks: Date[][] = []
  for (let i = 0; i < dates.length; i += 7) weeks.push(dates.slice(i, i + 7))

  const getCellColor = (booked: number) => {
    if (booked === 0) return '#F0FDF4'
    if (booked < room.total_units) return '#FEF3C7'
    return '#FEE2E2'
  }
  const getCellTextColor = (booked: number) => {
    if (booked === 0) return '#16A34A'
    if (booked < room.total_units) return '#92400E'
    return '#991B1B'
  }

  // Find upcoming fully-booked date ranges for summary
  const upcomingFull = dates.filter(d => bookedUnitsOnDate(d) >= room.total_units)
  const nextFullDate = upcomingFull[0]

  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px', marginBottom: '16px' }}>
      {/* Room header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <img src={room.images[0]} alt={room.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '11px', color: '#B8935A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>{room.category}</p>
          <p style={{ fontWeight: 600, color: '#111827', fontSize: '15px', marginBottom: '2px' }}>{room.name}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '3px' }}><BedDouble size={11} /> {room.total_units} unit{room.total_units > 1 ? 's' : ''}</span>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>€{room.price_per_night}/night</span>
          </div>
        </div>
        {nextFullDate ? (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '10px', color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Next full date</p>
            <p style={{ fontSize: '12px', color: '#EF4444', fontWeight: 600 }}>
              {nextFullDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        ) : (
          <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 500, background: '#F0FDF4', padding: '4px 10px', borderRadius: '9999px', flexShrink: 0 }}>All clear</span>
        )}
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', marginBottom: '3px' }}>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '10px', color: '#9CA3AF', padding: '2px 0', letterSpacing: '0.05em' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid — Mon-aligned */}
      {(() => {
        // Build a Mon-aligned 6-week grid
        const startOfGrid = new Date(today)
        const dow = today.getDay() // 0=Sun
        const daysFromMon = (dow + 6) % 7
        startOfGrid.setDate(today.getDate() - daysFromMon)

        const gridDates = Array.from({ length: 42 }, (_, i) => {
          const d = new Date(startOfGrid)
          d.setDate(startOfGrid.getDate() + i)
          return d
        })

        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
            {gridDates.map((date, i) => {
              const isToday = date.toDateString() === today.toDateString()
              const isPast = date < today
              const booked = bookedUnitsOnDate(date)
              const isCurrentMonth = date >= today

              return (
                <div
                  key={i}
                  title={isCurrentMonth ? `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}: ${booked}/${room.total_units} booked` : ''}
                  style={{
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    background: isPast ? '#F9FAFB' : getCellColor(booked),
                    border: isToday ? '2px solid #B8935A' : '1px solid transparent',
                    cursor: isCurrentMonth ? 'default' : 'default',
                    opacity: isPast ? 0.4 : 1,
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: isToday ? 700 : 400, color: isPast ? '#9CA3AF' : getCellTextColor(booked) }}>
                    {date.getDate()}
                  </span>
                  {isCurrentMonth && booked > 0 && (
                    <span style={{ fontSize: '9px', color: getCellTextColor(booked), lineHeight: 1 }}>
                      {booked}/{room.total_units}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )
      })()}

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
        {[
          { color: '#F0FDF4', label: 'Available', text: '#16A34A' },
          { color: '#FEF3C7', label: 'Partial', text: '#92400E' },
          { color: '#FEE2E2', label: 'Fully booked', text: '#991B1B' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', background: l.color, border: '1px solid #E5E7EB', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', color: '#6B7280' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Upcoming bookings list for this room */}
      {confirmedForRoom.filter(b => new Date(b.check_out) >= today).length > 0 && (
        <div style={{ marginTop: '16px', borderTop: '1px solid #F3F4F6', paddingTop: '14px' }}>
          <p style={{ fontSize: '11px', color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Upcoming bookings</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {confirmedForRoom
              .filter(b => new Date(b.check_out) >= today)
              .sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())
              .slice(0, 3)
              .map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: '#374151', fontWeight: 500 }}>{b.guest_name}</span>
                  <span style={{ color: '#6B7280' }}>{fmt(b.check_in)} → {fmt(b.check_out)}</span>
                  <span style={{ color: '#B8935A', fontWeight: 500 }}>€{(b.total_price || 0).toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Revenue Chart (pure CSS bar chart) ───────────────────────────────────────
function RevenueChart({ bookings }: { bookings: Booking[] }) {
  const months = useMemo(() => {
    const map: Record<string, number> = {}
    bookings.filter(b => b.status === 'confirmed').forEach(b => {
      const key = new Date(b.check_in).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
      map[key] = (map[key] || 0) + (b.total_price || 0)
    })
    // Last 6 months
    const result = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
      result.push({ label: key, value: map[key] || 0 })
    }
    return result
  }, [bookings])

  const max = Math.max(...months.map(m => m.value), 1)

  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}>Monthly Revenue</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
        {months.map(m => (
          <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
              {m.value > 0 ? `€${m.value >= 1000 ? (m.value/1000).toFixed(1)+'k' : m.value}` : ''}
            </span>
            <div style={{ width: '100%', background: m.value > 0 ? '#B8935A' : '#F3F4F6', borderRadius: '3px 3px 0 0', height: `${Math.max((m.value / max) * 80, m.value > 0 ? 4 : 0)}px`, transition: 'height 0.5s ease', minHeight: '2px' }} />
            <span style={{ fontSize: '10px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('bookings')
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [filterRoom, setFilterRoom] = useState(localRooms[0].id)
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth())
  const [filterYear, setFilterYear] = useState(new Date().getFullYear())

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    if (data) setBookings(data as Booking[])
    setLoading(false)
  }, [])

  useEffect(() => { if (authed) fetchData() }, [authed, fetchData])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) { setAuthed(true); setLoginError('') }
    else setLoginError('Incorrect password.')
  }

  const cancelBooking = async (id: string) => {
    if (!confirm('Cancel this booking?')) return
    setCancellingId(id)
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as any } : b))
    setCancellingId(null)
  }

  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const cancelled = bookings.filter(b => b.status === 'cancelled')
  const totalRevenue = confirmed.reduce((s, b) => s + (b.total_price || 0), 0)
  const totalNights = confirmed.reduce((s, b) => s + Math.round((new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / 86400000), 0)
  const avgRevPerBooking = confirmed.length > 0 ? Math.round(totalRevenue / confirmed.length) : 0

  const revenueByRoom = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; bookings: number }> = {}
    confirmed.forEach(b => {
      if (!map[b.room_id]) map[b.room_id] = { name: b.room_name, revenue: 0, bookings: 0 }
      map[b.room_id].revenue += b.total_price || 0
      map[b.room_id].bookings += 1
    })
    return Object.values(map).sort((a, b) => b.revenue - a.revenue)
  }, [confirmed])

  // Login screen
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F7F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: '420px', padding: '48px 40px', background: '#fff', boxShadow: '0 4px 40px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8935A', marginBottom: '8px' }}>Owner Portal</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 400, color: '#1a1a1a', marginBottom: '8px' }}>Maison Celeste</h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>Dashboard</p>
          </div>
          <form onSubmit={handleLogin}>
            <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: '8px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '15px', fontFamily: "'DM Sans', sans-serif", outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }} />
            {loginError && <p style={{ fontSize: '13px', color: '#DC2626', marginBottom: '12px' }}>{loginError}</p>}
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#B8935A', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Sign In
            </button>
          </form>
          <p style={{ marginTop: '24px', fontSize: '12px', color: '#9CA3AF', textAlign: 'center' }}>Demo password: celeste2024</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F5', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', color: '#1a1a1a' }}>
            Maison <span style={{ color: '#B8935A' }}>Celeste</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: '#E5E7EB' }} />
          <span style={{ fontSize: '13px', color: '#6B7280' }}>Owner Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>
            <Home size={14} /> View Site
          </Link>
          <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
          <button onClick={() => setAuthed(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Total Revenue', value: `€${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: '#B8935A', sub: `${confirmed.length} confirmed bookings` },
            { label: 'Avg per Booking', value: `€${avgRevPerBooking.toLocaleString()}`, icon: ArrowUpRight, color: '#3B82F6', sub: 'across all room types' },
            { label: 'Nights Booked', value: totalNights, icon: Calendar, color: '#8B5CF6', sub: 'total across all rooms' },
            { label: 'Cancellations', value: cancelled.length, icon: XCircle, color: '#EF4444', sub: `${confirmed.length + cancelled.length} total enquiries` },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <s.icon size={15} style={{ color: s.color }} />
                <span style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>{s.label}</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', lineHeight: 1, marginBottom: '4px' }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: '#9CA3AF' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid #E5E7EB', marginBottom: '32px', display: 'flex' }}>
          {(['bookings', 'rooms', 'revenue'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #B8935A' : '2px solid transparent', color: activeTab === tab ? '#B8935A' : '#6B7280', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'capitalize', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              {tab === 'rooms' ? 'Availability' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            {bookings.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center' }}>
                <Calendar size={32} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
                <p style={{ fontSize: '16px', color: '#374151', fontWeight: 500, marginBottom: '8px' }}>No bookings yet</p>
                <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Confirmed reservations will appear here automatically.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Guest</th><th>Room</th><th>Check In</th><th>Check Out</th>
                      <th>Nights</th><th>Guests</th><th>Total</th><th>Payment ID</th><th>Status</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => {
                      const nights = Math.round((new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / 86400000)
                      return (
                        <tr key={b.id}>
                          <td>
                            <p style={{ fontWeight: 500, color: '#111827', marginBottom: '2px' }}>{b.guest_name}</p>
                            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{b.guest_email}</p>
                          </td>
                          <td style={{ color: '#374151' }}>{b.room_name}</td>
                          <td style={{ color: '#374151', whiteSpace: 'nowrap' }}>{fmt(b.check_in)}</td>
                          <td style={{ color: '#374151', whiteSpace: 'nowrap' }}>{fmt(b.check_out)}</td>
                          <td style={{ color: '#374151', textAlign: 'center' }}>{nights}</td>
                          <td style={{ color: '#374151', textAlign: 'center' }}>{b.guests}</td>
                          <td style={{ color: '#B8935A', fontWeight: 500, whiteSpace: 'nowrap' }}>€{(b.total_price || 0).toLocaleString()}</td>
                          <td style={{ color: '#6B7280', fontSize: '11px', fontFamily: 'monospace' }}>{b.payment_id ? b.payment_id.slice(0, 16) + '…' : <span style={{ color: '#D1D5DB' }}>—</span>}</td>
                          <td><StatusBadge status={b.status} /></td>
                          <td>
                            {b.status === 'confirmed' && (
                              <button onClick={() => cancelBooking(b.id)} disabled={cancellingId === b.id}
                                style={{ padding: '5px 12px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, opacity: cancellingId === b.id ? 0.6 : 1 }}>
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Availability — compact filtered view */}
        {activeTab === 'rooms' && (() => {
          const now = new Date()
          const room = localRooms.find(r => r.id === filterRoom)!
          const confirmedForRoom = bookings.filter(b => b.room_id === filterRoom && b.status === 'confirmed')
          const today = new Date(); today.setHours(0,0,0,0)

          function bookedUnitsOnDate(date: Date) {
            return confirmedForRoom.filter(b => {
              const ci = new Date(b.check_in); ci.setHours(0,0,0,0)
              const co = new Date(b.check_out); co.setHours(0,0,0,0)
              return date >= ci && date < co
            }).length
          }

          const firstDay = new Date(filterYear, filterMonth, 1)
          const lastDay = new Date(filterYear, filterMonth + 1, 0)
          const startDow = (firstDay.getDay() + 6) % 7
          const gridDates: (Date | null)[] = [
            ...Array(startDow).fill(null),
            ...Array.from({ length: lastDay.getDate() }, (_, i) => new Date(filterYear, filterMonth, i + 1)),
          ]
          while (gridDates.length % 7 !== 0) gridDates.push(null)

          const getCellBg = (booked: number) => booked === 0 ? '#F0FDF4' : booked < room.total_units ? '#FEF3C7' : '#FEE2E2'
          const getCellColor = (booked: number) => booked === 0 ? '#15803D' : booked < room.total_units ? '#92400E' : '#991B1B'

          const prevMonth = () => { if (filterMonth === 0) { setFilterMonth(11); setFilterYear(y => y - 1) } else setFilterMonth(m => m - 1) }
          const nextMonth = () => { if (filterMonth === 11) { setFilterMonth(0); setFilterYear(y => y + 1) } else setFilterMonth(m => m + 1) }

          const monthBookings = confirmedForRoom
            .filter(b => new Date(b.check_out) >= today)
            .sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())
            .slice(0, 5)

          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
              {/* Calendar panel */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                {/* Filters row */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select value={filterRoom} onChange={e => setFilterRoom(e.target.value)}
                    style={{ padding: '7px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', color: '#111827', background: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", flex: 1, minWidth: '140px' }}>
                    {localRooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={prevMonth} style={{ padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', background: '#fff', cursor: 'pointer', color: '#374151', fontSize: '14px', lineHeight: 1 }}>‹</button>
                    <select value={filterMonth} onChange={e => setFilterMonth(Number(e.target.value))}
                      style={{ padding: '7px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', color: '#111827', background: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>{new Date(2000, i).toLocaleDateString('en-GB', { month: 'long' })}</option>
                      ))}
                    </select>
                    <select value={filterYear} onChange={e => setFilterYear(Number(e.target.value))}
                      style={{ padding: '7px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', color: '#111827', background: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      {[now.getFullYear(), now.getFullYear() + 1].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button onClick={nextMonth} style={{ padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', background: '#fff', cursor: 'pointer', color: '#374151', fontSize: '14px', lineHeight: 1 }}>›</button>
                  </div>
                </div>

                {/* Room info strip */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '12px', background: '#FAFAFA' }}>
                  <img src={room.images[0]} alt={room.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>{room.name}</p>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>{room.total_units} unit{room.total_units > 1 ? 's' : ''} · €{room.price_per_night}/night · max {room.capacity} guests</p>
                  </div>
                </div>

                {/* Calendar */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                      <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', padding: '4px 0', letterSpacing: '0.04em' }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {gridDates.map((date, i) => {
                      if (!date) return <div key={i} />
                      const isToday = date.toDateString() === today.toDateString()
                      const isPast = date < today
                      const booked = bookedUnitsOnDate(date)
                      return (
                        <div key={i} title={`${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}: ${booked}/${room.total_units} booked`}
                          style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', background: isPast ? '#F9FAFB' : getCellBg(booked), border: isToday ? '2px solid #B8935A' : '1px solid transparent', opacity: isPast ? 0.45 : 1, cursor: 'default' }}>
                          <span style={{ fontSize: '12px', fontWeight: isToday ? 700 : 400, color: isPast ? '#9CA3AF' : getCellColor(booked) }}>{date.getDate()}</span>
                          {!isPast && booked > 0 && <span style={{ fontSize: '9px', color: getCellColor(booked), lineHeight: 1 }}>{booked}/{room.total_units}</span>}
                        </div>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                    {[
                      { bg: '#F0FDF4', color: '#15803D', label: 'Available' },
                      { bg: '#FEF3C7', color: '#92400E', label: 'Partial' },
                      { bg: '#FEE2E2', color: '#991B1B', label: 'Fully booked' },
                    ].map(l => (
                      <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '12px', height: '12px', background: l.bg, border: '1px solid #E5E7EB', borderRadius: '3px' }} />
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>{l.label}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '12px', height: '12px', border: '2px solid #B8935A', borderRadius: '3px' }} />
                      <span style={{ fontSize: '11px', color: '#6B7280' }}>Today</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming bookings sidebar */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>Upcoming Bookings</p>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '2px 0 0' }}>{room.name}</p>
                </div>
                {monthBookings.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <Calendar size={24} style={{ color: '#D1D5DB', margin: '0 auto 10px' }} />
                    <p style={{ fontSize: '13px', color: '#9CA3AF' }}>No upcoming bookings</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {monthBookings.map((b, i) => {
                      const nights = Math.round((new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / 86400000)
                      return (
                        <div key={b.id} style={{ padding: '14px 20px', borderBottom: i < monthBookings.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>{b.guest_name}</p>
                            <span style={{ fontSize: '12px', color: '#B8935A', fontWeight: 500 }}>€{(b.total_price || 0).toLocaleString()}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 2px' }}>
                            {new Date(b.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} → {new Date(b.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </p>
                          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>{nights} night{nights > 1 ? 's' : ''} · {b.guests} guest{b.guests > 1 ? 's' : ''}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* Revenue */}
        {activeTab === 'revenue' && (
          <div>
            <RevenueChart bookings={bookings} />
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>Revenue by Room Type</h2>
                <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Confirmed bookings only</span>
              </div>
              {revenueByRoom.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <TrendingUp size={28} style={{ color: '#D1D5DB', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Revenue data will appear as bookings come in.</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr><th>Room</th><th>Bookings</th><th>Revenue</th><th>Avg per Booking</th><th>Share</th></tr>
                  </thead>
                  <tbody>
                    {revenueByRoom.map(row => (
                      <tr key={row.name}>
                        <td style={{ fontWeight: 500, color: '#111827' }}>{row.name}</td>
                        <td style={{ color: '#374151' }}>{row.bookings}</td>
                        <td style={{ color: '#B8935A', fontWeight: 600 }}>€{row.revenue.toLocaleString()}</td>
                        <td style={{ color: '#374151' }}>€{Math.round(row.revenue / row.bookings).toLocaleString()}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '6px', background: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${Math.round((row.revenue / totalRevenue) * 100)}%`, background: '#B8935A', borderRadius: '9999px' }} />
                            </div>
                            <span style={{ fontSize: '12px', color: '#6B7280', minWidth: '32px' }}>{Math.round((row.revenue / totalRevenue) * 100)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: '#F9FAFB' }}>
                      <td style={{ color: '#111827', fontWeight: 700 }}>Total</td>
                      <td style={{ color: '#374151', fontWeight: 600 }}>{confirmed.length}</td>
                      <td style={{ color: '#B8935A', fontWeight: 700 }}>€{totalRevenue.toLocaleString()}</td>
                      <td style={{ color: '#374151', fontWeight: 600 }}>€{avgRevPerBooking.toLocaleString()}</td>
                      <td style={{ color: '#374151' }}>100%</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
