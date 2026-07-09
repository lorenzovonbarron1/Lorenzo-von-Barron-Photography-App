// ─────────────────────────────────────────────────────────────
// LYNK submissions — front-end data layer with Supabase delivery.
//
// Every enquiry (booking or budget offer) is normalized into one
// record shape so the review pipeline stays uniform.
//
// Delivery: records are POSTed to the Supabase REST API
// (lynk_submissions table — see supabase/lynk_submissions.sql).
// The static export has no server, so the insert happens from the
// client using the public anon key, which RLS restricts to
// insert-only. localStorage is kept as a local backup either way.
//
// Until NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
// are set, delivery is silently skipped and behavior matches the
// previous local-only version.
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "lynk_submissions_v1";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    flexible_timing: fields.flexible_timing || null,
    flexible_deliverables: fields.flexible_deliverables || null,
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

export function deliveryConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

async function deliverSubmission(record) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/lynk_submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(record),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase insert failed (${response.status}): ${detail}`);
  }
}

function persistLocally(record) {
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
}

// Persist locally (backup) and deliver to Supabase when configured.
// Returns { ok, delivered }: ok=false only when a configured remote
// rejected the record — callers should let the client retry then.
export async function submitSubmission(record) {
  persistLocally(record);
  if (!deliveryConfigured()) {
    return { ok: true, delivered: false };
  }
  try {
    await deliverSubmission(record);
    return { ok: true, delivered: true };
  } catch (error) {
    if (typeof console !== "undefined") {
      console.error("[LYNK] delivery failed", error);
    }
    return { ok: false, delivered: false };
  }
}

export function listSubmissions() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
