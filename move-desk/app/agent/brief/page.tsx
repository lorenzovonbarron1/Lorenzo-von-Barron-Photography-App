import Link from "next/link";
import { AGENT } from "@/lib/agent.config";
import { recentLeads } from "@/lib/integrations/crm";
import { buildAutoBrief } from "@/lib/autobrief";
import type { BuyerLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

// Demo Agent Console — the Auto-Brief preview. Shows leads captured
// this server session (in-memory mock) plus one seeded example so the
// layout is never empty. Protect behind real auth before production.
export default function AgentBriefPage() {
  const captured = recentLeads();

  const sample: BuyerLead = {
    id: "sample", type: "buyer", name: "Jordan Rivera", contactMethod: "text",
    phone: "+14805551234", email: "jordan@example.com", bestTime: "evening",
    timeline: "now", listingId: "616-krista", areaAnchor: "downtown Phoenix office",
    bedrooms: "3 bed + office", priceBand: "$550k–$650k", financing: "pre-approved",
    note: "Relocating for work in August, want single-level.", consent: true,
    source: "sign-616krista", agentId: AGENT.id, createdAt: new Date().toISOString(),
  };
  const briefs = captured.length ? captured.map((c) => c.brief) : [buildAutoBrief(sample)];

  return (
    <main className="page">
      <section className="section wrap stack gap-m">
        <Link href="/" className="eyebrow">← Move Desk</Link>
        <p className="notice notice--warn" style={{ maxWidth: 620 }}>
          Demo Agent Console — protect behind real authentication before production. Captured leads are
          in-memory for this server session{captured.length ? "" : " (showing a seeded example)"}.
        </p>
        <h1 className="headline">Auto-Briefs</h1>

        <div className="stack gap-m" style={{ marginTop: 8 }}>
          {briefs.map((b) => (
            <article key={b.leadId} className="card stack gap-s">
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <span className="path-card__title">{b.headline}</span>
                <span className="eyebrow eyebrow--lynk">{b.recommendedAction}</span>
              </div>
              <p className="path-card__desc">
                {b.contact.name} · prefers {b.contact.method}{b.contact.bestTime ? ` (${b.contact.bestTime})` : ""}
                {b.contact.phone ? ` · ${b.contact.phone}` : ""}{b.contact.email ? ` · ${b.contact.email}` : ""}
              </p>
              <div className="chips">
                {b.details.map((d) => <span key={d} className="chip">{d}</span>)}
              </div>
              {b.note && <p className="body" style={{ fontStyle: "italic" }}>“{b.note}”</p>}
              <div className="notice notice--ok" style={{ marginTop: 4 }}>
                <strong>Suggested reply:</strong> {b.recommendedReply}
              </div>
              {b.lenderReferral && <p className="notice notice--warn">Lender referral flow applies — {AGENT.lender.disclosure}</p>}
              <p className="path-card__desc" style={{ color: "var(--stone-500)" }}>Source: {b.source} · Consent: {new Date(b.consentAt).toLocaleString()}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
