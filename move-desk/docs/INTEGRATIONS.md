# Integrations — developer notes

Every external service sits behind `lib/integrations/*` with a mock path that
runs when its env vars are absent. **Nothing throws into the request path**; a
failed or mocked delivery is reported in the `/api/lead` response's `delivery`
array as `{ channel, live, ok, detail }`.

`lib/integrations/config.ts` is the ONE place env vars are read. Components and
modules never touch `process.env` for integrations directly.

## Environment variables

| Variable | Enables | Behavior when absent |
|---|---|---|
| `RESEND_API_KEY` + `LEAD_EMAIL_FROM` | Agent + lead confirmation email via Resend | Email logged to server console (`[email:mock]`), reported `live:false` |
| `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` + `TWILIO_FROM` | Agent + lead SMS via Twilio | SMS logged (`[sms:mock]`), reported `live:false` |
| `CRM_WEBHOOK_URL` | POST `{ lead, brief }` JSON to your CRM / Airtable / Zapier catch-hook | Leads kept in server memory only (visible in `/agent/brief` for the session) |
| `NEXT_PUBLIC_CAL_BOOKING_URL` | "Request a time" becomes a real booking link (Cal.com / Calendly) | UI honestly labels it an **appointment request**, not a booking |
| `AGENT_NOTIFY_EMAIL` | Overrides where agent lead-alerts email goes | Falls back to `AGENT.email` in `lib/agent.config.ts` |
| `AGENT_NOTIFY_PHONE` | Overrides where agent lead-alert SMS goes | Falls back to `AGENT.phone` |

All in `.env` (copy `.env.example`). `NEXT_PUBLIC_*` vars are exposed to the
browser — never put secrets there.

## Expected behavior per group

**Email (Resend).** `sendEmail()` POSTs to `api.resend.com/emails` with
`LEAD_EMAIL_FROM` as sender (must be a Resend-verified domain). Used for (1)
the agent's Auto-Brief alert, (2) the lead's confirmation. Lead's own email is
set as `reply_to` on the agent alert so the agent can reply directly.

**SMS (Twilio).** `sendSms()` uses the REST API directly (no SDK dependency).
Used for (1) agent's one-line brief headline, (2) lead's confirmation.
**Consent gating happens in `/api/lead`** — a lead without `consent: true` is
rejected with 422 before any send. Lead SMS is only attempted when the lead
supplied a phone number.

**CRM webhook.** `persistLead()` always writes to server memory first (so a
lead is never lost when a webhook is down), then POSTs `{ lead, brief }`. Any
JSON-accepting endpoint works: Follow Up Boss inbound, Airtable automation,
Zapier/Make catch hook.

**Calendar.** No API calls — just a URL. When set, `/talk` and confirmations
can deep-link to real scheduling; when unset, the UI must keep the honest
"request, not booking" language (see `calendarIsLive()`).

## Order of operations in `/api/lead`

1. Validate: name, phone-or-email, `consent === true` → else 422, nothing sent.
2. Build Auto-Brief (`lib/autobrief.ts`) — includes attribution.
3. Persist (memory + CRM webhook if live).
4. Notify agent (email → `notify.email`, SMS → `notify.phone`).
5. Confirm to lead (email if given; SMS if phone given).
6. Respond `{ ok, id, brief, delivery[] }` — the client shows the confirmation
   screen on `ok`, and the delivery array tells you exactly what was live vs mocked.

## Adding a new provider

Swap the implementation inside the module (e.g. Postmark instead of Resend in
`email.ts`); the interface (`sendEmail`, `sendSms`, `persistLead`) and the rest
of the app don't change. Add its env vars to `config.ts` and this table.
