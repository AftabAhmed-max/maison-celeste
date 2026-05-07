import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

// Resend initialised lazily inside handler to avoid build-time errors

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'owner@maisonceleste.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid rgba(245,239,224,0.07);font-size:13px;color:rgba(245,239,224,0.45);letter-spacing:0.04em;width:40%;vertical-align:top;">${label}</td>
      <td style="padding:11px 0;border-bottom:1px solid rgba(245,239,224,0.07);font-size:13px;color:#F5EFE0;font-weight:500;text-align:right;vertical-align:top;">${value}</td>
    </tr>`
}

function ownerRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #F3F4F6;font-size:13px;color:#6B7280;width:40%;vertical-align:top;">${label}</td>
      <td style="padding:11px 0;border-bottom:1px solid #F3F4F6;font-size:13px;color:#111827;font-weight:500;text-align:right;vertical-align:top;">${value}</td>
    </tr>`
}

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await req.json()
    const { guest_name, guest_email, room_name, check_in, check_out, guests, nights, total_price, special_requests } = body

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    const guestRows = [
      detailRow('Room', room_name),
      detailRow('Check-in', formatDate(check_in)),
      detailRow('Check-out', formatDate(check_out)),
      detailRow('Duration', `${nights} night${nights > 1 ? 's' : ''}`),
      detailRow('Guests', `${guests} guest${Number(guests) > 1 ? 's' : ''}`),
      detailRow('Total', `€${Number(total_price).toLocaleString()}`),
      ...(special_requests ? [detailRow('Special Requests', special_requests)] : []),
    ].join('')

    const ownerRows = [
      ownerRow('Guest Name', guest_name),
      ownerRow('Email', guest_email),
      ownerRow('Room', room_name),
      ownerRow('Check-in', formatDate(check_in)),
      ownerRow('Check-out', formatDate(check_out)),
      ownerRow('Duration', `${nights} night${nights > 1 ? 's' : ''}`),
      ownerRow('Guests', `${guests} guest${Number(guests) > 1 ? 's' : ''}`),
      ownerRow('Total', `€${Number(total_price).toLocaleString()}`),
      ...(special_requests ? [ownerRow('Special Requests', special_requests)] : []),
    ].join('')

    const guestEmail = resend.emails.send({
      from: `Maison Celeste <${FROM_EMAIL}>`,
      to: guest_email,
      subject: `Booking Confirmed — ${room_name}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0E0E0E;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0E0E0E;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0E0E0E;">

      <!-- Header -->
      <tr><td style="background:#1C1C2E;padding:40px 48px;text-align:center;border-bottom:1px solid rgba(184,147,90,0.2);">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#B8935A;">Maison Celeste</p>
        <h1 style="margin:0;font-size:26px;font-weight:300;color:#F5EFE0;font-family:Georgia,serif;">Reservation Confirmed</h1>
      </td></tr>

      <!-- Greeting -->
      <tr><td style="padding:40px 48px 0;">
        <p style="margin:0 0 16px;font-size:16px;color:#F5EFE0;">Dear ${guest_name},</p>
        <p style="margin:0 0 36px;font-size:15px;color:rgba(245,239,224,0.65);line-height:1.8;">Your reservation at Maison Celeste is confirmed. We look forward to welcoming you to the Alps.</p>
      </td></tr>

      <!-- Booking Details -->
      <tr><td style="padding:0 48px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(184,147,90,0.25);padding:28px 28px 8px;">
          <tr><td colspan="2" style="padding-bottom:20px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#B8935A;">Booking Details</p>
          </td></tr>
          ${guestRows}
        </table>
      </td></tr>

      <!-- Note -->
      <tr><td style="padding:32px 48px;">
        <p style="margin:0 0 32px;font-size:13px;color:rgba(245,239,224,0.45);line-height:1.9;">
          To modify or cancel your reservation, please contact us at least 48 hours before arrival at
          <a href="mailto:${OWNER_EMAIL}" style="color:#B8935A;text-decoration:none;">${OWNER_EMAIL}</a>
        </p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:28px 48px;border-top:1px solid rgba(245,239,224,0.08);text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;color:rgba(245,239,224,0.35);">Maison Celeste &middot; Courchevel 1550, French Alps</p>
        <p style="margin:0;font-size:12px;color:rgba(245,239,224,0.35);">stackworkhq.com</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
    })

    const ownerEmail = resend.emails.send({
      from: `Maison Celeste Bookings <${FROM_EMAIL}>`,
      to: OWNER_EMAIL,
      subject: `New Booking — ${room_name} · ${formatDate(check_in)}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:32px 16px;background:#F3F4F6;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB;">

      <!-- Header -->
      <tr><td style="background:#B8935A;padding:24px 32px;">
        <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.65);letter-spacing:0.12em;text-transform:uppercase;">New Booking Received</p>
        <h2 style="margin:0;font-size:22px;color:#ffffff;font-weight:600;">${room_name}</h2>
      </td></tr>

      <!-- Details -->
      <tr><td style="padding:28px 32px 8px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${ownerRows}
        </table>
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:24px 32px 32px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin"
           style="display:inline-block;padding:12px 24px;background:#B8935A;color:#ffffff;text-decoration:none;border-radius:4px;font-size:13px;font-weight:500;letter-spacing:0.05em;">
          View in Dashboard
        </a>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
    })

    await Promise.all([guestEmail, ownerEmail])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
