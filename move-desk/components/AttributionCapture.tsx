"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";

// Mounted once in the root layout: records first-touch campaign
// params (?src, utm_*, listing) into sessionStorage on every
// navigation so attribution survives the whole journey.
export default function AttributionCapture() {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    captureAttribution();
  }, [pathname, search]);
  return null;
}
