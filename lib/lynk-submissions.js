// ─────────────────────────────────────────────────────────────
// LYNK submissions — front-end data layer, Supabase-ready.
//
// Every enquiry (booking or budget offer) is normalized into one
// record shape so the review pipeline stays uniform. To wire up
// Supabase later, replace the localStorage block in
// persistSubmission() with:
//   await supabase.from("lynk_submissions").insert(record);
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "lynk_submissions_v1";

export const SUBMISSION_TYPES = {
  BOOKING: "booking",
  BUDGET_OFFER: "budget_offer",
};

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `lynk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// pkg: entry from LYNK_PACKAGES · fields: raw form values.
export function buildSubmission(type, pkg, fields) {
  const offered = fields.offered_budget != null && fields.offered_budget !== ""
    ? Number(fields.offered_budget)
    : null;
  const listed = pkg.priceValue;

  let discountAmount = null;
  let discountPercent = null;
  if (type === SUBMISSION_TYPES.BUDGET_OFFER && listed != null && offered != null && !Number.isNaN(offered)) {
    discountAmount = Math.max(0, Math.round((listed - offered) * 100) / 100);
    discountPercent = listed > 0 ? Math.round((discountAmount / listed) * 1000) / 10 : null;
  }

  return {
    id: makeId(),
    submission_type: type,
    category_slug: pkg.categorySlug,
    package_id: pkg.id,
    package_name: pkg.title,
    listed_price: pkg.priceLabel,
    listed_price_value: listed,
    offered_budget: offered,
    requested_discount_amount: discountAmount,
    requested_discount_percent: discountPercent,
    scope_flexibility: fields.scope_flexibility || [],
    flexible_timing: fields.flexible_timing ?? null,
    flexible_deliverables: fields.flexible_deliverables ?? null,
    reason: fields.reason || null,
    name: fields.name || "",
    email: fields.email || "",
    phone: fields.phone || "",
    instagram: fields.instagram || "",
    preferred_date: fields.preferred_date || null,
    location: fields.location || null,
    project_notes: fields.project_notes || null,
    notes: fields.notes || null,
    status: "new", // new | reviewing | accepted | declined | follow_up
    created_at: new Date().toISOString(),
  };
}

export function persistSubmission(record) {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    existing.push(record);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Storage unavailable (private mode, quota) — the record is
    // still logged below so nothing is silently lost in dev.
  }
  if (typeof console !== "undefined") {
    console.info("[LYNK] submission", record);
  }
  return record;
}

export function listSubmissions() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
