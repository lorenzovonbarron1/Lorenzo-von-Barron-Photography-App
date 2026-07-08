"use client";

import { useState } from "react";

// Every photograph on the site renders through this frame: consistent
// dark veil over real images, and a labeled editorial placeholder when
// the file isn't in /public yet — the layout never breaks.
export default function EditorialImage({ src, alt = "", label = "", className = "", loading = "lazy" }) {
  const [failed, setFailed] = useState(false);
  const empty = failed || !src;

  return (
    <figure className={`ed-image ${empty ? "ed-image--empty" : ""} ${className}`.trim()}>
      {!empty && (
        <img src={src} alt={alt || label} loading={loading} onError={() => setFailed(true)} />
      )}
      {empty && <span className="ed-image__label">{label || alt}</span>}
      <span className="ed-image__veil" aria-hidden="true" />
    </figure>
  );
}
