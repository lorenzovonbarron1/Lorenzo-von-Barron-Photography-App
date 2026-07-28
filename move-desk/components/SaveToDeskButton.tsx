"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { saveListing, getSavedListing } from "@/lib/saved";

// "Save to My Move Desk" — instant local save (prototype), with the
// saved state linking straight into /my-desk for continuity.
export default function SaveToDeskButton({ listingId }: { listingId: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(getSavedListing() === listingId);
  }, [listingId]);

  if (saved) {
    return (
      <Link className="btn btn--ghost" href="/my-desk" aria-label="Saved — open My Move Desk">
        ✓ Saved — open My Move Desk
      </Link>
    );
  }
  return (
    <button
      type="button"
      className="btn btn--ghost"
      onClick={() => { saveListing(listingId); setSaved(true); }}
    >
      Save to My Move Desk
    </button>
  );
}
