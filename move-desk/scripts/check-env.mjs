#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// Environment validation — `npm run check-env`
//
// Reports which configuration is present/missing for a REAL
// production launch, without ever printing a value. Exit code 1 when
// a launch-required item is missing (safe to use as a deploy gate).
// ─────────────────────────────────────────────────────────────

const bool = (v) => (v ? "set" : "MISSING");
const has = (name) => Boolean(process.env[name]);

// Required to operate as a real lead machine.
const required = [
  ["RESEND_API_KEY", "agent + lead email delivery"],
  ["LEAD_EMAIL_FROM", "verified sender address"],
  ["AGENT_NOTIFY_EMAIL", "where lead alerts land"],
  ["AGENT_CONSOLE_TOKEN", "locks /agent/brief (lead PII)"],
];

// One of these must provide durable lead records.
const persistenceOptions = [
  ["LEAD_STORE=file", process.env.LEAD_STORE === "file", "durable file store (persistent-disk hosts)"],
  ["CRM_WEBHOOK_URL", has("CRM_WEBHOOK_URL"), "CRM as system of record"],
];

// Optional — feature unlocks.
const optional = [
  ["NEXT_PUBLIC_CAL_BOOKING_URL", "real calendar booking link"],
  ["AGENT_NOTIFY_PHONE", "agent SMS alerts (needs SMS enabled)"],
  ["SMS_ENABLED + TWILIO_*", "consumer/agent SMS — explicit TCPA opt-in", process.env.SMS_ENABLED === "true" && has("TWILIO_ACCOUNT_SID") && has("TWILIO_AUTH_TOKEN") && has("TWILIO_FROM")],
  ["LEAD_STORE_DIR", "custom file-store location"],
];

let missing = 0;
console.log("Move Desk environment check (values are never printed)\n");

console.log("Required for production launch:");
for (const [name, why] of required) {
  const ok = has(name);
  if (!ok) missing++;
  console.log(`  ${ok ? "✓" : "✗"} ${name.padEnd(28)} ${ok ? "set" : "MISSING"} — ${why}`);
}

console.log("\nDurable lead record (at least one):");
const anyPersistence = persistenceOptions.some(([, ok]) => ok);
for (const [name, ok, why] of persistenceOptions) {
  console.log(`  ${ok ? "✓" : "·"} ${name.padEnd(28)} ${ok ? "set" : "not set"} — ${why}`);
}
if (!anyPersistence) {
  missing++;
  console.log("  ✗ neither is set — leads will NOT survive a restart (demo mode only)");
}

console.log("\nOptional:");
for (const [name, why, computed] of optional) {
  const ok = computed !== undefined ? computed : has(name);
  console.log(`  ${ok ? "✓" : "·"} ${name.padEnd(28)} ${ok ? "set" : "not set"} — ${why}`);
}

// Agent config sanity (placeholders are code-level, not env).
console.log("\nReminder (code, not env): real agent phone/email, brokerage, license,");
console.log("lender, and isDemo:false live in lib/agent.config.ts — see PRODUCTION-CHECKLIST.md");

console.log(`\n${missing === 0 ? "READY: required configuration present." : `NOT READY: ${missing} required item(s) missing.`}`);
process.exit(missing === 0 ? 0 : 1);
