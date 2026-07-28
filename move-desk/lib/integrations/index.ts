// ─────────────────────────────────────────────────────────────
// Integration seams — every external service is behind a small
// interface with a MOCK implementation that runs until credentials
// are supplied. Nothing here throws into the request path; a failed
// delivery is logged and reported, never silently lost.
//
// To go live: set the env vars in .env and the real path activates.
// Swapping providers = editing one file, not the app.
// ─────────────────────────────────────────────────────────────

export type DeliveryResult = { channel: string; live: boolean; ok: boolean; detail?: string };

export interface EmailMessage { to: string; subject: string; body: string; replyTo?: string }
export interface SmsMessage { to: string; body: string }
