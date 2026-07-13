// ─────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for site content.
// Category slugs are the shared contract with LYNK — when LYNK
// adds or renames a vertical, update this one list.
// ─────────────────────────────────────────────────────────────

// LYNK is the booking agent — it lives inside this app at /lynk.
// Prices are shown only there, never on the showcase pages.
export const LYNK_BASE = "/lynk/";

export const HERO = {
  video: "/videos/lvb-hero-reel.mp4",
  poster: "/images/hero/lvb-hero-reel-poster.jpg",
  posterLabel: "Hero Reel — Poster",
  statement: ["Look Good.", "Move Loud.", "Let Them Watch."],
};

// ─────────────────────────────────────────────────────────────
// FUTURE HERO ASSET — the LYNK Superleggera rotating-object hero.
// Not wired up yet. HeroReel.jsx continues to render HERO above
// until this asset exists; do not fabricate a placeholder video.
//
// Subject: iPhone 12 in a matte-black case, Moment 58mm lens
// mounted over the rear camera, floating in a dark controlled
// environment, rotating slowly through 360°.
//
// When the final asset is ready:
//   1. Drop files at the paths below.
//   2. In HeroReel.jsx, swap the `HERO` import for
//      `HERO_ROTATING_OBJECT` (or merge the fields into HERO).
//   3. Nothing else in the component needs to change — the
//      <video> element's props (autoPlay/muted/loop/playsInline,
//      poster fallback, onError → EditorialImage placeholder)
//      already match the requirements below.
//
// Asset spec:
//   file:        /public/videos/lvb-hero-rotating-object.mp4
//   codec:       H.264 (yuv420p) for broadest mobile support;
//                include an .webm (VP9) alternate if size allows
//   resolution:  2160×2160 (1:1) source, cropped/letterboxed per
//                breakpoint by the existing object-fit: cover rules
//   duration:    6–8s for one full 360° rotation
//   loop:        seamless — first and last frame must match exactly
//   audio:       none (muted autoplay requires no audio track)
//   poster:      /public/images/hero/lvb-hero-rotating-object-poster.jpg
//                (a single frame, front 3/4 view, lens visible)
//   mobile:      same file; if a lighter cut is produced, name it
//                /public/videos/lvb-hero-rotating-object-mobile.mp4
//                and branch on a viewport/connection check in
//                HeroReel.jsx (not yet implemented)
//   reduced motion: when prefers-reduced-motion is set, render the
//                poster image only (no autoplay) — HeroReel.jsx's
//                existing EditorialImage fallback path already does
//                this for a failed/missing video and can be reused
//                for the reduced-motion case
//   no-video fallback: EditorialImage renders the poster; if the
//                poster is also missing, the standard dark
//                editorial placeholder (label below) appears —
//                the site never shows a broken frame
// ─────────────────────────────────────────────────────────────
export const HERO_ROTATING_OBJECT = {
  video: "/videos/lvb-hero-rotating-object.mp4",
  poster: "/images/hero/lvb-hero-rotating-object-poster.jpg",
  posterLabel: "Hero — iPhone 12 · Moment 58mm · Rotating",
};

