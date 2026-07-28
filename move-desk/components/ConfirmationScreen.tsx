import Link from "next/link";
import { AGENT } from "@/lib/agent.config";
import { sameDayPhrase } from "@/lib/leads";
import type { ContactMethod } from "@/lib/leads";

// Shown at the single highest-trust moment. Honest timeframe, clear
// next step, and a continuity hook — never claims anything is "booked".
export default function ConfirmationScreen({
  firstName,
  method,
}: {
  firstName: string;
  method: ContactMethod;
}) {
  return (
    <div className="stack gap-m" style={{ maxWidth: 560 }}>
      <p className="eyebrow eyebrow--lynk">Got it{firstName ? `, ${firstName}` : ""}.</p>
      <h2 className="headline">You're on {AGENT.name}'s desk.</h2>
      <p className="lede">
        {AGENT.name} will reach out by <strong>{sameDayPhrase()}</strong> via {method}.
      </p>

      {/* Placeholder for the agent's vertical thank-you video */}
      <div className="asset asset--empty" style={{ minHeight: 200 }}>
        <span className="asset__label">{AGENT.name}'s thank-you video — coming soon</span>
      </div>

      <div className="stack gap-s" style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <a className="btn btn--primary" href={`sms:${AGENT.phone}`}>Text {AGENT.name} now</a>
        <Link className="btn btn--ghost" href="/">Back to the Move Desk</Link>
      </div>
      <p className="notice notice--ok">A real person reads every message — usually {AGENT.name} herself.</p>
    </div>
  );
}
