# J COMMAND — Handlebar J Revenue + Content OS

**Internal nickname:** The Backstage
**Client:** Handlebar J BBQ Restaurant & Bar · 7116 E Becker Lane, Scottsdale, AZ 85254 · handlebarj.com
**Author posture:** product architect · hospitality ops · revenue systems · WCM house standard
**Companion doc:** `docs/LYNK-DESIGN-SYSTEM.md` (the guest-side system this connects to)
**Date:** 2026-09-10
**Status:** Blueprint. Nothing in this document has been validated against real Handlebar J data.

---

## 0. Read this first — what is verified and what is not

Every number, count, and claim below falls into one of four buckets. They are labeled throughout. Do not let them blur.

| Bucket | Meaning | Example in this doc |
|---|---|---|
| **VERIFIED** | Confirmed from a primary source we hold | Nothing yet. The blueprint precedes the data. |
| **STATED** | Someone told us; we have not seen it | "200+ private-event inquiries" |
| **MODELED** | Our arithmetic on stated assumptions | The $25K break-even in §3 |
| **ASSUMED** | Our judgment, waiting to be tested | Set-break ticket spike in §6 |

The "200-plus remembered inquiries" is **STATED**, and "remembered" is doing an enormous amount of work in that sentence. It may be 200 in a shoebox. It may be 40 in a phone. It may be a feeling. Day 1 of the engagement is finding out, and the Lead Desk ships with an `evidence` field on every record precisely so the difference is never lost again.

---

## 1. Executive summary

**The brief is 85% right and 100% too big.** The strategic read — that Emily's job is revenue operations wearing a content costume, and that she needs a private backstage OS rather than a guest app — is correct and unusually mature. The module list, taken literally, is a 9-month build being asked to ship in 30 days.

**What the brief gets right:**
- Separating LYNK (guest) from J COMMAND (operator) is the single best decision in it. Most agencies conflate these and ship a beautiful thing nobody internally uses.
- Refusing to optimize for followers. Correct, and rarer than it should be.
- The data rules — CSV before API, no payment details, role-based approval, audit log, no auto-publish of sensitive content — are written like someone who has actually been sued. Keep every one of them.
- Naming the Legacy Engine at all.

**What the brief gets wrong:**
- **Twelve screens in thirty days is a fantasy.** The MVP is five screens. §11 makes the cut.
- **The Legacy Engine is buried at #6 and it is the actual crown jewel.** Ribs can be copied. A sound system can be bought. Forty years of the Herndon Brothers cannot be replicated by any venue in Arizona at any price. It is the only genuinely defensible asset on the list and it is ranked below Campaign Builder.
- **The competitor list conflates two different things.** Gruene Hall, Billy Bob's, Broken Spoke, John T. Floore's and The White Horse are in Texas. No one in Scottsdale is choosing between Handlebar J and Gruene Hall on a Friday night. Those are **reference archetypes** — study them for form. The **competitive set** is Phoenix metro. Mixing them produces strategy that answers the wrong question. §9 separates them.
- **Nothing in the brief touches the guest's actual friction.** Ten modules of backstage instrumentation, and the guest experience on a Friday night is unchanged. Which brings us to the thing that makes this award-winning instead of merely competent.

**The thesis of this document:** J COMMAND's dashboard is table stakes. Every agency can build a dashboard. The defensible, ownable, genuinely new thing here is **THE RAIL** — an ordering system built on the insight that a live-music venue does not run on a clock, it runs on a setlist. §6 is the center of gravity of this entire blueprint. Everything else is the instrumentation that proves it works.

**One-line version:** Toast says what happened. Grok watches the market. J COMMAND says what to do next. **The Rail changes what happens.**

---

## 2. App mission

> **J COMMAND exists to answer one question, once per day, with evidence: what is the highest-value action Emily can take next for Handlebar J?**

Three non-negotiable properties:

1. **It is opinionated.** The dashboard does not present twelve charts and wish Emily luck. It ranks. One recommended action sits at the top, with the reasoning and the number behind it visible on demand.
2. **It is honest about attribution.** Four separated revenue buckets, always: *already happening* / *influenced* / *directly attributed* / *pipeline*. A system that lets Emily quietly claim baseline revenue as her own is worse than no system, because it destroys the trust the $25K depends on.
3. **It never publishes or prices without a human.** Ray and Joanne hold brand authority. The software's job is to make approval fast, not to route around it.

---

## 3. The $25,000 question — the honest arithmetic

Before a line of code, the engagement has to survive a napkin. This is **MODELED** on **ASSUMED** inputs and must be re-run the moment real Toast data lands.

**Assumptions (all require verification):**
- Incremental contribution margin on additional food/bar covers, where fixed costs are already carried: **40–50%**. Restaurant variable cost on incremental sales is roughly food cost + variable labor; fixed rent, base labor, and utilities are already paid by the baseline.
- Private events carry higher contribution — **50–60%** — because they are pre-committed, staffed to a known headcount, and often include a room minimum.
- Handlebar J runs roughly **16–20 event nights per month**.

**The break-even:**

| Path | Math | Monthly incremental revenue needed |
|---|---|---|
| Food & bar only, at 45% contribution | $25,000 ÷ 0.45 | **~$55,600** |
| Blended (70% F&B, 30% private events) | $25,000 ÷ 0.485 | **~$51,500** |
| Private events only, at 55% | $25,000 ÷ 0.55 | **~$45,500** |

**What ~$52,000/month actually looks like, three ways:**

