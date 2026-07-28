# Move Desk — "Fix Now" Implementation Package

**Goal:** flip the Move Desk from *beautiful demo* to *real lead machine* by closing the seven blocking items. Ship order below is by dependency + impact.

**Definition of done for the whole package:** a stranger scans a QR, submits the buyer OR seller form, and within 60 seconds (a) Savaughna gets a text + email with enough context to call, (b) the lead sees an honest confirmation, (c) consent + source + timestamp are recorded, and (d) the site legally identifies Savaughna and her brokerage.

Environment variables referenced throughout (put in `.env`, never in client code):

```bash
# Lead delivery
RESEND_API_KEY=            # email (resend.com)
LEAD_EMAIL_TO=            # Savaughna's real inbox
LEAD_EMAIL_FROM=movedesk@<verified-domain>
TWILIO_ACCOUNT_SID=       # SMS (twilio.com) — optional day one
TWILIO_AUTH_TOKEN=
TWILIO_FROM=+1XXXXXXXXXX
LEAD_SMS_TO=+1XXXXXXXXXX  # Savaughna's real cell

# Public agent/brokerage identity (safe to expose)
NEXT_PUBLIC_AGENT_NAME="Savaughna <LastName>"
NEXT_PUBLIC_AGENT_PHONE=+1XXXXXXXXXX
NEXT_PUBLIC_AGENT_EMAIL=
NEXT_PUBLIC_BROKERAGE_NAME=
NEXT_PUBLIC_LICENSE_NUMBER=
```

---

## Item 1 — Lead routing (email + SMS to Savaughna) · CRITICAL · low effort

**Build:** one server endpoint that every form POSTs to. It (a) records the lead, (b) emails Savaughna, (c) texts Savaughna. No lead may be captured client-side only.

**Lead payload (shared shape, buyer + seller):**

```ts
type Lead = {
  id: string;                 // uuid
  type: "buyer" | "seller";
  name: string;
  contactMethod: "text" | "call" | "email";
  phone?: string;
  email?: string;
  bestTime?: "morning" | "afternoon" | "evening";
  timeline: "now" | "1-3mo" | "3-6mo" | "exploring";
  // buyer
  priceBand?: string;
  areaAnchor?: string;        // "near ASU", "downtown Phoenix"
  financing?: "cash" | "pre-approved" | "talking-to-lender" | "not-started";
  mustHaves?: string;
  listingId?: string;
  // seller
  motivation?: string;
  propertySnapshot?: string;  // address/zip, beds, baths, sqft, type
  updates?: string;
  priorities?: string[];      // ["top-price","speed"]
  alsoBuying?: "yes" | "no" | "maybe";
  // shared
  note?: string;              // free-text — highest value field
  consent: boolean;           // must be true
  source: string;             // UTM/QR src, e.g. "sign-616krista"
  createdAt: string;          // ISO timestamp
  recommendedAction: string;  // computed, see Item below
};
```

**Reference endpoint (Next.js App Router):** `app/api/lead/route.ts`

```ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const lead = await req.json();

  // 1. Validate the non-negotiables
  if (!lead?.name || !lead?.consent || (!lead.phone && !lead.email)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }
  lead.id ??= crypto.randomUUID();
  lead.createdAt ??= new Date().toISOString();
  lead.recommendedAction = recommendAction(lead); // Item helper below

  // 2. Persist (day one: also write to a Sheet/Airtable via webhook — Item 6)
  //    Fire-and-forget so a slow CRM never blocks the confirmation.

  // 3. Email Savaughna
  await resend.emails.send({
    from: process.env.LEAD_EMAIL_FROM!,
    to: process.env.LEAD_EMAIL_TO!,
    replyTo: lead.email,
    subject: `New ${lead.type} lead — ${lead.name} (${lead.timeline})`,
    text: briefText(lead),
  });

  // 4. Text Savaughna (optional day one; guard if creds absent)
  if (process.env.TWILIO_ACCOUNT_SID) await sendSms(smsText(lead));

  return NextResponse.json({ ok: true, id: lead.id });
}
```

**Acceptance criteria:**
- [ ] Submitting either form results in an email in `LEAD_EMAIL_TO` within 60s.
- [ ] SMS arrives (or is cleanly skipped if Twilio creds absent — never errors).
- [ ] Endpoint rejects (422) missing name, missing both phone+email, or `consent !== true`.
- [ ] A slow/failed CRM write does **not** block the lead email or the user's confirmation.

---

## Item 2 — Lead + on-screen confirmation · CRITICAL · low effort

**Build:** three confirmations from one submit — (a) instant on-screen state, (b) email to the lead, (c) optional SMS to the lead (only if they gave a phone + consented).

**On-screen (replace the thank-you placeholder region):**

