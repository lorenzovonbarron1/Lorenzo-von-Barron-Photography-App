# Production checklist — LYNK Move Desk

Work top to bottom. The app runs safely with everything unset (all delivery
mocked); each step below turns one real thing on. **Never claim a channel is
live until `npm run verify` (or a manual test) has proven it with the real
credentials.**

## 1. Agent identity — `lib/agent.config.ts`

Every real-world detail lives in the active `AgentProfile` object (Emily is
the template). Replace, per field:

| Field | Replace with | Currently |
|---|---|---|
| `phone` | Agent's real routing number, E.164 (`+1480…`) — drives every `sms:`/`tel:` link | `+10000000000` placeholder |
| `email` | Agent's real inbox — drives `mailto:` + default alert target | placeholder |
| `brokerage.brokerageName` | Real brokerage legal name | `[Brokerage Name]` |
| `brokerage.licenseNumber` | Real AZ license # | `[AZ License #]` |
| `brokerage.demoNotice` | `""` (empty string removes the prototype banner) | prototype text |
| `isDemo` | `false` — removes the "Demo persona" badge. **Only when the above are real.** | `true` |
| `lender.*` | Named licensed lender + NMLS # for the referral flow | placeholders |
| `privacyPolicyUrl` | Keep `/privacy` after replacing its placeholder copy with reviewed legal text, or point to a hosted policy | `/privacy` (placeholder copy) |
| `smsDisclosure` | Reviewed TCPA consent language | draft text |

## 2. Email — Resend (the first real channel)

1. Create a [resend.com](https://resend.com) account; verify the sending domain.
2. Set in `.env` (or host env):
   ```bash
   RESEND_API_KEY=re_xxxxxxxxx
   LEAD_EMAIL_FROM=movedesk@your-verified-domain.com
   AGENT_NOTIFY_EMAIL=agent-real-inbox@example.com   # where lead alerts go
   ```
3. Prove it: `npm run verify` → the email check must report
   **"LIVE (Resend verified via console)"**, and the alert email must arrive
   in `AGENT_NOTIFY_EMAIL`.

Behavior once live: agent gets the Auto-Brief email (reply-to = the lead), the
lead gets a confirmation email.

## 3. CRM webhook

```bash
CRM_WEBHOOK_URL=https://…   # Follow Up Boss inbound / Airtable / Zapier catch-hook
```
POSTs `{ lead, brief }` JSON per submission. Leads are additionally kept
in-memory either way, so a webhook outage never loses a lead within a server
session. Prove it: submit a test lead, confirm the row/contact appears in the
CRM and the Agent Console shows `crm: delivered`.

## 4. Calendar

```bash
NEXT_PUBLIC_CAL_BOOKING_URL=https://cal.com/your-agent/intro
```
Adds a real "Book a time on the calendar" button on `/talk`. Until set, the UI
deliberately says "appointment request," and must keep saying it.

## 5. SMS — Twilio (OFF by default, explicit opt-in)

SMS does **not** activate on credentials alone. All four are required:
```bash
SMS_ENABLED=true            # the explicit TCPA sign-off switch
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_FROM=+1XXXXXXXXXX    # a number registered for A2P 10DLC
AGENT_NOTIFY_PHONE=+1XXXXXXXXXX   # where agent SMS alerts go
```
Before setting `SMS_ENABLED=true`, confirm: consent checkbox copy reviewed,
STOP/opt-out handling configured on the Twilio number, A2P 10DLC registration
done. Consumer SMS is only ever sent to leads who checked the consent box.

## 6. Pre-launch gates (from the product audit)

- [ ] Real agent phone/email in config (test `sms:`/`tel:` links on a phone)
- [ ] Brokerage + license + Equal Housing rendering in the footer
- [ ] Privacy page has reviewed copy; consent checkbox references it
- [ ] Email channel live and verified (step 2)
- [ ] CRM or `AGENT_NOTIFY_EMAIL` reliably receiving every lead
- [ ] `/agent/brief` protected (host-level auth / IP allowlist) — it exposes lead PII
- [ ] `npm run verify` fully green with production env
- [ ] Property photos approved + swapped in (`lib/listings.ts`), or demo
      labeling kept if still using the sample listing

## Verification

```bash
cd move-desk
npm run verify              # boots :3100, API checks; browser checks if playwright installed
npm i -D playwright         # (once) enables the browser journey + 390px checks
```

## What stays mocked until its step is done

| Channel | Mocked behavior |
|---|---|
| Email | Logged as `[email:mock]`, console shows `email: mocked` |
| SMS | Logged as `[sms:mock]`; requires SMS_ENABLED **and** creds |
| CRM | In-memory only (per server session) |
| Calendar | Honest "appointment request" language |
| My Move Desk auth | Demo token — do not market as secure until magic links ship |
