# Savaughna's Move Desk — Recon Scan & Recommendation Report

**Reviewer posture:** senior product strategist · luxury real-estate UX · CRO · AZ compliance-aware
**Subject:** `savaughna-move-desk.lorenzovonbarron.chatgpt.site`
**Basis:** LYNK Move Desk build brief + documented buyer/seller MVP flow. Flow/strategy audit, not a live pixel QA.
**Date:** 2026-07-28

---

## 1. Executive verdict

**Is it differentiated?** Yes — *conceptually*, and that matters. The category everyone else is in is "search + contact button." Savaughna's Move Desk is in a different category: "guided intent capture that hands the agent a prepared first conversation." That framing alone (QR/social/flyer → concierge → Auto-Brief) is genuinely defensible and the right wedge. Zillow can't copy it because Zillow's business model *is* the portal that disintermediates the agent. So the positioning is real.

**What's strong:**
- The **funnel shape is correct**: single-intent branch (buyer / seller / talk) instead of a dashboard of 30 filters.
- **Seller-side exists at all.** Most agent sites are 95% buyer. A guided seller path is where the money is (listing-side commission + inventory), and most competitors bury it.
- **Compliance instincts are unusually mature** for an MVP — you already flagged Fair Housing, "not a mortgage app," no school scores, calendar-as-request. That's the stuff that gets amateurs sued or de-platformed.
- **Mobile-first, QR-native** is the right physical-world-to-digital bridge for how agents actually get leads (yard signs, flyers, open houses, IG DMs).

**What's weak / premature / confusing:**
- Right now it is **mostly a beautiful concept, not yet a lead machine.** The dividing line is brutal and simple: *does a submitted form reliably land in Savaughna's hands within 60 seconds with enough context to call?* Until CRM/email/SMS routing exists, every gorgeous screen is a demo, not a tool. A lead form that emails no one is a scenic dead end.
- **"My Neighborhood" with 7 categories is the single biggest over-build.** It's the most likely place to (a) balloon into a Google Maps clone, (b) create Fair Housing exposure, and (c) add scroll length without adding conversion. More on this in §5.
- **The buyer flow is one screen too long.** Finance/readiness questions before the person has any relationship with Savaughna is a drop-off risk. Order matters more than content here.
- **Thank-you video is a placeholder** — fine, but a placeholder in the single highest-trust moment (right after someone gave you their info) is a wasted asset, not a neutral one.

**Bottom line:** This is an **A- concept sitting on a C+ conversion engine and a D infrastructure layer.** The design and positioning are ahead of the plumbing. That's the *correct* order to be wrong in for a demo — but it means it is demo-ready, not client-ready, until §7 is closed.

**True lead-gen tool, or beautiful concept?** Today: **beautiful concept with real bones.** With ~2 weeks of unglamorous work (routing, confirmations, real contact details, a booked-calendar), it becomes a real lead-gen tool. The gap is small in effort and enormous in outcome.

---

## 2. Customer-journey audit (buyer, screen by screen)

| Screen | What they understand | Where they hesitate / drop | Premium? | Verdict |
|---|---|---|---|---|
| **Home / Move Desk** | "This is Savaughna's world, and I pick a path." | If the 3 paths aren't visually ranked, a cold visitor stalls. | Yes, if restraint holds. | Keep. Lead with buyer. |
| **Explore Homes** | "Homes she's involved with." | If it's one demo listing, it can read as thin. Frame it as *curated*, not *inventory*. | Yes | Keep, reframe copy. |
| **Step Inside (listing)** | "This is the star." Story > card. | Too-long cinematic scroll on a weak connection = bounce. Needs static fallback. | This is the premium peak. | Keep. Protect it. |
| **My Neighborhood (7 cats)** | "Area info." | **Highest drop risk.** 7 tiles = homework. Feels like it's testing them. | Neutral-to-cluttered. | **Trim to 3 (§5).** |
| **Let's Talk** | "Now I engage." | Good intent moment. | Yes | Keep — but this should come *sooner* for hot leads. |
| **Finance / readiness Qs** | "She's qualifying me." | **Second-highest drop.** Money questions before trust = friction + "is this a mortgage app?" fear. | Risky. | **Shorten, reorder, reframe (§4).** |
| **Calendar / appt request** | "I can book time." | If it doesn't confirm instantly, they doubt it worked. | Yes | Keep — needs real confirmation. |
| **Thank-you video** | "It worked." | Placeholder = anticlimax at peak trust. | Currently weak. | **Fill this fast.** |
| **Return Home** | "Done." | Fine, but a dead end. Should offer "save this / text me the listing." | Neutral | Add continuity. |