> **Got it, {firstName}.**
> Savaughna will reach out by **{sameDayPhrase}** via **{their chosen method}**.
> *(Placeholder for Savaughna's video greeting.)*
> `[ Text Savaughna now ]`  `[ Back to homes ]`

`sameDayPhrase` = "end of day today" before 5pm local, else "tomorrow morning." Never promise a time you can't hit.

**Lead email (from Savaughna's address, human tone):**

```
Subject: Thanks — I've got your details

Hi {firstName},

Thanks for reaching out through my Move Desk. I've got your details and
I'll personally follow up by {sameDayPhrase}.

If you'd rather just talk now, text or call me at {AGENT_PHONE}.

— {AGENT_NAME}, {BROKERAGE_NAME}
{LICENSE_LINE}
```

**Acceptance criteria:**
- [ ] On-screen confirmation shows the lead's name + their chosen contact method + an honest timeframe.
- [ ] Lead receives a confirmation email (and SMS only if phone + consent present).
- [ ] Re-submitting the same form doesn't double-fire (disable button on submit; idempotent by `id`).
- [ ] Confirmation never claims anything is "booked" unless a real calendar confirmed it (see roadmap Item "calendar").

---

## Item 3 — Real contact / brokerage / license / Equal Housing · CRITICAL (legal) · low effort

**Build:** a persistent footer/disclosure block on every page, driven by the public env vars. No hard-coding.

**Reference component:** `components/Disclosure.tsx`

```tsx
export function Disclosure() {
  const {
    NEXT_PUBLIC_AGENT_NAME: name,
    NEXT_PUBLIC_BROKERAGE_NAME: brokerage,
    NEXT_PUBLIC_LICENSE_NUMBER: license,
    NEXT_PUBLIC_AGENT_PHONE: phone,
    NEXT_PUBLIC_AGENT_EMAIL: email,
  } = process.env;
  return (
    <footer className="disclosure">
      <p>{name} · {brokerage} · AZ License #{license}</p>
      <p><a href={`tel:${phone}`}>{phone}</a> · <a href={`mailto:${email}`}>{email}</a></p>
      <p className="fair-housing">
        Equal Housing Opportunity. All information deemed reliable but not
        guaranteed; verify independently. This is a marketing experience,
        not an offer of representation or financing.
      </p>
      <p><a href="/privacy">Privacy Policy</a></p>
    </footer>
  );
}
```

**Acceptance criteria:**
- [ ] Agent name, brokerage, and AZ license # appear on every page.
- [ ] Real, clickable phone + email (tap-to-call on mobile).
- [ ] "Equal Housing Opportunity" line present site-wide.
- [ ] All values come from config/env — swapping to another agent is a config change, not a code edit.
- [ ] Any remaining "demo/prototype" copy is removed before this goes to a real client, OR a visible "Prototype — details not final" banner stays until real values are in.

---

## Item 4 — Consent / TCPA + privacy · CRITICAL (legal) · low effort

**Build:** an explicit, unchecked-by-default consent checkbox on every form that collects phone/email; a privacy policy page; store consent + source + timestamp with the lead.

**Consent UI (required, not pre-checked):**

```tsx
<label className="consent">
  <input type="checkbox" name="consent" required />
  <span>
    I agree that {AGENT_NAME} may contact me by call, text, or email about
    my real-estate inquiry. Message &amp; data rates may apply; reply STOP to
    opt out. See the <a href="/privacy">Privacy Policy</a>.
  </span>
</label>
```

**Rules:**
- Checkbox **must not** be pre-checked. Submit is blocked until checked.
- Persist `consent: true`, `source`, and `createdAt` on the lead record (already in the payload).
- `/privacy` page: what's collected, how it's used, who it's shared with (lender referral partner), opt-out ("reply STOP" / email request), contact. A plain, honest page — placeholder legal copy is fine for MVP but the page must exist and be linked.

**Acceptance criteria:**
- [ ] Form cannot submit with consent unchecked (client + server both enforce).
- [ ] Stored lead includes `consent`, `source`, `createdAt`.
- [ ] `/privacy` exists and is linked from every form + the footer.
- [ ] No SMS is ever sent to a lead who didn't check consent.

---

## Item 5 — Reorder buyer flow + sticky "Text Savaughna" · HIGH · low effort

**Build two changes:**

**(a) Reorder so conversion precedes qualification.** New buyer order:

```
Home → Explore Homes → Step Inside
  → PRIMARY: [ Book a tour ] / [ Text Savaughna ]   ← offered here, early
  → SECONDARY (optional): "Help me plan" (readiness Qs, clearly skippable)
  → Confirm → Thank-you video → Save to My Move Desk
```

Key: the tour/contact CTA appears **before** the finance/readiness questions, and the questions are labeled optional ("Skip — I just want to talk"). A ready buyer must be able to reach Savaughna without answering anything.

**(b) Persistent sticky contact bar** on every screen (mobile thumb-zone, bottom):

```tsx
<div className="sticky-contact" role="region" aria-label="Contact Savaughna">
  <a href={`sms:${AGENT_PHONE}`}>Text</a>
  <a href={`tel:${AGENT_PHONE}`}>Call</a>
  <a href="/talk">Request a time</a>
</div>
```

**Acceptance criteria:**
- [ ] From any listing, a user can reach "text/call/book" in one tap without passing the finance questions.
- [ ] Finance/readiness step is visibly optional and has a working "Skip" path that still lets them book.
- [ ] Sticky contact bar is present on every screen, keyboard-focusable, and doesn't cover key content (respects safe-area insets on iPhone).

---

## Item 6 — Trim "My Neighborhood" to 3 compliant categories · HIGH · low effort

**Build:** reduce the seven tiles to three factual, sourced categories; remove anything subjective; convert to a single "what do you want to be near?" input where possible.

**Keep (only these three):**
1. **Commute / drive-time** — to a *user-entered* anchor. Distance/time facts only.
2. **Schools** — as **links to official AZ sources** (AZ Dept. of Ed / district boundary tools) + prompt: "Verify boundaries and enrollment directly — they change." No ratings, no "best."
3. **Everyday essentials** — grocery, pharmacy, major roads/transit. Proximity facts only.

**Remove / fold / link-out:** standalone Shopping, Dining, Parks, Medical → one outbound "Explore the area" link.

**Hard compliance rules (enforce in code + copy review):**
- [ ] No score, grade, rating, or star anywhere (safety, walkability-as-desirability, "family-friendly," "nice/safe area").
- [ ] No demographics of any kind.
- [ ] No "best schools" / rankings — links only, with the verify prompt.
- [ ] School data renders as an outbound link component, never an inline rating.

**Acceptance criteria:**
- [ ] Exactly 3 categories render; the other four are gone or collapsed into one outbound link.
- [ ] A text search of the neighborhood section returns zero instances of "best," "safe," "score," "rating," "family-friendly," "good schools."
- [ ] Schools section is links + a verify prompt only.

---

## Item 7 — Reframe finance questions as optional routing · HIGH · low-med effort

**Build:** replace any income/credit/debt/down-payment fields with a short, opt-in, routing-only set framed as "so your first call is useful."

**Section intro copy:** *"Optional — a few quick things so your first call with Savaughna is actually useful, not a generic pitch. Skip any of it."*

**Fields (all optional except none-required):**
- **Timeline** — Now / 1–3 mo / 3–6 mo / Just exploring.
- **Price range** — bands or slider, framed "helps me show the right homes."
- **Area anchor** — "Where do you need to be near?" (free text).
- **Financing (routing only):** "Where are you in financing?" → `Paying cash` / `Pre-approved` / `Talking to a lender` / `Haven't started — I'd like a referral`.
- **Must-haves** — one free-text line.
- **"Anything you want Savaughna to know?"** — free text (highest-value field).

**Remove entirely:** income, credit score, debts, exact down-payment amount, and any binary "are you pre-qualified?".

**Routing helper (drives the Auto-Brief "recommended action"):**

```ts
function recommendAction(lead: Lead): string {
  const hot = lead.timeline === "now" || lead.timeline === "1-3mo";
  if (lead.financing === "not-started")
    return "Refer to licensed lender (with disclosure), then follow up.";
  if (["cash", "pre-approved"].includes(lead.financing ?? "") && hot)
    return "Call within the hour — qualified + active. Offer a tour.";
  if (lead.listingId)
    return "Specific listing — call to book the tour.";
  return "Same-day follow-up; qualify timeline on the call.";
}
```

**Lender vs. Savaughna trigger (must be enforced):**
- `financing === "not-started"` → lender referral (named licensed lender + "Savaughna does not provide financing" disclosure).
- `cash | pre-approved` + active timeline, or any specific-listing tour → **Savaughna first.**
- The app never implies approval, rates, or affordability.

**Acceptance criteria:**
- [ ] Zero fields ask income, credit score, debts, or down-payment amount.
- [ ] Whole section is skippable; skipping still allows booking/contact.
- [ ] Financing is a 4-option routing choice, not a yes/no.
- [ ] `recommendedAction` appears in Savaughna's brief email/SMS for every lead.
- [ ] "Haven't started" leads produce a lender-referral action, not a hard sell.

---

## Ship order & rough effort

| # | Item | Blocks launch? | Effort |
|---|------|----------------|--------|
| 1 | Lead routing (email+SMS) | Yes | ~0.5 day |
| 2 | Confirmations | Yes | ~0.5 day |
| 3 | Contact/brokerage/license/EHO | Yes (legal) | ~2 hrs |
| 4 | Consent/TCPA + privacy | Yes (legal) | ~0.5 day |
| 7 | Finance-Q reframe | High | ~0.5 day |
| 5 | Flow reorder + sticky bar | High | ~0.5 day |
| 6 | Neighborhood trim | High | ~0.5 day |

**~3 focused days** gets all seven done. Items 1–4 are the true launch gate; 5–7 are same-sprint polish that materially lifts conversion and closes the Fair-Housing exposure.

## One integrated QA pass before showing a client
- [ ] iPhone Safari: full buyer flow, full seller flow, sticky bar, safe-area insets.
- [ ] Submit with consent unchecked → blocked.
- [ ] Submit valid → Savaughna email+SMS arrive; lead sees honest confirmation; lead email/SMS arrive.
- [ ] Reduced-motion on → Step Inside falls back to static.
- [ ] Grep the site for banned words (best/safe/score/rating/family-friendly).
- [ ] Every page shows license # + EHO + privacy link.
- [ ] "Skip the questions and just book" path works end to end.
