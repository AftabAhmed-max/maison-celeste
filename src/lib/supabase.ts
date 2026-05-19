import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Room = {
  id: string
  name: string
  slug: string
  category: string
  price_per_night: number
  capacity: number
  size_sqm: number
  total_units: number
  description: string
  short_description: string
  amenities: string[]
  images: string[]
  featured: boolean
}

export type Booking = {
  id: string
  created_at: string
  guest_name: string
  guest_email: string
  room_id: string
  room_name: string
  check_in: string
  check_out: string
  guests: number
  status: 'confirmed' | 'cancelled'
  special_requests?: string
  total_price: number
  payment_id?: string
  payment_order_id?: string
}

export async function getBookedUnitsForDates(
  roomId: string,
  checkIn: string,
  checkOut: string
): Promise<number> {
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_id', roomId)
    .neq('status', 'cancelled')
    .lt('check_in', checkOut)
    .gt('check_out', checkIn)

  if (error || !data) return 0
  return data.length
}

export async function isRoomAvailable(
  roomId: string,
  totalUnits: number,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  const booked = await getBookedUnitsForDates(roomId, checkIn, checkOut)
  return booked < totalUnits
}

export async function getBookedDatesForRoom(roomId: string, totalUnits: number): Promise<string[]> {
  const { data } = await supabase
    .from('bookings')
    .select('check_in, check_out')
    .eq('room_id', roomId)
    .neq('status', 'cancelled')

  if (!data) return []
  const dateCounts: Record<string, number> = {}
  data.forEach(b => {
    const start = new Date(b.check_in)
    const end = new Date(b.check_out)
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1
    }
  })
  return Object.entries(dateCounts)
    .filter(([, count]) => count >= totalUnits)
    .map(([date]) => date)
}
