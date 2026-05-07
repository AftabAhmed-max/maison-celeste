import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

// Resend initialised lazily inside handler to avoid build-time errors

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'owner@maisonceleste.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #F3F4F6;font-size:13px;color:#6B7280;width:38%;vertical-align:top;">${label}</td>
      <td style="padding:11px 0;border-bottom:1px solid #F3F4F6;font-size:13px;color:#111827;font-weight:500;text-align:right;vertical-align:top;">${value}</td>
    </tr>`
}

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await req.json()
    const { name, email, phone, message } = body

    await resend.emails.send({
      from: `Maison Celeste Enquiry <${FROM_EMAIL}>`,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `New Enquiry — ${name}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:32px 16px;background:#F3F4F6;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB;">

      <!-- Header -->
      <tr><td style="background:#0D1B3E;padding:24px 32px;">
        <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.12em;text-transform:uppercase;">Contact Enquiry</p>
        <h2 style="margin:0;font-size:22px;color:#ffffff;font-weight:500;">${name}</h2>
      </td></tr>

      <!-- Contact Details -->
      <tr><td style="padding:28px 32px 8px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${row('Email', `<a href="mailto:${email}" style="color:#B8935A;text-decoration:none;">${email}</a>`)}
          ${phone ? row('Phone', phone) : ''}
        </table>
      </td></tr>

      <!-- Message -->
      <tr><td style="padding:0 32px 28px;">
        <p style="margin:0 0 10px;font-size:11px;color:#9CA3AF;letter-spacing:0.1em;text-transform:uppercase;">Message</p>
        <div style="background:#F9FAFB;border-radius:6px;padding:20px;border:1px solid #F3F4F6;">
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.8;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      </td></tr>

      <!-- Footer note -->
      <tr><td style="padding:16px 32px 28px;border-top:1px solid #F3F4F6;">
        <p style="margin:0;font-size:12px;color:#9CA3AF;">Reply directly to this email to respond to ${name}.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact email error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
