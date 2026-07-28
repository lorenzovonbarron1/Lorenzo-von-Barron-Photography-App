import Link from "next/link";
import { AGENT } from "@/lib/agent.config";
import { FEATURED_LISTING } from "@/lib/listings";
import BuyerForm from "@/components/BuyerForm";
import ComplianceFooter from "@/components/ComplianceFooter";

// Buyer path. Conversion comes BEFORE qualification: text/tour first,
// then an optional plan. `source` carries the QR/UTM campaign.
export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string; listing?: string }>;
}) {
  const sp = await searchParams;
  const source = sp.src || AGENT.defaultCampaignSource;
  const listingId = sp.listing || FEATURED_LISTING.id;

  return (
    <main className="page">
      <section className="section wrap stack gap-m">
        <Link href="/" className="eyebrow">← Move Desk</Link>
        <h1 className="headline">Find your next home</h1>
        <p className="lede">Two ways in: reach {AGENT.name} right now, or let her line up homes worth your time.</p>

        {/* Conversion first — no form required */}
        <div className="card stack gap-s" style={{ maxWidth: 560 }}>
          <p className="eyebrow eyebrow--lynk">Ready now?</p>
          <div className="stack gap-s" style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <a className="btn btn--primary" href={`sms:${AGENT.phone}`}>Text {AGENT.name}</a>
            <Link className="btn btn--ghost" href={`/step-inside/${listingId}`}>Book a private showing</Link>
          </div>
        </div>

        <hr className="divider" />

        <div style={{ maxWidth: 640 }}>
          <p className="eyebrow">Optional · Help me plan my move</p>
          <BuyerForm listingId={listingId} source={source} />
        </div>
      </section>
      <ComplianceFooter />
    </main>
  );
}