**Two structural problems:**

1. **The hot buyer is punished.** Someone who scanned a yard sign *in front of the house* is ready NOW. Forcing them through neighborhood tiles + finance questions before they can say "can I see it Saturday?" loses the hottest leads. **Every screen needs a persistent, low-friction "Just text Savaughna" escape hatch** so ready buyers skip the funnel.

2. **Qualification is positioned as a toll booth, not a gift.** Right now the finance questions read as "prove you're worthy." Reframe the whole intake as *"so your first call is actually useful and not a generic pitch."* Same questions, opposite emotional read.

**Recommended buyer order:**
`Home → Explore Homes → Step Inside → [Book a tour / Text Savaughna — offered HERE, early] → optional "Help me plan" (readiness Qs, framed as optional) → Confirm → Thank-you video → Save to My Move Desk`

Move the *conversion action before the qualification*. Let people raise their hand first and answer questions second. You'll capture more leads and still get the context — just not at the cost of the lead.

---

## 3. Homepage / tile recommendations (final order)

Rank by intent temperature and business value. Buyer is most common; seller is most valuable; direct contact is hottest.

| # | Tile name | One-line description | CTA text |
|---|---|---|---|
| 1 | **Find My Next Home** | Homes and neighborhoods, walked through with you — not a search bar. | `Start Exploring` |
| 2 | **Sell My Home** | A plan and a real number before you ever list. | `Build My Selling Plan` |
| 3 | **Talk to Savaughna** | Text, call, or grab a time. No form wall. | `Text Savaughna` |
| 4 | **Step Inside a Home** *(featured listing)* | A single home, shown as a story. | `Take the Tour` |
| 5 | **How the Move Desk Works** | Three steps, sixty seconds, zero pressure. | `See How It Works` |

**Rules for the homepage:**
- **One primary action, visually.** Tile 1 gets the weight; the rest are secondary. Don't give five tiles equal size — that's a menu, not a concierge.
- **Tile 3 ("Talk") must not open a form.** It should reveal call / text / "request a time" buttons immediately. The whole point is *not* burying the ready buyer.
- **Kill any tile that's a dashboard.** No "market stats," no "mortgage calculator," no "saved searches" on the homepage. Those are portal reflexes; they cheapen the concierge feel.
- **Featured listing = curation signal.** One beautiful home says "she's selective," which is *more* premium than a grid of 40.

---

## 4. Buyer qualification audit

**The core reframe:** this is not a screening test, it's a *"so I don't waste your first call"* intake. Copy and order should say that out loud.

**Keep (useful, low-friction, non-financial-feeling):**
- **Timeline** — "When are you hoping to move?" (Now / 1–3 mo / 3–6 mo / Just exploring). *Single most useful field.* Routes urgency.
- **Area / commute anchor** — "Where do you need to be near?" (work, school, family). Factual, not a "score."
- **Bedrooms / must-haves** — one line, free text or chips.
- **Price range** — a *range slider or bands*, framed as "helps me show you the right homes," not "prove your budget."
- **Financing status** — but as a **routing question, not an interrogation**: *"Where are you in financing?"* → `Paying cash` / `Pre-approved` / `Talking to a lender` / `Haven't started — I'd like a referral`. That last option is your lender-handoff trigger and it's opt-in.

**Reword / soften:**
- Anything that reads like "income," "credit score," "debts," "down payment amount" → **cut entirely for MVP.** Savaughna doesn't approve financing; collecting this creates data-liability and mortgage-app confusion for zero benefit. The lender does this.
- "Are you pre-qualified?" (yes/no binary) → replace with the 4-option routing question above. Binary yes/no makes "no" feel like failure.

**Add:**
- **Preferred contact method + best time** (text / call, morning / evening). Tiny field, huge for connect rates.
- **One free-text line:** "Anything you want Savaughna to know?" This single box produces the most human, highest-converting Auto-Brief content — it's where people say "we're relocating for a job in August."
- **Explicit consent checkbox** for text/email (TCPA — see §7). Non-negotiable before this is production.

