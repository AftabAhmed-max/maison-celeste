import Razorpay from 'razorpay'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', booking_meta } = await req.json()

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      notes: booking_meta,
    })

    return NextResponse.json({ order_id: order.id, amount: order.amount, currency: order.currency })
  } catch (err) {
    console.error('Razorpay create-order error:', err)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
