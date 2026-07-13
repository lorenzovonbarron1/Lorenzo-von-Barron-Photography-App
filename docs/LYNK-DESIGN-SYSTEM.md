# LYNK Design System — Superleggera

**Codename:** Superleggera · **v1.1 (Scarlet revision)** · Flagship implementation: Lorenzo von Barron Photography (showcase site)

> **v1.1 — Tier 2 Scarlet revision:** Burnt Copper is retired as the visible
> brand accent. Every former copper role now maps to the Scarlet scale; the
> identity is Obsidian / Chrome / Scarlet. Sections below are updated in
> place; the copper token *names* survive in `globals.css` as aliases
> pointing at Scarlet so no component selector needed to change.

Same house. New armor. This document records the visual language applied in the
`design/lynk-superleggera-v1` pass — a material/lighting reskin of the existing
Editorial Luxury site, not a rebuild. Routes, copy, layout geometry, the LYNK
booking agent, and Supabase submission pipeline are unchanged.

---

## Brand philosophy

Ducati product storytelling × Leica industrial restraint × Apple interaction
clarity × Nike confidence × Vogue editorial hierarchy — built on Lorenzo von
Barron's existing Chicano/working-class brand spine and Arizona grit.

> Every experience begins with the tool and ends with the human.

The visitor may first notice the craftsmanship — lighting, material, motion —
but should leave thinking *"I trust Lorenzo to tell my story."* Restraint is
the luxury. Scarlet is ignition, not wallpaper.

---

## Palette

### Foundations — Obsidian / Carbon / Graphite

| Token | Hex | Use |
|---|---|---|
| `--obsidian` | `#050505` | Global background |
| `--soft-obsidian` | `#090909` | Secondary dark surface |
| `--carbon` | `#101010` | Image-well background, panels |
| `--graphite` | `#191919` | Reserved for future tile surfaces |
| `--elevated-graphite` | `#222222` | Reserved for hover/active surfaces |

### Chrome — engineering, structure, primary typography

| Token | Hex | Use | Contrast on Obsidian |
|---|---|---|---|
| `--chrome-dark` | `#686D71` | Hairline borders, icons — **not small text** (3.9:1, AA-large only) | 3.90:1 |
| `--chrome-mid` | `#B8BDC1` | Secondary/body text | 10.76:1 |
| `--chrome-light` | `#E7EAEC` | Primary text | 16.87:1 |
| `--chrome-highlight` | `#F5F7F8` | Rare high-key highlight | 18.97:1 |

### Scarlet — the primary accent (v1.1)

| Token | Hex | Use | Contrast on Obsidian |
|---|---|---|---|
| `--scarlet-dark` | `#8E1118` | Dividers, decorative fills, non-text accents only | 2.18:1 (non-text use only) |
| `--scarlet` | `#D71920` | Large text (≥18px), lighting sweeps, borders, decorative accents | 3.93:1 |
| `--scarlet-soft` | `#E04A50` | **Default readable scarlet** — labels, numbers, links, prices | 5.11:1 |
| `--scarlet-bright` | `#F02A30` | Hover/emphasis, Emily's status dot, ignition seeds | 4.93:1 |

**Size-based policy (unchanged in spirit from the copper era):** Scarlet
Core (`#D71920`) reads under WCAG AA-normal (4.5:1) at the 11–13px sizes
this system uses for eyebrows and numbers, so it is reserved for large
text and non-text accents. `--scarlet-soft` carries every small readable
scarlet label; `--scarlet-bright` is the hover/emphasis/status step.

### Retired — Burnt Copper

The v1 copper scale (`#71381F` / `#A85D35` / `#C77A4A` / `#D89660`) is no
longer rendered anywhere. The token *names* remain in `globals.css` as
aliases into the Scarlet scale (`--copper-light: var(--scarlet-soft)`,
etc.) so no component selector had to change. Do not point them back at
warm hues.

**Ratio in practice:** roughly 75% Obsidian/Carbon, 18% Chrome/neutral,
7% Scarlet or less. Authoritative and editorial, never loud or sporty —
no full-red panels, no permanent glows, no gradient clouds.

### Cool neutral text, not warm cream

The original palette used a warm cream (`#f4f0e8`) and warm muted gray
(`#a6a09a`) for text, plus warm-tinted `rgba()` literals scattered through
several component rules. All of these are now routed through the cool
Chrome scale (`--chrome-light` / `--chrome-mid`), including the `rgba()`
literals that weren't going through a token before (hero outline stroke,
placeholder labels, footer/contact/journal secondary text, Emily's chip
and placeholder text). Nothing in the showcase site renders warm-white
or warm-gray text anymore.

---

## Legacy token map

