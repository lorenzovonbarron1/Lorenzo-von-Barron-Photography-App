# J COMMAND — Handlebar J Revenue + Content OS

**Internal nickname:** The Backstage
**Client:** Handlebar J BBQ Restaurant & Bar · 7116 E Becker Lane, Scottsdale, AZ 85254 · handlebarj.com
**Author posture:** product architect · hospitality ops · revenue systems · WCM house standard
**Companion doc:** `docs/LYNK-DESIGN-SYSTEM.md` (the guest-side system this connects to)
**Version:** v2 — capacity-aware revision · 2026-09-10
**Status:** Blueprint. Nothing in this document has been validated against real Handlebar J data.

---

## 0. What changed in v2, and what it invalidated

v1 of this blueprint answered the question *"how do we get Handlebar J more business?"* New owner intelligence says that question is wrong, and in places actively dangerous:

- Handlebar J **sometimes has more business than it can comfortably handle.**
- Guests stay because the experience **is** the destination. Table turnover is not necessarily the objective.
- It is an **institution**, not a normal restaurant, and should not be operated like one.
- **A marketing company has already been hired and paid.**
- Ray is considering **a management company or a general manager.**
- A more aggressive growth strategy — happy hour, promotions, media — **may** be pursued. It is **not finalized.**

**The corrected mission:**

> Send the right business to the right days, while protecting the nights Handlebar J already handles well.

**The corrected central question:**

> **"What kind of business does Handlebar J want more of — and when?"**

### Three things in v1 that are now wrong, stated plainly

**1. The v1 break-even math is invalid.** v1 offered a path of "~76 additional covers per night × 18 event nights." If those nights are already at or beyond comfortable capacity, **that path does not exist.** You cannot add 76 covers to a full room, and trying is how an institution becomes a tourist trap with a two-hour wait and a one-star review about the service. §4 re-derives the arithmetic on revenue that does not consume a seat.

**2. The Rail was made the center of gravity. It should not be.** v1 called it "the thesis" and claimed it would improve table turns. Handlebar J may not *want* faster turns. The Rail is demoted to an **optional, approval-gated, single-event experiment** whose stated purpose is narrow: test whether timing-based requests reduce kitchen surges at music breaks without harming the guest experience. It may also prove to be added complexity for no benefit — and §8 requires the pilot to be able to return that answer.

**3. The system's default posture was growth. It is now caution.** A dashboard that recommends "promote harder" into an overloaded room is worse than no dashboard. The recommendation engine in §3 is now a **suppression engine first**: it decides what it is *not allowed* to say before it decides what to say.

### The strategic order

1. Understand demand · 2. Protect the institution · 3. Choose growth windows · 4. Promote selectively · 5. Test The Rail · 6. Scale only what improves revenue **without damaging the experience**

---

## 1. Evidence rules — unchanged and now more important

| Bucket | Meaning |
|---|---|
| **VERIFIED** | Confirmed from a primary source we hold |
| **STATED** | Someone told us; we have not seen it |
| **MODELED** | Our arithmetic on stated assumptions |
| **ASSUMED** | Our judgment, waiting to be tested |

Nothing in this document is VERIFIED. "Handlebar J is sometimes overloaded" is **STATED** — credible, from the owner, and still not measured. Which is exactly why the demand model's default state is `UNKNOWN` and not `OVERLOADED`.

The "200-plus remembered inquiries" remains **STATED**, and *remembered* is still doing enormous work in that sentence.

---

## 2. Operating modes

The venue is not in one condition. J COMMAND asks which mode a period is in **before** it does anything else. Mode is set by an authorized operator (§9) — never inferred by software alone.

### 1 · INSTITUTION MODE — the default

Protect the Handlebar J experience. Prioritize heritage, guest satisfaction, live-music quality, the Herndon legacy, repeat customers, artist relationships, community relationships, gift cards, merchandise, private events, and **accurate information**.

**Do not aggressively promote already-overloaded nights.** This mode is the default because the cost of wrongly promoting is much higher than the cost of wrongly not promoting: an empty table is recoverable next week; a regular of twenty years who couldn't get a seat and won't come back is not.

### 2 · GROWTH MODE — opt-in, per window, never global

