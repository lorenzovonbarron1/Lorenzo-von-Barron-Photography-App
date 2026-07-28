import Link from "next/link";
import { AGENT } from "@/lib/agent.config";
import { FEATURED_LISTING } from "@/lib/listings";
import AssetImage from "@/components/AssetImage";
import ComplianceFooter from "@/components/ComplianceFooter";

// Home / the agent's Move Desk. One warm hero, three clear paths, a
// single featured listing story (not a grid), and how it works.
export default function HomePage() {
  const L = FEATURED_LISTING;
  return (
    <main className="page">
      {/* Hero */}
      <section className="section wrap">
        <p className="eyebrow eyebrow--lynk">LYNK Move Desk</p>
        <div style={{ display: "grid", gap: 28, alignItems: "center", gridTemplateColumns: "1fr" }}>
          <div className="stack gap-m">
            <h1 className="display">{AGENT.heroMessage}</h1>
            <p className="lede">{AGENT.intro}</p>
            <div className="agent-pill" style={{ alignSelf: "flex-start", marginTop: 4 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="agent-pill__avatar" src={AGENT.portraits.avatar} alt={AGENT.name} />
              <div>
                <div className="agent-pill__name">{AGENT.name}</div>
                <div className="agent-pill__role">{AGENT.role} · {AGENT.territory}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three primary paths */}
      <section className="section wrap" style={{ paddingTop: 0 }}>
        <div className="grid-3">
          <Link className="path-card path-card--primary" href="/buy">
            <span className="eyebrow eyebrow--lynk">01</span>
            <span className="path-card__title">Find My Next Home</span>
            <span className="path-card__desc">Homes worth your time — walked through with you, not a search bar.</span>
            <span className="path-card__cta">Start exploring →</span>
          </Link>
          <Link className="path-card" href="/sell">
            <span className="eyebrow">02</span>
            <span className="path-card__title">Sell My Home</span>
            <span className="path-card__desc">A plan and a real number before you ever list.</span>
            <span className="path-card__cta">Build my selling plan →</span>
          </Link>
          <Link className="path-card" href="/talk">
            <span className="eyebrow">03</span>
            <span className="path-card__title">Talk to {AGENT.name}</span>
            <span className="path-card__desc">Text, call, or grab a time. No form wall.</span>
            <span className="path-card__cta">Reach {AGENT.name} →</span>
          </Link>
        </div>
      </section>

      {/* Featured listing story */}
      <section className="section wrap" style={{ paddingTop: 0 }}>
        <p className="eyebrow">Step Inside · Featured</p>
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr" }}>
          <Link href={`/step-inside/${L.id}`} aria-label={`Step inside ${L.address}`}>
            <AssetImage asset={L.hero} priority />
          </Link>
          <div className="stack gap-s">
            <h2 className="headline">{L.headline}</h2>
            <p className="body" style={{ maxWidth: "56ch" }}>{L.summary}</p>
            <p className="eyebrow" style={{ marginTop: 6 }}>
              {L.price} · {L.beds} bed · {L.baths} bath · {L.sqft.toLocaleString()} sq ft
            </p>
            <p className="notice notice--warn" style={{ maxWidth: "56ch" }}>{L.status}</p>
            <div className="stack gap-s" style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
              <Link className="btn btn--primary" href={`/step-inside/${L.id}`}>Take the tour</Link>
              <a className="btn btn--ghost" href={`sms:${AGENT.phone}`}>Text {AGENT.name}</a>
            </div>
          </div>
        </div>
      </section>

      {/* How the Move Desk works */}
      <section className="section wrap" style={{ paddingTop: 0 }}>
        <p className="eyebrow">How the Move Desk works</p>
        <div className="grid-3" style={{ marginTop: 16 }}>
          {[
            ["Step inside", "See a home as a story — arrival to backyard — not a static card."],
            ["Tell me your move", "A short, optional plan so your first call is useful, not generic."],
            ["Choose the next step", "Text, call, or book a private showing. You set the pace."],
          ].map(([t, d], i) => (
            <div className="card" key={t}>
              <span className="eyebrow eyebrow--lynk">{`0${i + 1}`}</span>
              <h3 className="path-card__title" style={{ marginTop: 8 }}>{t}</h3>
              <p className="path-card__desc" style={{ marginTop: 6 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <ComplianceFooter />
    </main>
  );
}
