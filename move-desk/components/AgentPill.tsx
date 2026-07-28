import { AGENT } from "@/lib/agent.config";

// Compact agent identity — uses the agent's personal accent for the
// avatar ring (never the product orange).
export default function AgentPill() {
  return (
    <div className="agent-pill">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="agent-pill__avatar" src={AGENT.portraits.avatar} alt={AGENT.name} />
      <div>
        <div className="agent-pill__name">{AGENT.name}</div>
        <div className="agent-pill__role">{AGENT.role}</div>
      </div>
    </div>
  );
}
