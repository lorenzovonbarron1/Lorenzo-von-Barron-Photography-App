"use client";

import { useEffect, useRef, useState } from "react";

// Every photograph on the site renders through this frame: consistent
// dark veil over real images, and a labeled editorial placeholder when
// the file isn't in /public yet — the layout never breaks.
export default function EditorialImage({ src, alt = "", label = "", className = "", loading = "lazy" }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  // A missing image can fire its error event before hydration attaches
  // onError, leaving the browser's broken-image icon. Catch that state
  // on mount so the editorial placeholder always takes over.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  const empty = failed || !src;

  return (
    <figure className={`ed-image ${empty ? "ed-image--empty" : ""} ${className}`.trim()}>
      {!empty && (
        <img ref={imgRef} src={src} alt={alt || label} loading={loading} onError={() => setFailed(true)} />
      )}
      {empty && <span className="ed-image__label">{label || alt}</span>}
      <span className="ed-image__veil" aria-hidden="true" />
    </figure>
  );
}