Aggressive marketing **only** where leadership has explicitly chosen to grow a specific business window. Happy hour, slower dayparts, Sunday/daytime programming, promotions, private events, gift cards, merchandise, community events, advance bookings.

**Hard rule:** GROWTH MODE is never set venue-wide. It is set on a **daypart cell** (§3) with a named approver and an end date. "We're in growth mode" is not a valid system state.

### 3 · EVENT MODE

Optimize one specific event without assuming the venue needs more traffic. Tracks capacity, advance seats, cover, F&B attach, **kitchen pressure, staff pressure**, guest satisfaction, event revenue, repeat behavior.

### 4 · PROTECTED MODE

Memorials, sensitive family events, youth/school events, artist-sensitive events, private gatherings. **All marketing automation disabled.** Every content action requires explicit, per-item approval. No "remember this choice." No scheduling. No paid amplification. PROTECTED overrides every other mode and cannot be bulk-cleared.

---

## 3. The Demand State model — the new center of the system

### 3.1 The five states

| State | Meaning | Posture |
|---|---|---|
| **OVERLOADED** | Demand exceeds comfortable capacity. Service, kitchen, or staff under strain. | Protect. Never add demand. |
| **HEALTHY** | Full or near-full, running well. | Improve yield, don't add volume. |
| **OPPORTUNITY** | Real unused capacity. | Candidate for GROWTH — with leadership sign-off. |
| **PROTECTED** | Sensitive occasion. | No promotion of any kind. |
| **UNKNOWN** | Not enough evidence to say. | **Default.** Measure before acting. |

### 3.2 The Demand Grid

Demand state is not a property of the venue. It is a property of a **day × daypart cell**. Friday 9pm and Tuesday 3pm are different businesses in the same building.

The dashboard's primary object is a **7-day × daypart grid**, every cell carrying a state. On day one nearly every cell reads `UNKNOWN`, and **that is the honest and correct first screen.** A system that opens on confident colors it has not earned is lying to the operator on its first impression.

### 3.3 What determines a state

| Signal | Source | Available day 1? |
|---|---|---|
| Covers vs. comfortable capacity | Toast CSV + a stated capacity number | Needs capacity from ops |
| Kitchen ticket times | Toast, if exported at that granularity | **Often not** |
| Wait times / turn-aways | **Manual** — host stand | No |
| Labor hours vs. sales | Toast labor export, plan-dependent | Maybe |
| Guest complaints | **Manual** — one tap at the host stand | No |
| Staff strain | **Manual** — MOD's end-of-night rating, 1–5 | No |
| Reservations / advance seats | Reservation platform | Maybe |

**The uncomfortable finding this surfaces immediately:** the two signals that most reliably identify OVERLOADED — turn-aways and staff strain — **are not in Toast and are not in any marketing tool.** They require a human tapping a screen at the end of the night. That 20-second habit is the highest-value operational change in this entire document, and it costs nothing.

Until it exists, the honest answer is `UNKNOWN`.

### 3.4 Recommendation classes and the suppression matrix

Every recommendation the system can produce belongs to exactly one class.

| Class | Examples |
|---|---|
| **DEMAND-GENERATING** | Promote a night, paid reach, discount offers, "come tonight" posts |
| **YIELD** | Featured item attach, advance seats, average-check work |
| **CAPACITY-FREE** | Gift cards, merchandise, routing private events to open dates |
| **EXPERIENCE** | Information accuracy, wait communication, service coordination, staffing flags |
| **ASSET** | Legacy capture, content library, community relationships |
| **ROUTING** | Shift promotion to another daypart, route inquiries to open dates |
| **MEASUREMENT** | Establish a baseline, start logging turn-aways, confirm capacity |

**The suppression matrix — this is the product.**

| Demand state | DEMAND-GEN | YIELD | CAPACITY-FREE | EXPERIENCE | ASSET | ROUTING | MEASUREMENT |
|---|---|---|---|---|---|---|---|
| **OVERLOADED** | **BLOCKED** | friction-free only | allowed | **priority** | allowed | **priority** | allowed |
| **HEALTHY** | manual only | **priority** | allowed | allowed | allowed | allowed | allowed |
| **OPPORTUNITY** | GROWTH mode + approval | allowed | allowed | allowed | allowed | allowed | allowed |
| **PROTECTED** | **BLOCKED** | **BLOCKED** | **BLOCKED** | allowed | approval each time | **BLOCKED** | allowed |
| **UNKNOWN** | **BLOCKED** | allowed | allowed | allowed | allowed | allowed | **priority** |

