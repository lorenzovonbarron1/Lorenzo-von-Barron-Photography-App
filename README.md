# Lorenzo von Barron Photography

Dark luxury editorial portfolio site. Cinematic, restrained, expensive —
Nike confidence, A24 restraint, Vogue typography, Arizona grit.

**Look good. Move loud. Let them watch.**

## Stack

- [Next.js](https://nextjs.org) (App Router, static export)
- Cormorant Garamond (editorial serif) × Inter (system sans) via Google Fonts
- No CMS, no booking forms — all bookings route to **LYNK** per discipline

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to /out
```

## Structure

- `lib/site-data.js` — **single source of truth** for all content: the 11
  portfolio disciplines (slugs are the shared contract with LYNK), the
  Selected Work slider, Journal entries, Working Class Stories, and menu.
  When LYNK adds or renames a vertical, update this one file.
- `app/` — routes: `/` `/portfolio` `/journal` `/stories` `/about` `/contact`
- `components/EditorialImage.jsx` — every photo renders through this frame:
  consistent dark veil over real images, labeled editorial placeholder when a
  file is missing. The layout never breaks on missing assets.
- `public/images/README.md` — exact drop-in paths for all photography.

## Design system

Palette (in `app/globals.css`): void black `#050505`, warm white `#f4f0e8`,
muted `#a6a09a`, gold/champagne `#b89a62` (used sparingly), hairlines at 12%
warm white. Serif for statements, titles, quotes; sans for nav, labels,
metadata, body. Motion is near-invisible — slow reveals only; the page
breathes, it never performs.