export const DISCIPLINES = [
  {
    number: "01",
    title: "Headshots",
    slug: "headshots",
    description:
      "Presence, distilled. The frame that becomes your first impression before the handshake, the pitch, or the room.",
    enquiryLabel: "Enquire · Headshots",
    lynkUrl: LYNK_BASE + "headshots/",
    heroImage: "/images/portfolio/headshots-hero.jpg",
    heroLabel: "Headshot — Signature",
    supportImages: [
      { src: "/images/portfolio/headshots-studio.jpg", label: "Headshot — Studio" },
      { src: "/images/portfolio/headshots-location.jpg", label: "Headshot — Location" },
    ],
    alt: "Cinematic headshot photography by Lorenzo von Barron",
  },
  {
    number: "02",
    title: "Fitness",
    slug: "fitness",
    description:
      "The body as architecture — light, tension, discipline, and form. Built for athletes, trainers, transformations, and brands that move.",
    enquiryLabel: "Enquire · Fitness",
    lynkUrl: LYNK_BASE + "fitness/",
    heroImage: "/images/portfolio/fitness-hero.jpg",
    heroLabel: "Fitness — Hero",
    supportImages: [
      { src: "/images/portfolio/fitness-detail.jpg", label: "Fitness — Detail" },
      { src: "/images/portfolio/fitness-motion.jpg", label: "Fitness — Motion" },
    ],
    alt: "Cinematic fitness photography by Lorenzo von Barron",
  },
  {
    number: "03",
    title: "Automotive",
    slug: "automotive",
    description:
      "Machines shot like sculpture. Reflection, geometry, horsepower, night, and the quiet violence of good design.",
    enquiryLabel: "Enquire · Automotive",
    lynkUrl: LYNK_BASE + "automotive/",
    heroImage: "/images/portfolio/automotive-hero.jpg",
    heroLabel: "Automotive — Hero",
    supportImages: [
      { src: "/images/portfolio/automotive-detail.jpg", label: "Automotive — Detail" },
      { src: "/images/portfolio/automotive-night.jpg", label: "Automotive — Night" },
    ],
    alt: "Cinematic automotive photography by Lorenzo von Barron",
  },
  {
    number: "04",
    title: "ASU Life",
    slug: "asu-life",
    description:
      "Graduation, Greek life, campus milestones, and the season of life worth keeping before it becomes a story.",
    enquiryLabel: "Enquire · ASU Life",
    lynkUrl: LYNK_BASE + "asu-life/",
    heroImage: "/images/portfolio/asu-life-hero.jpg",
    heroLabel: "ASU — Graduation",
    supportImages: [
      { src: "/images/portfolio/asu-life-graduation.jpg", label: "ASU — Greek Life" },
      { src: "/images/portfolio/asu-life-campus.jpg", label: "ASU — Campus" },
    ],
    alt: "ASU graduation and campus photography by Lorenzo von Barron",
  },
  {
    number: "05",
    title: "Portraits",
    slug: "portraits",
    description:
      "Studio and location portraiture for people who are the brand — creators, entrepreneurs, artists, fighters, and builders.",
    enquiryLabel: "Enquire · Portraits",
    lynkUrl: LYNK_BASE + "portraits/",
    heroImage: "/images/portfolio/portraits-hero.jpg",
    heroLabel: "Portrait — Signature",
    supportImages: [
      { src: "/images/portfolio/portraits-studio.jpg", label: "Portrait — Studio" },
      { src: "/images/portfolio/portraits-location.jpg", label: "Portrait — Location" },
    ],
    alt: "Cinematic portrait photography by Lorenzo von Barron",
  },
  {
    number: "06",
    title: "Family Portraits",
    slug: "family-portraits",
    description:
      "The people who matter, held still and lit right. Clean, honest, cinematic family work without the mall-photo energy.",
    enquiryLabel: "Enquire · Family Portraits",
    lynkUrl: LYNK_BASE + "family-portraits/",
    heroImage: "/images/portfolio/family-hero.jpg",
    heroLabel: "Family — Hero",
    supportImages: [
      { src: "/images/portfolio/family-candid.jpg", label: "Family — Candid" },
      { src: "/images/portfolio/family-formal.jpg", label: "Family — Formal" },
    ],
    alt: "Cinematic family portrait photography by Lorenzo von Barron",
  },
  {
    number: "07",
    title: "Couples & Weddings",
    slug: "couples-weddings",
    description:
      "Engagements, announcements, ceremonies, and the day itself — photographed with intention, restraint, and emotional weight.",
    enquiryLabel: "Enquire · Couples & Weddings",
    lynkUrl: LYNK_BASE + "couples-weddings/",
    heroImage: "/images/portfolio/couples-weddings-hero.jpg",
    heroLabel: "Couple — Hero",
    supportImages: [
      { src: "/images/portfolio/couples-weddings-detail.jpg", label: "Engagement — Detail" },
      { src: "/images/portfolio/couples-weddings-moment.jpg", label: "Wedding — Moment" },
    ],
    alt: "Cinematic couples and wedding photography by Lorenzo von Barron",
  },
  {
    number: "08",
    title: "Event Coverage",
    slug: "event-coverage",
    description:
      "Nightlife, sports, activations, fight nights, concerts, and rooms at their peak. Energy held perfectly still.",
    enquiryLabel: "Enquire · Event Coverage",
    lynkUrl: LYNK_BASE + "event-coverage/",
    heroImage: "/images/portfolio/events-hero.jpg",
    heroLabel: "Event — Hero",
    supportImages: [
      { src: "/images/portfolio/events-crowd.jpg", label: "Nightlife — Crowd" },
      { src: "/images/portfolio/events-action.jpg", label: "Sports — Action" },
    ],
    alt: "Cinematic event photography by Lorenzo von Barron",
  },
  {
    number: "09",
    title: "Product & E-Commerce",
    slug: "product-ecommerce",
    description:
      "Product shot like it belongs on a billboard. Texture, light, precision, and enough polish to make the object feel expensive.",
    enquiryLabel: "Enquire · Product & E-Commerce",
    lynkUrl: LYNK_BASE + "product-ecommerce/",
    heroImage: "/images/portfolio/product-hero.jpg",
    heroLabel: "Product — Hero",
    supportImages: [
      { src: "/images/portfolio/product-detail.jpg", label: "Product — Detail" },
      { src: "/images/portfolio/product-flatlay.jpg", label: "E-Commerce — Flat Lay" },
    ],
    alt: "Premium product and e-commerce photography by Lorenzo von Barron",
  },
  {
    number: "10",
    title: "Creator / Day in the Life",
    slug: "creator-day-in-the-life",
    description:
      "Content built for the feed but shot like cinema — lived-in, intentional, on-brand, and ready to move across platforms.",
    enquiryLabel: "Enquire · Creator / Day in the Life",
    lynkUrl: LYNK_BASE + "creator-day-in-the-life/",
    heroImage: "/images/portfolio/creator-hero.jpg",
    heroLabel: "Creator — Hero",
    supportImages: [
      { src: "/images/portfolio/creator-candid.jpg", label: "Creator — Candid" },
      { src: "/images/portfolio/creator-detail.jpg", label: "Creator — Detail" },
    ],
    alt: "Cinematic creator and day-in-the-life photography by Lorenzo von Barron",
  },
  {
    number: "11",
    title: "Boudoir",
    slug: "boudoir",
    description:
      "Intimate, tasteful, and entirely on your terms. Private sessions by enquiry only, with limited availability.",
    enquiryLabel: "Enquire · Boudoir",
    lynkUrl: LYNK_BASE + "boudoir/",
    heroImage: "/images/portfolio/boudoir-hero.jpg",
    heroLabel: "Boudoir — Signature",
    supportImages: [
      { src: "/images/portfolio/boudoir-light.jpg", label: "Boudoir — Light" },
      { src: "/images/portfolio/boudoir-detail.jpg", label: "Boudoir — Detail" },
    ],
    alt: "Tasteful boudoir photography by Lorenzo von Barron",
  },
];

