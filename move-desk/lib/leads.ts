// ─────────────────────────────────────────────────────────────
// Lead model — the only data the concierge collects.
//
// HARD RULE: never collect income, credit score, debt, down-payment
// amount, household composition, children, or any protected-class /
// demographic data. Financing is a ROUTING signal, not a mortgage app.
// ─────────────────────────────────────────────────────────────

export type LeadType = "buyer" | "seller";
export type ContactMethod = "text" | "call" | "email";
export type BestTime = "morning" | "afternoon" | "evening";
export type Timeline = "now" | "1-3mo" | "3-6mo" | "exploring";
export type FinancingStage =
  | "cash"
  | "pre-approved"
  | "talking-to-lender"
  | "not-started"; // "not-started" opts into a lender referral

export type SellerPriority = "price" | "speed" | "certainty" | "low-hassle";

export interface BaseLead {
  id: string;
  type: LeadType;
  name: string;
  contactMethod: ContactMethod;
  phone?: string;
  email?: string;
  bestTime?: BestTime;
  timeline: Timeline;
  note?: string;         // free-text — highest-value field
  consent: boolean;      // TCPA — must be true
  source: string;        // QR / UTM campaign source (kept for compat)
  attribution?: import("@/lib/attribution").Attribution; // full campaign context
  agentId: string;
  createdAt: string;     // ISO
}

export interface BuyerLead extends BaseLead {
  type: "buyer";
  listingId?: string;
  areaAnchor?: string;
  bedrooms?: string;
  priceBand?: string;
  financing?: FinancingStage;
}

export interface SellerLead extends BaseLead {
  type: "seller";
  reason?: string;
  address?: string;      // or ZIP
  propertyType?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  updates?: string;
  priorities?: SellerPriority[];
  buyingNext?: "yes" | "no" | "maybe";
}

export type Lead = BuyerLead | SellerLead;

export function makeId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Client-side POST to the lead engine. Never throws — returns a result. */
export async function submitLead(
  lead: Lead
): Promise<{ ok: boolean; brief?: unknown; error?: string }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.error || `HTTP ${res.status}` };
    return { ok: true, brief: data?.brief };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  }
}

/** Honest same-day phrasing — never promise a time we can't hit. */
export function sameDayPhrase(now = new Date()): string {
  return now.getHours() < 17 ? "end of day today" : "tomorrow morning";
}
