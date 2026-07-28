import Link from "next/link";
import { notFound } from "next/navigation";
import { AGENT } from "@/lib/agent.config";
import { getListing, LISTINGS } from "@/lib/listings";
import AssetImage from "@/components/AssetImage";
import StepInside from "@/components/StepInside";
import ComplianceFooter from "@/components/ComplianceFooter";

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

export default async function StepInsidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();

  return (
    <main className="page">
      {/* Arrival hero */}
      <section className="wrap section" style={{ paddingBottom: 24 }}>
        <Link href="/" className="eyebrow">← Move Desk</Link>
        <p className="eyebrow eyebrow--lynk" style={{ marginTop: 12 }}>Step Inside</p>
        <h1 className="display" style={{ marginTop: 8 }}>{listing.headline}</h1>
        <p className="lede" style={{ marginTop: 12 }}>{listing.summary}</p>
        <p className="eyebrow" style={{ marginTop: 12 }}>
          {listing.price} · {listing.beds} bed · {listing.baths} bath · {listing.sqft.toLocaleString()} sq ft · {listing.address}
        </p>
        {listing.isDemo && <p className="notice notice--warn" style={{ maxWidth: 560, marginTop: 12 }}>{listing.status}</p>}
      </section>

      {/* Hot-lead escape hatch — always visible before the cinema */}
      <section className="wrap" style={{ marginBottom: 12 }}>
        <div className="stack gap-s" style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <a className="btn btn--primary" href={`sms:${AGENT.phone}`}>Text {AGENT.name}</a>
          <Link className="btn btn--ghost" href={`/buy?listing=${listing.id}`}>Request a private showing</Link>
        </div>
      </section>

      {/* Cinematic scroll sequence */}
      <section className="wrap section" style={{ paddingTop: 12 }}>
        <StepInside listing={listing} />
      </section>

      {/* The property story */}
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <p className="eyebrow">The property story</p>
        <ul className="stack gap-s" style={{ listStyle: "none", padding: 0, marginTop: 16, maxWidth: "56ch" }}>
          {listing.storyPoints.map((p) => (
            <li key={p} className="body" style={{ paddingLeft: 18, borderLeft: "2px solid var(--lynk)" }}>{p}</li>
          ))}
        </ul>
      </section>

      {/* Factual neighborhood layer */}
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <p className="eyebrow">The area — the facts, not a score</p>
        <div className="grid-2" style={{ marginTop: 16 }}>
          <div className="card">
            <h3 className="path-card__title">Commute</h3>
            <p className="path-card__desc" style={{ marginTop: 8 }}>{listing.neighborhood.commuteAnchorsPrompt}</p>
            <a className="btn btn--ghost" href={`sms:${AGENT.phone}`} style={{ marginTop: 16 }}>Ask {AGENT.name} for drive times</a>
          </div>
          <div className="card">
            <h3 className="path-card__title">Everyday essentials</h3>
            <ul className="path-card__desc" style={{ marginTop: 8, paddingLeft: 18 }}>
              {listing.neighborhood.essentials.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </div>
        </div>
        <div className="card" style={{ marginTop: 16 }}>
          <h3 className="path-card__title">Schools</h3>
          <p className="path-card__desc" style={{ marginTop: 8 }}>{listing.neighborhood.schoolsNotice}</p>
          <div className="stack gap-s" style={{ marginTop: 12 }}>
            {listing.neighborhood.officialSchoolLinks.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--lynk-bright)", textDecoration: "underline", textUnderlineOffset: 3 }}>{l.label} ↗</a>
            ))}
          </div>
        </div>
      </section>

      {/* Tour CTA */}
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="card stack gap-s" style={{ alignItems: "flex-start" }}>
          <h2 className="headline">Tour this home with {AGENT.name}</h2>
          <div className="stack gap-s" style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Link className="btn btn--primary" href={`/buy?listing=${listing.id}`}>Request a private showing</Link>
            <a className="btn btn--ghost" href={`sms:${AGENT.phone}`}>Text {AGENT.name}</a>
          </div>
        </div>
      </section>

      <ComplianceFooter />
    </main>
  );
}
