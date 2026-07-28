import Link from "next/link";
import { AGENT } from "@/lib/agent.config";
import { getMoveDesk } from "@/lib/mydesk";
import { getListing } from "@/lib/listings";
import AssetImage from "@/components/AssetImage";
import ComplianceFooter from "@/components/ComplianceFooter";

export default async function MyDeskPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const sp = await searchParams;
  const desk = getMoveDesk(sp.token);
  const listing = getListing(desk.savedListingId);

  return (
    <main className="page">
      <section className="section wrap stack gap-m">
        <Link href="/" className="eyebrow">← Move Desk</Link>
        <p className="notice notice--warn" style={{ maxWidth: 560 }}>
          Prototype private area — this demo link is not yet a secure, expiring magic link.
        </p>
        <h1 className="headline">Welcome back, {desk.firstName}.</h1>

        <div className="grid-2" style={{ marginTop: 8 }}>
          {/* Saved home */}
          <div className="card stack gap-s">
            <p className="eyebrow">Your saved home</p>
            {listing && (
              <>
                <Link href={`/step-inside/${listing.id}`}><AssetImage asset={listing.hero} /></Link>
                <h3 className="path-card__title">{listing.headline}</h3>
                <p className="path-card__desc">{listing.price} · {listing.beds} bd · {listing.baths} ba · {listing.address}</p>
              </>
            )}
          </div>

          {/* Next step from the agent */}
          <div className="card stack gap-s">
            <p className="eyebrow eyebrow--lynk">Next step from {AGENT.name}</p>
            <p className="body">{desk.nextStep}</p>
            {desk.appointment && (
              <div className="notice" style={{ marginTop: 8 }}>
                <strong>{desk.appointment.kind}</strong> — {desk.appointment.when}
                <br /><span style={{ color: "var(--stone-500)" }}>Status: {desk.appointment.status}</span>
              </div>
            )}
            <a className="btn btn--primary" href={`sms:${AGENT.phone}`} style={{ marginTop: 8 }}>Message {AGENT.name}</a>
          </div>
        </div>

        {/* Priorities + goal */}
        <div className="card stack gap-s">
          <p className="eyebrow">What matters most</p>
          <p className="body">{desk.moveGoal}</p>
          <p className="body" style={{ color: "var(--stone-500)" }}>Timeline: {desk.timeline} · Requested: {desk.requestedAction}</p>
          <div className="chips" style={{ marginTop: 4 }}>
            {desk.priorities.map((p) => <span key={p} className="chip" aria-pressed="true">{p}</span>)}
          </div>
        </div>

        {/* Move checklist */}
        <div className="card">
          <p className="eyebrow">Your move checklist</p>
          <ul className="stack gap-s" style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
            {desk.checklist.map((c) => (
              <li key={c.label} className="body" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span aria-hidden="true" style={{ color: c.done ? "var(--lynk-bright)" : "var(--stone-500)" }}>{c.done ? "●" : "○"}</span>
                <span style={{ color: c.done ? "var(--chrome-mid)" : "var(--chrome-light)", textDecoration: c.done ? "line-through" : "none" }}>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ComplianceFooter />
    </main>
  );
}
