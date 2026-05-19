# Maison Celeste — Boutique Hotel Website

> Where the mountains remember you.

🌐 **Live Site:** [maison-celeste.vercel.app](https://maison-celeste.vercel.app/)

---

## About

Maison Celeste is a fictional luxury boutique hotel website built as a 
portfolio showcase project for Stackwork. Set in Courchevel 1550 in the 
French Alps, it demonstrates a fully cinematic web experience with real 
booking functionality, a Supabase backend, and a protected owner admin 
dashboard. This is the most technically and visually complex project in 
the Stackwork portfolio.

---

## Pages

- **Home** — Cinematic hero with GSAP text reveal, marquee strip, rooms 
showcase, experiences, testimonials
- **Rooms** — All 14 rooms with availability status, pricing, and 
category filters
- **Room Detail** — Image gallery with lightbox, amenities, availability 
calendar, and booking form
- **Experiences** — Hotel amenities and curated guest experiences
- **Gallery** — Full immersive photo gallery
- **About** — Lodge history and story
- **Contact** — Inquiry form with OpenStreetMap embed
- **Admin Dashboard (/admin)** — Protected dashboard for owner to manage 
bookings and room availability

---

## Key Features

- Real booking system writing to Supabase database
- Owner admin dashboard with booking management and room toggle
- GSAP scroll-triggered cinematic animations throughout
- Lenis ultra-smooth custom scroll
- Grain texture overlay on atmospheric sections
- Dynamic room detail pages with availability calendar
- Fully responsive across mobile, tablet, and desktop

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | Framework and dynamic routing |
| Tailwind CSS v4 | Styling |
| GSAP | Scroll-triggered animations |
| Lenis | Smooth scroll |
| Supabase | Database for rooms and bookings |
| Unsplash | Photography |
| Vercel | Deployment |

---

## Database Setup

Two Supabase tables required — rooms and bookings.
See `/supabase/schema.sql` in the repo for the exact SQL to create both 
tables and seed initial room data.

---

## Environment Variables

Create a `.env.local` file with all of the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend (transactional email)
RESEND_API_KEY=your_resend_api_key
OWNER_EMAIL=your_email_address
FROM_EMAIL=onboarding@resend.dev

# Razorpay (payment gateway)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Admin dashboard
ADMIN_PASSWORD=your_secure_admin_password

# App URL (used in email templates)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Running Locally

```bash
git clone https://github.com/AftabAhmed-max/maison-celeste.git
cd maison-celeste
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Part of Stackwork Portfolio

This project is a demo built by 
**[Stackwork](https://stackwork.netlify.app/)** — a digital agency 
serving businesses across India and the Gulf.