Every component still references the original token names. Rather than
touch each selector, the old names are remapped once in `:root` — a clean,
fully-migrated mapping (not a half-finished one):

```
--black:       var(--obsidian)
--soft-black:  var(--soft-obsidian)
--charcoal:    var(--carbon)
--white:       var(--chrome-light)
--muted:       var(--chrome-mid)
--gold:        var(--copper-light)   /* → --scarlet-soft via alias chain */
--gold-bright: var(--copper-glow)    /* → --scarlet-bright */
--burgundy:    var(--copper-dark)    /* → --scarlet-dark */
--line:        rgba(231, 234, 236, 0.12)   /* was warm-white based */
--line-soft:   rgba(231, 234, 236, 0.07)
```

If a future pass wants to fully rename `--gold` → `--scarlet-soft` etc. at
the call sites, this table is the reference; there is no rush, since the
remap is already clean.

---

## Typography

**Two fonts, three voices.** No third typeface was introduced — Cormorant
Garamond and Inter each do more than one job, which is the more disciplined,
timeless choice (see: Apple's restraint doctrine).

| Voice | Font | Used for |
|---|---|---|
| **Editorial** | Cormorant Garamond, weight 300, italic accents | Hero statement backdrop copy, the Creed, page titles, discipline names, quotes, About's lead line |
| **Engineering** | Inter | Navigation, body copy, metadata, the Technical Label style (below) |
| **Action** | Inter, bold, short/command-oriented | Reserved for primary conversion CTAs — lives in LYNK (`Send the Mission`, `Book This Package`), not introduced to the showcase site this pass |

### Technical Label

A single reusable style (`.eyebrow` — same class name, no markup changed)
now carries the lens-engraving aesthetic across every eyebrow, number, and
kicker on the site:

```css
.eyebrow {
  font-family: var(--font-sans);   /* Inter */
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--chrome-mid);
  font-variant-numeric: tabular-nums;
}
.eyebrow--gold { color: var(--gold); }  /* scarlet-soft — premium/accent labels */
```

Think: Leica lens engravings, Apple packaging, a Porsche dashboard. Not a
NASA terminal, not hacker-code monospace.

---

## Lighting Doctrine

Not every section deserves the same visual intensity — luxury comes from
contrast, and attention should rise and fall like a film, not shout from
top to bottom. Three levels, mapped onto the showcase site's six routes
and shared chrome:

### Level 3 — Showcase
Directional light, restrained scarlet edge illumination, exhibit-tile
framing — controlled red reflection on black metal, never neon.

- **Hero** — a one-shot chrome→scarlet diagonal light sweep on load (`.hero::before`,
  `@keyframes lvb-sweep`, 2.4s, plays once, `var(--ease-superleggera)`), and a
  bright scarlet seed at the top of the scroll-cue line, settling into core scarlet.
- **Selected Work** (home page's Featured Work reel) — hovering a frame gives
  a restrained 1.5% scale and a 1px scarlet edge + deepened shadow. Never a
  continuous glow.
- **Emily** (concierge, present on every route) — obsidian pill, scarlet
  hairline border, scarlet label, bright-scarlet status dot. Never solid red.
- **Portfolio introduction** — the `/portfolio` page header carries a
  `page-header--showcase` modifier class (the one small, documented
  structural addition in this pass — a single className, no DOM change)
  giving its title a whisper of scarlet edge-light, distinguishing it from
  the calmer discipline list below.

### Level 2 — Premium
Subtle scarlet accents, hairline chrome, gentle lighting, no continuous motion.

- Portfolio's discipline blocks (hairline chrome edge appears on hover of
  the hero image — no scale, unlike Level 3)
- About
- Working Class Stories
- The Creed
- The Menu overlay (a hairline chrome divider now separates each item's
  number from its name)

### Level 1 — Quiet
Clean Obsidian, subtle Chrome text, hairline borders, minimal motion.

- Journal
- Contact
- Footer
- Nav (deliberately understated everywhere via `mix-blend-mode: difference`,
  unchanged from the original spec)

**Note on judgment calls:** the brief named Hero, Portfolio introduction,
Featured Work, LYNK, Emily, and Booking explicitly as Level 3, and Footer,
Contact, and Journal explicitly as Level 1 (with LYNK/Booking excluded from
this pass by scope decision). The Creed, Working Class Stories, About, and
the Menu overlay weren't named in either list — this document places them
at Level 2 as the best fit for their emotional/human-storytelling register
(warmer than Quiet, calmer than Showcase). Revisit if that reads wrong in
review.

---

## Motion Doctrine

- `--ease-superleggera: cubic-bezier(0.16, 1, 0.3, 1)` — the one approved
  easing curve for weighted, physically believable motion.
- `--motion-fast: 0.35s` / `--motion-medium: 0.55s` — the two durations
  already in use across the site, now named as tokens.
- Every new motion in this pass is a **one-shot entrance or a hover state** —
  nothing loops, nothing bounces, nothing continuously glows.
- The site-wide `prefers-reduced-motion` rule (already present, unchanged)
  zeroes all animation/transition durations to `0.01ms`, so every new rule
  in this pass (the hero sweep, the Selected Work hover, the discipline
  hover) automatically degrades to a static, fully-functional state — no
  separate reduced-motion CSS was needed.

---

## Hero Asset — current state and the future rotating-object hero

**Current:** the existing `lvb-hero-reel.mp4` / poster / "Look Good. Move
Loud. Let Them Watch." statement is unchanged — only its visual treatment
changed (the light sweep, the scroll-cue ignition detail, cool-toned outline
stroke). No placeholder object was fabricated for the rotating iPhone+lens
hero described in the brief; that would mean shipping and later discarding
a fake asset.

**Future:** `HERO_ROTATING_OBJECT` is documented in `lib/site-data.js`,
ready for the final Grok-generated asset:

| Field | Spec |
|---|---|
| File | `/public/videos/lvb-hero-rotating-object.mp4` |
| Codec | H.264 (yuv420p); optional `.webm` (VP9) alternate |
| Resolution | 2160×2160 (1:1) source |
| Duration | 6–8s for one full 360° rotation |
| Loop | Seamless — first/last frame must match exactly |
| Audio | None (muted autoplay needs no audio track) |
| Poster | `/public/images/hero/lvb-hero-rotating-object-poster.jpg` — front 3/4 view, lens visible |
| Mobile | Same file, or a lighter `-mobile.mp4` cut (branching logic not yet implemented) |
| Reduced motion | Poster only, no autoplay — reuses `HeroReel.jsx`'s existing failed/missing-video → `EditorialImage` fallback path |
| No-video fallback | `EditorialImage` renders the poster; if that's also missing, the standard dark editorial placeholder appears — never a broken frame |

To activate: swap the `HERO` import in `components/HeroReel.jsx` for
`HERO_ROTATING_OBJECT` (or merge its fields into `HERO`) once the asset
exists. The component's video props already match this spec.

---

## Accessibility

- Every new/changed color combination was verified against WCAG 2.1 AA
  using the actual background it appears on (Obsidian, Carbon, or
  Graphite) and its actual in-app font size — see the Palette contrast
  table above.
- `--chrome-dark` and `--scarlet`/`--scarlet-dark` are explicitly restricted
  to large text or non-text uses (borders, dividers, icons) since they
  fall under 4.5:1 at small sizes.
- All warm-toned `rgba()` literals that weren't previously routed through
  a token (several were — see "Cool neutral text" above) are now cool
  Chrome-based, closing a gap the original "zero hardcoded hex" audit
  missed (that audit only searched for `#hex`, not `rgba()`).
- Reduced-motion handling is unchanged and already comprehensive; every
  new animation/transition in this pass inherits it automatically.
- No new interactive elements were added, so no new focus/keyboard-nav
  surface was introduced. Existing semantics (`role`, `aria-label`,
  `aria-expanded`) are untouched.

---

## What was deliberately preserved

Routes, route hierarchy, nav content/order, all copy (Creed, About,
Journal, Stories, Portfolio disciplines, LYNK packages/pricing/forms),
`lib/site-data.js` and `lib/lynk-data.js` data shape and content, LYNK
URLs/slugs, the Supabase submission pipeline, image-fallback *behavior*
(only its color skin changed), component architecture and props, static
export config, and existing accessibility semantics.

## Scope note — LYNK booking agent

`/lynk` and `/lynk/[category]` were left cosmetically as-is this pass by
explicit decision, even though they share this same token layer and will
inherit the Obsidian/Chrome/Scarlet recoloring automatically through
`app/globals.css`. No LYNK-specific selector (`.lynk-*`) or the hardcoded
`rgba()` literals inside them were touched. A dedicated LYNK reskin pass —
including its own Level 3 "Showcase" treatment per the brief — is a
natural follow-up once this pass is reviewed.

## Future implementation guidance

- If further Level 3 moments are wanted (e.g. a persistent active-nav
  scarlet marker), the brief allows it as optional ("if visually
  necessary") — none was added this pass since the current nav has no
  structural hook for per-route state without adding markup.
- `--graphite` / `--elevated-graphite` are defined but not yet used —
  reserved for a future exhibit-tile surface treatment if the Journal or
  Stories cards ever move from borderless to panelled.
- When the LYNK reskin happens, reuse this same token layer — do not
  introduce a second palette.
