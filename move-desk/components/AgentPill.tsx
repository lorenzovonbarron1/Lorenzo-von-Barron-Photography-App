import { AGENT } from "@/lib/agent.config";

// Compact agent identity — the agent's personal accent styles the
// avatar ring (never the product orange). While AGENT.isDemo, the
// pill always carries the demo-persona label so the interface never
// implies a live licensed agent.
export default function AgentPill({ detail }: { detail?: string }) {
  return (
    <div className="agent-pill">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="agent-pill__avatar" src={AGENT.portraits.avatar} alt={AGENT.name} />
      <div>
        <div className="agent-pill__name">
          {AGENT.name}
          {AGENT.isDemo && <span className="demo-chip">{AGENT.demoLabel}</span>}
        </div>
        <div className="agent-pill__role">{detail || AGENT.role}</div>
      </div>
    </div>
  );
}
