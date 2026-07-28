# LYNK Move Desk

A white-label, mobile-first real-estate **concierge & lead engine** — not a
Zillow clone. A QR scan or link becomes a guided property story, a buyer/seller
conversation, a prepared first contact, and an agent-facing Auto-Brief.

**Demo agent:** Emily. Every agent identity is configuration — swap the object
in `lib/agent.config.ts` and the whole product re-skins.

> Standalone app. It does **not** import from or depend on the photography site
> it currently sits beside; it is ready to move into its own repository.

## Run

```bash
cd move-desk
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # strict TypeScript, no emit
npm run build      # production build (server target)
```

Node 18.18+ (Next 15). Server-capable target — deploy to any Node host
(Vercel, Fly, a container). Not a static export: `/api/lead` runs server-side.

## What's here (routes)

| Route | Purpose |
|---|---|
| `/` | Emily's Move Desk — hero, 3 paths, featured listing story, how it works |
| `/step-inside/[id]` | Cinematic scroll listing + factual neighborhood + tour CTA |
| `/buy` | Buyer: text/tour first, then optional "Help me plan" intake |
| `/sell` | Seller: guided strategy intake → request a strategy call |
| `/talk` | Fast contact — text / call / email / request a time |
| `/my-desk` | My Move Desk (demo private area; magic-link-ready) |
| `/agent/brief` | Demo Agent Console — Auto-Brief previews |
| `/privacy` | Privacy + TCPA/SMS consent (placeholder copy) |
| `/api/lead` | Lead engine — validate → Auto-Brief → persist → notify → confirm |

Every screen carries a persistent "Text Emily" sticky action and the
compliance footer (brokerage · license · Equal Housing · privacy).

## Swap the agent (white-label)

Edit `lib/agent.config.ts` → the `EMILY` object (or add a new `AgentProfile`
and point `AGENT` at it): name, portraits, phone, email, brokerage, license,
territory, lender partner, campaign source, privacy, and the agent's personal
accent. **The product accent stays LYNK electric orange** — the agent accent
(`accent`) only styles the portrait ring / identity pill.

## Swap listing photos (asset workflow)

Listings live in `lib/listings.ts`. Each asset has `{ src?, source, approval,
label, caption }`. With no `src` it renders a **clearly-labeled placeholder** —
the layout never breaks and no false claim is made. To go live: drop files in
`/public/listings/<id>/`, set `src`, `source: "photo"`, `approval: "approved"`.

- AI motion must use `source: "ai-assisted"` → auto-labeled **"Cinematic Listing
  Preview."** Never labeled Matterport / 3D tour / verified documentation.
- Nothing is `approved` by default; no MLS facts are invented; demo listings
  are flagged `isDemo`.

## Campaign attribution (QR / social / flyer)

Any landing URL may carry `?src=`, `utm_source`, `utm_medium`, `utm_campaign`,
and `listing`. First touch is captured client-side (sessionStorage) and
survives the whole journey; the full attribution lands on every lead and
Auto-Brief and is displayed in the Agent Console. Example QR target:
`/step-inside/616-krista?src=sign-616krista&utm_medium=yard-sign`.

## Mocked vs. live

Full per-variable contract: `docs/INTEGRATIONS.md`. Agent alert overrides:
`AGENT_NOTIFY_EMAIL` / `AGENT_NOTIFY_PHONE`.

| Capability | Now (mock) | Live when… |
|---|---|---|
| Lead validation + Auto-Brief | ✅ live | always |
| Lead persistence | in-memory | `CRM_WEBHOOK_URL` set |
| Agent email / lead email | logged | `RESEND_API_KEY` + `LEAD_EMAIL_FROM` |
| Agent SMS / lead SMS | logged | `TWILIO_*` set |
| "Request a time" | appointment **request** | `NEXT_PUBLIC_CAL_BOOKING_URL` set |
| My Move Desk access | demo token (not secure) | signed, expiring magic link added |
| Agent Console | open + in-memory | real auth + DB added |
| Listing media | labeled placeholders | approved photos dropped in |
| Agent contact / brokerage / license | placeholders | real values in `agent.config.ts` |

## Compliance built in

Equal Housing mark + line · brokerage/license slots · TCPA checkbox unchecked by
default · privacy link on every form · SMS disclosure · **no** safety / best-schools
/ family-friendly / demographic / desirability scoring · neighborhood limited to
commute prompts, essentials proximity, and official school links with a
verification notice · financing is a routing signal, never a mortgage app (no
income / credit / debt / down-payment collected).

## Launch-gate checklist (the audit's "Fix Now")

- [x] Lead delivery path (email + SMS) — **live when creds set**
- [x] Lead + on-screen confirmation
- [x] Brokerage / license / Equal Housing slots — **fill real values**
- [x] TCPA consent + privacy page
- [ ] Real calendar — set `NEXT_PUBLIC_CAL_BOOKING_URL`
- [ ] CRM / source of truth — set `CRM_WEBHOOK_URL`
- [x] QR campaign tracking — `?src=` flows into every lead's Auto-Brief

## Still needed from the owner

Property photos + floor plan · real listing facts (or keep the demo flagged) ·
brokerage name + license # · Emily's routing phone/email · a named licensed
lender + NMLS · greeting + thank-you vertical videos.
