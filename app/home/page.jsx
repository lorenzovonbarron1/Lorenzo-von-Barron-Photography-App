import Link from "next/link";
import HeroReel from "@/components/HeroReel";
import SelectedWorkReel from "@/components/SelectedWorkReel";
import EditorialImage from "@/components/EditorialImage";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Home — Lorenzo von Barron Photography",
  description:
    "Dark luxury editorial photography — headshots, fitness, automotive, weddings, events, product, and more. Look good. Move loud. Let them watch. Bookings via LYNK.",
};

// The original homepage experience, unchanged — relocated from `/`
// when the LYNK Orbit Gateway became the site entrance.
export default function HomePage() {
  return (
    <main>
      <HeroReel />

      <SelectedWorkReel />

      <section className="creed reveal">
        <span className="eyebrow">The Creed</span>
        <h2 className="creed__lead">
          We do not take pictures. <em>We build presence.</em>
        </h2>
        <div className="creed__body">
          <p>
            Lorenzo von Barron Photography exists to make people look important, brands look
            expensive, and moments look legendary.
          </p>
          <p className="is-bright">This is not photography for people trying to look average.</p>
          <p>
            This is photography for athletes, creators, entrepreneurs, fighters, restaurants,
            families, students, and brands building something worth being seen.
          </p>
        </div>
        <p className="creed__close">Look good. Move loud. Let them watch.</p>
        <span className="creed__rule" aria-hidden="true" />
      </section>

      <section className="plate reveal-fade">
        <EditorialImage
          src="/images/home/editorial-plate.jpg"
          label="Full-Bleed — Editorial Plate"
          alt="Full-bleed editorial photograph by Lorenzo von Barron"
        />
      </section>

      <section className="portfolio-cta">
        <span className="eyebrow">Portfolio</span>
        <Link href="/portfolio/" className="quiet-cta">
          Enter the Portfolio
          <span className="quiet-cta__arrow">→</span>
        </Link>
      </section>

      <Footer home />
    </main>
  );
}
