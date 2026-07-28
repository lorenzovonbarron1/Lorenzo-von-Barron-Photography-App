import Link from "next/link";
import { AGENT } from "@/lib/agent.config";
import { recentLeads } from "@/lib/integrations/crm";
import { integrationStatus } from "@/lib/integrations/config";
import { buildAutoBrief } from "@/lib/autobrief";
import { attributionChips } from "@/lib/attribution";
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
    source: "sign-616krista",
    attribution: {
      source: "sign-616krista", utmSource: "qr", utmMedium: "yard-sign",
      utmCampaign: "krista-launch", listingId: "616-krista",
    },
    agentId: AGENT.id, createdAt: new Date().toISOString(),
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
              <div className="chips" aria-label="Campaign attribution">
                {(b.attribution ? attributionChips(b.attribution) : [`Source: ${b.source}`]).map((c) => (
                  <span key={c} className="chip" style={{ fontSize: "0.8rem", minHeight: 36, padding: "8px 12px" }}>{c}</span>
                ))}
              </div>
              <p className="path-card__desc" style={{ color: "var(--stone-500)" }}>Consent: {new Date(b.consentAt).toLocaleString()}</p>
            </article>
          ))}
        </div>

        {/* Integration status — what's live vs mocked right now */}
        <div className="card" style={{ marginTop: 8 }}>
          <p className="eyebrow">Delivery channels</p>
          <ul className="stack gap-s" style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
            {integrationStatus().map((s) => (
              <li key={s.name} className="body" style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                <span style={{ color: s.live ? "#7ee0a0" : "var(--lynk-bright)" }}>{s.live ? "● live" : "○ mocked"}</span>
                <span>{s.name}</span>
                {!s.live && <span style={{ color: "var(--stone-500)", fontSize: "0.8rem" }}>needs {s.requires}</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
