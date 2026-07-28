# LYNK Move Desk — Codebase Recon & Implementation Plan

**Status:** pre-build. Awaiting approval + decisions before any broad changes.
**Demo agent:** Emily (white-label; Savaughna/Kimberley = config swap).

---

## 0. The one thing to resolve first (product/repo mismatch)

The repo open in this session is **Lorenzo von Barron *Photography*** — a dark-luxury
photo portfolio whose `/lynk` route is a *photography booking* agent. It is **not**
a real-estate MVP. The real-estate "Savaughna Move Desk" lives separately (a
`chatgpt.site` build). So "transform the existing MVP in this folder" needs a
decision: there is no real-estate MVP in this folder to transform — there's a
photography site with an excellent, reusable design system.

**Three options:**
- **A — Standalone app (recommended).** New Next.js app (its own repo/deploy) for Move Desk. Copy the Superleggera design tokens as a starting skin. Clean separation; no risk to Lorenzo's live photography site; server routes allowed.
- **B — Route group inside this repo.** Build Move Desk under a namespace (e.g. `/desk`) sharing `globals.css`. Fast to reuse the design system, but couples a real-estate product to a photographer's static-export site and collides with the `/lynk` name.
- **C — Point me at the real Move Desk repo.** If Savaughna's build is in a GitHub repo, I target that instead and this photography repo is irrelevant.

Everything below assumes **A or B**. The phasing is identical either way; only the home changes.

---

## 1. Existing stack

| Layer | Current |
|---|---|
| Framework | **Next.js 15.3** App Router, **React 19** |
| Language | **JavaScript / JSX — no TypeScript** |
| Styling | Plain CSS, one **1,873-line `globals.css`** with a mature token system ("Superleggera": Obsidian / Chrome / Scarlet). No Tailwind, no CSS-in-JS. |
| Fonts | Cormorant Garamond (editorial serif) + Inter (Google Fonts) |
| Build | **Static export** (`output:"export"`, `images:{unoptimized}`, `trailingSlash`) → `/out`. **No server, so no API routes / server actions.** |
| Backend seam | **Supabase only** — client-side *insert-only* via anon key + RLS; localStorage backup; silently no-ops when env unset. |
| Deps | Only `next`, `react`, `react-dom`. Deliberately zero bloat. |

**Two hard implications for the brief:**
1. The brief asks for **TypeScript** and a **mocked `/api/lead` route + Auto-Brief API**. Static export can't serve API routes. → *server-target decision below.*
2. The brief asks for **clean TypeScript types**. Repo is JS. → *TS decision below.*

## 2. Existing routes / components / assets

**Routes:** `/` (OrbitGateway entrance), `/home`, `/portfolio`, `/journal`, `/stories`, `/about`, `/contact`, `/lynk`, `/lynk/[category]`.

**Components:** `SiteChrome` (nav + "Emily" concierge pill), `Footer`, `HeroReel`, `SelectedWorkReel`, `EditorialImage`, `OrbitGateway` (256-line CSS-3D orbit, rAF-driven, reduced-motion collapse), `lynk/PackageTile` (289-line form w/ validation).

**Data:** `lib/site-data.js` (content SoT), `lib/lynk-data.js` (packages/pricing/copy), `lib/lynk-submissions.js` (delivery layer), `supabase/lynk_submissions.sql`.

**Assets in-repo:** one automotive photo; everything else is `.gitkeep` placeholders rendered through `EditorialImage`.

**Emily assets you supplied (5):** 2 clean square headshots (purple bg) ✅ agent avatar; 1 full-body studio (green bg) ✅; 1 four-view ortho set (front/¾/profile/back) ✅ great for consistent generated imagery; 1 "Working Class Marketing"-branded desk shot ⚠️ off-brand for real estate (WCM signage) — use only if cropped/repurposed. **No property/listing media at all.**

## 3. What can be reused (high value — preserve, don't rebuild)

- **The Superleggera design system** (tokens, motion doctrine, `prefers-reduced-motion` handling, `.eyebrow`, lighting levels). Genuinely premium; it *is* the "$1M feel." Reuse as the Move Desk skin.
- **`EditorialImage`'s missing-asset fallback** — perfect for a listing gallery before real photos exist; the layout never breaks. Reuse verbatim (rename per product).
- **`lynk-submissions.js` delivery pattern** (localStorage + insert-only Supabase + graceful degrade + normalized record) → the exact backbone for the **lead pipeline**.
- **Supabase RLS insert-only pattern** → reuse for `leads` table.
- **`PackageTile` form patterns** — validation, accessible labels, error states → reuse for buyer/seller intake.
- **`OrbitGateway` motion technique** (rAF + refs, React state only on settle, reduced-motion static fallback) → the blueprint for the **Step Inside** scroll cinema.

## 4. What needs refactoring / building new

- **Agent config layer (new).** Emily is currently a hardcoded concierge label, not a white-label `AgentProfile`. Build a single typed config object (name, portraits, video, colors, territory, brokerage, license, contact, lender, QR source).
- **TypeScript (new).** Introduce TS for all Move Desk code (Next runs `.tsx` alongside `.jsx`).
- **Server target (change).** To honor real lead delivery (`/api/lead`, Resend, Twilio, Auto-Brief API), move off pure static export to a server/serverless target — *or* keep static + client Supabase insert (the proven pattern here) and add serverless later. Recommendation below.
- **Listing model + Step Inside (new).** Cinematic scroll sequence, asset approval states (`approved|draft|ai-assisted|photo|video`), "Cinematic Listing Preview" labeling.
- **My Move Desk (new).** Demo magic-link private area, structured for real auth later.
- **Auto-Brief (new).** Typed payload + `recommendAction()` + agent preview UI.
- **Compliance layer (new).** EHO/brokerage/license slots, TCPA checkbox, privacy page, factual-only neighborhood (no scores).
- **`/lynk` name collision.** That route is photography booking; Move Desk needs its own namespace.

