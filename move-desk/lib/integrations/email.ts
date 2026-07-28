import type { DeliveryResult, EmailMessage } from "./index";

// Email delivery. Live path = Resend when RESEND_API_KEY is set.
// Mock path logs and reports live:false so the UI can show "mocked".
export async function sendEmail(msg: EmailMessage): Promise<DeliveryResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;

  if (!key || !from) {
    console.info("[email:mock]", { to: msg.to, subject: msg.subject });
    return { channel: "email", live: false, ok: true, detail: "mocked (no RESEND_API_KEY)" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: msg.to, subject: msg.subject, text: msg.body, reply_to: msg.replyTo }),
    });
    if (!res.ok) return { channel: "email", live: true, ok: false, detail: `Resend ${res.status}` };
    return { channel: "email", live: true, ok: true };
  } catch (e) {
    return { channel: "email", live: true, ok: false, detail: e instanceof Error ? e.message : "error" };
  }
}
