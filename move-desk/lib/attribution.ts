// ─────────────────────────────────────────────────────────────
// Campaign attribution — QR / social / flyer source tracking.
//
// Supported URL params, captured on ANY landing page:
//   ?src=sign-616krista          LYNK campaign shorthand (QR codes)
//   ?utm_source=instagram        standard UTM triplet
//   ?utm_medium=social
//   ?utm_campaign=spring-open-house
//   ?listing=616-krista          listing context
//
// AttributionCapture (in the root layout) stores the first-touch
// values in sessionStorage so they survive every hop of the journey
// (home → step inside → buy → submit) and land on the Auto-Brief.
// First touch wins: a mid-journey navigation without params never
// overwrites the original campaign.
// ─────────────────────────────────────────────────────────────

export interface Attribution {
  source: string;          // ?src= or "direct"
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  listingId?: string;
}

const KEY = "lynk_attribution_v1";

export const DIRECT: Attribution = { source: "direct" };

export function parseAttribution(params: URLSearchParams): Attribution | null {
  const src = params.get("src") || undefined;
  const utmSource = params.get("utm_source") || undefined;
  const utmMedium = params.get("utm_medium") || undefined;
  const utmCampaign = params.get("utm_campaign") || undefined;
  const listingId = params.get("listing") || undefined;
  if (!src && !utmSource && !utmMedium && !utmCampaign && !listingId) return null;
  return { source: src || utmSource || "direct", utmSource, utmMedium, utmCampaign, listingId };
}

/** First-touch capture. Call client-side on navigation. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const found = parseAttribution(new URLSearchParams(window.location.search));
    if (!found) return;
    const existing = window.sessionStorage.getItem(KEY);
    if (existing) {
      // First touch wins, but a listing seen later enriches it.
      const prior = JSON.parse(existing) as Attribution;
      if (found.listingId && !prior.listingId) {
        prior.listingId = found.listingId;
        window.sessionStorage.setItem(KEY, JSON.stringify(prior));
      }
      return;
    }
    window.sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    // sessionStorage unavailable — attribution degrades to "direct".
  }
}

/** Read the journey's attribution (client-side), falling back to direct. */
export function getAttribution(fallbackSource?: string): Attribution {
  if (typeof window === "undefined") return { ...DIRECT, source: fallbackSource || "direct" };
  try {
    const stored = window.sessionStorage.getItem(KEY);
    if (stored) return JSON.parse(stored) as Attribution;
  } catch { /* fall through */ }
  return { ...DIRECT, source: fallbackSource || "direct" };
}

/** Human-readable chips for the Agent Console / Auto-Brief. */
export function attributionChips(a: Attribution | undefined): string[] {
  if (!a) return [];
  const chips: string[] = [`Source: ${a.source}`];
  if (a.utmSource) chips.push(`utm_source: ${a.utmSource}`);
  if (a.utmMedium) chips.push(`utm_medium: ${a.utmMedium}`);
  if (a.utmCampaign) chips.push(`Campaign: ${a.utmCampaign}`);
  if (a.listingId) chips.push(`Listing: ${a.listingId}`);
  return chips;
}
