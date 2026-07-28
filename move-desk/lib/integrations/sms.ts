import type { DeliveryResult, SmsMessage } from "./index";

// SMS delivery. Live path = Twilio when creds are set. Consent is
// enforced upstream (in the API route) — this layer only transports.
export async function sendSms(msg: SmsMessage): Promise<DeliveryResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  if (!sid || !token || !from) {
    console.info("[sms:mock]", { to: msg.to });
    return { channel: "sms", live: false, ok: true, detail: "mocked (no TWILIO creds)" };
  }
  try {
    const body = new URLSearchParams({ To: msg.to, From: from, Body: msg.body });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) return { channel: "sms", live: true, ok: false, detail: `Twilio ${res.status}` };
    return { channel: "sms", live: true, ok: true };
  } catch (e) {
    return { channel: "sms", live: true, ok: false, detail: e instanceof Error ? e.message : "error" };
  }
}
