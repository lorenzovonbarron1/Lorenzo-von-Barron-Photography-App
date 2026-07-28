// ─────────────────────────────────────────────────────────────
// Saved-home continuity (client-side).
//
// PROTOTYPE persistence: localStorage on this device only. When
// Supabase-backed magic links arrive, these two functions become
// API calls keyed to the visitor's MoveDeskAccess token — the
// call sites don't change.
// ─────────────────────────────────────────────────────────────

const KEY = "lynk_saved_listing_v1";

export function saveListing(id: string): void {
  try { window.localStorage.setItem(KEY, id); } catch { /* private mode */ }
}

export function getSavedListing(): string | null {
  try { return window.localStorage.getItem(KEY); } catch { return null; }
}
