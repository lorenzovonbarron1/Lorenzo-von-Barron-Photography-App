#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// Repeatable verification for the Move Desk lead engine.
//
//   npm run verify
//
// Boots its own dev server on :3100 with a production-like posture
// (LEAD_STORE=file into a temp dir + AGENT_CONSOLE_TOKEN), runs
// API-level checks, browser checks when `playwright` is installed,
// then a RESTART-SURVIVAL check proving file persistence. Point
// BASE_URL at a running server to test that instead (restart check
// is skipped — this script won't kill a server it doesn't own).
//
// Live-channel honesty: with RESEND_API_KEY + LEAD_EMAIL_FROM in the
// environment the email check asserts "delivered" via the console;
// without them it asserts "mocked". SMS is never exercised live here
// unless the environment already sets SMS_ENABLED=true.
// ─────────────────────────────────────────────────────────────
import { spawn } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

const OWNED = !process.env.BASE_URL;
const BASE = process.env.BASE_URL || "http://localhost:3100";
const TOKEN = process.env.AGENT_CONSOLE_TOKEN || "verify-secret";
const STORE_DIR = path.join(process.cwd(), `.verify-data-${Date.now()}`);
const serverEnv = {
  ...process.env,
  ...(OWNED ? { LEAD_STORE: "file", LEAD_STORE_DIR: STORE_DIR, AGENT_CONSOLE_TOKEN: TOKEN } : {}),
};

let child = null;
let pass = 0, fail = 0, skip = 0;
const ok = (name) => { pass++; console.log(`  ✓ ${name}`); };
const bad = (name, extra = "") => { fail++; console.log(`  ✗ ${name}${extra ? ` — ${extra}` : ""}`); };
const skipped = (name, why) => { skip++; console.log(`  – ${name} (skipped: ${why})`); };

