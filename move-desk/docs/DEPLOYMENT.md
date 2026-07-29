# DEPLOYMENT.md — LYNK Move Desk

Server-rendered Next.js app (`/api/lead` must run server-side). Node 18.18+.
Works on any Node host: a VPS/Docker/Fly machine (recommended — enables the
durable file store) or Vercel/serverless (use the CRM webhook as system of
record). Do each step in order; verify before moving on.

## 0. Build sanity (local)

```bash
cd move-desk
npm install
npm run typecheck && npm run build && npm run verify   # expect all green
```

## 1. Configure the environment

Copy `.env.example` → host environment. Run the gate:

```bash
npm run check-env    # exit 0 = required config present; never prints values
```

**Required for a real launch** (check-env enforces):
- `RESEND_API_KEY`, `LEAD_EMAIL_FROM` — email channel (Resend, verified domain)
- `AGENT_NOTIFY_EMAIL` — where lead alerts land
- `AGENT_CONSOLE_TOKEN` — locks the Agent Console (generate: `openssl rand -hex 24`)
- Durable leads, at least one of:
  - `LEAD_STORE=file` (+ optional `LEAD_STORE_DIR`) — hosts with a persistent
    disk / mounted volume. Verified restart-safe by `npm run verify`.
  - `CRM_WEBHOOK_URL` — CRM becomes the system of record (required approach on
    serverless without a volume; local disk there is ephemeral).

**Optional:** `NEXT_PUBLIC_CAL_BOOKING_URL` (real booking button),
`AGENT_NOTIFY_PHONE`, and the SMS group (`SMS_ENABLED=true` + `TWILIO_*`) —
SMS stays off without the explicit flag; see PRODUCTION-CHECKLIST.md §5.

## 2. Real agent details (code, not env)

`lib/agent.config.ts`: phone, email, brokerage, license, lender, SMS
disclosure; then `demoNotice: ""` and `isDemo: false`. Field map in
PRODUCTION-CHECKLIST.md §1. **Do not flip `isDemo` while any placeholder
remains.**

## 3. Deploy

```bash
npm run build
npm run start        # binds :3000; front with your host's TLS/proxy
```
Docker/Fly: `node_modules` + `.next` in the image, `npm run start` as CMD,
mount a volume at `LEAD_STORE_DIR` when using the file store. Vercel: project
root `move-desk/`, set env vars in the dashboard, use `CRM_WEBHOOK_URL`
persistence.

## 4. Protect the Agent Console

`/agent/brief` renders lead PII. Layers (use both when possible):
1. **App-level (built in):** `AGENT_CONSOLE_TOKEN` set → console requires
   `?token=…` (constant-time compare). Unset in production → console renders a
   locked page with zero lead data. Local development without a token stays
   open — that is the only demo backdoor, and it never applies when
   `NODE_ENV=production`.
2. **Host-level (recommended):** put `/agent/*` behind your platform's access
   control (Vercel Protection, Cloudflare Access, basic-auth proxy) so the
   path never reaches the app unauthenticated.
Headers: `/agent/*` and `/api/*` are served `Cache-Control: no-store` plus
nosniff/frame-deny/referrer/permissions baselines (next.config.mjs).

## 5. Verify against the deployed URL

```bash
BASE_URL=https://your-domain AGENT_CONSOLE_TOKEN=<token> npm run verify
# restart-survival is skipped against a remote server; all other checks run
npm run smoke:email   # one labeled test lead; see script output for what to expect
```
The email check reports **delivered** only when the configured Resend creds
actually delivered; otherwise it reports mocked and says so.

## 6. Production-launch checklist (honest)

- [ ] `npm run check-env` exits 0 on the host
- [ ] `npm run verify` green locally; deployed-URL run green (minus restart check)
- [ ] Smoke email arrived in `AGENT_NOTIFY_EMAIL`'s real inbox
- [ ] CRM webhook receiving `{ lead, brief }` (if configured) — confirmed in the CRM
- [ ] `/agent/brief` without token → locked page on the PRODUCTION URL
- [ ] Agent config real; `isDemo:false`; demo banners gone; privacy copy reviewed
- [ ] `sms:`/`tel:` links tested on a physical phone
- [ ] Listing photos approved & swapped, or demo labeling retained

## Still demo-only after all of the above

- My Move Desk access (demo token — no secure magic links yet; don't market it
  as a private account)
- Sample listing media/facts unless replaced
- SMS unless the TCPA review is done and `SMS_ENABLED=true` deliberately set
- In-memory store when neither `LEAD_STORE=file` nor CRM webhook is configured
