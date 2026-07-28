import type { DeliveryResult } from "./index";
import type { Lead } from "@/lib/leads";
import type { AutoBrief } from "@/lib/autobrief";

// Source-of-truth persistence. Live path = a generic CRM webhook
// (Follow Up Boss / Airtable / Zapier catch-hook) when CRM_WEBHOOK_URL
// is set. Mock path keeps leads in memory for the demo Agent Console.
const memory: { lead: Lead; brief: AutoBrief }[] = [];

export function recentLeads(limit = 25): { lead: Lead; brief: AutoBrief }[] {
  return memory.slice(-limit).reverse();
}

export async function persistLead(lead: Lead, brief: AutoBrief): Promise<DeliveryResult> {
  memory.push({ lead, brief });

  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) {
    return { channel: "crm", live: false, ok: true, detail: "mocked (in-memory; set CRM_WEBHOOK_URL)" };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead, brief }),
    });
    if (!res.ok) return { channel: "crm", live: true, ok: false, detail: `CRM ${res.status}` };
    return { channel: "crm", live: true, ok: true };
  } catch (e) {
    return { channel: "crm", live: true, ok: false, detail: e instanceof Error ? e.message : "error" };
  }
}