Three rules fall out of this matrix and must be enforced in code, not in a style guide:

1. **The dashboard can never recommend adding traffic to an OVERLOADED or PROTECTED period.** Not "de-prioritized" — the recommendation is not generatable.
2. **UNKNOWN blocks demand generation too.** Absence of evidence is not permission. The correct action on an unknown cell is to go measure it.
3. **Blocked recommendations are shown, struck through, with the reason.** The operator must be able to see that the system considered and refused "promote Friday" — otherwise they will assume it wasn't smart enough to think of it, and will do it manually.

"Friction-free only" YIELD on an OVERLOADED night means: advance seats and pre-orders, yes (they *reduce* pressure); tableside upselling that lengthens service, no.

---

## 4. The money question, re-derived

### 4.1 What the new intelligence does to the $25K

It has to be said directly: **a marketing company has already been hired and paid, and Ray is considering a management company or a GM.** That materially weakens a $25,000/month fractional-CMO proposal, for three reasons.

1. **There is an incumbent.** Any proposal now has to answer "what are you doing that they are not," and the honest answer cannot be "posting better."
2. **The volume pitch is gone.** If the best nights are overloaded, "we'll fill your room" is not a benefit. It may be a threat.
3. **Operations authority may go elsewhere.** A GM or management company would own the levers — staffing, pricing, capacity, service — that most affect the numbers. Marketing would be a supplier to that role, not the owner of it.

**The honest reframing.** In a capacity-constrained institution, the value is not volume. It is **yield, routing, and capacity-free revenue** — plus the one asset nobody else can build (§7). A defensible proposal sounds like:

> *"You don't need more people on Friday. You need more money per Friday, more business on the days that are empty, revenue that doesn't need a seat at all, and the Herndon story captured before it's gone. Here's the baseline, here's what's mine, here's the number at which you should fire me."*

Whether that is worth $25,000/month is Ray's call and depends entirely on scope and on what the incumbent already covers. **This document does not assert that it is.** It asserts that if it is, it is for those reasons and not for reach.

### 4.2 Capacity-free revenue — the central concept

**Capacity-free revenue is revenue that does not consume a seat on a busy night.** In an overloaded institution it is the only honest growth vector, and it is systematically under-exploited almost everywhere.

| Vector | Why it's capacity-free | Notes |
|---|---|---|
| **Gift cards** | Sold now, redeemed on a day the buyer picks — often a slow one | Also a repeat-visit engine and a referral vector |
| **Merchandise** | No seat, no kitchen ticket, no server time | Legacy venues under-monetize this badly (see Gruene Hall, §10) |
| **Private events on dark/slow days** | Uses capacity that is otherwise idle | Highest contribution margin available |
| **Advance seats / pre-commit** | Doesn't add covers — *de-risks and smooths* the ones you have | Reduces no-shows and walk-up crush |
| **Average check on existing covers** | Same guests, more value | Only where it doesn't slow service |

### 4.3 The re-derived break-even

**MODELED on ASSUMED inputs. Every figure requires verification.** Assumptions: incremental contribution ~40–50% on F&B, ~50–60% on private events, ~55–70% on gift cards and merch (low variable cost, though merch carries inventory).

At a blended ~50%, a $25,000 fee needs roughly **$50,000/month in incremental revenue** to be contribution-neutral. Composed **without adding a single cover to a busy night**:

| Vector | Monthly target | Consumes peak capacity? |
|---|---|---|
| Private events on slow/dark days (3–4 @ $9–12K) | ~$32,000 | **No** |
| Gift cards (+25–40% on a stated base) | ~$4,000 | **No** |
| Merchandise (establish the channel properly) | ~$3,500 | **No** |
| Average check / attach on existing covers (+$2–3) | ~$4,500 | **No** |
| Slow-daypart programming — **GROWTH windows only, if leadership chooses** | ~$6,000 | **No** |
| **Total** | **~$50,000** | |

