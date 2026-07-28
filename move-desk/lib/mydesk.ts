// ─────────────────────────────────────────────────────────────
// My Move Desk — demo private-client state.
//
// PROTOTYPE ONLY. The `token` is a demo access key, NOT a secure
// magic link — no auth, no expiry yet. The shape is structured so a
// real signed, expiring magic-link token + server lookup drops in
// without changing the UI. Do not claim this is secure.
// ─────────────────────────────────────────────────────────────

export interface MoveDeskState {
  token: string;
  firstName: string;
  savedListingId: string;
  moveGoal: string;
  timeline: string;
  priorities: string[];
  requestedAction: string;
  nextStep: string;
  appointment?: { kind: string; when: string; status: "requested" | "confirmed" };
  checklist: { label: string; done: boolean }[];
}

const DEMO: MoveDeskState = {
  token: "demo",
  firstName: "Alex",
  savedListingId: "616-krista",
  moveGoal: "A single-level home with a real office in South Tempe",
  timeline: "1–3 months",
  priorities: ["Home office", "Gated", "Single-level"],
  requestedAction: "Private showing",
  nextStep: "Emily is lining up two more single-level homes near your commute and will text you times this week.",
  appointment: { kind: "Private showing", when: "This Saturday, time TBC", status: "requested" },
  checklist: [
    { label: "Share your move goals with Emily", done: true },
    { label: "Step inside your saved home", done: true },
    { label: "Confirm financing stage / lender", done: false },
    { label: "Pick a showing time", done: false },
    { label: "Tour & compare", done: false },
  ],
};

// Demo lookup. Real version: verify a signed token, load the client's
// state from the DB, enforce expiry. Any token returns the demo state
// for now (clearly a prototype).
export function getMoveDesk(_token: string | undefined): MoveDeskState {
  return DEMO;
}
