"use client";

import Link from "next/link";
import { AGENT } from "@/lib/agent.config";

// Persistent thumb-zone escape hatch on every screen. A ready buyer
// can reach the agent in one tap without passing through any form.
export default function StickyContact() {
  const tel = `tel:${AGENT.phone}`;
  const sms = `sms:${AGENT.phone}`;
  return (
    <div className="sticky-contact" role="region" aria-label={`Contact ${AGENT.name}`}>
      <a className="btn btn--primary" href={sms}>Text {AGENT.name}</a>
      <a className="btn btn--ghost sticky-contact__call" href={tel} aria-label={`Call ${AGENT.name}`}>
        <span aria-hidden="true">📞</span>
      </a>
      <Link className="btn btn--ghost" href="/talk" style={{ flex: "0 0 auto" }}>
        Request a time
      </Link>
    </div>
  );
}