Whether the private-event number is achievable depends almost entirely on whether the 200-inquiry backlog is real. If it is, months one and two come from **demand that already exists and was never worked** — no content, no reach, no promotion. That is the single least glamorous and most certain line in this document.

---

## 5. Feria — new logic

Total sales is a bad primary metric for a capacity-constrained venue: a packed, miserable, low-attach night and a comfortable, high-attach night can post the same number.

### 5.1 What Feria measures now

| Metric | Why |
|---|---|
| **Revenue per open hour** | The core yield metric. Normalizes a 5-hour Tuesday against a 9-hour Friday. |
| Average check · check count | Split, never merged — they move in opposite directions and mean different things |
| **Food and drink attach rate** | A cover-only guest and a dinner guest are different businesses |
| Event revenue · advance-seat revenue | |
| Private-event pipeline | The capacity-free engine |
| Gift-card revenue · merchandise revenue | **Promoted to first-class metrics**, not footnotes |
| **Labor pressure** (labor hrs ÷ sales, and vs. plan) | A strain signal, not just a cost line |
| **Kitchen ticket pressure** (ticket times, peak concurrency) | Feeds the demand state |
| **Guest complaints** | Manual, one tap. The earliest OVERLOADED warning there is. |
| **Repeat behavior** | Anonymized/aggregate only (§6) |
| **Revenue from desired vs. undesired business mix** | See the guardrail below |

### 5.2 The four judgments the dashboard must never make

- **A full room is not automatically a success.** Full + low attach + complaints + staff strain is a bad night that looks like a good one on a sales report.
- **An empty table is not automatically a failure.** Slack on a Tuesday is inventory for private events.
- **Turnover is not automatically desirable.** People staying is the product.
- **More reservations are not automatically better** if they damage the experience.

### 5.3 "Desired vs. undesired business" — the guardrail

This metric is genuinely useful and genuinely dangerous, so its definition is constrained in the schema and not left to interpretation.

**Business mix may be evaluated ONLY on measurable commercial behavior:** attach rate, spend per occupied hour, advance-commitment rate, repeat rate, no-show rate, staff-load and complaint incidence associated with a booking type, and promotion-source margin (e.g. deep-discount channels that produce non-repeating, low-attach traffic).

**It may never be defined by, segmented on, or proxied to any characteristic of guests as people.** No demographic fields, no neighborhood inference, no appearance, no group-identity attributes — none of it enters this model, and the schema carries no column that could hold it.

The legitimate question is *"which booking types and promotion channels produce business that is good for this venue?"* — for example, discovering that a discount channel produces guests who occupy a peak table for two hours at a $12 check and never return, while the Herndon Brothers advance-seat package produces $60 checks and repeat visits. That is a channel and offer finding, and it is what this metric exists for.

---

## 6. Data rules — unchanged, and reinforced

- CSV/spreadsheet exports from Toast only. **No unauthorized direct access.**
- **No payment details.** The importer rejects a file containing a payment column rather than silently dropping it.
- No unnecessary personal customer information. Anonymized or aggregated wherever possible.
- Repeat behavior is measured in **aggregate cohorts**, never individual guest profiles, in the MVP.
- No private social account access without written owner authorization.
- **No automated publishing of high-risk content**; memorial, youth/school, artist, and guest content requires per-item explicit approval.
- **No automated changes to prices, menu items, events, capacity, or Toast settings. Ever.**
- Immutable, append-only audit log: actor, timestamp, before/after.
- Retention: raw imports 24 months; aggregates indefinitely; anything guest-identifying 90 days max — and the MVP should carry none.

---

## 7. Modules

### 7.1 Demand Grid **MVP-1**
The 7-day × daypart state grid (§3). Opens honest: mostly `UNKNOWN`. Primary actions: set state, set mode on a cell, log capacity, open the cell's evidence.

### 7.2 Feria **MVP-4**
§5 logic. Leads with revenue per open hour and the capacity-free lines, not total sales.

### 7.3 Event & Calendar Accuracy **MVP-3**
Deliberately unglamorous and deliberately third. Hours, band listings, cover, dance lessons, closures, holiday hours — correct on the site, on Google Business, and on social profiles.

**Why it outranks content:** for an institution where demand already exists, wrong information is a pure, silent revenue leak — people who tried to come and couldn't work out when or whether to. It is the cheapest fix in hospitality and the most commonly skipped.

