"use client";

import { useEffect } from "react";

// Registers the app-shell service worker (public/sw.js). Production
// only — a worker in dev fights Next's hot reload.
export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Install is progressive enhancement — the site works without it.
    });
  }, []);

  return null;
}
