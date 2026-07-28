import type { DeliveryResult, EmailMessage } from "./index";
import { integrationConfig } from "./config";

// Email delivery. Live path = Resend when RESEND_API_KEY +
// LEAD_EMAIL_FROM are set. Mock path logs and reports live:false so
// callers (and the console) can see exactly what was mocked.
export async function sendEmail(msg: EmailMessage): Promise<DeliveryResult> {
  const { email } = integrationConfig();

  if (!email.enabled) {
    console.info("[email:mock]", { to: msg.to, subject: msg.subject });
    return { channel: "email", live: false, ok: true, detail: "mocked — set RESEND_API_KEY + LEAD_EMAIL_FROM" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${email.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: email.from, to: msg.to, subject: msg.subject, text: msg.body, reply_to: msg.replyTo }),
    });
    if (!res.ok) return { channel: "email", live: true, ok: false, detail: `Resend ${res.status}` };
    return { channel: "email", live: true, ok: true };
  } catch (e) {
    return { channel: "email", live: true, ok: false, detail: e instanceof Error ? e.message : "error" };
  }
}