### 7.4 Content & Campaign Mode Selection **MVP-5**
Every content item and campaign is **stamped with the operating mode and demand state it targets** at creation. A campaign aimed at an OVERLOADED cell cannot be scheduled. Carries objective, audience, offer, assets, tracking code, owner, dates, success threshold, **kill threshold**, and the §9 impact classification.

### 7.5 Lead Desk **MVP-6**
Pipeline `NEW → QUALIFIED → QUOTED → DEPOSIT → BOOKED → COMPLETED → REPEAT/REFERRAL`. Opens on **leads aging past SLA**, not new ones. Every record carries an `evidence` field.

**New in v2 — date routing.** The Lead Desk is now a **routing tool**: when an inquiry's preferred date falls on an OVERLOADED cell, the desk surfaces open alternative dates for the operator to offer. This is the clearest expression of the corrected mission — sending the right business to the right day — and it is worth real money on both sides of the trade.

### 7.6 Legacy Engine Lite **MVP-7**
Deliberately "Lite": a structured place to record interviews, tag archival photographs, and hold permission state. Not a publishing engine yet.

**Ranked ahead of the full Rail on purpose.** It is the only asset here a competitor cannot buy, and archival memory is perishable — the people who hold these stories will not always be available to tell them. **Start the interviews in week one regardless of what else slips.** This has been the same recommendation since v1 and the new intelligence strengthens it: in INSTITUTION MODE, legacy capture is one of the few always-permitted actions in the suppression matrix.

### 7.7 Approval Queue **MVP (cross-cutting)**
Thumb-scale for whoever holds authority. States: `Draft → Needs review → Approved / Rejected → Scheduled → Published → Archived`. Every item carries the §9 impact classification.

### 7.8 Deferred to Phase 2
Community Network (with the no-bulk-outreach constraint enforced in code) · Competitor Watch (§10) · Weekly Brief as an interactive screen · full Campaign Builder · Legacy Engine publishing.

---

## 8. The Rail Zero — demoted, narrowed, approval-gated

**Status: an optional operational experiment. Not the center of Handlebar J's business. Not approved. Not scheduled.**

### 8.1 What it is now permitted to claim

Exactly one hypothesis: **that letting a guest request a timing window can reduce kitchen surges during music breaks without harming the guest experience.**

It may **not** claim, and this system may not market it as: faster service, better table turns, higher throughput, or an improved guest experience. Those are either unproven or actively contrary to what the venue wants.

### 8.2 Pilot constraints — all mandatory

- **Requires management approval** (Ray, Joanne, GM, or management company) before it runs.
- **One event only.**
- Timing windows: **NOW · NEXT BREAK · SECOND BREAK · LAST CALL**.
- **No Toast integration.** The Rail schedules a request; staff transact in Toast exactly as they do today.
- **No cover-credit accounting.**
- **No automatic song-triggered offers.**
- **No promise of faster service** anywhere in the guest-facing copy.
- **Staff can pause or disable it instantly**, from the floor, without calling anyone. A kill switch that requires permission is not a kill switch.
- The pilot must record whether it produced **benefit or additional complexity** — and the debrief form must make "this made the night harder" as easy to record as "this helped."

### 8.3 Deferred until the first pilot proves guest AND staff adoption

**Boot Tag · cover-to-tab credit · song-triggered offers · The Round · zone routing · any Toast API work.** All of it. These were v1's most interesting ideas and they are all downstream of a question that has not been asked yet.

### 8.4 Why it still belongs in the document

The kitchen-surge problem at set breaks is real and specific to music venues, and no POS models it. If the pilot works, it is a genuine contribution. If it doesn't, it cost one event and a QR code. What it must not do is drive the product thesis — which was v1's mistake.

**Success is not "guests used it." Success is "expo and the floor lead said the night was easier, and no guest experience got worse."** If guests love it and the kitchen hates it, the pilot failed.

---

## 9. Roles, authority, and handoff-readiness

Ray may hire a GM or a management company. **J COMMAND must be role-neutral and survive that handoff without a rebuild.** The system serves whoever runs operations; it does not assume Emily or WCM owns the business.

### 9.1 What an authorized marketing operator may NOT control

