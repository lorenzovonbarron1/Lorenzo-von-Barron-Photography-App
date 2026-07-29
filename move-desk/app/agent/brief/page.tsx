import Link from "next/link";
import { timingSafeEqual } from "node:crypto";
import { AGENT } from "@/lib/agent.config";
import { listLeads, persistenceSummary, type StoredLead } from "@/lib/integrations/store";
import { integrationStatus } from "@/lib/integrations/config";
import type { DeliveryResult } from "@/lib/integrations";
import { buildAutoBrief } from "@/lib/autobrief";
import { attributionChips } from "@/lib/attribution";
import type { BuyerLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

// ── Access control ───────────────────────────────────────────
// The console shows lead PII, so it is never publicly reachable in
// production:
//   - AGENT_CONSOLE_TOKEN set  → ?token=<value> required (any env).
//   - token unset + production → locked page, no lead data rendered.
//   - token unset + development → open (local demo only).
// Defense in depth: also protect the /agent path at the host
// (Vercel Protection / basic-auth proxy) — see DEPLOYMENT.md.
function accessAllowed(provided: string | undefined): boolean {
  const required = process.env.AGENT_CONSOLE_TOKEN;
  if (required) {
    if (!provided) return false;
    const a = Buffer.from(provided.padEnd(256, "\0"));
    const b = Buffer.from(required.padEnd(256, "\0"));
    return a.length === b.length && timingSafeEqual(a, b) && provided.length === required.length;
  }
  return process.env.NODE_ENV !== "production";
}

function LockedScreen() {
  return (
    <main className="page">
      <section className="section wrap stack gap-m" style={{ maxWidth: 620 }}>
        <Link href="/" className="eyebrow">← Move Desk</Link>
        <h1 className="headline">Agent Console is locked.</h1>
        <p className="body">
          This area contains lead details and is not publicly accessible. Open it with your
          console link (<code>/agent/brief?token=…</code>).
        </p>
        <p className="notice notice--warn" style={{ maxWidth: 560 }}>
          Operator setup: set <code>AGENT_CONSOLE_TOKEN</code> in the server environment and use
          <code>?token=&lt;value&gt;</code>. Without a token the console only opens in local
          development. See DEPLOYMENT.md.
        </p>
      </section>
    </main>
  );
}

export default async function AgentBriefPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const sp = await searchParams;
  if (!accessAllowed(sp.token)) return <LockedScreen />;

  const captured = await listLeads();
  const persistence = persistenceSummary();

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
  // Newest first (listLeads orders desc). Seeded example when empty,
  // with representative mocked delivery so the layout reads true.
  const entries: StoredLead[] = captured.length
    ? captured
    : [{
        id: sample.id, createdAt: sample.createdAt, type: "buyer", consentAt: sample.createdAt,
        lead: sample, brief: buildAutoBrief(sample),
        delivery: [
          { channel: "crm", live: false, ok: true, detail: "mocked" },
          { channel: "email", live: false, ok: true, detail: "mocked" },
        ],
        persistence: { mode: "memory", persisted: false, detail: "seeded example" },
      }];

  const deliveryLabel = (d: DeliveryResult) => (!d.live ? "mocked" : d.ok ? "delivered" : "failed");
  const deliveryColor = (d: DeliveryResult) => (!d.live ? "var(--stone-300)" : d.ok ? "#7ee0a0" : "#ff8f8f");

  return (
    <main className="page">
      <section className="section wrap stack gap-m">
        <Link href="/" className="eyebrow">← Move Desk</Link>
        <p className="notice notice--warn" style={{ maxWidth: 620 }}>
          Internal Agent Console. Lead store: {persistence.detail}
          {captured.length ? "" : " (showing a seeded example)"}.
        </p>
        <h1 className="headline">Auto-Briefs</h1>

        <div className="stack gap-m" style={{ marginTop: 8 }}>
          {entries.map(({ brief: b, delivery, persistence: p }) => (
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
              {/* Delivery + persistence — internal only */}
              <p className="path-card__desc" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
                {delivery.map((d, i) => (
                  <span key={`${d.channel}-${i}`} style={{ color: deliveryColor(d), fontSize: "0.8rem" }}>
                    {`${d.channel}: ${deliveryLabel(d)}`}
                  </span>
                ))}
                <span style={{ color: p.persisted ? "#7ee0a0" : "var(--lynk-bright)", fontSize: "0.8rem" }}>
                  {p.persisted ? "stored: durable" : `stored: ${p.mode}`}
                </span>
                <span style={{ color: "var(--stone-500)", fontSize: "0.8rem" }}>
                  Consent: {new Date(b.consentAt).toLocaleString()}
                </span>
              </p>
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
            <li className="body" style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
              <span style={{ color: persistence.durable ? "#7ee0a0" : "var(--lynk-bright)" }}>
                {persistence.durable ? "● durable" : "○ demo"}
              </span>
              <span>Lead store</span>
              {!persistence.durable && (
                <span style={{ color: "var(--stone-500)", fontSize: "0.8rem" }}>needs LEAD_STORE=file (+ persistent disk) or CRM_WEBHOOK_URL</span>
              )}
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
