"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import EditorialImage from "@/components/EditorialImage";
import { ORBIT_ITEMS } from "@/lib/site-data";

const COUNT = ORBIT_ITEMS.length;
const STEP = 360 / COUNT;
const IDLE_DELAY = 6000; // ms before slow idle drift begins
const IDLE_SPEED = 0.018; // deg per frame — barely perceptible
const SETTLE_DELAY = 220; // ms after last input before magnetic settle

// Signed shortest angular distance a → b, in (-180, 180].
function shortest(a, b) {
  return ((b - a + 540) % 360) - 180;
}

// LYNK Orbit Gateway — the site entrance at `/`.
// A circular gallery of rigid photographic plates suspended in
// obsidian, built on CSS 3D transforms (no WebGL). All motion is
// driven through refs + one requestAnimationFrame loop; React
// state changes only when the settled active card changes.
// prefers-reduced-motion collapses the ring into a static,
// scrollable grid with every link intact.
export default function OrbitGateway() {
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const activeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [staticMode, setStaticMode] = useState(false);

  const s = useRef({
    rotation: 0,
    target: 0,
    lastInput: 0,
    dragging: false,
    dragStartX: 0,
    dragStartTarget: 0,
    moved: 0,
    raf: 0,
  }).current;

  const nudge = (steps) => {
    s.target = Math.round(s.target / STEP) * STEP + steps * STEP;
    s.lastInput = performance.now();
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMode = () => setStaticMode(mq.matches);
    applyMode();
    mq.addEventListener("change", applyMode);
    return () => mq.removeEventListener("change", applyMode);
  }, []);

  useEffect(() => {
    if (staticMode) return undefined;
    s.lastInput = performance.now();

    const frame = (now) => {
      const sinceInput = now - s.lastInput;
      if (!s.dragging) {
        if (sinceInput > IDLE_DELAY) {
          s.target += IDLE_SPEED; // slow idle rotation
        } else if (sinceInput > SETTLE_DELAY) {
          // magnetic settle toward the nearest card
          const nearest = Math.round(s.target / STEP) * STEP;
          s.target += (nearest - s.target) * 0.09;
        }
      }
      s.rotation += (s.target - s.rotation) * 0.12;

      const ring = ringRef.current;
      if (ring) ring.style.setProperty("--rot", s.rotation.toFixed(3));

      for (let i = 0; i < COUNT; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const ang = shortest(s.rotation, i * STEP);
        const t = Math.cos((ang * Math.PI) / 180); // 1 front … -1 back
        el.style.opacity = Math.max(0.12, (t + 1) / 2).toFixed(3);
        el.style.filter = `brightness(${(0.45 + 0.55 * Math.max(0, t)).toFixed(3)})`;
      }

      const idx = ((Math.round(s.rotation / STEP) % COUNT) + COUNT) % COUNT;
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActiveIndex(idx);
      }
      s.raf = requestAnimationFrame(frame);
    };
    s.raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(s.raf);
  }, [staticMode, s]);

  // ── input handlers (no-ops in static mode via conditional attach) ──
  const onWheel = (e) => {
    // The gateway fills the viewport, so nothing else scrolls —
    // vertical scroll becomes rotation without hijacking anything.
    s.target += (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 0.12;
    s.lastInput = performance.now();
  };

  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    s.dragging = true;
    s.moved = 0;
    s.dragStartX = e.clientX;
    s.dragStartTarget = s.target;
    s.lastInput = performance.now();
  };
  const onPointerMove = (e) => {
    if (!s.dragging) return;
    const dx = e.clientX - s.dragStartX;
    s.moved = Math.max(s.moved, Math.abs(dx));
    s.target = s.dragStartTarget - dx * 0.28;
    s.lastInput = performance.now();
  };
  const endDrag = () => {
    s.dragging = false;
    s.lastInput = performance.now();
  };
  const onClickCapture = (e) => {
    // a drag that travelled is not a click — protect card links
    if (s.moved > 10) {
      e.preventDefault();
      e.stopPropagation();
      s.moved = 0;
    }
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nudge(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nudge(-1);
    }
  };
  const onCardFocus = (i) => {
    // rotate the focused card to the front so the focus ring is visible
    s.target += shortest(((s.target % 360) + 360) % 360, i * STEP);
    s.lastInput = performance.now();
  };

  const interactive = staticMode
    ? {}
    : {
        onWheel,
        onPointerDown,
        onPointerMove,
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
        onPointerLeave: endDrag,
        onKeyDown,
        onClickCapture,
      };

  return (
    <main className={`orbit${staticMode ? " orbit--static" : ""}`}>
      <span className="eyebrow orbit__label">Choose Your Experience</span>

      <div
        className="orbit__stage"
        role="region"
        aria-label="Orbit gallery — choose your experience"
        {...interactive}
      >
        <div className="orbit__ring" ref={ringRef}>
          {ORBIT_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`orbit-card${i === activeIndex && !staticMode ? " is-active" : ""}`}
              style={{ "--a": `${i * STEP}deg` }}
              aria-label={`${item.title} — ${item.subtitle}`}
              onFocus={staticMode ? undefined : () => onCardFocus(i)}
              draggable={false}
            >
              <EditorialImage
                className="orbit-card__image"
                src={item.image}
                label={item.title}
                alt={item.alt}
              />
              <span className="orbit-card__meta">
                <span className="orbit-card__num" aria-hidden="true">
                  {item.num}
                </span>
                <span className="orbit-card__title">{item.title}</span>
                <span className="orbit-card__sub">{item.subtitle}</span>
                <span className="orbit-card__enter" aria-hidden="true">
                  Enter <span className="orbit-card__arrow">→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>

        {!staticMode && (
          <>
            <button
              className="orbit__arrow orbit__arrow--prev"
              onClick={() => nudge(-1)}
              aria-label="Previous destination"
            >
              ←
            </button>
            <button
              className="orbit__arrow orbit__arrow--next"
              onClick={() => nudge(1)}
              aria-label="Next destination"
            >
              →
            </button>
          </>
        )}
      </div>

      <div className="orbit__foot">
        {!staticMode && (
          <span className="orbit__index" aria-hidden="true">
            <span className="orbit__index-current">{ORBIT_ITEMS[activeIndex].num}</span>
            <span className="orbit__index-sep">/</span>
            <span>{String(COUNT).padStart(2, "0")}</span>
          </span>
        )}
        <Link href="/home/" className="orbit__enter-site">
          Enter Full Site <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Screen-reader / keyboard destination list — hidden until a
          link inside it receives focus (skip-link pattern). */}
      <nav className="orbit-skip" aria-label="Gallery destinations">
        <ul>
          {ORBIT_ITEMS.map((item) => (
            <li key={item.href}>
              <a href={item.href}>
                {item.title} — {item.subtitle}
              </a>
            </li>
          ))}
          <li>
            <a href="/home/">Enter full site</a>
          </li>
        </ul>
      </nav>
    </main>
  );
}