Restaurant operations · staffing · pricing · Toast settings · cover policies · menu changes · event capacity · guest-service decisions.

This is enforced in permissions, not documented as etiquette.

### 9.2 Authorities the system supports

| Authority | Scope |
|---|---|
| **Ray** | Full. Brand and final authority. |
| **Joanne** | Full. Brand, operations, financial. |
| **General Manager** | Operations, staffing, capacity, service, demand state, mode setting. |
| **Management company** | As delegated by ownership; configurable, scoped, and logged. |
| **Authorized marketing operator** (Emily / WCM / the incumbent agency) | Content, campaigns, lead handling, reporting. **Recommends only** on anything operational. |
| **Floor Lead / MOD** | Tonight, demand-state logging, Rail pause. |
| **Read-only** | Summary. |

**Note:** the marketing-operator role is deliberately written so that *more than one* organization can hold it simultaneously with separate scopes and separate audit trails. Given that an agency is already engaged, that is not hypothetical.

### 9.3 Impact classification — required on every recommendation

No recommendation, campaign, or approval item may exist without these fields answered:

| Field | Values |
|---|---|
| **Who approves** | Ray · Joanne · GM · management company · marketing operator · no approval needed |
| **Affects operations?** | yes / no |
| **Affects staffing?** | yes / no |
| **Affects pricing?** | yes / no |
| **Affects guest experience?** | yes / no |
| **Disposition** | do now · test · defer · blocked by demand state |

A recommendation that touches operations, staffing, or pricing is **routed to operational authority and marked as a recommendation, never an action.** This single mechanism is what makes the system safe to hand to a GM on day one of their tenure — and what stops marketing from quietly steering the restaurant.

---

## 10. Competitor Watch — the v1 split still holds

**Competitive set (Phoenix metro):** Harold's Cave Creek Corral · Buffalo Chip Saloon · Rusty Spur Saloon · Foley Ranch Boots & BBQ · Dierks Bentley's Whiskey Row · Roosters Country · The Stillery · Scootin' Boots.

