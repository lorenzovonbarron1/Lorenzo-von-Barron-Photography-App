# Lorenzo von Barron Photography

Dark luxury editorial portfolio site **and installable app (PWA)**.
Cinematic, restrained, expensive — Nike confidence, A24 restraint,
Vogue typography, Arizona grit.

**Look good. Move loud. Let them watch.**

## Stack

- [Next.js](https://nextjs.org) (App Router, static export)
- Cormorant Garamond (editorial serif) × Inter (system sans) via Google Fonts
- No CMS, no booking forms — all bookings route to **LYNK** per discipline
- Progressive Web App: manifest, brand icons, offline shell service worker

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build    # static export to /out
```

The service worker only registers in production builds. To test PWA
behavior locally, serve the export: `npx serve out`.

## Deploy

Push to the connected Vercel project (the repo is a static export —
any static host works). No environment variables are required.

## Install as an app

**iPhone:** Open the site in Safari → Share → **Add to Home Screen**.
It opens full-screen from the home screen with the LVB icon.

**Android:** Open the site in Chrome → menu → **Install App** (or
**Add to Home Screen**). Chrome may also show its own install prompt.

## Structure

- `lib/site-data.js` — **single source of truth** for all content: the 11
  portfolio disciplines (slugs are the shared contract with LYNK), the
  Selected Work slider, Journal entries, Working Class Stories, and menu.
  **LYNK URLs are configured here** (`LYNK_BASE` for per-discipline
  enquiries, `LYNK_HOME` for the general "Book via LYNK" CTA) — swap the
  placeholders when the real LYNK links land.
- `app/` — routes: `/` `/portfolio` `/journal` `/stories` `/about`
  `/contact` `/offline` (the offline shell served by the service worker)
- `components/EditorialImage.jsx` — every photo renders through this frame:
  consistent dark veil over real images, labeled editorial placeholder when a
  file is missing. The layout never breaks on missing assets.
- `components/PwaRegister.jsx` — registers the service worker (production only).

## Assets

- **Icons:** `public/icons/` (`icon-192.png`, `icon-512.png`,
  `maskable-icon-512.png`, `apple-touch-icon.png`). Brand-matched
  placeholders — see `public/icons/README.md` to replace them.
- **Hero video:** `public/videos/lvb-hero-reel.mp4` (poster at
  `public/images/hero/lvb-hero-reel-poster.jpg`).
- **Images:** `public/images/` — see `public/images/README.md` for the
  exact drop-in path of every photograph.
- **PWA:** `public/manifest.webmanifest` (identity, colors, icons) and
  `public/sw.js` (offline shell: precaches `/offline/`, cache-first for
  build assets, network-first for pages).

## Design system

Palette (in `app/globals.css`): void black `#050505`, warm white `#f4f0e8`,
muted `#a6a09a`, gold/champagne `#b89a62` (used sparingly), hairlines at 12%
warm white. Serif for statements, titles, quotes; sans for nav, labels,
metadata, body. Motion is near-invisible — slow reveals only; the page
breathes, it never performs. Safe-area insets (`env(safe-area-inset-*)`)
keep the nav, footer, and Emily clear of the iPhone notch and home
indicator when running as an installed app.

## Doctrine

Website/App = **showcase only**. LYNK = **booking agent only**.
No pricing, packages, booking forms, checkout, calendars, deposits, or
public rates live here — every enquiry CTA routes out to LYNK.
