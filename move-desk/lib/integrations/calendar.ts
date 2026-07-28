import type { AgentProfile } from "@/lib/agent.config";

// Calendar readiness. Until a real scheduler (Cal.com / Calendly) is
// connected, a "request a time" is an APPOINTMENT REQUEST, not a
// confirmed booking — the UI must say so. When CAL_BOOKING_URL is set,
// bookingUrl() returns it so the CTA can deep-link to real scheduling.
export function bookingUrl(_agent: AgentProfile): string | null {
  return process.env.NEXT_PUBLIC_CAL_BOOKING_URL || null;
}

export function calendarIsLive(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CAL_BOOKING_URL);
}