| Route | Requirement |
|---|---|
| **Spread across event nights** | ~$2,900 incremental per event night, ×18 nights. At a $38 average check, that is **~76 additional covers per night** — or a smaller number of covers plus a $4–6 average-check lift. |
| **Private events** | **4–6 additional private events per month** at $9–12K each. This is the highest-leverage path and the one the Lead Desk exists to unlock. |
| **Mixed (recommended)** | 2–3 additional private events (~$28K) + a $3 average-check lift across ~1,400 monthly covers (~$4.2K) + advance-seat/package revenue on Herndon Brothers nights (~$12K) + gift card and merch lift (~$8K). |

**The verdict Emily must be willing to say out loud in the pitch:** *"Break-even on my fee is roughly $52,000 a month in incremental revenue. Here is the plan to get there, here is how I'll prove which part was mine, and here is the number at which you should fire me."*

That sentence is worth more than any deck. Note that "4–6 additional private events per month" is the whole ballgame — and if the 200-inquiry backlog is real and unworked, the first two months of that number may already be sitting in a shoebox.

**Structure note:** the $25K is a professional fee. Ad spend, merch inventory, print, venue costs, and outside vendors are separate line items and must never be netted against it. Blending them is how agencies end up eating media budget out of their own margin and then quietly reducing the work.

---

## 4. User personas

| Persona | Role | Opens the app | Needs | Must never be able to |
|---|---|---|---|---|
| **Emily** — Fractional CMO / Revenue Operator | Owner-operator of the system | 3–8× daily, heavily on mobile, often one-handed in a loud room | Today's action, tonight's shot list, lead follow-ups, what's awaiting Ray | Publish sensitive content without approval; alter Toast; see raw payment data |
| **Ray Herndon** — Owner, brand authority | Approver, story source | 2–4× weekly, ~90 seconds per session, phone | A queue he can clear with his thumb; a weekly brief he can read in 6 minutes | — (full authority) |
| **Joanne** — Owner / operations | Approver, ops truth | Weekly + event days | Event accuracy, staffing implications, cost reality | — (full authority) |
| **Floor Lead / MOD** | Runs the night | Event nights only, tablet at the host stand | The Rail queue, zone map, VIP/advance-seat list | Approve marketing content; see financials beyond tonight |
| **Kitchen Expo** | Ticket flow | Event nights, fixed screen | Load curve, sequenced tickets, hold/fire control | Anything else |
| **WCM (Lorenzo / studio)** | Builds and maintains | Weekly | System health, build queue, cross-client patterns | Approve Handlebar J brand content |
| **Grok / market watch** | Competitive input | Automated + manual entry | A structured place to put observations | Publish anything; touch revenue data |

**Design consequence:** Emily's and the Floor Lead's interfaces are **loud-room, low-light, one-thumb**. Ray's interface is **a queue and a brief, nothing else**. Building one interface for all of them is how this fails.

---

## 5. Core workflows

Five loops. Everything in the app serves one of them; if a feature serves none, it does not ship.

**Loop 1 — The Daily Loop (Emily, ~10 min, every morning)**
`Open → read the single Recommended Action → check overnight leads → clear content approvals → confirm tonight's Rail setup → act`

**Loop 2 — The Night Loop (Emily + Floor Lead, event nights)**
`Tonight at the J → shot list → capture → Rail monitoring → post-event checklist → same-night asset dump to Vault`

**Loop 3 — The Lead Loop (Emily, continuous, SLA-driven)**
`Inquiry lands → auto-timestamped → qualify → quote → follow-up cadence → deposit → booked → post-event referral ask`
The single most important metric in this loop is **response time**. Every hospitality lead study points the same direction: speed beats polish. The Lead Desk's primary alert is not "new lead," it is **"lead aging past SLA."**

**Loop 4 — The Campaign Loop (Emily + Ray approval)**
`Objective → offer → tracking code → assets → approval → launch → measure against threshold → SCALE / IMPROVE / HOLD / TEST / KILL`
Every campaign is created with its **kill threshold already written down**. A campaign without a pre-declared kill number is a hobby.

**Loop 5 — The Weekly Loop (Ray, 6 minutes, Monday)**
`Brief lands → what made feria → what didn't → decisions needed from Ray → approve/decide → next 7 days locked`

---

## 6. THE RAIL — a new way to order

> **Order by the song, not the seat.**

This is the section that matters. Everything above is competent. This is the part that is new.

### 6.1 The insight

Every restaurant ordering system on earth — Toast included, and every QR menu built on top of it — models a venue as **tables on a clock**. Party sits at 7:12. Order at 7:19. Fire. Deliver. Turn.

**Handlebar J is not tables on a clock. It is a room on a setlist.**

On a Herndon Brothers night, the room has a rhythm that no POS knows about:

- During a set, people are **on the dance floor, not in their seats**. A server delivering ribs to an empty chair during "Amarillo By Morning" is delivering to nobody.
- When the band breaks, **the entire room orders at once**. The kitchen takes a wall of tickets in a six-minute window, quality drops, tickets take 28 minutes, and the food lands *just as the next set starts* — so it sits, or gets eaten cold, or gets comped.
- The guest's actual desire is not "food now." It is **"food that arrives when I'm sitting down and the band isn't playing."** No ordering system in hospitality lets a guest express that.
- Nobody wants to hear a server recite specials at 92 dB, and nobody can read an 8-point menu at 8 lux.

Toast optimizes table turns. **A music venue does not want table turns — it wants people to stay, drink, dance, and come back.** The entire ordering paradigm is misaligned with the business model.

