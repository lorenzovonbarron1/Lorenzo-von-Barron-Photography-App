import Link from "next/link";
import { AGENT } from "@/lib/agent.config";
import ComplianceFooter from "@/components/ComplianceFooter";

// Placeholder privacy policy — the page must exist and be linked from
// every form before public use. Replace with reviewed legal copy.
export default function PrivacyPage() {
  return (
    <main className="page">
      <section className="section wrap stack gap-m" style={{ maxWidth: 720 }}>
        <Link href="/" className="eyebrow">← Move Desk</Link>
        <h1 className="headline">Privacy & contact consent</h1>
        <p className="notice notice--warn">Placeholder policy for the prototype. Replace with reviewed legal copy before public use.</p>

        <div className="stack gap-m body" style={{ marginTop: 8 }}>
          <div><h3 className="path-card__title">What we collect</h3><p>Your name, contact details, and the preferences you choose to share (timeline, area, budget band, financing stage, and notes). We do not ask for income, credit score, debt, down-payment amounts, or demographic information.</p></div>
          <div><h3 className="path-card__title">How we use it</h3><p>To respond to your inquiry and prepare a useful first conversation with {AGENT.name}. If you request a lender referral, your details may be shared with a licensed lender you are free to accept or decline.</p></div>
          <div><h3 className="path-card__title">Messaging consent</h3><p>{AGENT.smsDisclosure}</p></div>
          <div><h3 className="path-card__title">Opt out</h3><p>Reply STOP to any text, or email {AGENT.email} to be removed.</p></div>
        </div>
      </section>
      <ComplianceFooter />
    </main>
  );
}