**Reference archetypes (Texas institutions — study the form, don't chase them):** Gruene Hall · Billy Bob's Texas · The White Horse · Broken Spoke · John T. Floore's Country Store.

**The new intelligence makes the reference set more valuable, not less.** These are institutions that are *also frequently at capacity*, and the thing to study is precisely how they monetize a room they cannot make bigger: merchandise programs, gift cards, legacy licensing, ticketed and pre-committed events, daytime and off-peak programming. That is a direct capacity-free revenue playbook from venues with the same constraint.

Per-observation fields keep v1's addition of **`labor complexity`** — and gain **`capacity impact`** (does adopting this consume peak capacity?). Recommendations: `BORROW · IMPROVE · TEST · IGNORE · AVOID`.

---

## 11. MVP — re-prioritized

| # | Deliverable | Note |
|---|---|---|
| 1 | **Demand State dashboard (the Demand Grid)** | The new center. Ships honest, mostly `UNKNOWN`. |
| 2 | **Toast CSV import** | Baseline. No API. |
| 3 | **Event / calendar accuracy** | Cheapest real revenue in the document |
| 4 | **Feria baseline** | §5 logic, incl. revenue per open hour |
| 5 | **Content & campaign mode selection** | Mode + demand state stamped at creation |
| 6 | **Lead Desk** (with date routing) | The capacity-free engine |
| 7 | **Legacy Engine Lite** | Perishable. Start interviews week one. |
| 8 | **Rail Zero — optional, approval-gated** | Only if management approves. Cut first if anything slips. |

Plus, cross-cutting and non-optional: **roles and impact classification (§9), the approval queue, and the audit log.**

### Deliberately not built
Full Toast API · automated publishing · customer identity profiles · AI video generation (Handlebar J's asset is that it is *real*) · payroll · full CRM · public guest app · automated pricing · unapproved outreach · **and any Rail feature beyond the four timing windows.**

### Build reality
The v1 estimate of ~35–48 dev-days still roughly holds — the Demand Grid and role/impact system replace scope that was cut. **That does not fit 30 calendar days for one developer.** Recommend **one developer, 45 days**, with **event/calendar accuracy and the Demand Grid shipped in week one** so the operator has something true in front of them immediately. Promising 30 days is how a relationship opens with a missed commitment.

---

## 12. The 30-day success test — recalibrated

The four attribution buckets are unchanged and still never merged: **already happening · influenced · directly attributed · pipeline.** Bucket 3 is the only unqualified claim; bucket 1 is never the marketer's.

**What changed: volume metrics are demoted, and two protection metrics are promoted to first-class success criteria.**

| Metric | Target | Why |
|---|---|---|
| **Demand states established** | ≥ 80% of cells off `UNKNOWN` | The whole system depends on it |
| **Turn-away / strain logging habit** | In place, nightly | The signal nobody has |
| Information accuracy audit | Complete, all channels | Silent leak closed |
| Private-event inquiries → qualified → quoted → deposits | Establish → 12 → 8 → 3 | Capacity-free |
| **Median first-response time** | < 60 minutes | Speed beats polish |
| **Leads routed to open dates** | Tracked at all | The corrected mission, measured |
| Gift-card revenue | +25% | Capacity-free |
| Merchandise | Channel established | Capacity-free |
| Revenue per open hour | Establish, then trend | Yield, not volume |
| Average check / attach | +$2–3 | Yield |
| **Guest complaints** | **Flat or down** | **A promotion that raises this failed, whatever it sold** |
| **Staff strain rating** | **Flat or up** | Same |
| Legacy interviews captured | ≥ 3 | Perishable |
| Content produced | Volume target **only in GROWTH windows** | Content into an overloaded room is waste |

**The two lines in bold are the v2 test.** A month that hits every revenue number while complaints rise and staff strain worsens is a **failed month**, and the system must be able to say so out loud. That is the difference between a marketing dashboard and an operating system for an institution.

---

## 13. Technology stack

Unchanged from v1 and consistent with what WCM already runs: **Next.js** (App Router) · **Supabase** (Postgres + RLS + Auth — RLS maps directly onto §9's role table) · Supabase Storage · client-parsed, server-validated CSV import with a column allow-list · server-rendered HTML → PDF for reports · Resend + Twilio for SLA alerts · Vercel.

The Rail Zero, if approved, runs as a static page over the **anon-insert-only** Supabase pattern already proven in this repo (`lib/lynk-submissions.js`, `supabase/lynk_submissions.sql`) — no Toast dependency, no reads from the client.

**Explicitly rejected:** a no-code stack. The permission model, the impact classification, the suppression matrix, and the audit log are the parts that make this safe to hand to a GM — and they are exactly the parts no-code makes hardest.

---

## 14. How J COMMAND connects to LYNK and WCM

| System | Owns |
|---|---|
| **Toast** | What actually sold |
| **J COMMAND** | What kind of business is wanted, when — and what to do about it |
| **LYNK** | Where guests take action |
| **Grok / market watch** | What the market is doing |
| **Rail Zero** | One narrow experiment, if approved |
| **Ray / Joanne / GM / management company** | Authority |
| **WCM + the incumbent agency** | Execution, in scoped lanes |

A LYNK private-event enquiry inserts into a submissions table → lands in the Lead Desk as `NEW` with a timestamp → starts the SLA clock → **and is checked against the Demand Grid so the operator can route it to a date the venue actually wants.** That last step is the corrected mission expressed as a single join.

---

## 15. Verdict

**What the new intelligence really changed:** it converted this from a growth product into a **capacity-aware decision system**, and in doing so it made the product harder to build and much easier to defend. Anyone can build a dashboard that says "post more." Very few will build one whose first job is to refuse.

**The central question is now:** *What kind of business does Handlebar J want more of — and when?*

**Three things that must not slip:**
1. **Ray's stories.** Still perishable, still week one, still the only unbuyable asset.
2. **The turn-away and strain log.** Twenty seconds a night, and without it every demand state is a guess.
3. **The suppression matrix.** If the system can be talked into recommending traffic for an overloaded night, none of the rest of this matters.

**And one thing to say out loud before any fee is discussed:** a marketing company is already engaged and a GM or management company may be coming. The role this system supports should be defined *after* that structure is settled, not before — and J COMMAND is built to be handed over precisely because that structure isn't settled yet.

---

*Prepared by Working Class Marketing. Nothing herein is validated against Handlebar J's operational data. §1's evidence buckets apply to every figure in this document.*
