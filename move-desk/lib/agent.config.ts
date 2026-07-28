// ─────────────────────────────────────────────────────────────
// Agent configuration — the white-label spine of LYNK Move Desk.
//
// A new agent (Savaughna, Kimberley, …) is a NEW OBJECT here, not a
// code change. Components read only from the active AgentProfile.
// Nothing about Emily may be hardcoded in a component.
//
// The product accent is ALWAYS LYNK electric orange (see globals.css).
// `accent` below is the agent's personal accent — used for portrait
// treatment, the identity pill border, and agent-scoped flourishes
// only. It never overrides the product system.
// ─────────────────────────────────────────────────────────────

export type ContactMethod = "text" | "call" | "email";

export interface BrokerageDisclosure {
  brokerageName: string;
  licenseNumber: string;   // agent license #
  equalHousing: boolean;   // renders the EHO mark + line
  /** Shown verbatim as the demo/prototype banner. Empty string = live. */
  demoNotice: string;
}

export interface LenderPartner {
  name: string;
  company: string;
  nmls: string;
  phone?: string;
  /** Displayed with every referral. Keep it truthful. */
  disclosure: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  /**
   * DEMO RULE: while true, the interface must visibly present this
   * agent as a product demo persona — not a live licensed agent
   * available to represent buyers or sellers. Set to false ONLY when
   * real agent/brokerage/license details replace the placeholders.
   */
  isDemo: boolean;
  /** Short badge text rendered next to the identity while isDemo. */
  demoLabel: string;
  role: string;
  heroMessage: string;
  intro: string;
  territory: string;
  tone: string;

  phone: string;   // E.164, used for tel:/sms:
  email: string;

  portraits: {
    avatar: string;      // square headshot
    hero: string;        // hero portrait
    fullBody?: string;
    greetingVideo?: string; // vertical mp4 when supplied; else undefined
  };

  accent: string;        // agent-personal accent (NOT the product orange)

  brokerage: BrokerageDisclosure;
  lender: LenderPartner;

  /** Default QR/campaign source when none is present on the URL. */
  defaultCampaignSource: string;

  privacyPolicyUrl: string;
  smsDisclosure: string;
}

// ── Emily — first demo agent & template ──────────────────────
export const EMILY: AgentProfile = {
  id: "emily",
  name: "Emily",
  isDemo: true,
  demoLabel: "Demo persona — not a licensed agent",
  role: "Your Move Desk guide",
  heroMessage: "Let's make your next move feel clear.",
  intro:
    "I turn a scroll or a scan into a real plan — homes worth your time, a straight conversation, and a next step you actually choose. No pressure, no portal maze.",
  territory: "Tempe · East Valley · Greater Phoenix",
  tone: "direct, calm, polished, reassuring",

  phone: "+10000000000", // TODO: replace with Emily's real routing number
  email: "hello@example-movedesk.com", // TODO: replace

  portraits: {
    avatar: "/agents/emily/emily-headshot-smile.png",
    hero: "/agents/emily/emily-headshot.png",
    fullBody: "/agents/emily/emily-full-body.jpeg",
    greetingVideo: undefined, // vertical greeting video not yet supplied
  },

  accent: "#7c3aed", // Emily's violet — portrait/pill treatment only

  brokerage: {
    brokerageName: "[Brokerage Name]",
    licenseNumber: "[AZ License #]",
    equalHousing: true,
    demoNotice:
      "Prototype experience — agent, brokerage, licensing, and property details are placeholders and must be replaced before public use.",
  },

  lender: {
    name: "[Lender Name]",
    company: "[Lending Company]",
    nmls: "[NMLS #]",
    disclosure:
      "Emily is not a lender and does not approve financing. Referrals go to a licensed lender; you are free to choose any lender.",
  },

  defaultCampaignSource: "direct",

  privacyPolicyUrl: "/privacy",
  smsDisclosure:
    "By providing your number you agree to receive calls/texts about your inquiry. Message & data rates may apply. Reply STOP to opt out.",
};

// The active agent for this deployment. Multi-tenant selection
// (by subdomain/route) plugs in here later without touching components.
export const AGENT: AgentProfile = EMILY;

/** Inline style that exposes the agent's personal accent to CSS. */
export function agentAccentStyle(agent: AgentProfile = AGENT): React.CSSProperties {
  return { ["--agent-accent" as string]: agent.accent };
}
