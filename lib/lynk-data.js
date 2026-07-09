// ─────────────────────────────────────────────────────────────
// LYNK — the booking agent for Lorenzo von Barron Photography.
// SINGLE SOURCE OF TRUTH for packages, pricing, and booking copy.
//
// Doctrine: the website/app shows the work; LYNK converts it.
// Prices live HERE and only here — never in site-data.js.
// Category slugs must stay in sync with DISCIPLINES in
// lib/site-data.js (the shared contract with the showcase site).
// ─────────────────────────────────────────────────────────────

export const LYNK_COPY = {
  eyebrow: "LYNK — Booking Agent",
  headline: "Start the Brief.",
  subheadline: "Choose the discipline, review the scope, and send the mission.",
  primaryCta: "Begin Enquiry",
  openBrief: "Open the Brief",
  bookPackage: "Book This Package",
  budgetCta: "Working With a Budget?",
  sendMission: "Send the Mission",
  sendOffer: "Send the Offer",
  doctrine: "The site shows the work. LYNK books it.",
  bookingConfirmation:
    "Brief received. Lorenzo will review the frame, the story, and the outcome. If it fits the standard, you’ll receive the next step.",
  budgetConfirmation:
    "Offer received. Lorenzo will review the project, the timing, and the scope. If it makes sense, you’ll get the next step. If not, no hard feelings — the worst we can say is no.",
  budgetIntro:
    "We never lower the standard of the work. If your budget is tighter, we may be able to adjust the scope — less time, fewer edits, simpler setup, or a more flexible delivery window. Tell us what you can invest and what you need. We’ll review it case by case. Worst we can say is no.",
  budgetLineA: "Same standard. Smaller scope.",
  budgetLineB: "Custom rates are reviewed case by case and are never guaranteed.",
  scopeQuestion: "What are you willing to adjust?",
};

export const BUDGET_SCOPE_OPTIONS = [
  "Shorter session time",
  "Fewer edited photos",
  "One simple location",
  "No outfit changes",
  "Flexible delivery window",
  "Minimal setup",
  "No revisions",
  "Local-only shoot",
  "Photographer’s discretion",
];

// Public discipline system — mirrors the website/app portfolio.
// Old verticals (Branding, Food + Beverage, NSFW naming) are
// retired or mapped: Food + Beverage → Product & E-Commerce;
// Boudoir is the public, tasteful, enquiry-only naming.
export const LYNK_CATEGORIES = [
  {
    number: "01",
    slug: "headshots",
    title: "Headshots",
    tagline: "The frame that becomes your first impression.",
  },
  {
    number: "02",
    slug: "fitness",
    title: "Fitness",
    tagline: "Light, tension, discipline, and form.",
  },
  {
    number: "03",
    slug: "automotive",
    title: "Automotive",
    tagline: "Machines shot like sculpture.",
  },
  {
    number: "04",
    slug: "asu-life",
    title: "ASU Life",
    tagline: "Milestones before they become memory.",
  },
  {
    number: "05",
    slug: "portraits",
    title: "Portraits",
    tagline: "For people who are the brand.",
  },
  {
    number: "06",
    slug: "family-portraits",
    title: "Family Portraits",
    tagline: "The people who matter, held still and lit right.",
  },
  {
    number: "07",
    slug: "couples-weddings",
    title: "Couples & Weddings",
    tagline: "The day itself, shot like it matters.",
  },
  {
    number: "08",
    slug: "event-coverage",
    title: "Event Coverage",
    tagline: "Rooms at their peak, held perfectly still.",
  },
  {
    number: "09",
    slug: "product-ecommerce",
    title: "Product & E-Commerce",
    tagline: "Objects made expensive by light.",
  },
  {
    number: "10",
    slug: "creator-day-in-the-life",
    title: "Creator / Day in the Life",
    tagline: "Built for the feed, shot like cinema.",
  },
  {
    number: "11",
    slug: "boudoir",
    title: "Boudoir",
    tagline: "Intimate, tasteful, and entirely on your terms.",
    note: "Tasteful, discreet, and non-explicit. Private sessions by enquiry only, with limited availability.",
    enquiryOnly: true,
  },
];

