import type { DeliveryResult, SmsMessage } from "./index";
import { integrationConfig } from "./config";

// SMS delivery. Live path = Twilio when all three TWILIO_* vars are
// set. Consent is enforced upstream (in the API route) — this layer
// only transports.
export async function sendSms(msg: SmsMessage): Promise<DeliveryResult> {
  const { sms } = integrationConfig();

  if (!sms.enabled) {
    console.info("[sms:mock]", { to: msg.to });
    return { channel: "sms", live: false, ok: true, detail: "mocked — set TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_FROM" };
  }
  try {
    const body = new URLSearchParams({ To: msg.to, From: sms.from!, Body: msg.body });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sms.accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sms.accountSid}:${sms.authToken}`).toString("base64")}`,
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
