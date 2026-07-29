import { NextResponse } from "next/server";
import type { Lead } from "@/lib/leads";
import { buildAutoBrief } from "@/lib/autobrief";
import { AGENT } from "@/lib/agent.config";
import { sendEmail } from "@/lib/integrations/email";
import { sendSms } from "@/lib/integrations/sms";
import { persistLead, recordDelivery } from "@/lib/integrations/crm";
import { integrationConfig } from "@/lib/integrations/config";
import { attributionChips } from "@/lib/attribution";
import type { DeliveryResult } from "@/lib/integrations";

export const runtime = "nodejs";

// The lead engine. One endpoint every form POSTs to. It validates
// the non-negotiables, builds the Auto-Brief, persists to the source
// of truth, notifies the agent (email + SMS), and confirms to the
// lead. Delivery failures are collected and reported, never thrown.
export async function POST(req: Request) {
  let lead: Lead;
  try {
    lead = (await req.json()) as Lead;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  // Non-negotiables: name, a reachable channel, and TCPA consent.
  if (!lead?.name?.trim()) return NextResponse.json({ ok: false, error: "name required" }, { status: 422 });
  if (!lead.phone && !lead.email) return NextResponse.json({ ok: false, error: "phone or email required" }, { status: 422 });
  if (lead.consent !== true) return NextResponse.json({ ok: false, error: "consent required" }, { status: 422 });

  lead.id ||= crypto.randomUUID();
  lead.agentId ||= AGENT.id;
  lead.createdAt ||= new Date().toISOString();
  // A listing seen via the campaign URL enriches a buyer lead that
  // didn't carry one explicitly.
  if (lead.type === "buyer" && !lead.listingId && lead.attribution?.listingId) {
    lead.listingId = lead.attribution.listingId;
  }

  const brief = buildAutoBrief(lead);
  const { notify } = integrationConfig();

  // Persist first (source of truth) so a lead is never lost even if
  // notifications fail.
  const delivery: DeliveryResult[] = [];
  delivery.push(await persistLead(lead, brief));

  // Notify the agent (env overrides beat agent config — see
  // docs/INTEGRATIONS.md).
  delivery.push(
    await sendEmail({
      to: notify.email,
      replyTo: lead.email,
      subject: `New ${lead.type} lead — ${lead.name} (${brief.timeline})`,
      body: agentEmailBody(brief),
    })
  );
  if (notify.phone) {
    delivery.push(await sendSms({ to: notify.phone, body: brief.headline }));
  }

  // Confirm to the lead (SMS only if they gave a phone + consented).
  if (lead.email) {
    delivery.push(
      await sendEmail({
        to: lead.email,
        subject: `Thanks — ${AGENT.name} has your details`,
        body: leadEmailBody(lead.name),
      })
    );
  }
  if (lead.phone) {
    delivery.push(await sendSms({ to: lead.phone, body: `Thanks ${lead.name}! ${AGENT.name} will reach out shortly. Reply STOP to opt out.` }));
  }

  // Attach delivery outcomes to the stored lead (Agent Console only),
  // and log failures server-side — channel + detail carry status codes
  // and provider names, never credentials.
  recordDelivery(lead.id, delivery);
  for (const d of delivery) {
    if (!d.ok) console.error(`[lead:${lead.id}] ${d.channel} delivery FAILED — ${d.detail || "no detail"}`);
  }

  // Consumer response is intentionally minimal: no brief, no delivery
  // internals. The visitor's experience never depends on (or reveals)
  // which channels are live vs mocked.
  return NextResponse.json({ ok: true, id: lead.id });
}

function agentEmailBody(brief: ReturnType<typeof buildAutoBrief>): string {
  const c = brief.contact;
  return [
    brief.headline,
    "",
    `Contact: ${c.name} · prefers ${c.method}${c.bestTime ? ` (${c.bestTime})` : ""}`,
    c.phone ? `Phone: ${c.phone}` : "",
    c.email ? `Email: ${c.email}` : "",
    attributionChips(brief.attribution).join(" · ") || `Source: ${brief.source}`,
    "",
    ...brief.details.map((d) => `• ${d}`),
    brief.note ? `\nNote: ${brief.note}` : "",
    "",
    `Recommended: ${brief.recommendedAction}`,
    `Suggested reply: ${brief.recommendedReply}`,
    brief.lenderReferral ? "\n⚑ Lender referral flow applies." : "",
    `\nConsent captured: ${brief.consentAt}`,
  ].filter(Boolean).join("\n");
}

function leadEmailBody(name: string): string {
  return [
    `Hi ${name},`,
    "",
    `Thanks for reaching out through my Move Desk. I've got your details and I'll follow up personally, soon.`,
    "",
    `If you'd rather just talk now, text or call me directly.`,
    "",
    `— ${AGENT.name}, ${AGENT.brokerage.brokerageName}`,
    `AZ License #${AGENT.brokerage.licenseNumber} · Equal Housing Opportunity`,
  ].join("\n");
}
