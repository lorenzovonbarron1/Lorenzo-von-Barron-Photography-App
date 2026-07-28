// ─────────────────────────────────────────────────────────────
// Auto-Brief — the agent-facing intelligence layer.
//
// Turns a raw Lead into a skimmable brief with a RECOMMENDED ACTION,
// so the agent's first contact is prepared, not generic. This is the
// feature that makes a solo agent feel like they have a team.
// ─────────────────────────────────────────────────────────────

import type { Lead, BuyerLead, SellerLead, Timeline } from "@/lib/leads";

export type NextAction =
  | "call-now-offer-tour"
  | "call-listing-tour"
  | "same-day-followup"
  | "intro-plus-lender-referral"
  | "seller-strategy-call";

export interface AutoBrief {
  leadId: string;
  agentId: string;
  createdAt: string;
  headline: string;         // one-line summary for a phone notification
  type: "buyer" | "seller";
  contact: { name: string; method: string; phone?: string; email?: string; bestTime?: string };
  source: string;
  consentAt: string;
  timeline: Timeline;
  details: string[];        // skimmable bullets
  note?: string;
  recommendedAction: NextAction;
  recommendedReply: string; // suggested opening message
  lenderReferral: boolean;
}

const TIMELINE_LABEL: Record<Timeline, string> = {
  now: "Ready now",
  "1-3mo": "1–3 months",
  "3-6mo": "3–6 months",
  exploring: "Just exploring",
};

function isHot(t: Timeline): boolean {
  return t === "now" || t === "1-3mo";
}

export function buildAutoBrief(lead: Lead): AutoBrief {
  const base: Omit<AutoBrief, "recommendedAction" | "recommendedReply" | "lenderReferral" | "details" | "headline"> = {
    leadId: lead.id,
    agentId: lead.agentId,
    createdAt: new Date().toISOString(),
    type: lead.type,
    contact: {
      name: lead.name,
      method: lead.contactMethod,
      phone: lead.phone,
      email: lead.email,
      bestTime: lead.bestTime,
    },
    source: lead.source,
    consentAt: lead.createdAt,
    timeline: lead.timeline,
    note: lead.note,
  };

  if (lead.type === "buyer") return { ...base, ...buyerBrief(lead) };
  return { ...base, ...sellerBrief(lead) };
}

type BriefTail = Pick<AutoBrief, "headline" | "details" | "recommendedAction" | "recommendedReply" | "lenderReferral">;

function buyerBrief(lead: BuyerLead): BriefTail {
  const details: string[] = [`Buyer · ${TIMELINE_LABEL[lead.timeline]}`];
  if (lead.priceBand) details.push(`Budget: ${lead.priceBand}`);
  if (lead.areaAnchor) details.push(`Near: ${lead.areaAnchor}`);
  if (lead.bedrooms) details.push(`Wants: ${lead.bedrooms}`);
  if (lead.financing) details.push(`Financing: ${lead.financing}`);
  if (lead.listingId) details.push(`Viewed listing: ${lead.listingId}`);

  const hot = isHot(lead.timeline);

  if (lead.financing === "not-started") {
    return {
      headline: `${lead.name} — buyer, needs a lender intro`,
      details,
      recommendedAction: "intro-plus-lender-referral",
      recommendedReply:
        `Hi ${lead.name}, thanks for reaching out. I'll help you get oriented and connect you with a licensed lender so you know your numbers — no pressure, no application marathon.`,
      lenderReferral: true,
    };
  }
  if ((lead.financing === "cash" || lead.financing === "pre-approved") && hot) {
    return {
      headline: `🔥 ${lead.name} — qualified + active, call fast`,
      details,
      recommendedAction: "call-now-offer-tour",
      recommendedReply:
        `Hi ${lead.name}, great timing. You're set up to move — want to grab a tour this week? I can send a couple of options that fit.`,
      lenderReferral: false,
    };
  }
  if (lead.listingId) {
    return {
      headline: `${lead.name} — asked about ${lead.listingId}`,
      details,
      recommendedAction: "call-listing-tour",
      recommendedReply:
        `Hi ${lead.name}, glad that home caught your eye. Want me to set up a private showing? I can also answer anything about the area first.`,
      lenderReferral: false,
    };
  }
  return {
    headline: `${lead.name} — buyer, same-day follow-up`,
    details,
    recommendedAction: "same-day-followup",
    recommendedReply:
      `Hi ${lead.name}, thanks for reaching out. Tell me what you're hoping for and I'll line up homes worth your time — we can go at whatever pace works.`,
    lenderReferral: false,
  };
}

function sellerBrief(lead: SellerLead): BriefTail {
  const details: string[] = [`Seller · ${TIMELINE_LABEL[lead.timeline]}`];
  if (lead.address) details.push(`Property: ${lead.address}`);
  if (lead.propertyType) details.push(`Type: ${lead.propertyType}`);
  const size = [lead.beds && `${lead.beds}bd`, lead.baths && `${lead.baths}ba`, lead.sqft && `${lead.sqft} sqft`].filter(Boolean).join(" · ");
  if (size) details.push(size);
  if (lead.reason) details.push(`Motivation: ${lead.reason}`);
  if (lead.priorities?.length) details.push(`Priorities: ${lead.priorities.join(", ")}`);
  if (lead.buyingNext) details.push(`Buying next: ${lead.buyingNext}`);

  return {
    headline: `${lead.name} — seller strategy call requested`,
    details,
    recommendedAction: "seller-strategy-call",
    recommendedReply:
      `Hi ${lead.name}, thanks for the details. Before you list, I'll put together a real plan and a straight number for your home — when's a good time to talk it through?`,
    lenderReferral: false,
  };
}