## 5. Proposed information architecture (Move Desk)

```
/                    Emily's Move Desk (home) — 3 primary paths + featured listing story
/step-inside/[id]    Cinematic listing experience (one featured property)
/buy                 Buyer: Book/Text first → optional "Help Me Plan My Move" → confirm
/sell                Seller: guided strategy intake → Request My Strategy Call → confirm
/talk                Fast contact: text / call / request a time (no form wall)
/my-desk             My Move Desk (demo magic-link private area)
/agent/brief         Auto-Brief preview (protected/demo agent console)
/privacy             Privacy policy + SMS/TCPA disclosure
+ persistent mobile "Text Emily" sticky action on every screen
+ site-wide footer: brokerage · license · Equal Housing Opportunity · privacy
```

**Config-driven:** `lib/agent.config.ts` (agent/brokerage/lender/colors/territory),
`lib/listings.ts` (listing + asset approval states), `lib/leads.ts` (types + delivery),
`lib/autobrief.ts` (payload + recommendation). New agent = edit config, not components.

## 6. Phased implementation plan

**Phase 0 — Foundation (no user-visible change).** TS config, agent/listing/lead types, agent config object seeded with Emily, design tokens ported, base layout + sticky contact + compliance footer, `EditorialImage` port. *Gate: builds clean, Emily config swappable.*

**Phase 1 — Home + Talk (the lead-capable core).** Emily hero, 3 primary paths, featured listing card, "How it works," `/talk` fast path (real tel:/sms: + request-a-time). *Gate: a stranger can reach Emily in one tap.*

**Phase 2 — Buyer flow + lead engine.** `/buy` with Book/Text-first ordering, optional plan intake (only the allowed fields), TCPA consent, submitted/confirmation/failure states, lead delivery (Supabase insert now; email/SMS seam ready), Auto-Brief payload + `recommendAction()`. *Gate: submit → lead recorded + honest confirmation + brief generated.*

**Phase 3 — Step Inside (flagship).** Scroll-driven cinematic sequence, asset approval states, "Cinematic Listing Preview" labeling, static/reduced-motion fallback, factual neighborhood layer (commute / essentials / official school links only), request-a-showing CTA. *Gate: cinematic on iPhone, degrades to static, zero invented facts.*

**Phase 4 — Seller flow.** Guided strategy intake (exact questions), Request My Strategy Call, confirmation, seller Auto-Brief. No automated valuation. *Gate: seller brief reaches agent.*

**Phase 5 — My Move Desk + Agent console.** Demo private area (saved home, next step, tour/call, notes, message, checklist) via demo magic-link; Auto-Brief preview console. *Gate: structured for real auth/CRM later.*

**Phase 6 — Polish + launch gate.** iPhone QA, keyboard/a11y, reduced motion, empty/invalid states, README, env list, mocked-vs-live checklist, launch-gate checklist.

Each phase is independently reviewable; nothing destructive lands without your approval per phase.

## 7. Decisions I need from you

1. **Home for the build:** Standalone app (A, recommended) · route group in this repo (B) · point me at the real Move Desk repo (C)?
2. **TypeScript** for Move Desk code (recommended yes)?
3. **Lead delivery target:** ship-fast **static + client Supabase insert** (proven here; email/SMS added later via serverless) — or **server target now** (enables `/api/lead` + Resend/Twilio server-side)?
4. **Accent color:** three are in play — repo **Scarlet**, LYNK brief **electric orange**, Emily's photos read **purple/violet**. Which is LYNK DNA for this build?

## 8. Missing assets I need from you

1. **Property/listing photos** — *the #1 blocker for Step Inside.* Need approved exterior / entry / living / kitchen / primary suite / backyard shots (+ floor plan ideally). Until then I ship clearly-labeled placeholders via `EditorialImage`.
2. **Listing facts** — real (authorized) or explicit-demo address, price, beds/baths/sqft, features. Confirm whether to use the wiki's demo listing (616 E Krista Way, $615K, 3/2/1,849) labeled "sample."
3. **Brokerage + license + contact** — real values for production, or confirm placeholders for demo (I will not invent a real license #/brokerage).
4. **Emily video** — greeting + thank-you vertical clips, or confirm placeholder-for-now.
5. **Lender partner** — named licensed lender for the referral workflow, or placeholder.
6. **Logo/wordmark** for LYNK Move Desk / the agent.
7. **Territory + contact details** (phone/email/service area) for Emily's demo config.

## 9. Compliance guardrails (baked in from Phase 0)

EHO disclosure area · brokerage/license slots · TCPA checkbox unchecked by default · privacy link · SMS disclosure language · **no** safety/best-schools/family-friendly/demographic/desirability scoring · neighborhood limited to commute anchors, essentials proximity, official school links + verification notice · AI listing media never "approved" by default and labeled "Cinematic Listing Preview," never "Matterport"/"3D tour." No invented MLS facts.
