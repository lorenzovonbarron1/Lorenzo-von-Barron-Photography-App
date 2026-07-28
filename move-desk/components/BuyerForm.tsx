"use client";

import { useState } from "react";
import Link from "next/link";
import { AGENT } from "@/lib/agent.config";
import { submitLead, makeId, type BuyerLead, type ContactMethod, type Timeline, type FinancingStage, type BestTime } from "@/lib/leads";
import { getAttribution } from "@/lib/attribution";
import ConfirmationScreen from "@/components/ConfirmationScreen";

// Buyer intake. Book/Text is offered first (above); this optional
// "Help me plan" step collects ONLY routing-safe fields — never
// income, credit, debt, down-payment, or demographic data.
export default function BuyerForm({ listingId, source }: { listingId?: string; source: string }) {
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("text");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bestTime, setBestTime] = useState<BestTime | "">("");
  const [timeline, setTimeline] = useState<Timeline | "">("");
  const [areaAnchor, setAreaAnchor] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [priceBand, setPriceBand] = useState("");
  const [financing, setFinancing] = useState<FinancingStage | "">("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please add your name.";
    if (!phone.trim() && !email.trim()) e.contact = "A phone or email so " + AGENT.name + " can reach you.";
    if (contactMethod === "text" || contactMethod === "call") { if (!phone.trim()) e.phone = "A phone number for text/call."; }
    if (contactMethod === "email" && !email.trim()) e.email = "An email address.";
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
    // First-touch campaign attribution (?src / utm_*) captured at
    // landing survives the whole journey and rides on the lead.
    const attribution = getAttribution(source);
    if (listingId && !attribution.listingId) attribution.listingId = listingId;
    const lead: BuyerLead = {
      id: makeId(),
      type: "buyer",
      name: name.trim(),
      contactMethod,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      bestTime: (bestTime || undefined) as BestTime | undefined,
      timeline: timeline as Timeline,
      listingId,
      areaAnchor: areaAnchor.trim() || undefined,
      bedrooms: bedrooms.trim() || undefined,
      priceBand: priceBand.trim() || undefined,
      financing: (financing || undefined) as FinancingStage | undefined,
      note: note.trim() || undefined,
      consent,
      source: attribution.source,
      attribution,
      agentId: AGENT.id,
      createdAt: new Date().toISOString(),
    };
    const res = await submitLead(lead);
    if (res.ok) setState("done");
    else { setState("error"); setServerError(res.error || "Something went wrong."); }
  }

  if (state === "done") {
    return <ConfirmationScreen firstName={name.trim().split(" ")[0]} method={contactMethod} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="body" style={{ maxWidth: "52ch", marginBottom: 24 }}>
        Optional — a few quick things so your first call with {AGENT.name} is actually useful, not a
        generic pitch. Skip anything you like.
      </p>

      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" className={`input`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        {errors.name && <span className="field__err">{errors.name}</span>}
      </div>

      <div className="field">
        <label>Best way to reach you</label>
        <div className="chips" role="group" aria-label="Preferred contact method">
          {(["text", "call", "email"] as ContactMethod[]).map((m) => (
            <button type="button" key={m} className="chip" aria-pressed={contactMethod === m} onClick={() => setContactMethod(m)}>
              {m[0].toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className={`field ${errors.phone ? "field--error" : ""}`}>
          <label htmlFor="phone">Phone</label>
          <input id="phone" className="input" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          {errors.phone && <span className="field__err">{errors.phone}</span>}
        </div>
        <div className={`field ${errors.email ? "field--error" : ""}`}>
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          {errors.email && <span className="field__err">{errors.email}</span>}
        </div>
      </div>
      {errors.contact && <span className="field__err" style={{ display: "block", marginTop: -8, marginBottom: 16 }}>{errors.contact}</span>}

      <div className="field">
        <label>Best time to connect</label>
        <div className="chips" role="group" aria-label="Best time">
          {(["morning", "afternoon", "evening"] as BestTime[]).map((t) => (
            <button type="button" key={t} className="chip" aria-pressed={bestTime === t} onClick={() => setBestTime(bestTime === t ? "" : t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={`field ${errors.timeline ? "field--error" : ""}`}>
        <label>When are you hoping to move?</label>
        <div className="chips" role="group" aria-label="Timeline">
          {([["now", "Now"], ["1-3mo", "1–3 months"], ["3-6mo", "3–6 months"], ["exploring", "Just exploring"]] as [Timeline, string][]).map(([v, l]) => (
            <button type="button" key={v} className="chip" aria-pressed={timeline === v} onClick={() => setTimeline(v)}>{l}</button>
          ))}
        </div>
        {errors.timeline && <span className="field__err">{errors.timeline}</span>}
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="area">Where do you need to be near?</label>
          <input id="area" className="input" placeholder="work, school, family…" value={areaAnchor} onChange={(e) => setAreaAnchor(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="beds">Bedrooms / must-haves</label>
          <input id="beds" className="input" placeholder="3 bed, office, single-level…" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="price">Price range <span className="hint">— helps {AGENT.name} show the right homes</span></label>
        <input id="price" className="input" placeholder="$500k–$650k" value={priceBand} onChange={(e) => setPriceBand(e.target.value)} />
      </div>

      <div className="field">
        <label>Where are you in financing? <span className="hint">— for routing, not a mortgage application</span></label>
        <div className="chips" role="group" aria-label="Financing stage">
          {([["cash", "Paying cash"], ["pre-approved", "Pre-approved"], ["talking-to-lender", "Talking to a lender"], ["not-started", "Haven't started — I'd like a referral"]] as [FinancingStage, string][]).map(([v, l]) => (
            <button type="button" key={v} className="chip" aria-pressed={financing === v} onClick={() => setFinancing(financing === v ? "" : v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="note">Anything you want {AGENT.name} to know?</label>
        <textarea id="note" className="textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Relocating in August, first home, love South Tempe…" />
      </div>

      <div className={`field ${errors.consent ? "field--error" : ""}`}>
        <label className="consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>
            I agree that {AGENT.name} may contact me by call, text, or email about my inquiry.
            {" "}{AGENT.smsDisclosure} See the <Link href={AGENT.privacyPolicyUrl}>Privacy Policy</Link>.
          </span>
        </label>
        {errors.consent && <span className="field__err">{errors.consent}</span>}
      </div>

      {state === "error" && (
        <div className="notice notice--warn" style={{ marginBottom: 16 }}>
          Couldn't send that ({serverError}). You can retry, or just{" "}
          <a href={`sms:${AGENT.phone}`} style={{ color: "var(--lynk-bright)" }}>text {AGENT.name} directly</a>.
        </div>
      )}

      <button type="submit" className="btn btn--primary" disabled={state === "sending"} style={{ marginTop: 8 }}>
        {state === "sending" ? "Sending…" : `Send to ${AGENT.name}`}
      </button>
    </form>
  );
}
