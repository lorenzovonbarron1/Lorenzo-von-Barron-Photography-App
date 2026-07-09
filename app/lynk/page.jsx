import Link from "next/link";
import Footer from "@/components/Footer";
import {
  LYNK_COPY,
  LYNK_CATEGORIES,
  packagesForCategory,
  startingPriceLabel,
} from "@/lib/lynk-data";

export const metadata = {
  title: "LYNK — Book Lorenzo von Barron Photography",
  description:
    "LYNK is the booking agent for Lorenzo von Barron Photography. Choose the discipline, review the scope and pricing, and send the mission.",
};

export default function LynkPage() {
  return (
    <main>
      <section className="lynk-hero">
        <span className="eyebrow eyebrow--gold">{LYNK_COPY.eyebrow}</span>
        <h1 className="lynk-hero__title">{LYNK_COPY.headline}</h1>
        <p className="lynk-hero__sub">{LYNK_COPY.subheadline}</p>
        <a href="#disciplines" className="lynk-btn lynk-btn--hero">
          {LYNK_COPY.primaryCta}
        </a>
        <p className="lynk-hero__doctrine">{LYNK_COPY.doctrine}</p>
      </section>

      <section id="disciplines" className="lynk-index">
        {LYNK_CATEGORIES.map((category) => {
          const count = packagesForCategory(category.slug).length;
          return (
            <Link
              key={category.slug}
              href={`/lynk/${category.slug}/`}
              className="lynk-cat reveal"
            >
              <span className="lynk-cat__num">{category.number}</span>
              <div className="lynk-cat__body">
                <h2 className="lynk-cat__title">{category.title}</h2>
                <p className="lynk-cat__tagline">{category.tagline}</p>
              </div>
              <div className="lynk-cat__meta">
                <span className="lynk-cat__price">{startingPriceLabel(category.slug)}</span>
                <span className="lynk-cat__count">
                  {count} {count === 1 ? "package" : "packages"}
                </span>
                <span className="lynk-cat__open">{LYNK_COPY.openBrief} →</span>
              </div>
            </Link>
          );
        })}
      </section>

      <Footer width="wide" right="LYNK · Booking Agent" />
    </main>
  );
}