async function reachable() {
  try { const r = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(2500) }); return r.ok; }
  catch { return false; }
}
async function boot() {
  child = spawn("npx", ["next", "dev", "-p", "3100"], { stdio: "ignore", detached: true, env: serverEnv });
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await reachable()) return true;
  }
  return false;
}
function stop() {
  if (child) { try { process.kill(-child.pid); } catch { /* gone */ } child = null; }
}
async function post(body) {
  const res = await fetch(`${BASE}/api/lead`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}
const consoleHtml = async () => (await fetch(`${BASE}/agent/brief?token=${encodeURIComponent(TOKEN)}`)).text();
function buyer(overrides = {}) {
  return {
    type: "buyer", name: "Verify Bot", contactMethod: "text", phone: "+14805550111",
    timeline: "now", financing: "pre-approved", consent: true, source: "verify",
    agentId: "emily", createdAt: "", ...overrides,
  };
}

// ── boot ─────────────────────────────────────────────────────
if (!(await reachable())) {
  if (!OWNED) { console.error(`BASE_URL ${BASE} is not reachable`); process.exit(1); }
  console.log(`Starting dev server at ${BASE} (file store, console token) …`);
  if (!(await boot())) { console.error("Server failed to start"); process.exit(1); }
}

// Warm-up: in dev, the console page's first on-demand compile resets
// server module state; the file store makes results durable anyway,
// and warming keeps memory-mode runs deterministic too.
await consoleHtml().catch(() => null);

console.log("\nAPI checks");

// 1. Consent gate.
{
  const { status } = await post(buyer({ consent: false }));
  status === 422 ? ok("invalid consent blocks submission with 422") : bad("consent gate", `got ${status}`);
}

// 2. Required fields.
{
  const a = await post(buyer({ name: "" }));
  const b = await post(buyer({ phone: undefined, email: undefined }));
  a.status === 422 && b.status === 422
    ? ok("missing name / contact channel rejected with 422")
    : bad("required-field validation", `got ${a.status}/${b.status}`);
}

// 3. Valid lead; minimal consumer response.
{
  const { status, json } = await post(buyer());
  status === 200 && json.ok && json.id && !("brief" in json) && !("delivery" in json)
    ? ok("valid buyer lead accepted; response minimal (no brief/delivery leaked to consumer)")
    : bad("valid lead / minimal response", `status ${status}, keys: ${Object.keys(json).join(",")}`);
}

// 4-6. Attribution → Auto-Brief → console; delivery honesty; SMS gate.
const marker = `verify-${Date.now()}`;
{
  const { status } = await post(buyer({
    name: "Verify Attribution",
    attribution: { source: marker, utmSource: "qr", utmMedium: "test", utmCampaign: marker, listingId: "616-krista" },
  }));
  const html = await consoleHtml();
  status === 200 && html.includes(marker) && html.includes("call-now-offer-tour")
    ? ok("buyer lead creates an Auto-Brief; attribution survives API → Agent Console")
    : bad("attribution → Auto-Brief", `status ${status}, marker in console: ${html.includes(marker)}`);

  const emailLive = Boolean(process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM);
  const expect = emailLive ? "email: delivered" : "email: mocked";
  html.includes(expect)
    ? ok(`no-creds delivery is ${emailLive ? "LIVE (Resend verified via console)" : "mocked, not a failed user experience"}`)
    : bad("delivery status", `expected "${expect}" on the console`);

  if (process.env.SMS_ENABLED !== "true") {
    !html.includes("sms: delivered")
      ? ok("SMS remains mocked without explicit SMS_ENABLED=true")
      : bad("SMS gate", "sms delivered without SMS_ENABLED");
  } else {
    skipped("SMS gate", "SMS_ENABLED=true set");
  }

  // 7. Console lock: no token → locked page, zero lead PII.
  const locked = await (await fetch(`${BASE}/agent/brief`)).text();
  if (OWNED || process.env.AGENT_CONSOLE_TOKEN) {
    locked.includes("locked") && !locked.includes(marker) && !locked.includes("Jordan Rivera")
      ? ok("Agent Console requires token; locked page exposes no lead PII")
      : bad("console lock", "lead data reachable without token");
  } else {
    skipped("console lock", "external server without AGENT_CONSOLE_TOKEN");
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

  await page.goto(`${BASE}/?src=${journeyMarker}&utm_campaign=${journeyMarker}`, { waitUntil: "networkidle" });
  await page.goto(`${BASE}/buy`, { waitUntil: "networkidle" });
  await page.fill("#name", "Journey Bot");
  await page.fill("#phone", "+14805550222");
  await page.getByRole("button", { name: "1–3 months" }).click();
  await page.locator(".consent input").check();
  await page.getByRole("button", { name: /Send to/ }).click();
  await page.waitForSelector("text=You're on", { timeout: 10000 }).catch(() => null);
  (await consoleHtml()).includes(journeyMarker)
    ? ok("attribution survives landing → form → API → Auto-Brief (browser)")
    : bad("browser journey attribution", "marker missing from console");

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

// ── restart survival (file persistence) ──────────────────────
console.log("\nPersistence checks");
if (!OWNED) {
  skipped("leads survive a server restart", "external BASE_URL — won't restart a server this script doesn't own");
} else {
  stop();
  await new Promise((r) => setTimeout(r, 1500));
  if (await boot()) {
    const html = await consoleHtml();
    html.includes(marker) && html.includes("stored: durable")
      ? ok("leads survive a server restart (LEAD_STORE=file verified durable)")
      : bad("restart survival", `marker after restart: ${html.includes(marker)}, durable chip: ${html.includes("stored: durable")}`);
  } else {
    bad("restart survival", "server failed to restart");
  }
}

// ── report ───────────────────────────────────────────────────
console.log(`\n${pass} passed · ${fail} failed · ${skip} skipped`);
stop();
if (OWNED) { try { rmSync(STORE_DIR, { recursive: true, force: true }); } catch { /* fine */ } }
process.exit(fail ? 1 : 0);
