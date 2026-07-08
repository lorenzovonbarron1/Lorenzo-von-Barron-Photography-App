"use client";

import { useState } from "react";
import EditorialImage from "@/components/EditorialImage";
import { HERO } from "@/lib/site-data";

// Full-screen cinematic hero: autoplaying reel with poster fallback,
// dark shade, the brand statement, and a quiet scroll cue.
// The site opens like a film, not a homepage.
export default function HeroReel() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="hero">
      <div className="hero__media">
        {!videoFailed ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO.poster}
            onError={() => setVideoFailed(true)}
          >
            <source src={HERO.video} type="video/mp4" onError={() => setVideoFailed(true)} />
          </video>
        ) : (
          <EditorialImage
            src={HERO.poster}
            label={HERO.posterLabel}
            alt="Lorenzo von Barron Photography reel"
            loading="eager"
          />
        )}
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__statement">
        <h1>
          {HERO.statement.map((line, i) => (
            <span key={line} className={i === HERO.statement.length - 1 ? "is-outline" : ""}>
              {line}
            </span>
          ))}
        </h1>
      </div>
      <div className="hero__cue" aria-hidden="true">
        <span className="hero__cue-word">Scroll</span>
        <span className="hero__cue-line" />
      </div>
    </section>
  );
}
