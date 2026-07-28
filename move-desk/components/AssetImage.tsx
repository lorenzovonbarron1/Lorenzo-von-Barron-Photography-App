import type { ListingAsset } from "@/lib/listings";

// Renders a listing asset, or a clearly-labeled placeholder when no
// approved file exists yet — the layout never breaks and no fake
// claim is ever made. AI-assisted media is tagged "Cinematic Listing
// Preview"; nothing renders as a verified tour.
export default function AssetImage({
  asset,
  className = "",
  priority = false,
}: {
  asset: ListingAsset;
  className?: string;
  priority?: boolean;
}) {
  const empty = !asset.src || asset.source === "placeholder";
  const tag =
    asset.source === "ai-assisted"
      ? "Cinematic Listing Preview"
      : asset.approval !== "approved"
      ? asset.approval
      : null;

  return (
    <figure className={`asset ${empty ? "asset--empty" : ""} ${className}`.trim()}>
      {!empty && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset.src} alt={asset.label} loading={priority ? "eager" : "lazy"} />
      )}
      {empty && <figcaption className="asset__label">{asset.label}</figcaption>}
      {tag && (
        <span className={`asset__tag ${asset.source === "ai-assisted" ? "asset__tag--ai" : ""}`.trim()}>
          {tag}
        </span>
      )}
    </figure>
  );
}