export const SELECTED_WORK = [
  { slug: "headshots", title: "Headshots", line: "First impressions with weight.", image: "/images/selected-work/headshots.jpg" },
  { slug: "fitness", title: "Fitness", line: "Discipline, tension, and form.", image: "/images/selected-work/fitness.jpg" },
  { slug: "automotive", title: "Automotive", line: "Reflection, geometry, and night.", image: "/images/selected-work/automotive.jpg" },
  { slug: "asu-life", title: "ASU Life", line: "Milestones before they become memory.", image: "/images/selected-work/asu-life.jpg" },
  { slug: "portraits", title: "Portraits", line: "People who are the brand.", image: "/images/selected-work/portraits.jpg" },
  { slug: "family-portraits", title: "Family", line: "The people who matter.", image: "/images/selected-work/family.jpg" },
  { slug: "couples-weddings", title: "Couples & Weddings", line: "The day, held with intention.", image: "/images/selected-work/couples-weddings.jpg" },
  { slug: "event-coverage", title: "Events", line: "Energy at its peak.", image: "/images/selected-work/events.jpg" },
  { slug: "product-ecommerce", title: "Product", line: "Objects made expensive by light.", image: "/images/selected-work/product.jpg" },
  { slug: "creator-day-in-the-life", title: "Creator", line: "Content with a point of view.", image: "/images/selected-work/creator-day-in-life.jpg" },
];