**Remove:**
- Any protected-class-adjacent question (household composition beyond bedrooms, kids' schools framed as preference, religion/ethnicity/familial status). Fair Housing landmine, and it adds nothing.
- Multi-step finance sub-forms. If it feels like a 1003/mortgage app, you've lost.

**How Savaughna receives & uses answers → the Auto-Brief:**
- She should get a **single, skimmable brief** (SMS + email) with: name, contact method + best time, buyer/seller, timeline, price band, area anchor, financing status, the free-text line, and **a recommended first move** ("Pre-approved + timeline Now → call within the hour, offer a Saturday tour").
- The brief should tell her *what to do*, not just dump fields. That "recommended first reply / next action" line is the feature that makes it feel like she has a team.

**Lender referral vs. Savaughna call — trigger logic:**
- **→ Lender referral** when financing status = "Haven't started / I'd like a referral," OR cash-uncertain + early timeline. Hand off to a *named licensed lender*, with disclosure that Savaughna doesn't provide financing.
- **→ Savaughna call first** when: pre-approved, cash, active timeline (Now / 1–3 mo), or *any* specific-listing tour request. Hot + qualified goes straight to her, not to a lender detour.
- **Never** let the app imply approval, rates, or affordability. It routes; it does not advise.

---

## 5. My Neighborhood audit

**Blunt take: this is your biggest over-build and your biggest compliance risk in one feature.** Seven categories (Groceries, Shopping, Dining, Schools, Parks, Commute, Medical) is a Google-Maps-clone trap — it adds scroll, invites subjective "scores," and drags a Fair Housing target onto the app.

**What belongs there (factual, sourced, neutral):**
- **Commute / drive-time** to a *user-entered* anchor ("how far to your office?"). Factual, personal, high-value.
- **Everyday essentials proximity** — grocery, pharmacy, major roads/transit. Distance/time facts only.
- **Schools — as links to official sources only** (AZ Dept. of Ed / district boundary tools) with an explicit "verify enrollment & boundaries yourself" prompt. Never a rating, never "best," never "good schools."

**What must NEVER be included:**
- **Any subjective score or grade** (safety score, school score, "walkability" implying desirability, "family-friendly," "up-and-coming," "safe/nice area"). These are textbook steering language and Fair Housing exposure.
- **Demographics of any kind.** Crime "heat," "type of people," religious/ethnic framing — all prohibited.
- **"Best schools" / rankings.** Link out; never assert.

**Keep it premium, not cluttered:**
- **Personalize, don't enumerate.** One input — "What do you want to be close to?" — beats seven static tiles. A concierge asks; a directory lists.
- **Facts as clean editorial cards,** not a map peppered with 200 pins.
- **Curate to 3, link out for the rest.**

**The 3 categories that matter most for conversion:**
1. **Commute / drive-time** (the #1 real buyer decision driver).
2. **Schools (as verified links)** — high demand, but handled compliantly = trust win.
3. **Everyday essentials** (grocery/pharmacy/major routes) — signals "you could actually live here."

Cut or link-out: standalone Shopping, Dining, Parks, Medical as their own tiles. Fold them into "essentials" or a single "Explore the area" outbound link. They're nice-to-know, not decision-drivers, and each one is scroll you pay for.

**Listing-level, global, or both?**
- **Both, but weighted to listing-level.** Neighborhood context is most persuasive *attached to a specific home* ("15 min to downtown Phoenix from THIS house"). A global version can exist as a lighter "About the area" for the territory, but the conversion power is at the listing.
- Practically: build it **once as a component** that takes a location prop, render it inside listings, optionally surface a territory-level version. Don't build two.

---

## 6. Seller-side MVP recommendation

Sellers are the prize (listing commission + inventory + the "what's my home worth" intent is red-hot). Beat the generic "What's my home worth?" form by giving a *plan and a conversation*, not an instant robot number that's always wrong.

**Page / tile order:**
`Sell My Home → Why sell / timeline → Property snapshot → Priorities → Contact + consent → Request a Strategy Call → Confirm + thank-you video → Save to My Move Desk`

**Exact questions (short — this should feel like 90 seconds):**
1. **"What's prompting the move?"** — Upsizing / Downsizing / Relocating / Investment / Just curious. *(Intent + urgency.)*
2. **"When would you ideally sell?"** — ASAP / 1–3 mo / 3–6 mo / Exploring.
3. **Property snapshot** — address (or ZIP if shy), beds, baths, approx. sq ft, home type. *(Enough to prep a real CMA.)*
4. **"Anything special or recently updated?"** — free text (renovations, view, lot). *This is where sellers brag — gold for the brief.*
5. **"What matters most in this sale?"** — Top price / Speed / Certainty / Low hassle *(pick up to 2)*. Sets her strategy.
6. **"Are you also buying next?"** — Yes / No / Maybe. *(Double-side opportunity.)*
7. **Contact method + best time + consent checkbox.**

**Best CTA language:**
- Entry tile: **`Build My Selling Plan`** (not "What's my home worth?" — that pre-commits you to a number).
- Final action: **`Request My Strategy Call`** or **`Get My Home's Game Plan`**.
- Avoid "Free home valuation" — it attracts tire-kickers and sets a robot-number expectation.

**What Savaughna receives:**
- A **Seller Auto-Brief**: address/area, timeline, motivation, property snapshot, updates, stated priorities, buying-next flag, contact + best time, consent, and a **recommended prep** ("Motivated relocator, wants speed + certainty, 3/2 in Tempe, updated kitchen → prep 3 comps, lead with timeline + net-proceeds, book within 24h").
- Crucially: **no auto-generated price shown to the seller.** She brings the number to the call. That's the whole competitive advantage.

**Why this beats "What's my home worth?" forms:**
- Those forms trade an inflated/wrong AVM number for an email; the lead knows it's a bait-and-switch and arrives annoyed.
- This trades **a real conversation and a tailored plan** for context. The seller feels *advised*, not *harvested*. Savaughna shows up to the call already knowing the story = she looks like she has a team.

**Add later, NOT in MVP:**
- Automated CMA / comp report generation.
- Estimated net-proceeds calculator.
- Photo upload / pre-listing checklist.
- Staging / prep timeline generator.
Keep MVP a **guided intake + booked call.** Automated valuation math is a v2 accuracy-and-liability project, not an MVP screen.

---

## 7. Missing MVP essentials (before this is a real lead machine)

Ranked by "does the lead actually reach Savaughna and convert" — highest impact first.

1. **Lead delivery / routing (email + SMS to Savaughna).** *Non-negotiable #1.* Right now a submitted form with no delivery is a lead that evaporated. Even a plain email to her inbox beats nothing. **Fix now.**
2. **Instant confirmation to the lead (email/SMS + on-screen).** People doubt a form that goes silent. A "Got it — Savaughna will reach out by [time]" message closes the loop and cuts double-submits. **Fix now.**
3. **Savaughna's real contact details + brokerage/license.** Real phone, real email, brokerage name, license #, Equal Housing/Fair Housing line. Legally required for AZ real estate solicitation and currently (per brief) placeholder. **Fix now — legal gate.**
4. **Consent / TCPA + privacy.** Explicit opt-in checkbox for text/email, privacy policy link, "message & data rates" line. Texting leads without consent is a real legal liability. **Fix now — legal gate.**
5. **Real calendar (booked, not "requested").** Cal.com / Calendly / Google embed so a tour or strategy call is actually on her calendar with a confirmation. Manual is OK *day one* if #1–2 exist. **Build next.**
6. **CRM / lead capture-of-record.** Even a Google Sheet or Airtable as source of truth so leads aren't only in an inbox. Follow-Up Boss / kvCORE later. **Build next.**
7. **Analytics + QR campaign tracking.** UTM/`?src=` per QR (yard sign vs. flyer vs. IG) so she knows what works. Cheap to add, compounding value. **Build next.**
8. **Real video assets** (agent greeting + thank-you). The thank-you placeholder is a wasted trust moment; a 20-sec Savaughna vertical video is the single highest-ROI content add. **Build next.**
9. **Listing data strategy.** Decide now: hand-curated listings (MVP-correct, compliant) vs. a feed. Do **not** MLS-scrape. One-to-few curated listings is fine and on-brand. **Decide now, build later.**
10. **Lender handoff (named licensed lender + disclosure).** A real referral partner and disclosure language, wired to the "needs financing" trigger. **Build next.**

**The five-line version of "is it real yet":** leads route (1), leads get confirmed (2), she's legally identified (3), consent is captured (4), and something is actually booked (5). Close those five and it's a real machine.

---

## 8. Technical & operational recommendations

**Manual at first (and that's fine):**
- Lead routing → **email + SMS to Savaughna**, she calls/texts back by hand. Concierge *should* feel human early.
- Scheduling → "request" that she confirms manually, *if* confirmation copy is honest ("she'll confirm your time").
- Listings → hand-entered by you/her. Compliant, controllable, on-brand.
- Auto-Brief → templated email; the "recommended next action" line can be human-written per lead at first.

**Automate next (in order):**
1. Form → CRM/Sheet + templated email/SMS to both parties (Zapier/Make as glue day one).
2. Real booked calendar with reminders.
3. QR/UTM attribution auto-tagged onto every lead.
4. Lender-trigger auto-referral email.

**Tools worth adding (pragmatic, cheap → scaled):**
- **Glue:** Zapier or Make (fastest path to routing).
- **Calendar:** Cal.com or Calendly.
- **Email/SMS:** Resend (email) + Twilio/SimpleTexting (SMS, consent-gated).
- **CRM:** Airtable/Sheet → Follow Up Boss or kvCORE when volume justifies.
- **Analytics:** Plausible/GA4 + per-QR UTMs.
- **Backend (from the brief):** Supabase for DB/auth/storage/RLS is the right call for the real magic-link + tenant isolation later — but **don't block the visual MVP on it.**

**What Savaughna maintains weekly (keep this tiny or she won't do it):**
- Featured listing(s): add/retire, verify facts, price, status.
- Availability (if manual calendar).
- Respond to Auto-Briefs (the actual job).
- Refresh one short video / social hook.
That's it. If weekly upkeep is more than ~30 min, the product failed the "make a solo agent look like a team" test.

**One realtor → brokerage product:**
- The brief's **white-label / tenant model is exactly right**: agent, listings, colors, territory, disclosures = *config, not code*. Savaughna is `tenant #1`.
- Scale path: per-agent config record → shared component library → per-tenant subdomain → brokerage admin (add/remove agents, brand once, compliance once). Sell it to the *brokerage* as "give every agent a Move Desk," which is a far bigger check than one agent.
- **Compliance as a platform feature** (disclosures, consent, Fair-Housing-safe templates baked in) is a genuine moat vs. every agent hand-rolling a Wix site. Lead with that when you sell to teams.

---

## 9. Conversion recommendations

**10 CTA improvements**
1. `Contact` → **`Text Savaughna Now`** (name + channel + immediacy).
2. `Submit` → **`Send to Savaughna`** (a person, not a database).
3. `Learn More` → **`Step Inside`** (already good — use it everywhere).
4. `Get Started` → **`Start My Move`** (owns the brand promise).
5. `What's my home worth?` → **`Build My Selling Plan`** (no robot-number trap).
6. `Book` → **`Grab a Time With Savaughna`** (human, low-pressure).
7. `Explore Homes` → **`See Homes Savaughna Recommends`** (curation > inventory).
8. Finance intro → **`Help Me Plan My Budget`** (gift, not toll booth).
9. Thank-you → **`Text Me This Listing`** (continuity + a second lead touch).
10. Add a persistent sticky bar on every screen: **`Talk to Savaughna`** (rescues hot buyers from the funnel).

**5 short trust-building lines**
1. "A real person reads every message — usually Savaughna herself."
2. "No spam, no auto-dialers. One helpful conversation."
3. "You'll hear back the same day."
4. "Licensed in Arizona · Equal Housing Opportunity." *(with real license #)*
5. "You choose the pace. Browse quietly or talk today — both are fine."

**5 Savaughna-style vertical video topics**
1. "Scan-to-tour in 60 seconds" — how the Move Desk works, filmed on a phone at a listing.
2. "3 things first-time buyers in the East Valley always ask me."
3. "Thinking of selling? Here's what I'd do *before* you list." (thank-you-video candidate)
4. "What 'pre-approved' actually means — in plain English." (lender-handoff trust builder)
5. "A day in my listings" — 20-sec cinematic walk of a home (reinforces Step Inside).

**3 QR-code campaign ideas**
1. **Yard-sign QR → that exact listing's Step Inside** (`?src=sign-<address>`). Highest-intent scan there is; skip straight to tour CTA.
2. **Open-house QR → instant "save + get the full gallery texted to you"** (`?src=openhouse`). Captures the walk-through crowd who won't fill a clipboard.
3. **Flyer/mailer QR → "What's happening in [neighborhood]" seller hook** (`?src=mailer-<zip>`). Farms a ZIP for seller leads.

**Best buyer lead magnet / hook:** **"Text me and I'll send you homes that actually fit — before they hit Zillow."** Early/curated access is the one thing the portals structurally can't offer, and it's a low-commitment yes.

**Best seller lead magnet / hook:** **"Get your home's real game plan — a strategy and a straight number, not a robot estimate."** It directly attacks the AVM bait-and-switch every competitor uses and promises a human + honesty.

---

## 10. Priority roadmap

**Fix now (days — blocks "is this real")**
- Lead routing to Savaughna (email + SMS). *[impact: critical · effort: low · risk: low]*
- Lead + on-screen confirmation. *[critical · low · low]*
- Real contact details, brokerage, license #, Equal Housing line. *[critical/legal · low · high-if-missing]*
- Consent checkbox + privacy link (TCPA). *[critical/legal · low · high-if-missing]*
- Reorder buyer flow: conversion CTA *before* finance Qs; add persistent "Text Savaughna." *[high · low · low]*
- Trim "My Neighborhood" to 3 compliant categories; strip any score/"best." *[high · low · high-if-missing (Fair Housing)]*
- Reframe finance Qs as optional "help me plan," 4-option routing, cut income/credit. *[high · low · med]*

**Build next (2–4 weeks)**
- Real booked calendar (Cal.com/Calendly). *[high · med · low]*
- CRM/source-of-record (Sheet/Airtable → FUB). *[high · med · low]*
- Templated Auto-Brief with "recommended next action." *[high · med · low]*
- QR/UTM attribution per campaign. *[med · low · low]*
- Real agent + thank-you videos. *[high · med · low]*
- Named lender handoff + disclosure, wired to trigger. *[med · med · med]*
- Seller flow per §6, guided-intake version. *[high · med · low]*

**Build later (quarter+)**
- Supabase persistence + secure expiring magic-link My Move Desk. *[med · high · med]*
- Listing activation workflow (upload → review → campaign → QR). *[med · high · low]*
- Multi-tenant / brokerage admin + white-label config UI. *[high-strategic · high · med]*
- Neighborhood templates by area (compliant, sourced). *[med · med · med]*
- CRM webhook integrations. *[med · med · low]*

**Do NOT build yet**
- Automated home valuation / net-proceeds engine (accuracy + liability). 
- MLS scraping / unlicensed listing ingestion (legal).
- Mortgage pre-approval / affordability advice engine (licensing).
- AI fly-through labeled as a real/verified tour (compliance + trust).
- A giant agent admin dashboard before the client journey converts.
- Any neighborhood "score," ranking, or "best schools" (Fair Housing).

---

## Would I put this in front of a real realtor today?

**Maybe — leaning yes for a *design/vision* demo, hard no for a *live lead tool*, and the gap between those is about one week of work.**

- **As a vision pitch to Savaughna / her brokerage:** **Yes.** It's differentiated, the concierge framing is genuinely better than a Zillow-dashboard site, and the seller path + compliance instincts will impress a broker who's seen a hundred generic agent sites. Show it, but *narrate* the plumbing as "next sprint," don't imply it's live.
- **As a tool you hand a high-value client to actually generate leads:** **No — not until the "Fix now" list is closed.** A concierge that doesn't deliver the message, doesn't confirm, doesn't show a license, and doesn't capture consent isn't a concierge; it's a very pretty voicemail no one checks. Ship lead routing + confirmation + real contact/consent/disclosures first, then it flips to a confident yes.

**Why, exactly:** the concept and design are already ahead of 90% of realtor sites. The only thing standing between "beautiful demo" and "real lead machine" is unglamorous, low-effort, high-impact infrastructure — routing, confirmation, legal identity, consent, and one honest calendar. That's the best possible position to be in a week before launch. Close §7 items 1–4 and the answer is an unqualified **yes.**
