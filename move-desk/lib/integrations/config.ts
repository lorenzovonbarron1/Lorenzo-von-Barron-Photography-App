// ─────────────────────────────────────────────────────────────
// Integration configuration — ONE place that reads every env var.
//
// Rule: with nothing set, every integration is safely OFF and the
// app runs fully in mock mode (leads validated, briefs built,
// delivery logged — never sent, never thrown). Setting a group's
// env vars flips that group live. See docs/INTEGRATIONS.md for the
// full contract per variable.
// ─────────────────────────────────────────────────────────────

import { AGENT } from "@/lib/agent.config";

export interface IntegrationConfig {
  email: { enabled: boolean; apiKey?: string; from?: string };
  sms: { enabled: boolean; accountSid?: string; authToken?: string; from?: string };
  crm: { enabled: boolean; webhookUrl?: string };
  calendar: { enabled: boolean; bookingUrl?: string };
  /** Where agent notifications go. Env overrides beat agent config. */
  notify: { email: string; phone: string };
}

export function integrationConfig(): IntegrationConfig {
  const email = {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.LEAD_EMAIL_FROM,
  };
  const sms = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_FROM,
  };
  return {
    email: { enabled: Boolean(email.apiKey && email.from), ...email },
    sms: { enabled: Boolean(sms.accountSid && sms.authToken && sms.from), ...sms },
    crm: {
      enabled: Boolean(process.env.CRM_WEBHOOK_URL),
      webhookUrl: process.env.CRM_WEBHOOK_URL,
    },
    calendar: {
      enabled: Boolean(process.env.NEXT_PUBLIC_CAL_BOOKING_URL),
      bookingUrl: process.env.NEXT_PUBLIC_CAL_BOOKING_URL,
    },
    notify: {
      email: process.env.AGENT_NOTIFY_EMAIL || AGENT.email,
      phone: process.env.AGENT_NOTIFY_PHONE || AGENT.phone,
    },
  };
}

/** Status table for the Agent Console / debugging. */
export function integrationStatus(): { name: string; live: boolean; requires: string }[] {
  const c = integrationConfig();
  return [
    { name: "Email (Resend)", live: c.email.enabled, requires: "RESEND_API_KEY + LEAD_EMAIL_FROM" },
    { name: "SMS (Twilio)", live: c.sms.enabled, requires: "TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_FROM" },
    { name: "CRM webhook", live: c.crm.enabled, requires: "CRM_WEBHOOK_URL" },
    { name: "Calendar booking", live: c.calendar.enabled, requires: "NEXT_PUBLIC_CAL_BOOKING_URL" },
  ];
}
