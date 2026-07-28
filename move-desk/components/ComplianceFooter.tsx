import Link from "next/link";
import { AGENT } from "@/lib/agent.config";

// Site-wide legal identity: brokerage, license, Equal Housing, and
// privacy — all config-driven. Required before any public use.
export default function ComplianceFooter() {
  const b = AGENT.brokerage;
  return (
    <footer className="wrap disclosure">
      <p style={{ color: "var(--chrome-mid)" }}>
        {AGENT.name} · {b.brokerageName} · AZ License #{b.licenseNumber}
      </p>
      <p>
        <a href={`tel:${AGENT.phone}`}>{AGENT.phone}</a> · <a href={`mailto:${AGENT.email}`}>{AGENT.email}</a> · {AGENT.territory}
      </p>
      {b.equalHousing && (
        <p className="eho">
          <span className="eho__mark" aria-hidden="true" /> Equal Housing Opportunity
        </p>
      )}
      <p>
        All information deemed reliable but not guaranteed; verify independently. This is a
        marketing experience, not an offer of representation or financing.{" "}
        <Link href={AGENT.privacyPolicyUrl}>Privacy Policy</Link>
      </p>
      {b.demoNotice && <p className="notice notice--warn" style={{ marginTop: 16 }}>{b.demoNotice}</p>}
    </footer>
  );
}
