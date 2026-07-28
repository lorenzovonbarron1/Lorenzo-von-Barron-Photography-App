import Link from "next/link";
import { AGENT } from "@/lib/agent.config";
import SellerForm from "@/components/SellerForm";
import ComplianceFooter from "@/components/ComplianceFooter";

export default async function SellPage({ searchParams }: { searchParams: Promise<{ src?: string }> }) {
  const sp = await searchParams;
  const source = sp.src || AGENT.defaultCampaignSource;
  return (
    <main className="page">
      <section className="section wrap stack gap-m">
        <Link href="/" className="eyebrow">← Move Desk</Link>
        <h1 className="headline">Sell my home</h1>
        <p className="lede">A real plan and a straight number before you list — not a robot estimate. Ninety seconds now, a strategy call next.</p>
        <div style={{ maxWidth: 640, marginTop: 8 }}>
          <SellerForm source={source} />
        </div>
      </section>
      <ComplianceFooter />
    </main>
  );
}
