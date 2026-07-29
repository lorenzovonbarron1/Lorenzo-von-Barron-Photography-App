#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// Live-email smoke test — `npm run smoke:email`
//
// Posts ONE clearly-labeled test lead to a running server (BASE_URL,
// default http://localhost:3000) and tells you exactly what to expect.
//
// Honesty rules:
//   - Without RESEND_API_KEY + LEAD_EMAIL_FROM in the SERVER's env,
//     delivery is mocked; this script says so plainly and does not
//     claim a live send.
//   - No SMS is ever sent unless the server has SMS_ENABLED=true; the
//     test lead carries no phone number at all, so even then the SMS
//     path is not exercised here.
// ─────────────────────────────────────────────────────────────

const BASE = process.env.BASE_URL || "http://localhost:3000";
const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM);

const payload = {
  type: "buyer",
  name: "SMOKE TEST — safe to delete",
  contactMethod: "email",
  email: process.env.SMOKE_LEAD_EMAIL || "smoke-test@example.com",
  timeline: "exploring",
  note: "Automated live-email smoke test lead. Not a real inquiry.",
  consent: true,
  source: "smoke-test",
  attribution: { source: "smoke-test", utmCampaign: "smoke-test" },
  agentId: "emily",
  createdAt: "",
};

const res = await fetch(`${BASE}/api/lead`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
}).catch((e) => { console.error(`Server unreachable at ${BASE} — start it first (npm run dev / start). ${e.message}`); process.exit(1); });

const json = await res.json().catch(() => ({}));
if (!res.ok || !json.ok) {
  console.error(`Smoke test FAILED — HTTP ${res.status}`, json);
  process.exit(1);
}

console.log(`Smoke lead accepted: ${json.id}`);
if (emailConfigured) {
  console.log(`
This script's env has Resend configured. If the SERVER shares it:
  1. Check AGENT_NOTIFY_EMAIL's inbox for "New buyer lead — SMOKE TEST…"
  2. Check the console (/agent/brief?token=…) — expect "email: delivered"
Only after seeing both may you call the email channel live.`);
} else {
  console.log(`
RESEND_API_KEY / LEAD_EMAIL_FROM not present in this environment:
delivery was MOCKED — no real email was sent. The console will show
"email: mocked". Configure the server env and re-run to smoke-test a
real send.`);
}
