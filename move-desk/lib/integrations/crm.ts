import type { DeliveryResult } from "./index";
import type { Lead } from "@/lib/leads";
import type { AutoBrief } from "@/lib/autobrief";
import { integrationConfig, PROVIDER_TIMEOUT_MS } from "./config";

// Source-of-truth persistence. Live path = a generic CRM webhook
// (Follow Up Boss / Airtable / Zapier catch-hook) when CRM_WEBHOOK_URL
// is set. Mock path keeps leads in memory for the demo Agent Console.
//
// Each stored entry also carries the lead's per-channel delivery
// results (recorded after notifications run) so the Agent Console can
// show mocked / delivered / failed — internally only. This status is
// never returned to the consumer client.
export interface LeadRecord {
  lead: Lead;
  brief: AutoBrief;
  delivery: DeliveryResult[];
}

const memory: LeadRecord[] = [];

/** Newest first. */
export function recentLeads(limit = 25): LeadRecord[] {
  return memory.slice(-limit).reverse();
}

/** Attach delivery outcomes to an already-persisted lead. */
export function recordDelivery(leadId: string, results: DeliveryResult[]): void {
  const entry = memory.find((m) => m.lead.id === leadId);
  if (entry) entry.delivery = results;
}

export async function persistLead(lead: Lead, brief: AutoBrief): Promise<DeliveryResult> {
  memory.push({ lead, brief, delivery: [] });

  const { crm } = integrationConfig();
  if (!crm.enabled) {
    return { channel: "crm", live: false, ok: true, detail: "mocked (in-memory; set CRM_WEBHOOK_URL)" };
  }
  const url = crm.webhookUrl!;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead, brief }),
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });
    if (!res.ok) return { channel: "crm", live: true, ok: false, detail: `CRM ${res.status}` };
    return { channel: "crm", live: true, ok: true };
  } catch (e) {
    return { channel: "crm", live: true, ok: false, detail: e instanceof Error ? e.message : "error" };
  }
}
