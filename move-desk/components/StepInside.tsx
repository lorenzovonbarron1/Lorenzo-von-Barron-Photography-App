"use client";

import { useEffect, useRef, useState } from "react";
import type { Listing, StepInsideFrame } from "@/lib/listings";

// The flagship: a pinned cinematic frame that moves through the
// approved room order as the reader scrolls. Until real photography
// arrives, each room renders as a designed "light field" plate —
// distinct per room, clearly tagged as awaiting photography, never
// pretending to be a photo. Real assets drop in via lib/listings.ts
// with zero component changes.
//
// prefers-reduced-motion (JS-detected, like the CSS belt) renders a
// static stacked gallery with every room fully visible — the story
// requires no motion to be understood. The server also pre-activates
// frame 0 so the first paint is never an empty frame.
export default function StepInside({ listing }: { listing: Listing }) {
  const [active, setActive] = useState(0);
  const [staticMode, setStaticMode] = useState(false);
  const markers = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setStaticMode(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (staticMode) return;
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
  }, [staticMode]);

  if (staticMode) {
    return (
      <div className="si-static" aria-label="Room-by-room story">
        {listing.frames.map((f, i) => (
          <Plate key={f.key} frame={f} index={i} total={listing.frames.length} active />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ position: "sticky", top: 12, zIndex: 1 }}>
        <div className="si-frame" role="img" aria-label={`${listing.headline} — ${listing.frames[active]?.title}`}>
          {listing.frames.map((f, i) => (
            <Plate key={f.key} frame={f} index={i} total={listing.frames.length} active={i === active} />
          ))}
          <span className="eyebrow si-counter" aria-hidden="true">
            {String(active + 1).padStart(2, "0")} / {String(listing.frames.length).padStart(2, "0")}
          </span>
          <div className="si-rail" aria-hidden="true">
            {listing.frames.map((f, i) => (
              <span key={f.key} className="si-rail__dot" data-active={i === active} />
            ))}
          </div>
        </div>
      </div>

      {/* Invisible scroll spacers drive the active frame. */}
      <div aria-hidden="true">
        {listing.frames.map((f, i) => (
          <div
            key={f.key}
            ref={(el) => { markers.current[i] = el; }}
            data-index={i}
            className="si-spacer"
          />
        ))}
      </div>
    </div>
  );
}

function Plate({
  frame,
  index,
  total,
  active,
}: {
  frame: StepInsideFrame;
  index: number;
  total: number;
  active: boolean;
}) {
  const a = frame.asset;
  const isPlaceholder = !a.src || a.source === "placeholder";
  const tag =
    a.source === "ai-assisted"
      ? "Cinematic Listing Preview"
      : isPlaceholder
      ? "Awaiting approved photography"
      : a.approval !== "approved"
      ? `Photography — ${a.approval}`
      : null;

  return (
    <div className="plate" data-room={frame.key} data-active={active}>
      {isPlaceholder ? (
        <>
          <div className="plate__field" aria-hidden="true" />
          <span className="plate__word" aria-hidden="true">{frame.title}</span>
        </>
      ) : (
        <div className="plate__img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.src} alt={a.label} loading={index === 0 ? "eager" : "lazy"} />
        </div>
      )}
      <div className="plate__meta">
        <span className="eyebrow eyebrow--lynk">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <span className="plate__title">{frame.title}</span>
        {a.caption && <span className="plate__caption">{a.caption}</span>}
        {tag && <span className={`plate__tag ${a.source === "ai-assisted" ? "plate__tag--ai" : ""}`.trim()}>{tag}</span>}
      </div>
    </div>
  );
}
