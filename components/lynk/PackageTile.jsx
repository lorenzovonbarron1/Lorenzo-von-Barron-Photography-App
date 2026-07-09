"use client";

import { useState } from "react";
import { LYNK_COPY, BUDGET_SCOPE_OPTIONS } from "@/lib/lynk-data";
import {
  SUBMISSION_TYPES,
  buildSubmission,
  persistSubmission,
} from "@/lib/lynk-submissions";

// One package tile: scope, price, deliverables, and both enquiry
// flows (booking brief + budget offer) opened in place so the
// client never leaves the tile they were sold on.
export default function PackageTile({ pkg, categoryLabel }) {
  // null | "booking" | "budget" | "sent-booking" | "sent-budget"
  const [mode, setMode] = useState(null);
  const [scope, setScope] = useState([]);

  const toggleScope = (option) =>
    setScope((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );

  const readForm = (form) => {
    const data = new FormData(form);
    const fields = {};
    for (const [key, value] of data.entries()) fields[key] = String(value).trim();
    return fields;
  };

  const submitBooking = (event) => {
    event.preventDefault();
    const fields = readForm(event.currentTarget);
    persistSubmission(buildSubmission(SUBMISSION_TYPES.BOOKING, pkg, fields));
    setMode("sent-booking");
  };

  const submitBudget = (event) => {
    event.preventDefault();
    const fields = readForm(event.currentTarget);
    fields.scope_flexibility = scope;
    persistSubmission(buildSubmission(SUBMISSION_TYPES.BUDGET_OFFER, pkg, fields));
    setMode("sent-budget");
  };

  const primaryLabel = pkg.enquiryOnly ? LYNK_COPY.primaryCta : LYNK_COPY.bookPackage;

  return (
    <article className="lynk-tile reveal">
      {categoryLabel && <span className="lynk-tile__category">{categoryLabel}</span>}
      <header className="lynk-tile__head">
        <div>
          <h3 className="lynk-tile__title">{pkg.title}</h3>
          <p className="lynk-tile__desc">{pkg.description}</p>
        </div>
        <div className="lynk-tile__pricing">
          <span className="lynk-tile__price">{pkg.priceLabel}</span>
          {pkg.duration && <span className="lynk-tile__duration">{pkg.duration}</span>}
        </div>
      </header>

      <div className="lynk-tile__lists">
        <div>
          <span className="lynk-tile__list-label">Deliverables</span>
          <ul className="lynk-tile__list">
            {pkg.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="lynk-tile__list-label">Includes</span>
          <ul className="lynk-tile__list">
            {pkg.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {(mode === null || mode === "booking" || mode === "budget") && (
        <div className="lynk-tile__actions">
          <button
            className={`lynk-btn${mode === "booking" ? " is-active" : ""}`}
            onClick={() => setMode(mode === "booking" ? null : "booking")}
          >
            {primaryLabel}
          </button>
          <button
            className={`lynk-btn lynk-btn--ghost${mode === "budget" ? " is-active" : ""}`}
            onClick={() => setMode(mode === "budget" ? null : "budget")}
          >
            {LYNK_COPY.budgetCta}
          </button>
        </div>
      )}

      {mode === "booking" && (
        <form className="lynk-form" onSubmit={submitBooking}>
          <span className="lynk-form__eyebrow">The Brief · {pkg.title}</span>
          <div className="lynk-form__grid">
            <label className="lynk-field">
              <span>Name</span>
              <input name="name" type="text" required autoComplete="name" />
            </label>
            <label className="lynk-field">
              <span>Email</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label className="lynk-field">
              <span>Phone</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label className="lynk-field">
              <span>Instagram</span>
              <input name="instagram" type="text" placeholder="@handle" />
            </label>
            <label className="lynk-field">
              <span>Package selected</span>
              <input name="package_selected" type="text" value={pkg.title} readOnly />
            </label>
            <label className="lynk-field">
              <span>Preferred date</span>
              <input name="preferred_date" type="date" />
            </label>
            <label className="lynk-field lynk-field--wide">
              <span>Location</span>
              <input name="location" type="text" placeholder="City, venue, or vibe" />
            </label>
            <label className="lynk-field lynk-field--wide">
              <span>What are we creating?</span>
              <textarea name="project_notes" rows={3} required />
            </label>
            <label className="lynk-field lynk-field--wide">
              <span>Notes</span>
              <textarea name="notes" rows={2} />
            </label>
          </div>
          <button type="submit" className="lynk-btn lynk-btn--submit">
            {LYNK_COPY.sendMission}
          </button>
        </form>
      )}

      {mode === "budget" && (
        <form className="lynk-form" onSubmit={submitBudget}>
          <span className="lynk-form__eyebrow">Budget Offer · {pkg.title}</span>
          <p className="lynk-form__intro">{LYNK_COPY.budgetIntro}</p>
          <p className="lynk-form__fineprint">
            {LYNK_COPY.budgetLineA} · {LYNK_COPY.budgetLineB}
          </p>
          <div className="lynk-form__grid">
            <label className="lynk-field">
              <span>Name</span>
              <input name="name" type="text" required autoComplete="name" />
            </label>
            <label className="lynk-field">
              <span>Email</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label className="lynk-field">
              <span>Phone</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label className="lynk-field">
              <span>Instagram</span>
              <input name="instagram" type="text" placeholder="@handle" />
            </label>
            <label className="lynk-field">
              <span>Package interested in</span>
              <input name="package_interested" type="text" value={pkg.title} readOnly />
            </label>
            <label className="lynk-field">
              <span>Listed package price</span>
              <input name="listed_price" type="text" value={pkg.priceLabel} readOnly />
            </label>
            <label className="lynk-field">
              <span>Your budget offer</span>
              <input
                name="offered_budget"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="USD"
                required
              />
            </label>
            <label className="lynk-field">
              <span>Preferred date</span>
              <input name="preferred_date" type="date" />
            </label>
            <label className="lynk-field lynk-field--wide">
              <span>Why are you requesting a custom rate?</span>
              <textarea name="reason" rows={2} required />
            </label>
            <label className="lynk-field lynk-field--wide">
              <span>Location</span>
              <input name="location" type="text" placeholder="City, venue, or vibe" />
            </label>
            <label className="lynk-field lynk-field--wide">
              <span>What are we creating?</span>
              <textarea name="project_notes" rows={3} required />
            </label>
            <label className="lynk-field">
              <span>Are you flexible on timing?</span>
              <select name="flexible_timing" defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                <option value="yes">Yes</option>
                <option value="somewhat">Somewhat</option>
                <option value="no">No</option>
              </select>
            </label>
            <label className="lynk-field">
              <span>Are you flexible on deliverables?</span>
              <select name="flexible_deliverables" defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                <option value="yes">Yes</option>
                <option value="somewhat">Somewhat</option>
                <option value="no">No</option>
              </select>
            </label>
          </div>

          <fieldset className="lynk-scope">
            <legend className="lynk-tile__list-label">{LYNK_COPY.scopeQuestion}</legend>
            <div className="lynk-scope__chips">
              {BUDGET_SCOPE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`lynk-chip${scope.includes(option) ? " is-selected" : ""}`}
                  aria-pressed={scope.includes(option)}
                  onClick={() => toggleScope(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="lynk-btn lynk-btn--submit">
            {LYNK_COPY.sendOffer}
          </button>
        </form>
      )}

      {mode === "sent-booking" && (
        <div className="lynk-confirm" role="status">
          <span className="lynk-form__eyebrow">Brief Received</span>
          <p>{LYNK_COPY.bookingConfirmation}</p>
        </div>
      )}

      {mode === "sent-budget" && (
        <div className="lynk-confirm" role="status">
          <span className="lynk-form__eyebrow">Offer Received</span>
          <p>{LYNK_COPY.budgetConfirmation}</p>
        </div>
      )}
    </article>
  );
}
