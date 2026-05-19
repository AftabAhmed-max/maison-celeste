import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'owner@maisonceleste.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'

function escHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function detailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:11px 0;border-bottom:1px solid rgba(245,239,224,0.07);font-size:13px;color:rgba(245,239,224,0.45);width:40%;vertical-align:top;">${label}</td>
    <td style="padding:11px 0;border-bottom:1px solid rgba(245,239,224,0.07);font-size:13px;color:#F5EFE0;font-weight:500;text-align:right;vertical-align:top;">${value}</td>
  </tr>`
}

function ownerRow(label: string, value: string) {
  return `<tr>
    <td style="padding:11px 0;border-bottom:1px solid #F3F4F6;font-size:13px;color:#6B7280;width:40%;vertical-align:top;">${label}</td>
    <td style="padding:11px 0;border-bottom:1px solid #F3F4F6;font-size:13px;color:#111827;font-weight:500;text-align:right;vertical-align:top;">${value}</td>
  </tr>`
}

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking,
    } = await req.json()

    // ── 1. Verify signature ──────────────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // ── 2. Save confirmed booking ────────────────────────────────────────────
    const { error: sbError } = await supabase.from('bookings').insert([{
      guest_name: booking.guest_name,
      guest_email: booking.guest_email,
      room_id: booking.room_id,
      room_name: booking.room_name,
      check_in: booking.check_in,
      check_out: booking.check_out,
      guests: booking.guests,
      status: 'confirmed',
      special_requests: booking.special_requests,
      total_price: booking.total_price,
      payment_id: razorpay_payment_id,
      payment_order_id: razorpay_order_id,
    }])

    if (sbError) {
      console.error('Supabase insert error:', sbError)
      return NextResponse.json({ error: 'Booking save failed' }, { status: 500 })
    }

    // ── 3. Send emails ───────────────────────────────────────────────────────
    const resend = new Resend(process.env.RESEND_API_KEY)
    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const nights = Math.round((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24))

    const guestRows = [
      detailRow('Room', escHtml(booking.room_name)),
      detailRow('Check-in', formatDate(booking.check_in)),
      detailRow('Check-out', formatDate(booking.check_out)),
      detailRow('Duration', `${nights} night${nights > 1 ? 's' : ''}`),
      detailRow('Guests', `${booking.guests} guest${booking.guests > 1 ? 's' : ''}`),
      detailRow('Total Paid', `€${Number(booking.total_price).toLocaleString()}`),
      detailRow('Payment ID', escHtml(razorpay_payment_id)),
      ...(booking.special_requests ? [detailRow('Special Requests', escHtml(booking.special_requests))] : []),
    ].join('')

    const ownerRows = [
      ownerRow('Guest Name', escHtml(booking.guest_name)),
      ownerRow('Email', escHtml(booking.guest_email)),
      ownerRow('Room', escHtml(booking.room_name)),
      ownerRow('Check-in', formatDate(booking.check_in)),
      ownerRow('Check-out', formatDate(booking.check_out)),
      ownerRow('Duration', `${nights} night${nights > 1 ? 's' : ''}`),
      ownerRow('Guests', `${booking.guests} guest${booking.guests > 1 ? 's' : ''}`),
      ownerRow('Total Paid', `€${Number(booking.total_price).toLocaleString()}`),
      ownerRow('Payment ID', escHtml(razorpay_payment_id)),
      ...(booking.special_requests ? [ownerRow('Special Requests', escHtml(booking.special_requests))] : []),
    ].join('')

    await Promise.all([
      resend.emails.send({
        from: `Maison Celeste <${FROM_EMAIL}>`,
        to: booking.guest_email,
        subject: `Payment Confirmed — ${booking.room_name}`,
        html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0E0E0E;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0E0E0E;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0E0E0E;">
      <tr><td style="background:#1C1C2E;padding:40px 48px;text-align:center;border-bottom:1px solid rgba(184,147,90,0.2);">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#B8935A;">Maison Celeste</p>
        <h1 style="margin:0;font-size:26px;font-weight:300;color:#F5EFE0;font-family:Georgia,serif;">Booking & Payment Confirmed</h1>
      </td></tr>
      <tr><td style="padding:40px 48px 0;">
        <p style="margin:0 0 16px;font-size:16px;color:#F5EFE0;">Dear ${escHtml(booking.guest_name)},</p>
        <p style="margin:0 0 36px;font-size:15px;color:rgba(245,239,224,0.65);line-height:1.8;">Your payment has been received and your reservation is confirmed. We look forward to welcoming you to the Alps.</p>
      </td></tr>
      <tr><td style="padding:0 48px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(184,147,90,0.25);padding:28px 28px 8px;">
          <tr><td colspan="2" style="padding-bottom:20px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#B8935A;">Booking Details</p>
          </td></tr>
          ${guestRows}
        </table>
      </td></tr>
      <tr><td style="padding:32px 48px;">
        <p style="margin:0 0 32px;font-size:13px;color:rgba(245,239,224,0.45);line-height:1.9;">
          To modify or cancel, contact us at least 48 hours before arrival at
          <a href="mailto:${OWNER_EMAIL}" style="color:#B8935A;text-decoration:none;">${OWNER_EMAIL}</a>
        </p>
      </td></tr>
      <tr><td style="padding:28px 48px;border-top:1px solid rgba(245,239,224,0.08);text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;color:rgba(245,239,224,0.35);">Maison Celeste &middot; Courchevel 1550, French Alps</p>
        <p style="margin:0;font-size:12px;color:rgba(245,239,224,0.35);">stackworkhq.com</p>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`,
      }),
      resend.emails.send({
        from: `Maison Celeste Bookings <${FROM_EMAIL}>`,
        to: OWNER_EMAIL,
        subject: `Payment Received — ${booking.room_name} · ${formatDate(booking.check_in)}`,
        html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:32px 16px;background:#F3F4F6;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB;">
    <tr><td style="background:#2C6E49;padding:24px 32px;">
      <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.65);letter-spacing:0.12em;text-transform:uppercase;">Payment Received</p>
      <h2 style="margin:0;font-size:22px;color:#fff;font-weight:600;">${escHtml(booking.room_name)}</h2>
    </td></tr>
    <tr><td style="padding:28px 32px 8px;">
      <table width="100%" cellpadding="0" cellspacing="0">${ownerRows}</table>
    </td></tr>
    <tr><td style="padding:24px 32px 32px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin"
         style="display:inline-block;padding:12px 24px;background:#B8935A;color:#fff;text-decoration:none;border-radius:4px;font-size:13px;font-weight:500;">
        View in Dashboard
      </a>
    </td></tr>
  </table>
</td></tr></table></body></html>`,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Verify error:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
