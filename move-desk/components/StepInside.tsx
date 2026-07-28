"use client";

import { useEffect, useRef, useState } from "react";
import AssetImage from "@/components/AssetImage";
import type { Listing } from "@/lib/listings";

// Scroll-driven cinematic sequence: a pinned frame cross-fades through
// the approved room order as the reader scrolls step markers. Under
// prefers-reduced-motion (and no-JS), CSS collapses it into a static,
// fully-readable vertical gallery — no motion required to understand
// the home. AI motion, when present, is tagged "Cinematic Listing
// Preview" by AssetImage; nothing here claims a verified tour.
export default function StepInside({ listing }: { listing: Listing }) {
  const [active, setActive] = useState(0);
  const markers = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.index);
            if (!Number.isNaN(i)) setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    markers.current.forEach((m) => m && io.observe(m));
    return () => io.disconnect();
  }, []);

  return (
    <div>
      {/* Pinned cinematic frame */}
      <div style={{ position: "sticky", top: 12, zIndex: 1 }}>
        <div className="si-frame">
          {listing.frames.map((f, i) => (
            <AssetImage key={f.key} asset={f.asset} className="" priority={i === 0} />
          ))}
          {/* Active overlay caption */}
          <div className="si-caption">
            <p className="eyebrow eyebrow--lynk">{listing.frames[active]?.title}</p>
            {listing.frames[active]?.asset.caption && (
              <p className="lede" style={{ maxWidth: "40ch" }}>{listing.frames[active].asset.caption}</p>
            )}
          </div>
        </div>
      </div>

      {/* Set active-frame data attribute for CSS opacity control */}
      <SetActive frames={listing.frames.length} active={active} />

      {/* Scroll markers drive the active frame (invisible spacers on desktop, real cards when reduced-motion collapses) */}
      <div aria-hidden="true">
        {listing.frames.map((f, i) => (
          <div key={f.key} ref={(el) => { markers.current[i] = el; }} data-index={i} style={{ height: "62vh" }} />
        ))}
      </div>
    </div>
  );
}

// Toggles data-active on the frame's asset children so CSS controls
// the cross-fade without re-rendering images.
function SetActive({ active }: { frames: number; active: number }) {
  useEffect(() => {
    const frame = document.querySelector(".si-frame");
    if (!frame) return;
    const kids = frame.querySelectorAll<HTMLElement>(".asset");
    kids.forEach((k, i) => k.setAttribute("data-active", String(i === active)));
  }, [active]);
  return null;
}
