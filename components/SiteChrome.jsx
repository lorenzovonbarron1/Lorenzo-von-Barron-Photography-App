"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MENU_ITEMS, DISCIPLINES } from "@/lib/site-data";

// Global chrome: fixed nav (mix-blend difference), full-screen menu
// overlay, and the Emily concierge. Wraps every route.
export default function SiteChrome({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [emilyOpen, setEmilyOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMenuOpen(false);
    setEmilyOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const goDiscipline = (slug) => {
    setEmilyOpen(false);
    setMenuOpen(false);
    router.push(`/portfolio/#${slug}`);
  };

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav__wordmark" onClick={() => setMenuOpen(false)}>
          Lorenzo&nbsp;von&nbsp;Barron
        </Link>
        <button
          className="nav__menu"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {menuOpen && (
        <div className="menu-overlay" role="dialog" aria-label="Menu">
          <div className="menu-overlay__items">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.num}
                href={item.href}
                className="menu-overlay__link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="menu-overlay__num">{item.num}</span>
                <span className="menu-overlay__name">{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="menu-overlay__foot">
            <div className="menu-overlay__note">
              <span className="menu-overlay__note-label">Enquiries</span>
              <span className="menu-overlay__note-copy">
                All bookings are handled through LYNK. Choose a discipline in the Portfolio to
                open its enquiry.
              </span>
            </div>
            <button className="pill-button" onClick={() => setMenuOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {children}

      {!emilyOpen && (
        <button className="emily-trigger" onClick={() => setEmilyOpen(true)}>
          <span className="emily-trigger__dot" aria-hidden="true" />
          Emily
        </button>
      )}

      {emilyOpen && (
        <div className="emily-panel" role="dialog" aria-label="Emily concierge">
          <div className="emily-panel__head">
            <span className="emily-panel__eyebrow">Concierge</span>
            <button
              className="emily-panel__close"
              onClick={() => setEmilyOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p className="emily-panel__greeting">Hello. I&rsquo;m Emily.</p>
          <p className="emily-panel__sub">Looking for something specific?</p>
          <input
            type="text"
            className="emily-panel__input"
            placeholder="Tell me what you have in mind…"
          />
          <div className="emily-panel__chips">
            {DISCIPLINES.map((d) => (
              <button key={d.slug} className="emily-chip" onClick={() => goDiscipline(d.slug)}>
                {d.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
