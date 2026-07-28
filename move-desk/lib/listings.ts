// ─────────────────────────────────────────────────────────────
// Listings + the cinematic "Step Inside" story model.
//
// Compliance-critical: AI/placeholder media is NEVER `approved` by
// default. Every asset carries a source + approval state. The UI
// labels AI motion "Cinematic Listing Preview" and never claims a
// verified tour. No MLS facts are invented — demo listings are
// explicitly flagged `isDemo`.
//
// Asset-replacement workflow: drop real files into
// /public/listings/<id>/ and change `src` + `source: "photo"` +
// `approval: "approved"`. Until then the frame renders a clearly
// labeled placeholder (never a broken image, never a fake claim).
// ─────────────────────────────────────────────────────────────

export type AssetSource = "photo" | "video" | "ai-assisted" | "placeholder";
export type AssetApproval = "approved" | "draft" | "pending-review";

export interface ListingAsset {
  /** Undefined src → labeled placeholder frame. */
  src?: string;
  source: AssetSource;
  approval: AssetApproval;
  label: string;      // shown on placeholder + as alt
  caption?: string;   // story caption for this frame
}

export interface StepInsideFrame {
  key: string;
  title: string;
  asset: ListingAsset;
}

export interface NeighborhoodLayer {
  // Factual, neutral only. NO scores, "best schools", safety,
  // family-friendly, demographic, or desirability language.
  commuteAnchorsPrompt: string;
  essentials: string[];        // neutral proximity facts
  schoolsNotice: string;
  officialSchoolLinks: { label: string; url: string }[];
}

export interface Listing {
  id: string;
  isDemo: boolean;
  status: string;        // e.g. "Sample listing"
  headline: string;
  address: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  summary: string;
  storyPoints: string[]; // 3–5 lifestyle points (factual, non-hype)
  hero: ListingAsset;
  frames: StepInsideFrame[];   // exterior → entry → living → kitchen → primary → backyard
  neighborhood: NeighborhoodLayer;
}

function placeholder(label: string, caption?: string): ListingAsset {
  return { source: "placeholder", approval: "pending-review", label, caption };
}

// Demo listing from the build brief — explicitly flagged as a sample.
export const DEMO_LISTING: Listing = {
  id: "616-krista",
  isDemo: true,
  status: "Sample listing — demo only",
  headline: "The Lifestyle Upgrade",
  address: "616 E Krista Way, Tempe",
  price: "$615,000",
  beds: 3,
  baths: 2,
  sqft: 1849,
  summary:
    "Gated South Tempe, single-level flow, and enough room for a real office — not a laptop wedged beside the kitchen.",
  storyPoints: [
    "Single-level layout — no stairs between you and the coffee.",
    "A dedicated room that can actually be an office.",
    "Gated South Tempe location.",
    "Backyard sized for evenings, not just maintenance.",
  ],
  hero: placeholder("Exterior arrival — replace with approved listing photo"),
  frames: [
    { key: "arrival", title: "Arrival", asset: placeholder("Exterior / arrival", "Pull into a quiet, gated street.") },
    { key: "entry", title: "Entry", asset: placeholder("Entry", "The first breath of the home.") },
    { key: "living", title: "Living", asset: placeholder("Living room", "Where the day lands.") },
    { key: "kitchen", title: "Kitchen", asset: placeholder("Kitchen", "Room to actually cook.") },
    { key: "primary", title: "Primary suite", asset: placeholder("Primary suite", "The quiet corner of the house.") },
    { key: "backyard", title: "Backyard", asset: placeholder("Backyard / lifestyle", "Evenings, not just upkeep.") },
  ],
  neighborhood: {
    commuteAnchorsPrompt: "Tell Emily where you need to be — work, school, family — and she'll map real drive times to this home.",
    essentials: [
      "Grocery and pharmacy within a short drive",
      "Direct access to major routes across the East Valley",
      "Parks and everyday errands nearby",
    ],
    schoolsNotice:
      "School assignments and boundaries change. Verify enrollment and attendance zones directly with the district and the state before relying on them.",
    officialSchoolLinks: [
      { label: "Arizona Department of Education — School Report Cards", url: "https://azreportcards.azed.gov/" },
      { label: "Find your district & attendance zone", url: "https://www.azed.gov/" },
    ],
  },
};

export const LISTINGS: Listing[] = [DEMO_LISTING];

export function getListing(id: string): Listing | undefined {
  return LISTINGS.find((l) => l.id === id);
}

export const FEATURED_LISTING = DEMO_LISTING;
