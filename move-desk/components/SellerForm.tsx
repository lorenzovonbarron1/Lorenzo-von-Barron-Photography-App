"use client";

import { useState } from "react";
import Link from "next/link";
import { AGENT } from "@/lib/agent.config";
import { submitLead, makeId, type SellerLead, type ContactMethod, type Timeline, type BestTime, type SellerPriority } from "@/lib/leads";
import ConfirmationScreen from "@/components/ConfirmationScreen";

// Seller strategy intake — a plan and a conversation, not an instant
// robot valuation. No automated home value is shown in MVP.
export default function SellerForm({ source }: { source: string }) {
  const [reason, setReason] = useState("");
  const [timeline, setTimeline] = useState<Timeline | "">("");
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [updates, setUpdates] = useState("");
  const [priorities, setPriorities] = useState<SellerPriority[]>([]);
  const [buyingNext, setBuyingNext] = useState<"yes" | "no" | "maybe" | "">("");
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("text");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bestTime, setBestTime] = useState<BestTime | "">("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");

  function togglePriority(p: SellerPriority) {
    setPriorities((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : cur.length < 2 ? [...cur, p] : cur));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please add your name.";
    if (!phone.trim() && !email.trim()) e.contact = "A phone or email so " + AGENT.name + " can reach you.";
    if (!timeline) e.timeline = "Pick a rough timeline.";
    if (!consent) e.consent = "Please agree so we can contact you.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setState("sending");
    setServerError("");
    const lead: SellerLead = {
      id: makeId(),
      type: "seller",
      name: name.trim(),
      contactMethod,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      bestTime: (bestTime || undefined) as BestTime | undefined,
      timeline: timeline as Timeline,
      reason: reason.trim() || undefined,
      address: address.trim() || undefined,
      propertyType: propertyType.trim() || undefined,
      beds: beds.trim() || undefined,
      baths: baths.trim() || undefined,
      sqft: sqft.trim() || undefined,
      updates: updates.trim() || undefined,
      priorities: priorities.length ? priorities : undefined,
      buyingNext: (buyingNext || undefined) as SellerLead["buyingNext"],
      note: note.trim() || undefined,
      consent,
      source,
      agentId: AGENT.id,
      createdAt: new Date().toISOString(),
    };
    const res = await submitLead(lead);
    if (res.ok) setState("done");
    else { setState("error"); setServerError(res.error || "Something went wrong."); }
  }

  if (state === "done") return <ConfirmationScreen firstName={name.trim().split(" ")[0]} method={contactMethod} />;

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="reason">What's prompting the move?</label>
        <select id="reason" className="select" value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">Select…</option>
          {["Upsizing", "Downsizing", "Relocating", "Investment", "Just curious"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className={`field ${errors.timeline ? "field--error" : ""}`}>
        <label>When would you ideally sell?</label>
        <div className="chips" role="group" aria-label="Timeline">
          {([["now", "ASAP"], ["1-3mo", "1–3 months"], ["3-6mo", "3–6 months"], ["exploring", "Exploring"]] as [Timeline, string][]).map(([v, l]) => (
            <button type="button" key={v} className="chip" aria-pressed={timeline === v} onClick={() => setTimeline(v)}>{l}</button>
          ))}
        </div>
        {errors.timeline && <span className="field__err">{errors.timeline}</span>}
      </div>

      <div className="field">
        <label htmlFor="addr">Address or ZIP</label>
        <input id="addr" className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address, or just a ZIP for now" />
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="ptype">Property type</label>
          <select id="ptype" className="select" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">Select…</option>
            {["Single-family", "Condo / townhome", "Multi-family", "Land", "Other"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sqft">Approx. square footage</label>
          <input id="sqft" className="input" inputMode="numeric" value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="1,849" />
        </div>
      </div>

      <div className="grid-2">
        <div className="field"><label htmlFor="beds">Beds</label><input id="beds" className="input" inputMode="numeric" value={beds} onChange={(e) => setBeds(e.target.value)} /></div>
        <div className="field"><label htmlFor="baths">Baths</label><input id="baths" className="input" inputMode="numeric" value={baths} onChange={(e) => setBaths(e.target.value)} /></div>
      </div>

      <div className="field">
        <label htmlFor="updates">Anything special or recently updated?</label>
        <textarea id="updates" className="textarea" value={updates} onChange={(e) => setUpdates(e.target.value)} placeholder="New kitchen, big lot, mountain view…" />
      </div>

      <div className="field">
        <label>What matters most in this sale? <span className="hint">— pick up to 2</span></label>
        <div className="chips" role="group" aria-label="Priorities">
          {([["price", "Top price"], ["speed", "Speed"], ["certainty", "Certainty"], ["low-hassle", "Low hassle"]] as [SellerPriority, string][]).map(([v, l]) => (
            <button type="button" key={v} className="chip" aria-pressed={priorities.includes(v)} onClick={() => togglePriority(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Are you also buying next?</label>
        <div className="chips" role="group" aria-label="Buying next">
          {(["yes", "no", "maybe"] as const).map((v) => (
            <button type="button" key={v} className="chip" aria-pressed={buyingNext === v} onClick={() => setBuyingNext(buyingNext === v ? "" : v)}>{v[0].toUpperCase() + v.slice(1)}</button>
          ))}
        </div>
      </div>

      <hr className="divider" />

      <div className={`field ${errors.name ? "field--error" : ""}`}>
        <label htmlFor="sname">Your name</label>
        <input id="sname" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        {errors.name && <span className="field__err">{errors.name}</span>}
      </div>

      <div className="field">
        <label>Best way to reach you</label>
        <div className="chips" role="group" aria-label="Preferred contact method">
          {(["text", "call", "email"] as ContactMethod[]).map((m) => (
            <button type="button" key={m} className="chip" aria-pressed={contactMethod === m} onClick={() => setContactMethod(m)}>{m[0].toUpperCase() + m.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="field"><label htmlFor="sphone">Phone</label><input id="sphone" className="input" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" /></div>
        <div className="field"><label htmlFor="semail">Email</label><input id="semail" className="input" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
      </div>
      {errors.contact && <span className="field__err" style={{ display: "block", marginTop: -8, marginBottom: 16 }}>{errors.contact}</span>}

      <div className="field">
        <label>Best time to connect</label>
        <div className="chips" role="group" aria-label="Best time">
          {(["morning", "afternoon", "evening"] as BestTime[]).map((t) => (
            <button type="button" key={t} className="chip" aria-pressed={bestTime === t} onClick={() => setBestTime(bestTime === t ? "" : t)}>{t[0].toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className={`field ${errors.consent ? "field--error" : ""}`}>
        <label className="consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>I agree that {AGENT.name} may contact me by call, text, or email about my inquiry. {AGENT.smsDisclosure} See the <Link href={AGENT.privacyPolicyUrl}>Privacy Policy</Link>.</span>
        </label>
        {errors.consent && <span className="field__err">{errors.consent}</span>}
      </div>

      {state === "error" && (
        <div className="notice notice--warn" style={{ marginBottom: 16 }}>
          Couldn't send that ({serverError}). Retry, or <a href={`sms:${AGENT.phone}`} style={{ color: "var(--lynk-bright)" }}>text {AGENT.name} directly</a>.
        </div>
      )}

      <button type="submit" className="btn btn--primary" disabled={state === "sending"} style={{ marginTop: 8 }}>
        {state === "sending" ? "Sending…" : "Request my strategy call"}
      </button>
    </form>
  );
}
