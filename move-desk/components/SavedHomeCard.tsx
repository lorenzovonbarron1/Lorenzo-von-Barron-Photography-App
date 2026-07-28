"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedListing } from "@/lib/saved";
import { getListing, FEATURED_LISTING } from "@/lib/listings";
import AssetImage from "@/components/AssetImage";

// Shows the home the visitor actually saved on this device (via
// "Save to My Move Desk"), falling back to the demo state's listing.
// When Supabase magic links land, the saved id comes from the
// visitor's server-side Move Desk record instead of localStorage.
export default function SavedHomeCard({ fallbackListingId }: { fallbackListingId: string }) {
  const [listingId, setListingId] = useState(fallbackListingId);
  const [fromDevice, setFromDevice] = useState(false);

  useEffect(() => {
    const saved = getSavedListing();
    if (saved && getListing(saved)) {
      setListingId(saved);
      setFromDevice(true);
    }
  }, []);

  const listing = getListing(listingId) || FEATURED_LISTING;

  return (
    <div className="card stack gap-s">
      <p className="eyebrow">Your saved home</p>
      <Link href={`/step-inside/${listing.id}`}><AssetImage asset={listing.hero} /></Link>
      <h3 className="path-card__title">{listing.headline}</h3>
      <p className="path-card__desc">
        {listing.price} · {listing.beds} bd · {listing.baths} ba · {listing.address}
      </p>
      {fromDevice && (
        <p className="path-card__desc" style={{ color: "var(--stone-500)" }}>
          Saved from your visit on this device.
        </p>
      )}
      <Link className="btn btn--ghost" href={`/step-inside/${listing.id}`} style={{ marginTop: 6 }}>
        Step back inside
      </Link>
    </div>
  );
}