### 6.2 The mechanism

The Rail replaces "when do you want to order" with **"where in the show do you want this to land."**

**The Set Clock** is the spine. A night is not hours, it is segments, published by the band and locked by the Floor Lead:

```
DOORS → SET 1 → BREAK 1 → SET 2 → BREAK 2 → SET 3 → LAST CALL
5:00     7:30    8:25       8:45    9:40      10:00    11:40
```

Every guest order carries a **landing window**, not a fire time:

| Guest picks | What it means | Kitchen sees |
|---|---|---|
| **Now** | Standard. They're seated and hungry. | Fire immediately |
| **Before the band** | Land it with ≥15 min of Set 1 to spare | Fire at T-32 from Set 1 |
| **At the break** | Land it 90 seconds into Break 1 | Fire at T-24 from Break 1 |
| **After this song** | Encore/last-song trigger, drinks only | Expo fires on Floor Lead's tap |
| **Last call** | Late-night board only | Fire at T-18 from Last Call |

The kitchen no longer receives a wall. It receives a **known demand curve, hours in advance.** Expo sees the load for Break 1 building at 7:40pm and can prep accordingly. The wall of tickets at 8:25 becomes a scheduled, smoothed, staffed event.

**This is demand shaping via entertainment schedule, and as far as we can find, nobody in hospitality is doing it.** It is the patentable-feeling idea in this document.

### 6.3 The Boot Tag — a tab that isn't a table

Table-bound tabs break the moment someone dances. The Rail identifies **people, not furniture.**

- On arrival (or at cover), the guest gets a **Boot Tag** — a short call sign they choose or are assigned: `RED BOOT 4`, `TWO-STEP 9`. Printed on the cover stub, held in the phone, spoken out loud without embarrassment.
- The tab follows the tag. Move from a table to the rail to the dance floor to the patio — the tab moves.
- Runners find guests by **zone + tag**, not table number. The room is divided into named zones a human can actually use: `STAGE LEFT` · `THE RAIL` · `DANCE FLOOR EDGE` · `BACK BOOTHS` · `PATIO` · `BAR`.
- **Cover rolls into the tab.** Pay cover once, it becomes the tag, and a portion is applied as credit toward food or merch. This is the single highest-leverage average-check mechanic in the whole system: it converts a sunk cost into a spending trigger.

Name note: "The Rail" is the bar rail — where people actually stand at a honky-tonk — *and* the kitchen rail where tickets hang. The name is doing two jobs on purpose.

### 6.4 Built for 92 dB and 8 lux

The interface constraints are the design brief:

- **No reading.** Photographic tiles at thumb size. The ribs look like ribs.
- **One thumb, one hand.** Every primary action reachable from the bottom third of the screen; the other hand is holding a drink.
- **High-contrast, low-emission.** Amber-on-smoke, not white-on-white. A phone at full white brightness in a dark saloon is antisocial — it lights up the person's whole face and ruins the room. The Rail's palette is chosen so the screen doesn't become a lantern.
- **Haptics as confirmation.** You cannot hear a chime. You can feel a buzz. Order placed = distinct haptic pattern. Food landing = second pattern.
- **Zero-typing.** Everything is a tap. Names, notes, and modifiers are pre-set chips.

### 6.5 The Round

Bar-group friction is a real revenue leak: one person buys, everyone else means to reciprocate, nobody tracks it, the tab under-performs.

**The Round** — one guest opens a round, the rest join by tapping tags together or scanning. The split is agreed *before* the drinks arrive: even split, one buyer, or per-item. The app remembers whose round is next and surfaces it once, quietly, at the right moment. Not nagging — one prompt, at the break.

**ASSUMED:** group tabs with pre-agreed splits raise per-head spend because the social friction of "who's paying" is removed. This is testable in one weekend and should be tested before it is built.

### 6.6 Song-triggered offers — armed, never invented

When the band starts a specific song, a **pre-approved** offer can fire to guests in the room.

Critical constraint, and it is non-negotiable: **the software never invents an offer, never sets a price, and never touches Toast configuration.** Ray or Joanne approve a small library of offer templates in advance. The Floor Lead *arms* one for the night. The trigger fires it. It expires on its own.

Example, fully approved in advance: Herndon Brothers open the encore → guests in the room see *"Encore Board — half rack + two drinks, $32, next 20 minutes."* It is a real, scarce, event-locked offer that exists only inside the room, and it converts the emotional peak of the night into an order.

This is the direct bridge from the brief's `CONTENT → ATTENTION → INQUIRIES → BOOKINGS → TOAST SALES → REPEAT` chain into a single measurable moment, because the offer carries a tracking code and lands in the Feria dashboard the next morning as attributed revenue.

### 6.7 What The Rail is worth

**MODELED on ASSUMED inputs. Test before believing.**

| Mechanic | Hypothesis | Test |
|---|---|---|
| Cover-to-credit | +$4–7 average check on cover nights | One month, alternating nights, A/B |
| Set-break sequencing | Ticket-time variance down; comp/void rate down | Compare comp+void % vs. baseline nights |
| Landing windows | Fewer cold-food comps, higher food attach on show nights | Food attach rate on event nights |
| The Round | +$3–6 per head in groups of 4+ | Group tabs vs. individual, same nights |
| Song-triggered offers | 6–12% take rate in-room | Tracking code redemption |
| Boot Tag zones | Higher second-round rate from dance-floor guests | Reorder rate by zone |