// priceValue: numeric base for budget-offer math; null when the
// package is custom/enquiry-priced. enquiryOnly packages use the
// enquiry flow instead of "Book This Package".
export const LYNK_PACKAGES = [
  {
    id: "headshots-asu-student",
    categorySlug: "headshots",
    title: "ASU Student Package",
    priceLabel: "$75",
    priceValue: 75,
    duration: "30 min",
    description: "College content that slaps.",
    deliverables: [
      "Up to 20 professionally edited photos",
      "1 location, campus or nearby urban",
      "48-hour delivery",
    ],
    includes: ["30-minute session", "Fast turnaround", "Student-friendly pricing"],
  },
  {
    id: "headshots-business",
    categorySlug: "headshots",
    title: "Business Headshots",
    priceLabel: "$125",
    priceValue: 125,
    duration: "30 min",
    description: "Executive presence, working-class price.",
    deliverables: [
      "Up to 10 professionally edited photos",
      "Multiple background options",
      "Business casual and formal looks",
    ],
    includes: ["30-minute session", "Professional backgrounds", "Quick turnaround"],
  },
  {
    id: "fitness-professional",
    categorySlug: "fitness",
    title: "Fitness Professional",
    priceLabel: "$100",
    priceValue: 100,
    duration: "45 min",
    description: "Content for trainers who grind.",
    deliverables: [
      "Up to 20 professionally edited photos",
      "Gym or outdoor location",
      "Mix of action shots and posed portraits",
    ],
    includes: ["45-minute session", "Dynamic action shots", "Trainer-focused content"],
  },
  {
    id: "automotive-feature",
    categorySlug: "automotive",
    title: "Automotive Feature",
    priceLabel: "$150",
    priceValue: 150,
    duration: "60 min",
    description: "Machines shot like sculpture.",
    deliverables: [
      "Up to 20 professionally edited photos",
      "Exterior detail shots",
      "Rolling or parked cinematic looks if available",
    ],
    includes: ["1 location", "Detail and hero angles", "Night or golden-hour option when possible"],
  },
  {
    id: "asu-life-session",
    categorySlug: "asu-life",
    title: "ASU Life Session",
    priceLabel: "$125",
    priceValue: 125,
    duration: "45 min",
    description: "Graduation, Greek life, and campus milestones.",
    deliverables: [
      "Up to 20 professionally edited photos",
      "1 campus or nearby location",
      "Solo or small group options",
    ],
    includes: ["Campus-focused direction", "Social-ready delivery", "Milestone coverage"],
  },
  {
    id: "portraits-session",
    categorySlug: "portraits",
    title: "Portrait Session",
    priceLabel: "$150",
    priceValue: 150,
    duration: "45 min",
    description: "Studio and location portraiture for people who are the brand.",
    deliverables: [
      "Up to 15 professionally edited photos",
      "1 location",
      "Editorial portrait direction",
    ],
    includes: ["Posing guidance", "Clean portrait set", "Social/profile-ready crops"],
  },
  {
    id: "family-portraits",
    categorySlug: "family-portraits",
    title: "Family Portraits",
    priceLabel: "$175",
    priceValue: 175,
    duration: "45 min",
    description: "The people who matter, held still and lit right.",
    deliverables: [
      "Up to 20 professionally edited photos",
      "1 location",
      "Candid and posed family moments",
    ],
    includes: ["Simple direction", "Clean group portraits", "Lifestyle moments"],
  },
  {
    id: "couples-session",
    categorySlug: "couples-weddings",
    title: "Couples Session",
    priceLabel: "$175",
    priceValue: 175,
    duration: "45 min",
    description:
      "Engagements, announcements, and the day itself — shot like it matters.",
    deliverables: [
      "Up to 20 professionally edited photos",
      "1 location",
      "Romantic, candid, and editorial-style images",
    ],
    includes: ["Posing guidance", "Detail moments", "Social-ready delivery"],
  },
  {
    id: "wedding-event-inquiry",
    categorySlug: "couples-weddings",
    title: "Wedding / Event Inquiry",
    priceLabel: "Custom",
    priceValue: null,
    duration: "Custom",
    description: "For weddings, elopements, and longer coverage.",
    deliverables: ["Custom coverage", "Custom timeline", "Custom deliverables"],
    includes: ["Inquiry required", "Quote after brief review", "Timeline-based planning"],
    enquiryOnly: true,
  },
  {
    id: "event-coverage",
    categorySlug: "event-coverage",
    title: "Event Coverage",
    priceLabel: "Starting at $250",
    priceValue: 250,
    duration: "Custom",
    description:
      "Nightlife, sports, activations, fight nights, concerts, and rooms at their peak.",
    deliverables: ["Event photo coverage", "Edited gallery", "Social-ready highlights"],
    includes: [
      "Coverage based on timeline",
      "Candid and key-moment captures",
      "Quote after brief review",
    ],
  },
  {
    id: "product-ecommerce-session",
    categorySlug: "product-ecommerce",
    title: "Product / E-Commerce Session",
    priceLabel: "Starting at $150",
    priceValue: 150,
    duration: "60 min",
    description: "Product shot like it belongs on a billboard.",
    deliverables: [
      "Product hero images",
      "Detail images",
      "E-commerce or campaign-ready visuals",
    ],
    includes: ["Simple setup", "Clean lighting direction", "Brand-focused styling"],
  },
  {
    id: "creator-content-session",
    categorySlug: "creator-day-in-the-life",
    title: "Creator Content Session",
    priceLabel: "Starting at $200",
    priceValue: 200,
    duration: "90 min",
    description: "Content built for the feed but shot like cinema.",
    deliverables: [
      "Lifestyle images",
      "Behind-the-scenes style coverage",
      "Social-ready content set",
    ],
    includes: ["Story-driven direction", "Multiple content moments", "Platform-aware framing"],
  },
  {
    id: "boudoir-inquiry",
    categorySlug: "boudoir",
    title: "Boudoir Inquiry",
    priceLabel: "Private / By Enquiry",
    priceValue: null,
    duration: "Custom",
    description: "Intimate, tasteful, and entirely on your terms.",
    deliverables: ["Private portrait session", "Custom concept", "Discreet delivery"],
    includes: ["Enquiry-only", "Limited availability", "Respectful, tasteful direction"],
    enquiryOnly: true,
  },
];

export function categoryBySlug(slug) {
  return LYNK_CATEGORIES.find((c) => c.slug === slug) || null;
}

export function packagesForCategory(slug) {
  return LYNK_PACKAGES.filter((p) => p.categorySlug === slug);
}

export function packageById(id) {
  return LYNK_PACKAGES.find((p) => p.id === id) || null;
}

// "From $75" for the category index; falls back to the package's
// own label when the pricing is custom/enquiry-only.
export function startingPriceLabel(slug) {
  const packages = packagesForCategory(slug);
  const priced = packages.filter((p) => p.priceValue != null);
  if (priced.length > 0) {
    const min = Math.min(...priced.map((p) => p.priceValue));
    return `From $${min}`;
  }
  return packages[0]?.priceLabel || "By Enquiry";
}
