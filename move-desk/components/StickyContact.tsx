"use client";

import Link from "next/link";
import { AGENT } from "@/lib/agent.config";

// Persistent thumb-zone escape hatch on every screen. A ready buyer
// can reach the agent in one tap without passing through any form.
// Labels are short by design so nothing wraps or overflows at 320px.
export default function StickyContact() {
  return (
    <div className="sticky-contact" role="region" aria-label={`Contact ${AGENT.name}`}>
      <a className="btn btn--primary" href={`sms:${AGENT.phone}`}>Text {AGENT.name}</a>
      <a className="btn btn--ghost sticky-contact__call" href={`tel:${AGENT.phone}`} aria-label={`Call ${AGENT.name}`}>
        <span aria-hidden="true">📞</span>
      </a>
      <Link className="btn btn--ghost" href="/talk">Request a time</Link>
    </div>
  );
}
