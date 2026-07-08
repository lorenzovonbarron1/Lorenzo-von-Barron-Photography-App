import EditorialImage from "@/components/EditorialImage";
import Footer from "@/components/Footer";
import { DISCIPLINES } from "@/lib/site-data";

export const metadata = {
  title: "Portfolio — Lorenzo von Barron Photography",
  description:
    "Selected work by discipline — headshots, fitness, automotive, ASU life, portraits, family, couples & weddings, events, product, creator content, and boudoir.",
};

export default function PortfolioPage() {
  return (
    <main>
      <header className="page-header">
        <span className="eyebrow eyebrow--gold">Selected Work</span>
        <h1 className="page-header__title">Portfolio</h1>
        <p className="page-header__intro">
          Organised by discipline. Each body of work opens directly into its LYNK enquiry — the
          categories here and there stay in step.
        </p>
      </header>

      {DISCIPLINES.map((d) => (
        <section className="discipline" id={d.slug} key={d.slug}>
          <div className="discipline__head reveal">
            <span className="discipline__num">{d.number}</span>
            <h2 className="discipline__title">{d.title}</h2>
            <p className="discipline__blurb">{d.description}</p>
          </div>

          <EditorialImage
            className="discipline__hero reveal-fade"
            src={d.heroImage}
            label={d.heroLabel}
            alt={d.alt}
          />

          <div className="discipline__grid">
            {d.supportImages.map((img) => (
              <EditorialImage
                key={img.src}
                className="reveal-fade"
                src={img.src}
                label={img.label}
                alt={`${img.label} — ${d.alt}`}
              />
            ))}
          </div>

          <div className="discipline__cta">
            <a href={d.lynkUrl} className="enquire-link">
              {d.enquiryLabel}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      ))}

      <Footer />
    </main>
  );
}
