"use client";

import { useRef } from "react";
import EditorialImage from "@/components/EditorialImage";
import { SELECTED_WORK } from "@/lib/site-data";

// Horizontal cinematic archive: large frames, scroll-snap, elegant
// arrows on desktop, native swipe on mobile.
export default function SelectedWorkReel() {
  const stripRef = useRef(null);

  const scrollByAmount = (dir) => {
    const el = stripRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.72, behavior: "smooth" });
  };

  return (
    <section className="work-reel">
      <div className="work-reel__head reveal">
        <span className="eyebrow eyebrow--gold">Selected Work</span>
      </div>
      <div className="work-reel__strip" ref={stripRef}>
        {SELECTED_WORK.map((item) => (
          <div className="work-reel__item" key={item.slug}>
            <EditorialImage
              src={item.image}
              label={item.title}
              alt={`${item.title} — selected work by Lorenzo von Barron`}
            />
            <div className="work-reel__caption">
              <h3 className="work-reel__title">{item.title}</h3>
              <p className="work-reel__line">{item.line}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="work-reel__arrow work-reel__arrow--prev"
        onClick={() => scrollByAmount(-1)}
        aria-label="Previous work"
      >
        ←
      </button>
      <button
        className="work-reel__arrow work-reel__arrow--next"
        onClick={() => scrollByAmount(1)}
        aria-label="Next work"
      >
        →
      </button>
    </section>
  );
}
