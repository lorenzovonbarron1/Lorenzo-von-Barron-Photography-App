import type { AgentProfile } from "@/lib/agent.config";
import { integrationConfig } from "./config";

// Calendar readiness. Until a real scheduler (Cal.com / Calendly) is
// connected, a "request a time" is an APPOINTMENT REQUEST, not a
// confirmed booking — the UI must say so. When
// NEXT_PUBLIC_CAL_BOOKING_URL is set, bookingUrl() returns it so the
// CTA can deep-link to real scheduling.
export function bookingUrl(_agent: AgentProfile): string | null {
  return integrationConfig().calendar.bookingUrl || null;
}

export function calendarIsLive(): boolean {
  return integrationConfig().calendar.enabled;
}