export const JOURNAL = [
  {
    kicker: "Process",
    date: "Jun 2026",
    title: "Shooting into the light on purpose",
    excerpt: "Why I stopped fighting hard backlight and started using it as the subject.",
    image: "/images/journal/journal-01.jpg",
    label: "Journal — 01",
  },
  {
    kicker: "Gear",
    date: "May 2026",
    title: "One lens, one month",
    excerpt: "What a single focal length teaches you about seeing before you shoot.",
    image: "/images/journal/journal-02.jpg",
    label: "Journal — 02",
  },
  {
    kicker: "Field Notes",
    date: "Apr 2026",
    title: "The 6am automotive call",
    excerpt: "Chasing reflection-free paint before the city wakes up.",
    image: "/images/journal/journal-03.jpg",
    label: "Journal — 03",
  },
  {
    kicker: "Opinion",
    date: "Mar 2026",
    title: "Presence over perfection",
    excerpt: "The most expensive-looking frame is rarely the most technically clean one.",
    image: "/images/journal/journal-04.jpg",
    label: "Journal — 04",
  },
];

export const STORIES = [
  {
    num: "01",
    name: "Marco",
    trade: "Tattoo Artist",
    image: "/images/working-class-stories/marco.jpg",
    label: "WCS — Marco, Tattoo Artist",
    pull: "The skin remembers everything. My job is to make sure it remembers something worth keeping.",
  },
  {
    num: "02",
    name: "Dez",
    trade: "Car Builder",
    image: "/images/working-class-stories/dez.jpg",
    label: "WCS — Dez, Car Builder",
    pull: "Everyone sees the finished car. Nobody sees the four years of knuckles.",
  },
  {
    num: "03",
    name: "Priya",
    trade: "Chef",
    image: "/images/working-class-stories/priya.jpg",
    label: "WCS — Priya, Chef",
    pull: "A plate is on the pass for ninety seconds. I want it to matter for longer than that.",
  },
];

// ─────────────────────────────────────────────────────────────
// LYNK Orbit Gateway — the circular entrance gallery at `/`.
// Destination hrefs use the REAL portfolio section ids (the brief
// named `#events` / `#product`, but the live anchors are
// `#event-coverage` / `#product-ecommerce` — links must work).
// Images reuse existing selected-work / stories paths; missing
// files fall back to the standard editorial placeholder.
// ─────────────────────────────────────────────────────────────
export const ORBIT_ITEMS = [
  {
    num: "01",
    title: "Headshots",
    subtitle: "First impressions with weight.",
    href: "/portfolio/#headshots",
    image: "/images/selected-work/headshots.jpg",
    alt: "Cinematic headshot photography by Lorenzo von Barron",
  },
  {
    num: "02",
    title: "Fitness",
    subtitle: "Discipline, tension, and form.",
    href: "/portfolio/#fitness",
    image: "/images/selected-work/fitness.jpg",
    alt: "Cinematic fitness photography by Lorenzo von Barron",
  },
  {
    num: "03",
    title: "Automotive",
    subtitle: "Reflection, geometry, and night.",
    href: "/portfolio/#automotive",
    image: "/images/selected-work/automotive.jpg",
    alt: "Cinematic automotive photography by Lorenzo von Barron",
  },
  {
    num: "04",
    title: "Portraits",
    subtitle: "People who are the brand.",
    href: "/portfolio/#portraits",
    image: "/images/selected-work/portraits.jpg",
    alt: "Cinematic portrait photography by Lorenzo von Barron",
  },
  {
    num: "05",
    title: "Events",
    subtitle: "Energy at its peak.",
    href: "/portfolio/#event-coverage",
    image: "/images/selected-work/events.jpg",
    alt: "Cinematic event photography by Lorenzo von Barron",
  },
  {
    num: "06",
    title: "Product",
    subtitle: "Objects made expensive by light.",
    href: "/portfolio/#product-ecommerce",
    image: "/images/selected-work/product.jpg",
    alt: "Premium product photography by Lorenzo von Barron",
  },
  {
    num: "07",
    title: "Working Class Stories",
    subtitle: "Stories from people building something.",
    href: "/stories/",
    image: "/images/working-class-stories/marco.jpg",
    alt: "Working Class Stories — documentary series by Lorenzo von Barron",
  },
];

export const MENU_ITEMS = [
  { num: "01", name: "Home", href: "/home/" },
  { num: "02", name: "Portfolio", href: "/portfolio/" },
  { num: "03", name: "Journal", href: "/journal/" },
  { num: "04", name: "Working Class Stories", href: "/stories/" },
  { num: "05", name: "About", href: "/about/" },
  { num: "06", name: "Contact", href: "/contact/" },
  { num: "07", name: "Book — LYNK", href: "/lynk/" },
];