If even three of six hold, the average-check lift alone carries a meaningful share of the §3 break-even.

### 6.8 How to pilot it in 30 days with zero Toast integration

This is the part that makes it real instead of a slide.

**The Rail Zero** — one event night, no API, no build:
1. A QR code on every table and along the bar rail → a static page (this repo's stack already does static export cleanly).
2. Guest picks a landing window from four buttons. Submits with a name and zone.
3. The request lands in a Supabase table — **exactly the pattern already running in `lib/lynk-submissions.js` and `supabase/lynk_submissions.sql`.** Anon insert only, RLS locked, no reads from the client.
4. A tablet at expo shows the queue, grouped by landing window, sorted by fire time.
5. Server enters the actual order into Toast as normal. **The Rail schedules; Toast still transacts.**

That is a weekend of work, it violates none of the data rules, it touches nothing in Toast, and it produces a real answer to the only question that matters: *do guests use a landing window when you give them one?*

If the answer is yes, the Toast partner-API integration in Phase 3 is justified by evidence rather than enthusiasm. If it's no, we learned it for the cost of a QR code instead of a nine-month build.

---

## 7. Screen-by-screen design

Twelve screens are specified. Five ship in the MVP (marked **MVP**); the rest are designed now so the data model doesn't have to be rebuilt later.

### 7.1 Home Dashboard **MVP**
- **Purpose:** answer "what do I do next" in under five seconds.
- **First thing Emily sees:** one Recommended Action, in a sentence, with the number behind it. Not a chart wall.
- **Main information:** the action · tonight's event state · leads aging past SLA · items awaiting Ray · yesterday vs. comparable day.
- **Actions:** accept the action, open the lead, open tonight, push to Ray.
- **Inputs:** Toast CSV, Lead Desk, Approval Queue, event calendar.
- **Outputs:** an executed action with a timestamp (this is what the audit log records).
- **Permissions:** Emily, Ray, Joanne, WCM. Floor Lead sees a reduced version.
- **Revenue support:** it is the prioritization engine. Its entire value is preventing Emily from spending Tuesday on the wrong thing.

### 7.2 Tonight at the J **MVP**
- **Purpose:** run the night.
- **First thing:** the Set Clock, live, with the current segment lit.
- **Main information:** band · cover · dance lesson · advance seats · featured item · armed offer · shot list · Rail load · weather · post-event checklist.
- **Actions:** lock the Set Clock, arm an approved offer, check off shots, mark the checklist.
- **Permissions:** Emily + Floor Lead write; Ray/Joanne read; Expo sees the Rail panel only.
- **Revenue support:** the night is the product. This screen makes sure nothing capturable is missed and the room's peak converts.

### 7.3 Feria **MVP**
- **Purpose:** what made money.
- **First thing:** the four attribution buckets, separated and never summed into one hero number.
- **Main information:** revenue vs. comparable day · average check · covers · item winners/losers · discounts, comps, voids · online orders · gift cards · merch · event performance · campaign performance.
- **Actions:** tag any line SCALE / IMPROVE / HOLD / TEST / KILL; drill to source rows.
- **Inputs:** Toast CSV import; manual entry for what Toast can't export (§8).
- **Revenue support:** it is the scoreboard the fee is judged against.

### 7.4 Content Vault **MVP**
- **Purpose:** never lose an asset, never publish one without permission.
- **First thing:** what still needs capture for the next 7 days — not a grid of old photos.
- **Main information:** asset · date · location · people · **permission status** · event · campaign · platform · usage restrictions · final/rough · caption ideas · CTA.
- **Actions:** upload, tag, set permission, mark restricted, push to campaign.
- **Hard rule:** an asset with `permission: none` or `sensitive: true` cannot be attached to a scheduled post. The system blocks it. Memorial, youth, school, and artist content defaults to restricted.
- **Revenue support:** capture cost is the largest hidden expense in content ops. Re-shooting because a file was lost is pure waste.

### 7.5 Lead Desk **MVP**
- **Purpose:** convert the pipeline. This is where the private-event money is.
- **First thing:** **leads aging past SLA**, red, at the top. Not the new ones — the rotting ones.
- **Pipeline:** `NEW → QUALIFIED → QUOTED → DEPOSIT → BOOKED → COMPLETED → REPEAT/REFERRAL`
- **Fields:** inquiry date · source · event type · guest count · preferred date · budget range · **first response time** · assigned · quote status · deposit status · estimated revenue · final revenue · referral source · next follow-up · **evidence** (where this record came from — see §0).
- **Revenue support:** the highest-leverage screen in the app. Four to six additional private events per month is the §3 break-even.

### 7.6 Campaign Builder
- **Purpose:** run tests with pre-declared kill thresholds.
- **Required at creation:** objective · audience · offer · date · assets · landing page · Toast item/offer · QR · tracking code · budget · owner · start · end · **success threshold** · **kill threshold**.
- **Rule:** no campaign saves without both thresholds. Non-negotiable.

### 7.7 Legacy Engine
- **Purpose:** turn forty years into a permanent content supply.
- **Why it should be built earlier than the brief says:** it is the only asset on the entire list that is structurally impossible to copy. Everything else — ribs, sound, dance floor, packages — can be matched by a competitor with capital. The Herndon family timeline cannot.
- **Contents:** family timeline · venue history · former band members · Herndon Brothers milestones · famous guests · Arizona music stories · archival photographs · historic events · anniversary dates · approved interview clips · story status · permission status.
- **Output series:** *On This Stage* · *Ray's Road Stories* · *40 Years of the Herndon Brothers* · *Arizona Country Music at the J* · *Where Western Hospitality Is Always a Tradition*.
- **Urgency note, stated plainly:** archival memory is perishable. The people who hold these stories will not always be available to tell them. Interview capture should begin in month one regardless of what else slips.

### 7.8 Community Network
- **Purpose:** remember and serve relationships. Chaparral High School, coaches, musicians, real-estate professionals, sponsors, charities, hospitality partners, photographers, DJs, bands.
- **Fields:** relationship type · last interaction · potential collaboration · permission status · upcoming opportunity · follow-up date · notes.
- **Guardrail, enforced in software:** no bulk send, no mail-merge, no export-to-outreach-tool. Rate-limited to individual, human-written contact. The brief says "do not turn this into a spam machine" — that has to be a constraint in the code, not a sentence in a doc, or it will become one within a quarter.

### 7.9 Competitor Watch
See §9 — the list needs restructuring before the screen is built.

### 7.10 Approval Queue **MVP**
- **Purpose:** let Ray clear his responsibilities with his thumb in 90 seconds.
- **First thing:** the oldest blocking item.
- **States:** `Draft → Needs review → Approved / Rejected → Scheduled → Published → Archived`
- **Design constraint:** Ray's view is a stack of cards, swipe-scale. If approval takes more than 15 seconds per item, it will not happen, and the whole governance model collapses.
- **Audit:** every approval, rejection, and edit is logged with actor and timestamp, immutably.

### 7.11 Weekly Brief **MVP-lite (generated, not a screen)**
- Ships as a generated PDF/email in the MVP. The interactive screen comes later.
- Contents per the brief: what made feria · what didn't · best/weakest items · best/weakest event · best content · best CTA · best lead source · pipeline · website friction · recommended tests · recommended cuts · **decisions needed from Ray** · next 7 days.
- **The "decisions needed from Ray" block is the most important section of the brief and goes at the top, not the bottom.** A report Ray reads and takes no action from is a newsletter.

### 7.12 Settings & Permissions
Roles, approval routing, SLA thresholds, Toast import mapping, audit log viewer, data retention.

---

## 8. Data model

### 8.1 Core entities

```
Venue ─┬─ Event ─┬─ SetClock ─── SetSegment[]
       │         ├─ Campaign[] ── TrackingCode
       │         ├─ RailTicket[] ── LandingWindow
       │         └─ ContentAsset[]
       ├─ SalesDay ─── SalesLine[] (from Toast CSV)
       ├─ Lead ─── LeadEvent[] (status transitions, timestamped)
       ├─ ContentAsset ─── Permission
       ├─ LegacyRecord ─── Permission
       ├─ Contact (Community) ─── Interaction[]
       ├─ CompetitorObservation
       ├─ ApprovalItem ─── AuditEntry[]
       └─ User ─── Role
```

### 8.2 Toast import structure

| Field | Source | Notes |
|---|---|---|
| date, day_of_week, hour | **Toast export** | Hour-level granularity is essential — the whole Rail thesis lives in the hourly curve |
| menu_item, menu_category | **Toast export** | |
| quantity_sold, gross_sales, net_sales | **Toast export** | |
| discounts, comps, voids | **Toast export** | Comp/void rate is the primary Rail success metric |
| order_source | **Toast export** | dine-in / online / takeout |
| check_count, average_check | **Toast export** (or derived) | |
| gift_card_activity | **Toast export**, varies by plan | May require separate report |
| merch_sku | **Toast export** *if* merch is rung through Toast | **ASSUMED it is. Verify day 1.** If merch is cash-and-a-shoebox, it is manual entry and that is a finding in itself. |
| labor | **Toast export**, plan-dependent | Nice to have; not MVP-blocking |
| **event_id** | **MANUAL** | Toast does not know which band played. This join is the entire analytical value of the system. |
| **cover_charge_revenue** | **MANUAL** unless rung as a Toast item | Strong recommendation: ring cover as a Toast SKU so it enters the data automatically |
| **advance_seats_sold** | **MANUAL** or reservation platform export | |
| **weather** | **AUTO** (free API) | Cheap, and materially explains variance on a patio-heavy venue |
| **campaign_id / tracking_code** | **MANUAL** at campaign creation | |
| **private_event_revenue** | **MANUAL** from contract | |

**The critical realization:** Toast exports tell you *what* sold and *when*. They cannot tell you *why*. The `event_id` join — mapping every sales hour to the band, the cover, the weather, and the active campaign — is the thing that converts a sales export into intelligence. It is manual, it takes Emily about four minutes per event night, and it is the highest-return four minutes in the whole system.

### 8.3 Explicitly excluded from the data model

Per the brief's rules, and enforced at the schema level so it cannot drift:
- No card numbers, no payment tokens, no PAN fragments.
- No customer names from Toast checks.
- No individual guest purchase histories in the MVP.
- Guest-level data is **aggregated or anonymized** at import. The importer strips prohibited columns before write, and rejects a file that contains a payment column rather than silently dropping it — a silent drop teaches nobody.

---

## 9. Competitor Watch — restructured

The brief's list mixes two incompatible categories. Split it.

### Competitive set — Phoenix metro. These take Handlebar J's Friday night.

| Venue | Watch for |
|---|---|
| Harold's Cave Creek Corral | Sports + BBQ + bar crossover; the Cave Creek draw |
| Buffalo Chip Saloon | Bull riding, dance floor, the "authentic Arizona" claim |
| Rusty Spur Saloon | Old Town tourist capture; walk-in music |
| Foley Ranch Boots & BBQ | Direct BBQ + country positioning; newest threat |
| Dierks Bentley's Whiskey Row | Brand-name draw, scale, Scottsdale footprint |
| Roosters Country | Dance floor, lessons, country nights |
| The Stillery | Nashville-model food + live music |
| Scootin' Boots | Dance-focused, lesson programming |

### Reference archetypes — Texas institutions. Study the form, don't chase them.

Gruene Hall · Billy Bob's Texas · The White Horse · Broken Spoke · John T. Floore's Country Store

These are not competitors. They are the best examples in America of the thing Handlebar J *is* — a historic music institution — and they are worth studying for one reason only: **how they monetize legacy.** Gruene Hall's merch, Broken Spoke's dance lessons, Floore's mythology. That is Legacy Engine research, not competitive intelligence, and putting them in the same table as Rusty Spur produces confused strategy.

**Fields per observation:** competitor · date · event · offer · price · content example · website flow · customer complaint · strength · weakness · labor complexity · risk · feria value · recommendation.

**Recommendations:** `BORROW` · `IMPROVE` · `TEST` · `IGNORE` · `AVOID`

**Added field, not in the brief: `labor complexity`.** The most common way a restaurant loses money copying a competitor's promotion is discovering the promotion requires a prep station and a person they don't have. Any BORROW that raises labor gets flagged before it reaches a campaign.

---

## 10. Permissions, security, and approval

### Roles

| Role | Feria | Leads | Content | Approve | Rail | Settings |
|---|---|---|---|---|---|---|
| Owner (Ray, Joanne) | full | full | full | **yes** | full | full |
| Operator (Emily) | full | full | full | request only | full | limited |
| Floor Lead | tonight only | none | tonight only | no | **run** | no |
| Expo | no | no | no | no | queue only | no |
| WCM | full | full | full | no | full | full |
| Read-only | summary | no | no | no | no | no |

### Non-negotiable rules

1. **No automated publishing of high-risk content.** Memorial, youth/school, artist, and guest-featuring content requires explicit approval every time, with no "remember this choice."
2. **No automated price, menu, event, or Toast changes.** Ever. The Rail *schedules*; it does not *reconfigure*.
3. **Immutable audit log.** Every approval, rejection, publish, and data import: actor, timestamp, before/after. Append-only.
4. **Permission is a first-class field**, not a note. Assets and legacy records carry structured permission state, and the publish path checks it.
5. **Least-privilege by default.** New users start read-only.
6. **No private social account access** without written owner authorization on file.
7. **Data retention:** raw Toast imports retained 24 months; aggregates indefinitely; anything guest-identifying, 90 days maximum — and the MVP should carry none at all.

---

## 11. The 30-day MVP — what actually ships

**Cut hard.** The brief lists eleven MVP items and twelve screens. That is not a 30-day build; it is a 30-day way to ship eleven mediocre things.

### Ships in 30 days

| # | Deliverable | Why it survives the cut |
|---|---|---|
| 1 | **Toast CSV import + Feria dashboard** | Without a baseline there is no proof, and without proof there is no $25K |
| 2 | **Lead Desk with SLA alerting** | The break-even path in §3 runs straight through it |
| 3 | **Tonight at the J + Set Clock** | Runs the night and sets up The Rail |
| 4 | **Content Vault with permission gating** | Legal exposure and re-shoot waste both live here |
| 5 | **Approval Queue (Ray's thumb-scale view)** | Governance; the whole model collapses without it |
| 6 | **Weekly Brief generator (PDF + email)** | The artifact Ray actually judges the engagement on |
| 7 | **The Rail Zero** (§6.8 — QR + landing windows + expo tablet) | The differentiator, piloted for a weekend of work |

### Deferred to Phase 2 (days 31–90)

Campaign Builder (spreadsheet-tracked in month one — and that is fine) · Legacy Engine capture tooling (**but begin interviews immediately; the tool can lag the recording**) · Community Network · Competitor Watch (a structured sheet in month one) · Weekly Brief as an interactive screen.

### Explicitly not built — and the reason each is a trap

| Not building | Why |
|---|---|
| Full Toast API integration | Partner approval, cost, and lead time; unjustified before The Rail Zero proves guest behavior |
| Automated publishing without approval | Violates the governance model that makes Ray comfortable |
| Customer identity profiles | Privacy exposure with no proportionate MVP return |
| AI video generation | Handlebar J's asset is *real* — real ribs, real smoke, a real family. Synthetic video actively damages the thing being sold. |
| Payroll, full CRM, public guest app | Out of scope; LYNK is the guest layer |
| Automated pricing | Explicitly forbidden, and correctly so |
| Unapproved outreach | Reputational risk against exactly the community relationships being built |

---

## 12. The 30-day success test

Emily proves value or she doesn't. The test is declared **before** day 1, not assembled on day 29.

### The four buckets — never merged

| Bucket | Definition | How it's proven |
|---|---|---|
| **1. Already happening** | Baseline revenue on comparable days before the engagement | 90-day Toast export, pre-engagement |
| **2. Influenced** | Revenue on nights Emily promoted, above comparable-day baseline | Same-weekday, same-season comparison |
| **3. Directly attributed** | Revenue carrying a tracking code, QR, package SKU, or named lead | Campaign codes, Toast SKUs, Lead Desk records |
| **4. Pipeline** | Quoted and deposited but not yet delivered | Lead Desk, with quote and deposit documents |

Bucket 3 is the only bucket Emily may claim without qualification. Bucket 2 she may claim **with the comparison shown**. Bucket 1 is never hers. Bucket 4 is a forecast and must be labeled as one.

### The scorecard

| Metric | Day-1 baseline | Day-30 target | Source |
|---|---|---|---|
| Private-event inquiries | Establish | +40% | Lead Desk |
| **Median first-response time** | Establish | **< 60 minutes** | Lead Desk |
| Qualified leads | Establish | ≥ 12 | Lead Desk |
| Quotes sent | Establish | ≥ 8 | Lead Desk |
| Deposits received | Establish | ≥ 3 | Lead Desk |
| Advance seats sold | Establish | Trend up | Manual/reservations |
| Average check, event nights | Establish | +$2–4 | Toast |
| Featured-item sales | Establish | 2× on featured nights | Toast |
| Gift-card sales | Establish | +25% | Toast |
| Merch sales | Establish | Establish channel | Toast/manual |
| Social→booking clicks | Establish | Tracked at all | Tracking codes |
| Content produced | 0 | 25 short-form, 5 hero, 1 walkthrough | Vault |
| Comp + void rate, Rail nights | Establish | Down vs. baseline | Toast |
| Revenue vs. baseline | Establish | Reported honestly, in four buckets | Feria |

**"Establish" is not a hedge — it is the deliverable.** A venue that has never had a baseline getting a real one in 30 days has received something valuable even if every other number is flat.

**The uncomfortable one:** if the 200-inquiry backlog is real and unworked, month one should produce bookings from *existing* demand. That is the fastest, least glamorous, highest-certainty revenue in this entire document, and it requires no content at all.

---

## 13. Technology stack

Recommended, and consistent with what WCM already runs — the Supabase submission pipeline in `lib/lynk-submissions.js` is the template.

| Layer | Choice | Reason |
|---|---|---|
| App | **Next.js (App Router)** | Already the house stack |
| Data | **Supabase (Postgres + RLS + Auth)** | Row-level security maps directly onto the role table in §10; the anon-insert-only pattern for The Rail Zero is already proven in this repo |
| Auth | Supabase Auth, magic link | Ray will not manage a password |
| Files | Supabase Storage | Vault assets, permission metadata alongside |
| CSV import | Client parse → validated server insert | Column allow-list rejects prohibited fields (§8.3) |
| Reports | Server-rendered HTML → PDF | Weekly Brief |
| Email/SMS | Resend + Twilio | SLA alerts; SMS matters because Emily is in a loud room |
| Hosting | Vercel | House standard |
| The Rail (Zero) | Static QR page → Supabase | No Toast dependency |
| The Rail (Phase 3) | Toast Partner API | Only after the pilot earns it |

**Explicitly rejected:** a no-code stack. The permission model, the audit log, and the import allow-list are the parts that make this defensible, and they are exactly the parts no-code platforms make hardest.

---

## 14. Build complexity

| Component | Complexity | Est. |
|---|---|---|
| Toast CSV import + validation | Medium | 5–7 d |
| Feria dashboard | Medium | 5–7 d |
| Lead Desk + SLA | Low-Medium | 4–5 d |
| Tonight at the J + Set Clock | Medium | 4–6 d |
| Content Vault + permission gating | Medium | 5–7 d |
| Approval Queue + audit log | Medium | 4–5 d |
| Weekly Brief generator | Low-Medium | 3–4 d |
| **The Rail Zero** | **Low** | **2–3 d** |
| Auth, roles, RLS | Medium | 3–4 d |
| **MVP total** | | **~35–48 dev-days** |

**That does not fit in 30 calendar days for one developer.** Two honest options: two developers for a month, or one developer and a 45-day MVP. Promising 30 days with one developer is how the engagement starts with a missed commitment — the worst possible opening for a $25K/month relationship.

**Recommendation:** one developer, 45 days, with **The Rail Zero shipped in week one** so there is a live, visible, differentiated thing running at Handlebar J while the rest is built.

Phase 2 (Campaign Builder, Legacy Engine, Community, Competitor Watch): ~25–35 dev-days.
Phase 3 (Toast Partner API, full Rail): ~40–60 dev-days plus partner approval lead time.

---

## 15. Example daily Emily workflow

**Tuesday**

| Time | Action |
|---|---|
| 8:40a | Opens J COMMAND. Recommended Action: *"Three private-event leads are past the 60-minute SLA. Estimated combined value $24K. Call Martinez first — 120 guests, December 14, a date currently open."* |
| 8:45a | Calls Martinez. Logs the call. Moves to QUALIFIED. |
| 9:10a | Clears two content approvals into Ray's queue. |
| 9:30a | Feria: Saturday's rib sales up 18% vs. comparable. Tags SCALE. |
| 10:00a | Vault: uploads Saturday's capture, tags it, flags one clip as restricted pending the artist's permission. |
| 11:00a | Blocks Thursday's shot list in Tonight at the J. |
| 2:00p | Sends the Martinez quote. Moves to QUOTED. Sets follow-up Friday. |
| 4:30p | Confirms Thursday's Set Clock with the band; arms the approved Encore Board offer. |
| 5:00p | Closes the app. Total time in-system: ~50 minutes. |

The system's job is that the 8:40a screen said *"call Martinez"* instead of *"here are twelve charts."*

## 16. Example weekly Ray report

> **HANDLEBAR J — WEEK OF SEPT 8** *(illustrative format; figures are examples, not real data)*
>
> **DECISIONS NEEDED FROM YOU — 3**
> 1. Approve the December 14 private-event quote at $18,400 (120 guests). *Blocks a deposit.*
> 2. Approve or reject the Chaparral fundraiser night concept. *Blocks a 3-week promotion runway.*
> 3. Confirm the Encore Board offer for Herndon Brothers nights through October.
>
> **WHAT MADE FERIA**
> Saturday, Herndon Brothers: $14,200 · +22% vs. comparable Saturday · average check $41 (+$4) · ribs 2.1× normal · Encore Board 34 redemptions, $1,088 attributed.
>
> **WHAT DIDN'T**
> Wednesday: flat. The dance-lesson promotion produced 4 tracked reservations against a threshold of 15. **Recommendation: KILL the current format, TEST as a package with dinner instead.**
>
> **PIPELINE**
> 7 qualified · 4 quoted ($52,000) · 2 deposits ($6,400) · median first response 38 minutes (was 4.5 hours).
>
> **NEXT 7 DAYS**
> Legacy interview with Ray (Tuesday, 45 min) · Herndon Brothers campaign live Thursday · gift-card push begins Monday.

Six minutes. Three decisions. Ray never opens a chart.

## 17. Example Feria Scorecard

| Line | This period | Comparable | Δ | Status |
|---|---|---|---|---|
| Saturday show revenue | $14,200 | $11,640 | +22% | **SCALE** |
| Average check, event nights | $41 | $37 | +$4 | **SCALE** |
| Ribs, featured nights | 2.1× | — | — | **SCALE** |
| Encore Board (attributed) | $1,088 | — | new | **TEST → SCALE** |
| Wednesday dance lesson | 4 res. | threshold 15 | −73% | **KILL** |
| Gift cards | $2,150 | $1,720 | +25% | **IMPROVE** |
| Comp + void %, Rail nights | 2.1% | 3.8% | −1.7pt | **SCALE** |
| Merch | $340 | $310 | +10% | **HOLD** |
| Private-event deposits | $6,400 | $0 | new | **SCALE** |

*Illustrative figures.*

---

## 18. How J COMMAND connects to LYNK and WCM

| System | Owns | Audience |
|---|---|---|
| **Toast** | What actually sold | Operations |
| **J COMMAND** | What to do next | Emily, Ray, Joanne, Floor Lead |
| **THE RAIL** | What happens in the room | Guests, kitchen, floor |
| **Grok / market watch** | What the market is doing | Feeds Competitor Watch |
| **LYNK** | Where guests take action | Guests |
| **WCM** | Strategy, content, technology, execution | The studio |
| **Ray & Joanne** | Brand authority and final approval | — |

**The LYNK connection is architectural, not marketing.** LYNK is already a proven pattern in this codebase — a conversion layer with a locked-down Supabase submission pipeline (`lib/lynk-submissions.js`, `supabase/lynk_submissions.sql`, anon-insert-only RLS). J COMMAND's Lead Desk is the operator-side mirror of exactly that pattern:

- A LYNK private-event enquiry inserts into a submissions table → **appears in the Lead Desk as NEW with a timestamp** → starts the SLA clock.
- The Rail Zero uses the identical anon-insert-only pattern. It is the same architecture serving a different moment.
- Campaign tracking codes generated in J COMMAND resolve to LYNK landing pages, closing the `content → attention → inquiry` loop with an actual join key instead of a guess.

**For WCM this is a productizable system, not a one-off.** A honky-tonk, a real-estate move desk, and a photography studio are the same shape underneath: *capture intent → route it fast → prove what converted.* J COMMAND is the operator-side half of the house platform; LYNK is the guest-side half. Handlebar J is the flagship implementation for the operator half the way Lorenzo von Barron is for the guest half.

---

## 19. Roadmap

| Phase | Window | Ships |
|---|---|---|
| **0 — Baseline** | Days 1–7 | 90-day Toast export, baseline established, money-path audit (hours, calendar, links, forms, Google Business), inquiry backlog verified |
| **1 — MVP** | Days 1–45 | The seven items in §11, with **The Rail Zero live in week one** |
| **2 — Depth** | Days 46–90 | Campaign Builder, Legacy Engine, Community Network, Competitor Watch, interactive brief |
| **3 — The Rail, full** | Months 4–7 | Toast Partner API, Boot Tag, The Round, song-triggered offers, kitchen load balancing |
| **4 — Platform** | Months 8–12 | Multi-venue. If The Rail works at Handlebar J, **every live-music venue in America has the same set-break problem, and none of them have a solution.** That is the product, and Handlebar J is the proof. |

---

## 20. The verdict

**Is the brief buildable?** Yes — at about 60% of its stated scope in the stated time.

**Is it award-winning as written?** No. As written it is a very good internal dashboard, and internal dashboards do not win anything. Dashboards report on a night. **The Rail changes the night.**

**What makes it award-winning:** one genuinely new idea, executed with discipline — *a venue does not run on a clock, it runs on a setlist, so ordering should too.* That idea is specific to live-music hospitality, it is testable for the cost of a QR code, it makes the guest's night better and the kitchen's night easier at the same time, and it produces measurable revenue in the average check. It is also, notably, the only part of this system a competitor cannot buy off a shelf.

**The one thing that must not slip:** Ray's stories. Everything else in this document can be built in month six. Archival memory cannot be recovered once it's gone. Start the interviews in week one.

---

*Prepared by Working Class Marketing. Nothing herein is validated against Handlebar J's operational data. §0's four buckets apply to every figure in this document.*
