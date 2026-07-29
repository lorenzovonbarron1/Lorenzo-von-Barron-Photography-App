#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// Repeatable verification for the Move Desk lead engine.
//
//   npm run verify
//
// Boots a dev server on :3100 (unless BASE_URL points at a running
// instance), runs API-level checks, then — if `playwright` is
// installed (npm i -D playwright) — runs the browser journey checks
// (attribution landing→form→brief, sticky bar at 390px). Browser
// checks are skipped gracefully when playwright is absent.
//
// Live-channel note: with RESEND_API_KEY configured the email check
// asserts "delivered" via the Agent Console; without it, "mocked".
// The script never claims live behavior it didn't observe.
// ─────────────────────────────────────────────────────────────
import { spawn } from "node:child_process";

const BASE = process.env.BASE_URL || "http://localhost:3100";
let child = null;
let pass = 0, fail = 0, skip = 0;

const ok = (name) => { pass++; console.log(`  ✓ ${name}`); };
const bad = (name, extra = "") => { fail++; console.log(`  ✗ ${name}${extra ? ` — ${extra}` : ""}`); };
const skipped = (name, why) => { skip++; console.log(`  – ${name} (skipped: ${why})`); };

async function reachable() {
  try { const r = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(2500) }); return r.ok; }
  catch { return false; }
}

async function post(body) {
  const res = await fetch(`${BASE}/api/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

function buyer(overrides = {}) {
  return {
    type: "buyer", name: "Verify Bot", contactMethod: "text", phone: "+14805550111",
    timeline: "now", financing: "pre-approved", consent: true, source: "verify",
    agentId: "emily", createdAt: "", ...overrides,
  };
}

// ── boot ─────────────────────────────────────────────────────
if (!(await reachable())) {
  console.log(`Starting dev server at ${BASE} …`);
  child = spawn("npx", ["next", "dev", "-p", "3100"], { stdio: "ignore", detached: true });
  let up = false;
  for (let i = 0; i < 90 && !up; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    up = await reachable();
  }
  if (!up) { console.error("Server failed to start"); process.exit(1); }
}

// Warm-up: in dev, the console page's first on-demand compile resets
// server module state, which would hide leads posted before it. A
// prebuilt production server has no such reset; warming is harmless
// there and makes this script deterministic in both modes.
await fetch(`${BASE}/agent/brief`).catch(() => null);

console.log("\nAPI checks");

// 1. Consent missing/false → 422, nothing accepted.
{
  const { status } = await post(buyer({ consent: false }));
  status === 422 ? ok("invalid consent blocks submission with 422") : bad("consent gate", `got ${status}`);
}

// 2. Missing name / missing contact channel → 422.
{
  const a = await post(buyer({ name: "" }));
  const b = await post(buyer({ phone: undefined, email: undefined }));
  a.status === 422 && b.status === 422
    ? ok("missing name / contact channel rejected with 422")
    : bad("required-field validation", `got ${a.status}/${b.status}`);
}

// 3. Valid buyer lead → accepted; consumer response is minimal.
{
  const { status, json } = await post(buyer());
  if (status === 200 && json.ok && json.id && !("brief" in json) && !("delivery" in json)) {
    ok("valid buyer lead accepted; response minimal (no brief/delivery leaked to consumer)");
  } else {
    bad("valid lead / minimal response", `status ${status}, keys: ${Object.keys(json).join(",")}`);
  }
}

// 4. Attribution + Auto-Brief: POST with campaign context, then
//    confirm it surfaces on the Agent Console (proves the brief was
//    built and attribution survived API → console).
const marker = `verify-${Date.now()}`;
{
  const { status } = await post(buyer({
    name: "Verify Attribution",
    attribution: { source: marker, utmSource: "qr", utmMedium: "test", utmCampaign: marker, listingId: "616-krista" },
  }));
  const html = await (await fetch(`${BASE}/agent/brief`)).text();
  if (status === 200 && html.includes(marker) && html.includes("call-now-offer-tour")) {
    ok("buyer lead creates an Auto-Brief; attribution survives API → Agent Console");
  } else {
    bad("attribution → Auto-Brief", `status ${status}, marker in console: ${html.includes(marker)}`);
  }

  // 5. Delivery honesty: mocked without creds, delivered with them.
  const emailLive = Boolean(process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM);
  const expect = emailLive ? "email: delivered" : "email: mocked";
  if (html.includes(expect)) {
    ok(`no-creds delivery is ${emailLive ? "LIVE (Resend verified via console)" : "mocked, not a failed user experience"}`);
  } else {
    bad("delivery status", `expected "${expect}" on the console`);
  }

  // 6. SMS must stay mocked unless explicitly enabled.
  if (process.env.SMS_ENABLED !== "true") {
    html.includes("sms: mocked") || !html.includes("sms: delivered")
      ? ok("SMS remains mocked without explicit SMS_ENABLED=true")
      : bad("SMS gate", "sms delivered without SMS_ENABLED");
  } else {
    skipped("SMS gate", "SMS_ENABLED=true set");
  }
}

// ── browser checks (optional) ────────────────────────────────
console.log("\nBrowser checks");
let pw = null;
try { pw = await import("playwright"); } catch { /* not installed */ }
if (!pw) {
  skipped("landing → form → brief journey", "playwright not installed (npm i -D playwright)");
  skipped("sticky bar fits at 390px", "playwright not installed");
} else {
  const browser = await pw.chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium",
  }).catch(() => pw.chromium.launch());
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const journeyMarker = `journey-${Date.now()}`;

  // Full journey: QR landing → buyer form → submit → Agent Console.
  await page.goto(`${BASE}/?src=${journeyMarker}&utm_campaign=${journeyMarker}`, { waitUntil: "networkidle" });
  await page.goto(`${BASE}/buy`, { waitUntil: "networkidle" });
  await page.fill("#name", "Journey Bot");
  await page.fill("#phone", "+14805550222");
  await page.getByRole("button", { name: "1–3 months" }).click();
  await page.locator(".consent input").check();
  await page.getByRole("button", { name: /Send to/ }).click();
  await page.waitForSelector("text=You're on", { timeout: 10000 }).catch(() => null);
  const consoleHtml = await (await fetch(`${BASE}/agent/brief`)).text();
  consoleHtml.includes(journeyMarker)
    ? ok("attribution survives landing → form → API → Auto-Brief (browser)")
    : bad("browser journey attribution", "marker missing from console");

  // Sticky bar geometry at 390px.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const geom = await page.evaluate(() => {
    const bar = document.querySelector(".sticky-contact");
    if (!bar) return null;
    const r = bar.getBoundingClientRect();
    const overflowing = [...bar.querySelectorAll(".btn")].some((b) => b.scrollWidth > b.clientWidth + 1);
    return { width: r.width, docOverflow: document.documentElement.scrollWidth > 391, overflowing };
  });
  geom && geom.width <= 391 && !geom.docOverflow && !geom.overflowing
    ? ok("sticky bar fits at 390px (no wrap, no horizontal scroll)")
    : bad("sticky bar 390px", JSON.stringify(geom));

  await browser.close();
}

// ── report ───────────────────────────────────────────────────
console.log(`\n${pass} passed · ${fail} failed · ${skip} skipped`);
if (child) { try { process.kill(-child.pid); } catch { /* already gone */ } }
process.exit(fail ? 1 : 0);
