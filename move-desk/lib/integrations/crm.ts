import type { DeliveryResult } from "./index";
import type { Lead } from "@/lib/leads";
import type { AutoBrief } from "@/lib/autobrief";
import { integrationConfig, PROVIDER_TIMEOUT_MS } from "./config";

// CRM delivery — POSTs { lead, brief } to a generic webhook
// (Follow Up Boss inbound / Airtable automation / Zapier catch-hook)
// when CRM_WEBHOOK_URL is set. Persistence itself lives in
// lib/integrations/store.ts; this module is transport only, so a CRM
// outage can never lose a lead.
export async function sendToCrm(lead: Lead, brief: AutoBrief): Promise<DeliveryResult> {
  const { crm } = integrationConfig();
  if (!crm.enabled) {
    return { channel: "crm", live: false, ok: true, detail: "mocked — set CRM_WEBHOOK_URL" };
  }
  try {
    const res = await fetch(crm.webhookUrl!, {
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
