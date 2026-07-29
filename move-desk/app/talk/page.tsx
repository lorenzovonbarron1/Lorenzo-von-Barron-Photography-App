import Link from "next/link";
import { AGENT } from "@/lib/agent.config";
import { calendarIsLive, bookingUrl } from "@/lib/integrations/calendar";
import ComplianceFooter from "@/components/ComplianceFooter";

// Fast contact path — no form wall. A ready person reaches the agent
// in one tap. When a real scheduler URL is configured the booking
// button deep-links to it; otherwise "request a time" stays honestly
// labeled as a request.
export default function TalkPage() {
  const live = calendarIsLive();
  const calUrl = bookingUrl(AGENT);
  return (
    <main className="page">
      <section className="section wrap stack gap-m">
        <Link href="/" className="eyebrow">← Move Desk</Link>
        <h1 className="headline">Talk to {AGENT.name}</h1>
        <p className="lede">The fastest way through. Text, call, or ask for a time — a real person reads every message.</p>

        <div className="stack gap-s" style={{ maxWidth: 460, marginTop: 12 }}>
          <a className="btn btn--primary" href={`sms:${AGENT.phone}`}>Text {AGENT.name}</a>
          <a className="btn btn--ghost" href={`tel:${AGENT.phone}`}>Call {AGENT.name}</a>
          <a className="btn btn--ghost" href={`mailto:${AGENT.email}`}>Email {AGENT.name}</a>
          {live && calUrl && (
            <a className="btn btn--ghost" href={calUrl} target="_blank" rel="noopener noreferrer">
              Book a time on the calendar
            </a>
          )}
          <Link className="btn btn--ghost" href="/buy">Have me plan homes for you</Link>
        </div>

        <div className="notice notice--warn" style={{ maxWidth: 520, marginTop: 12 }}>
          {live
            ? "Pick any open time — it books directly on the calendar."
            : "Requesting a time sends an appointment request. It's confirmed once " +
              AGENT.name + " replies — not an instant booking yet."}
        </div>
        <p className="body" style={{ fontSize: "0.85rem", color: "var(--stone-500)", maxWidth: 520 }}>
          {AGENT.smsDisclosure}
        </p>
      </section>
      <ComplianceFooter />
    </main>
  );
}
